// Package search implements a Boolean query parser that converts search
// strings into PostgreSQL tsquery expressions and field-specific filters.
//
// Grammar:
//
//	expression → term (OR term)*
//	term      → factor (AND factor)*  (AND is implicit between adjacent factors)
//	factor    → NOT factor | '+' factor | '-' factor | primary
//	primary   → '(' expression ')' | field_filter | phrase | word
//
// The '+' prefix is a no-op (identity), '-' prefix is equivalent to NOT.
// Field filters use the syntax: field:value or field:!value (negated).
package search

import (
	"fmt"
	"strings"
)

// Query represents a parsed search query with a tsquery string and field filters.
type Query struct {
	TsQuery string        // PostgreSQL tsquery string (e.g., "'climate' & 'environment'")
	Filters []FieldFilter // Field-specific filters extracted from the query
}

// FieldFilter represents a field:value filter extracted from the query.
type FieldFilter struct {
	Field    string // Field name (e.g., "author", "tag", "is")
	Value    string // Filter value
	Operator string // "=" for positive match, "!=" for negated match
}

// tokenType represents the type of a lexer token.
type tokenType int

const (
	tokEOF    tokenType = iota
	tokWord             // bare word (e.g., climate, !alice)
	tokPhrase           // quoted phrase (e.g., "fossil fuels")
	tokAnd              // AND keyword
	tokOr               // OR keyword
	tokNot              // NOT keyword
	tokLParen           // (
	tokRParen           // )
	tokField            // field name followed by colon (e.g., author:, tag:)
	tokPlus             // + prefix
	tokMinus            // - prefix
)

// token represents a single lexer token.
type token struct {
	typ   tokenType
	value string
}

// lexer tokenizes a search query string into a stream of tokens.
type lexer struct {
	input []rune
	pos   int
}

func newLexer(input string) *lexer {
	return &lexer{input: []rune(input)}
}

// next returns the next token from the input.
func (l *lexer) next() token {
	l.skipWhitespace()

	if l.pos >= len(l.input) {
		return token{typ: tokEOF}
	}

	ch := l.input[l.pos]

	switch {
	case ch == '(':
		l.pos++
		return token{typ: tokLParen}
	case ch == ')':
		l.pos++
		return token{typ: tokRParen}
	case ch == '"':
		return l.readPhrase()
	case ch == '+':
		l.pos++
		return token{typ: tokPlus}
	case ch == '-':
		l.pos++
		return token{typ: tokMinus}
	case ch == '!':
		// ! at the start of a word (e.g., !alice) — read as part of the word
		if l.pos+1 < len(l.input) && !isWhitespace(l.input[l.pos+1]) &&
			l.input[l.pos+1] != '(' && l.input[l.pos+1] != ')' {
			return l.readWord()
		}
		// Standalone ! is treated as NOT
		l.pos++
		return token{typ: tokNot}
	default:
		if isWordRune(ch) {
			return l.readWord()
		}
		// Skip any other unexpected characters
		l.pos++
		return l.next()
	}
}

// skipWhitespace advances past whitespace runes.
func (l *lexer) skipWhitespace() {
	for l.pos < len(l.input) && isWhitespace(l.input[l.pos]) {
		l.pos++
	}
}

// readPhrase reads a quoted phrase. It does not unescape; it returns the raw
// content between the quotes.
func (l *lexer) readPhrase() token {
	// Skip opening quote
	l.pos++
	start := l.pos
	for l.pos < len(l.input) && l.input[l.pos] != '"' {
		l.pos++
	}
	if l.pos >= len(l.input) {
		// Unterminated quote — return what we have as a phrase anyway
		return token{typ: tokPhrase, value: string(l.input[start:])}
	}
	// Skip closing quote
	value := string(l.input[start:l.pos])
	l.pos++
	return token{typ: tokPhrase, value: value}
}

// readWord reads a word token. It also detects field: prefix and AND/OR/NOT keywords.
func (l *lexer) readWord() token {
	start := l.pos
	for l.pos < len(l.input) && isWordRune(l.input[l.pos]) {
		l.pos++
	}

	raw := string(l.input[start:l.pos])

	// Check if this is a field name followed by colon (e.g., author:, tag:)
	// The word must have at least one character before the colon
	savePos := l.pos
	l.skipWhitespace()
	if l.pos < len(l.input) && l.input[l.pos] == ':' {
		// This is a field: prefix
		l.pos++ // consume the ':'
		return token{typ: tokField, value: strings.ToLower(raw)}
	}
	// Restore position if it wasn't a colon
	l.pos = savePos

	// Check for Boolean operators (case-insensitive)
	switch strings.ToUpper(raw) {
	case "AND":
		return token{typ: tokAnd}
	case "OR":
		return token{typ: tokOr}
	case "NOT":
		return token{typ: tokNot}
	default:
		return token{typ: tokWord, value: raw}
	}
}

// isWhitespace reports whether r is a whitespace rune.
func isWhitespace(r rune) bool {
	return r == ' ' || r == '\t' || r == '\n' || r == '\r'
}

// isWordRune reports whether r is a valid word character.
// Colon is excluded so field:value syntax can be recognized.
func isWordRune(r rune) bool {
	return !isWhitespace(r) && r != '(' && r != ')' && r != '"' && r != ':'
}

// astNode is the interface implemented by all AST nodes.
type astNode interface {
	// tsquery returns the PostgreSQL tsquery fragment for this node.
	tsquery() string
	// collectFilters gathers field filters from this node and its children.
	collectFilters() []FieldFilter
}

// wordNode represents a single word.
type wordNode struct {
	value string
}

func (n *wordNode) tsquery() string {
	// Lowercase and wrap in single quotes for tsquery
	return "'" + strings.ToLower(n.value) + "'"
}

func (n *wordNode) collectFilters() []FieldFilter {
	return nil
}

// phraseNode represents a quoted phrase.
type phraseNode struct {
	words []string
}

func (n *phraseNode) tsquery() string {
	// phraseto_tsquery produces words connected by <-> (followed by) operator
	parts := make([]string, len(n.words))
	for i, w := range n.words {
		parts[i] = "'" + strings.ToLower(w) + "'"
	}
	return strings.Join(parts, " <-> ")
}

func (n *phraseNode) collectFilters() []FieldFilter {
	return nil
}

// notNode represents a NOT (negation) operation.
type notNode struct {
	operand astNode
}

func (n *notNode) tsquery() string {
	inner := n.operand.tsquery()
	if inner == "" {
		return ""
	}
	// Avoid double-wrapping: if inner already has parens or is a simple word,
	// just prefix with !. Otherwise wrap in !(...) for correct precedence.
	if strings.HasPrefix(inner, "(") || isSimpleTsqueryWord(inner) {
		return "!" + inner
	}
	return "!(" + inner + ")"
}

// isSimpleTsqueryWord reports whether s is a single-quoted word (e.g., 'climate').
func isSimpleTsqueryWord(s string) bool {
	return len(s) >= 3 && s[0] == '\'' && s[len(s)-1] == '\'' && !strings.ContainsRune(s[1:len(s)-1], '\'')
}

func (n *notNode) collectFilters() []FieldFilter {
	return n.operand.collectFilters()
}

// andNode represents an AND operation.
type andNode struct {
	left, right astNode
}

func (n *andNode) tsquery() string {
	left := n.left.tsquery()
	right := n.right.tsquery()
	if left == "" {
		return right
	}
	if right == "" {
		return left
	}
	return left + " & " + right
}

func (n *andNode) collectFilters() []FieldFilter {
	return append(n.left.collectFilters(), n.right.collectFilters()...)
}

// orNode represents an OR operation.
type orNode struct {
	left, right astNode
}

func (n *orNode) tsquery() string {
	left := n.left.tsquery()
	right := n.right.tsquery()
	if left == "" {
		return right
	}
	if right == "" {
		return left
	}
	return left + " | " + right
}

func (n *orNode) collectFilters() []FieldFilter {
	return append(n.left.collectFilters(), n.right.collectFilters()...)
}

// fieldFilterNode represents a field:value filter.
type fieldFilterNode struct {
	field    string
	value    string
	operator string // "=" or "!="
}

func (n *fieldFilterNode) tsquery() string {
	// Field filters don't contribute to the tsquery (they become SQL WHERE clauses)
	return ""
}

func (n *fieldFilterNode) collectFilters() []FieldFilter {
	return []FieldFilter{
		{Field: n.field, Value: n.value, Operator: n.operator},
	}
}

// groupNode wraps a parenthesized expression to add parentheses in tsquery output.
type groupNode struct {
	inner astNode
}

func (n *groupNode) tsquery() string {
	inner := n.inner.tsquery()
	if inner == "" {
		return ""
	}
	return "(" + inner + ")"
}

func (n *groupNode) collectFilters() []FieldFilter {
	return n.inner.collectFilters()
}

// plusNode represents a '+' prefix (identity — no-op).
type plusNode struct {
	operand astNode
}

func (n *plusNode) tsquery() string {
	// '+' is a no-op in tsquery
	return n.operand.tsquery()
}

func (n *plusNode) collectFilters() []FieldFilter {
	return n.operand.collectFilters()
}

// parser implements a recursive-descent parser for the Boolean query grammar.
type parser struct {
	lex *lexer
	tok token // current token
}

// Parse parses a search query string and returns a Query struct.
func Parse(input string) (*Query, error) {
	p := &parser{
		lex: newLexer(input),
	}
	p.advance()

	// Handle empty input
	if p.tok.typ == tokEOF {
		return &Query{}, nil
	}

	node, err := p.parseExpression()
	if err != nil {
		return nil, err
	}

	if p.tok.typ != tokEOF {
		return nil, fmt.Errorf("unexpected token %q after expression", p.tok.value)
	}

	var filters []FieldFilter
	tsq := node.tsquery()

	// If the entire query is a field filter with no tsquery, it's still valid
	if tsq == "" && len(filters) == 0 {
		filters = node.collectFilters()
	} else {
		filters = node.collectFilters()
	}

	// If the query is empty after filtering, return empty but valid
	return &Query{
		TsQuery: tsq,
		Filters: filters,
	}, nil
}

// advance moves to the next token.
func (p *parser) advance() {
	p.tok = p.lex.next()
}

// parseExpression parses: term (OR term)*
func (p *parser) parseExpression() (astNode, error) {
	left, err := p.parseTerm()
	if err != nil {
		return nil, err
	}

	for p.tok.typ == tokOr {
		p.advance() // consume OR
		right, err := p.parseTerm()
		if err != nil {
			return nil, err
		}
		left = &orNode{left: left, right: right}
	}

	return left, nil
}

// parseTerm parses: factor (AND factor)*  (AND is implicit between adjacent factors)
func (p *parser) parseTerm() (astNode, error) {
	left, err := p.parseFactor()
	if err != nil {
		return nil, err
	}

	// Consume explicit AND operators
	for p.tok.typ == tokAnd {
		p.advance() // consume AND
		right, err := p.parseFactor()
		if err != nil {
			return nil, err
		}
		left = &andNode{left: left, right: right}
	}

	// Implicit AND between adjacent factors
	for p.isFactorStart() {
		right, err := p.parseFactor()
		if err != nil {
			return nil, err
		}
		left = &andNode{left: left, right: right}
	}

	return left, nil
}

// isFactorStart reports whether the current token can begin a factor.
func (p *parser) isFactorStart() bool {
	switch p.tok.typ {
	case tokWord, tokPhrase, tokLParen, tokField, tokPlus, tokMinus, tokNot:
		return true
	}
	return false
}

// parseFactor parses: NOT factor | '+' factor | '-' factor | primary
func (p *parser) parseFactor() (astNode, error) {
	switch p.tok.typ {
	case tokNot:
		p.advance() // consume NOT
		operand, err := p.parseFactor()
		if err != nil {
			return nil, err
		}
		return &notNode{operand: operand}, nil
	case tokPlus:
		p.advance() // consume '+'
		operand, err := p.parseFactor()
		if err != nil {
			return nil, err
		}
		return &plusNode{operand: operand}, nil
	case tokMinus:
		p.advance() // consume '-'
		operand, err := p.parseFactor()
		if err != nil {
			return nil, err
		}
		return &notNode{operand: operand}, nil
	default:
		return p.parsePrimary()
	}
}

// parsePrimary parses: '(' expression ')' | field_filter | phrase | word
func (p *parser) parsePrimary() (astNode, error) {
	switch p.tok.typ {
	case tokLParen:
		return p.parseGroupedExpression()
	case tokField:
		return p.parseFieldFilter()
	case tokPhrase:
		return p.parsePhrase()
	case tokWord:
		return p.parseWord()
	default:
		if p.tok.typ == tokEOF {
			return nil, fmt.Errorf("unexpected end of input")
		}
		return nil, fmt.Errorf("unexpected token %q", p.tok.value)
	}
}

// parseGroupedExpression parses: '(' expression ')'
func (p *parser) parseGroupedExpression() (astNode, error) {
	p.advance() // consume '('

	if p.tok.typ == tokRParen {
		p.advance()
		// Empty parentheses
		return nil, fmt.Errorf("empty parentheses")
	}

	node, err := p.parseExpression()
	if err != nil {
		return nil, err
	}

	if p.tok.typ != tokRParen {
		return nil, fmt.Errorf("missing closing parenthesis")
	}
	p.advance() // consume ')'

	return &groupNode{inner: node}, nil
}

// parseFieldFilter parses a field:value filter.
func (p *parser) parseFieldFilter() (astNode, error) {
	fieldName := p.tok.value
	p.advance() // consume field token (the ':' was already consumed by lexer)

	operator := "="
	var val string

	// Handle "field:!value" where ! is a standalone NOT token or a prefix on the word
	if p.tok.typ == tokNot {
		// Standalone ! — consume and treat as negation prefix
		operator = "!="
		p.advance()
		if p.tok.typ != tokWord && p.tok.typ != tokPhrase {
			return nil, fmt.Errorf("empty value after '!' in field filter %q", fieldName)
		}
		val = p.tok.value
	} else if p.tok.typ == tokWord {
		if strings.HasPrefix(p.tok.value, "!") {
			operator = "!="
			val = strings.TrimPrefix(p.tok.value, "!")
			if val == "" {
				return nil, fmt.Errorf("empty value after '!' in field filter %q", fieldName)
			}
		} else {
			val = p.tok.value
		}
	} else if p.tok.typ == tokPhrase {
		val = p.tok.value
	} else {
		return nil, fmt.Errorf("expected value after field %q", fieldName)
	}

	if val == "" {
		return nil, fmt.Errorf("expected non-empty value after field %q", fieldName)
	}

	p.advance() // consume the value token

	return &fieldFilterNode{
		field:    fieldName,
		value:    val,
		operator: operator,
	}, nil
}

// parsePhrase parses a quoted phrase node.
func (p *parser) parsePhrase() (astNode, error) {
	phrase := p.tok.value
	p.advance() // consume phrase

	words := strings.Fields(phrase)
	if len(words) == 0 {
		return &wordNode{value: ""}, nil
	}

	// A single-word phrase is equivalent to a word
	if len(words) == 1 {
		return &wordNode{value: words[0]}, nil
	}

	return &phraseNode{words: words}, nil
}

// parseWord parses a bare word node.
func (p *parser) parseWord() (astNode, error) {
	word := p.tok.value
	p.advance() // consume word
	return &wordNode{value: word}, nil
}

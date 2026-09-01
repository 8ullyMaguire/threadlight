package search

import (
	"strings"
	"testing"
)

func TestParse(t *testing.T) {
	tests := []struct {
		name        string
		input       string
		wantTsQuery string
		wantFilters []FieldFilter
		wantErr     bool
		errContains string
	}{
		{
			name:        "empty input",
			input:       "",
			wantTsQuery: "",
			wantFilters: nil,
		},
		{
			name:        "whitespace only",
			input:       "   \t\n  ",
			wantTsQuery: "",
			wantFilters: nil,
		},
		{
			name:        "single word",
			input:       "climate",
			wantTsQuery: "'climate'",
			wantFilters: nil,
		},
		{
			name:        "multiple words with implicit AND",
			input:       "climate environment",
			wantTsQuery: "'climate' & 'environment'",
			wantFilters: nil,
		},
		{
			name:        "explicit AND",
			input:       "climate AND environment",
			wantTsQuery: "'climate' & 'environment'",
			wantFilters: nil,
		},
		{
			name:        "explicit OR",
			input:       "climate OR environment",
			wantTsQuery: "'climate' | 'environment'",
			wantFilters: nil,
		},
		{
			name:        "NOT operator",
			input:       "NOT climate",
			wantTsQuery: "!'climate'",
			wantFilters: nil,
		},
		{
			name:        "NOT with AND",
			input:       "climate AND NOT environment",
			wantTsQuery: "'climate' & !'environment'",
			wantFilters: nil,
		},
		{
			name:        "NOT with OR",
			input:       "climate OR NOT environment",
			wantTsQuery: "'climate' | !'environment'",
			wantFilters: nil,
		},
		{
			name:        "multiple NOT",
			input:       "NOT NOT climate",
			wantTsQuery: "!(!'climate')",
			wantFilters: nil,
		},
		{
			name:        "parentheses grouping",
			input:       "(climate OR environment) AND policy",
			wantTsQuery: "('climate' | 'environment') & 'policy'",
			wantFilters: nil,
		},
		{
			name:        "nested parentheses",
			input:       "((climate OR environment) AND policy)",
			wantTsQuery: "(('climate' | 'environment') & 'policy')",
			wantFilters: nil,
		},
		{
			name:        "NOT with parentheses",
			input:       "NOT (climate OR environment)",
			wantTsQuery: "!('climate' | 'environment')",
			wantFilters: nil,
		},
		{
			name:        "phrase matching (double quotes)",
			input:       `"fossil fuels"`,
			wantTsQuery: "'fossil' <-> 'fuels'",
			wantFilters: nil,
		},
		{
			name:        "phrase with single word",
			input:       `"climate"`,
			wantTsQuery: "'climate'",
			wantFilters: nil,
		},
		{
			name:        "phrase with AND",
			input:       `"fossil fuels" AND climate`,
			wantTsQuery: "'fossil' <-> 'fuels' & 'climate'",
			wantFilters: nil,
		},
		{
			name:        "field filter author",
			input:       "author:alice",
			wantTsQuery: "",
			wantFilters: []FieldFilter{{Field: "author", Value: "alice", Operator: "="}},
		},
		{
			name:        "field filter tag",
			input:       "tag:golang",
			wantTsQuery: "",
			wantFilters: []FieldFilter{{Field: "tag", Value: "golang", Operator: "="}},
		},
		{
			name:        "field filter community",
			input:       "community:opensource",
			wantTsQuery: "",
			wantFilters: []FieldFilter{{Field: "community", Value: "opensource", Operator: "="}},
		},
		{
			name:        "field filter title",
			input:       "title:hello",
			wantTsQuery: "",
			wantFilters: []FieldFilter{{Field: "title", Value: "hello", Operator: "="}},
		},
		{
			name:        "field filter body",
			input:       "body:content",
			wantTsQuery: "",
			wantFilters: []FieldFilter{{Field: "body", Value: "content", Operator: "="}},
		},
		{
			name:        "field filter mood",
			input:       "mood:happy",
			wantTsQuery: "",
			wantFilters: []FieldFilter{{Field: "mood", Value: "happy", Operator: "="}},
		},
		{
			name:        "field filter is",
			input:       "is:nsfw",
			wantTsQuery: "",
			wantFilters: []FieldFilter{{Field: "is", Value: "nsfw", Operator: "="}},
		},
		{
			name:        "field filter before",
			input:       "before:2024-01-01",
			wantTsQuery: "",
			wantFilters: []FieldFilter{{Field: "before", Value: "2024-01-01", Operator: "="}},
		},
		{
			name:        "field filter after",
			input:       "after:2024-01-01",
			wantTsQuery: "",
			wantFilters: []FieldFilter{{Field: "after", Value: "2024-01-01", Operator: "="}},
		},
		{
			name:        "field filter negated (exclamation on word)",
			input:       "author:!alice",
			wantTsQuery: "",
			wantFilters: []FieldFilter{{Field: "author", Value: "alice", Operator: "!="}},
		},
		{
			name:        "field filter negated (standalone !)",
			input:       "author:! alice",
			wantTsQuery: "",
			wantFilters: []FieldFilter{{Field: "author", Value: "alice", Operator: "!="}},
		},
		{
			name:        "field filter with phrase value",
			input:       `author:"alice bob"`,
			wantTsQuery: "",
			wantFilters: []FieldFilter{{Field: "author", Value: "alice bob", Operator: "="}},
		},
		{
			name:        "combined complex query",
			input:       `(climate OR environment) AND NOT "fossil fuels" author:alice`,
			wantTsQuery: "('climate' | 'environment') & !('fossil' <-> 'fuels')",
			wantFilters: []FieldFilter{{Field: "author", Value: "alice", Operator: "="}},
		},
		{
			name:        "combined with tag and author filters",
			input:       `climate AND tag:golang author:!bob`,
			wantTsQuery: "'climate'",
			wantFilters: []FieldFilter{
				{Field: "tag", Value: "golang", Operator: "="},
				{Field: "author", Value: "bob", Operator: "!="},
			},
		},
		{
			name:        "multiple field filters with implicit AND",
			input:       `author:alice tag:golang is:nsfw`,
			wantTsQuery: "",
			wantFilters: []FieldFilter{
				{Field: "author", Value: "alice", Operator: "="},
				{Field: "tag", Value: "golang", Operator: "="},
				{Field: "is", Value: "nsfw", Operator: "="},
			},
		},
		{
			name:        "query with both text and filters",
			input:       `climate environment tag:science`,
			wantTsQuery: "'climate' & 'environment'",
			wantFilters: []FieldFilter{
				{Field: "tag", Value: "science", Operator: "="},
			},
		},
		{
			name:        "complex with field filters in parens",
			input:       `(title:hello OR body:world) AND NOT "climate change" author:alice tag:!foo`,
			wantTsQuery: "!('climate' <-> 'change')",
			wantFilters: []FieldFilter{
				{Field: "title", Value: "hello", Operator: "="},
				{Field: "body", Value: "world", Operator: "="},
				{Field: "author", Value: "alice", Operator: "="},
				{Field: "tag", Value: "foo", Operator: "!="},
			},
		},
		{
			name:        "case insensitive operators",
			input:       "climate and environment or policy not nuclear",
			wantTsQuery: "'climate' & 'environment' | 'policy' & !'nuclear'",
			wantFilters: nil,
		},
		{
			name:        "plus shorthand (+)",
			input:       "+climate +environment",
			wantTsQuery: "'climate' & 'environment'",
			wantFilters: nil,
		},
		{
			name:        "minus shorthand (-)",
			input:       "climate -environment",
			wantTsQuery: "'climate' & !'environment'",
			wantFilters: nil,
		},
		{
			name:        "plus and minus combined",
			input:       "+climate -environment",
			wantTsQuery: "'climate' & !'environment'",
			wantFilters: nil,
		},
		{
			name:        "word with numbers",
			input:       "climate2024",
			wantTsQuery: "'climate2024'",
			wantFilters: nil,
		},
		{
			name:        "field filter on 'is' with text",
			input:       "tutorial is:educational",
			wantTsQuery: "'tutorial'",
			wantFilters: []FieldFilter{{Field: "is", Value: "educational", Operator: "="}},
		},
		{
			name:        "field filter with uppercase field name",
			input:       "Author:Alice",
			wantTsQuery: "",
			wantFilters: []FieldFilter{{Field: "author", Value: "Alice", Operator: "="}},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Parse(tt.input)

			// Check error expectations
			if tt.wantErr {
				if err == nil {
					t.Errorf("Parse() expected error but got nil")
				} else if tt.errContains != "" && !strings.Contains(err.Error(), tt.errContains) {
					t.Errorf("Parse() error = %q, want error containing %q", err.Error(), tt.errContains)
				}
				return
			}
			if err != nil {
				t.Errorf("Parse() unexpected error: %v", err)
				return
			}

			// Check TsQuery
			if got.TsQuery != tt.wantTsQuery {
				t.Errorf("Parse().TsQuery = %q, want %q", got.TsQuery, tt.wantTsQuery)
			}

			// Check Filters
			if !equalFilters(got.Filters, tt.wantFilters) {
				t.Errorf("Parse().Filters = %v, want %v", filterString(got.Filters), filterString(tt.wantFilters))
			}
		})
	}
}

func TestParseErrors(t *testing.T) {
	tests := []struct {
		name        string
		input       string
		errContains string
	}{
		{
			name:        "unmatched opening paren",
			input:       "(climate OR environment",
			errContains: "missing closing parenthesis",
		},
		{
			name:        "unmatched closing paren",
			input:       "climate)",
			errContains: "after expression",
		},
		{
			name:        "field filter no value",
			input:       "author:",
			errContains: "expected value after field",
		},
		{
			name:        "field filter with empty negation (standalone !)",
			input:       "author:!",
			errContains: "empty value after '!'",
		},
		{
			name:        "field filter with empty negation (! followed by space)",
			input:       "author:! ",
			errContains: "empty value after '!'",
		},
		{
			name:        "empty parentheses",
			input:       "()",
			errContains: "empty parentheses",
		},
		{
			name:        "trailing operator",
			input:       "climate AND",
			errContains: "unexpected end of input",
		},
		{
			name:        "orphan NOT",
			input:       "NOT",
			errContains: "unexpected end of input",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := Parse(tt.input)
			if err == nil {
				t.Errorf("Parse() expected error containing %q but got nil", tt.errContains)
				return
			}
			if tt.errContains != "" && !strings.Contains(err.Error(), tt.errContains) {
				t.Errorf("Parse() error = %q, want error containing %q", err.Error(), tt.errContains)
			}
		})
	}
}

// TestFieldFilterWithWordAndPhrase tests field filters combined with text search.
func TestFieldFilterWithWordAndPhrase(t *testing.T) {
	tests := []struct {
		name        string
		input       string
		wantTsQuery string
		wantFilters []FieldFilter
	}{
		{
			name:        "word with author filter",
			input:       "climate author:alice",
			wantTsQuery: "'climate'",
			wantFilters: []FieldFilter{{Field: "author", Value: "alice", Operator: "="}},
		},
		{
			name:        "phrase with tag filter",
			input:       `"climate change" tag:science`,
			wantTsQuery: "'climate' <-> 'change'",
			wantFilters: []FieldFilter{{Field: "tag", Value: "science", Operator: "="}},
		},
		{
			name:        "negated field filter with word",
			input:       "climate author:!bob",
			wantTsQuery: "'climate'",
			wantFilters: []FieldFilter{{Field: "author", Value: "bob", Operator: "!="}},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Parse(tt.input)
			if err != nil {
				t.Errorf("Parse() unexpected error: %v", err)
				return
			}
			if got.TsQuery != tt.wantTsQuery {
				t.Errorf("Parse().TsQuery = %q, want %q", got.TsQuery, tt.wantTsQuery)
			}
			if !equalFilters(got.Filters, tt.wantFilters) {
				t.Errorf("Parse().Filters = %v, want %v", filterString(got.Filters), filterString(tt.wantFilters))
			}
		})
	}
}

// TestOperatorPrecedence verifies that AND binds tighter than OR.
func TestOperatorPrecedence(t *testing.T) {
	tests := []struct {
		name        string
		input       string
		wantTsQuery string
	}{
		{
			name:        "AND before OR (implicit)",
			input:       "climate environment OR policy",
			wantTsQuery: "'climate' & 'environment' | 'policy'",
		},
		{
			name:        "AND before OR (explicit)",
			input:       "climate AND environment OR policy",
			wantTsQuery: "'climate' & 'environment' | 'policy'",
		},
		{
			name:        "parentheses override precedence",
			input:       "climate OR (environment AND policy)",
			wantTsQuery: "'climate' | ('environment' & 'policy')",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Parse(tt.input)
			if err != nil {
				t.Errorf("Parse() unexpected error: %v", err)
				return
			}
			if got.TsQuery != tt.wantTsQuery {
				t.Errorf("Parse().TsQuery = %q, want %q", got.TsQuery, tt.wantTsQuery)
			}
		})
	}
}

// TestWordSpecialCharacters tests that words with special characters are handled.
func TestWordSpecialCharacters(t *testing.T) {
	tests := []struct {
		name        string
		input       string
		wantTsQuery string
	}{
		{
			name:        "word with underscores",
			input:       "climate_action",
			wantTsQuery: "'climate_action'",
		},
		{
			name:        "word with hyphens",
			input:       "climate-action",
			wantTsQuery: "'climate-action'",
		},
		{
			name:        "word with dots",
			input:       "v2.0",
			wantTsQuery: "'v2.0'",
		},
		{
			name:        "mixed case normalized in tsquery",
			input:       "Climate",
			wantTsQuery: "'climate'",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Parse(tt.input)
			if err != nil {
				t.Errorf("Parse() unexpected error: %v", err)
				return
			}
			if got.TsQuery != tt.wantTsQuery {
				t.Errorf("Parse().TsQuery = %q, want %q", got.TsQuery, tt.wantTsQuery)
			}
		})
	}
}

// TestUnclosedQuote verifies that unclosed quotes are handled gracefully.
func TestUnclosedQuote(t *testing.T) {
	got, err := Parse(`"climate environment`)
	if err != nil {
		t.Errorf("Parse() unexpected error for unclosed quote: %v", err)
		return
	}
	if got.TsQuery != "'climate' <-> 'environment'" {
		t.Errorf("Parse().TsQuery = %q, want %q", got.TsQuery, "'climate' <-> 'environment'")
	}
}

// TestFieldFilterWithNegationVariants tests different negation syntaxes.
func TestFieldFilterWithNegationVariants(t *testing.T) {
	tests := []struct {
		name        string
		input       string
		wantFilters []FieldFilter
	}{
		{
			name:        "! prefix on word",
			input:       "author:!bob",
			wantFilters: []FieldFilter{{Field: "author", Value: "bob", Operator: "!="}},
		},
		{
			name:        "! as standalone NOT token",
			input:       "author:! bob",
			wantFilters: []FieldFilter{{Field: "author", Value: "bob", Operator: "!="}},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Parse(tt.input)
			if err != nil {
				t.Errorf("Parse() unexpected error: %v", err)
				return
			}
			if !equalFilters(got.Filters, tt.wantFilters) {
				t.Errorf("Parse().Filters = %v, want %v", filterString(got.Filters), filterString(tt.wantFilters))
			}
		})
	}
}

// TestAllFieldTypes verifies all supported field types are recognized.
func TestAllFieldTypes(t *testing.T) {
	fields := []string{"author", "tag", "community", "title", "body", "mood", "is", "before", "after"}
	for _, field := range fields {
		t.Run(field, func(t *testing.T) {
			input := field + ":test"
			got, err := Parse(input)
			if err != nil {
				t.Errorf("Parse(%q) unexpected error: %v", input, err)
				return
			}
			if len(got.Filters) != 1 {
				t.Errorf("Parse(%q) got %d filters, want 1", input, len(got.Filters))
				return
			}
			if got.Filters[0].Field != field {
				t.Errorf("Parse(%q) filter Field = %q, want %q", input, got.Filters[0].Field, field)
			}
			if got.Filters[0].Value != "test" {
				t.Errorf("Parse(%q) filter Value = %q, want %q", input, got.Filters[0].Value, "test")
			}
			if got.Filters[0].Operator != "=" {
				t.Errorf("Parse(%q) filter Operator = %q, want %q", input, got.Filters[0].Operator, "=")
			}
		})
	}
}

// --- helpers ---

func equalFilters(a, b []FieldFilter) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i].Field != b[i].Field || a[i].Value != b[i].Value || a[i].Operator != b[i].Operator {
			return false
		}
	}
	return true
}

func filterString(filters []FieldFilter) string {
	if len(filters) == 0 {
		return "[]"
	}
	s := "["
	for i, f := range filters {
		if i > 0 {
			s += " "
		}
		s += "{" + f.Field + " " + f.Operator + " " + f.Value + "}"
	}
	s += "]"
	return s
}

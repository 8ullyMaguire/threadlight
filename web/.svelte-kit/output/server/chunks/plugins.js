import "marked";
import markedLinkifyIt from "marked-linkify-it";
//#region src/lib/app/markdown/renderers/plugins.ts
var linkify = markedLinkifyIt({
	"!": {
		validate: function(text, pos, self) {
			const tail = text.slice(pos);
			if (!self.re.community) self.re.community = /* @__PURE__ */ new RegExp(/^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z]{2,63})/i);
			if (self.re.community.test(tail)) {
				if (pos >= 2 && tail[pos - 2] === "!") return false;
				const match = tail.match(self.re.community);
				return match ? match[0].length : 0;
			}
			return 0;
		},
		normalize: function(match) {
			let prefix = match.url;
			prefix = prefix.startsWith("c/") ? prefix.slice(2) : prefix.slice(1);
			match.url = `/c/${prefix}`;
		}
	},
	"@": {
		validate: function(text, pos, self) {
			const tail = text.slice(pos);
			if (!self.re.user) self.re.user = /* @__PURE__ */ new RegExp(/^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z]{2,63})/i);
			if (self.re.user.test(tail)) {
				if (pos >= 2 && tail[pos - 2] === "!") return false;
				const match = tail.match(self.re.user);
				return match ? match[0].length : 0;
			}
			return 0;
		},
		normalize: function(match) {
			let prefix = match.url;
			prefix = prefix.startsWith("u/") ? prefix.slice(2) : prefix.slice(1);
			match.url = `/u/${prefix}`;
		}
	}
}, { fuzzyEmail: false });
var regexes = {
	post: /^https:\/\/([a-zA-Z0-9.-]+)\/post\/(\d+)$/i,
	comment: /^https:\/\/([a-zA-Z0-9.-]+)\/comment\/(\d+)$/i,
	user: /^https:\/\/([a-zA-Z0-9.-]+)(\/u\/)([a-zA-Z0-9.-_]+)$/i,
	community: /^https:\/\/([a-zA-Z0-9.-]+)(\/c\/)([a-zA-Z0-9.-_]+)$/i,
	implicitUser: /^mailto:([a-z0-9_.-]+)@(([\da-z.-]+)\.([a-z]{2,63}))/i
};
/**
* Convert links to photon links
*/
var photonify = (link) => {
	if (regexes.community.test(link)) {
		const match = link.match(regexes.community);
		if (!match) return;
		if (match?.[3].includes("@")) return `/c/${match?.[3]}`;
		else return `/c/${match?.[3]}@${match?.[1]}`;
	}
	if (regexes.post.test(link)) {
		const match = link.match(regexes.post);
		if (!match) return;
		return `/post/${match?.[1]}/${match?.[2]}`;
	}
	if (regexes.comment.test(link)) {
		const match = link.match(regexes.comment);
		if (!match) return;
		return `/comment/${match?.[1]}/${match?.[2]}`;
	}
	if (regexes.user.test(link)) {
		const match = link.match(regexes.user);
		if (!match) return;
		if (match?.[3].includes("@")) return `/u/${match?.[3]}`;
		else return `/u/${match?.[3]}@${match?.[1]}`;
	}
	if (regexes.implicitUser.test(link)) {
		const exec = regexes.implicitUser.exec(link);
		if (!exec?.[1] || !exec?.[2]) return;
		return `/u/${exec[1]}@${exec[2]}`;
	}
};
function subSupscriptExtension(tokensExtractor) {
	return {
		name: "subscriptSuperscript",
		level: "inline",
		start(src) {
			return src.match(/[~^]/)?.index;
		},
		tokenizer(src) {
			const subscriptRule = /^~([^~\s](?:[^~]*[^~\s])?)~/;
			const superscriptRule = /^\^([^^\s](?:[^^]*[^^\s])?)\^/;
			let match;
			if (match = subscriptRule.exec(src)) return tokensExtractor({
				type: "subscript",
				content: match[1],
				raw: match[0],
				lexer: this.lexer
			}) ?? void 0;
			if (match = superscriptRule.exec(src)) return tokensExtractor({
				type: "superscript",
				content: match[1],
				raw: match[0],
				lexer: this.lexer
			}) ?? void 0;
		}
	};
}
//#endregion
export { photonify as n, subSupscriptExtension as r, linkify as t };

//# sourceMappingURL=plugins.js.map
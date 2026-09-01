import { n as attr, o as escape_html } from "./validate.js";
import { a as bind_props, c as ensure_array_like, h as stringify, i as await_block, o as derived } from "./server.js";
import { Fn as ChevronRight, In as ChevronLeft, K as isCommentView, Rt as Modal, Yt as Spinner, Zt as Button, hn as Newspaper, nt as UserLink, q as isPostView, t as client } from "./client.svelte.js";
import { n as Icon } from "./Placeholder.js";
import { t as ArrowDownCircle } from "./ArrowDownCircle.js";
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/ArrowUpCircle.js
var ArrowUpCircle = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm-.75 10.25a.75.75 0 0 0 1.5 0V6.56l1.22 1.22a.75.75 0 1 0 1.06-1.06l-2.5-2.5a.75.75 0 0 0-1.06 0l-2.5 2.5a.75.75 0 0 0 1.06 1.06l1.22-1.22v4.69Z",
			"clip-rule": "evenodd"
		}]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-.75-4.75a.75.75 0 0 0 1.5 0V8.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0L6.2 9.74a.75.75 0 1 0 1.1 1.02l1.95-2.1v4.59Z",
			"clip-rule": "evenodd"
		}]
	},
	"outline": {
		"a": {
			"fill": "none",
			"viewBox": "0 0 24 24",
			"stroke-width": "1.5",
			"stroke": "currentColor"
		},
		"path": [{
			"stroke-linecap": "round",
			"stroke-linejoin": "round",
			"d": "m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region src/lib/feature/moderation/ViewVotesModal.svelte
function ViewVotesModal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = void 0, item = void 0 } = $$props;
		let page = 1;
		async function loadVotes(page) {
			if (!item) return [];
			if (isPostView(item)) return await client().listPostLikes({
				post_id: item.post.id,
				limit: 50,
				page
			}).then((i) => i.post_likes);
			if (isCommentView(item)) return await client().listCommentLikes({
				comment_id: item.comment.id,
				limit: 50,
				page
			}).then((i) => i.comment_likes);
			return [];
		}
		let votes = derived(() => loadVotes(page));
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Modal($$renderer, {
				title: "Votes",
				get open() {
					return open;
				},
				set open($$value) {
					open = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					$$renderer.push(`<div class="flex flex-col gap-1">`);
					await_block($$renderer, votes(), () => {
						$$renderer.push(`<div class="self-center justify-self-center h-48 grid place-items-center">`);
						Spinner($$renderer, { width: 24 });
						$$renderer.push(`<!----></div>`);
					}, (votes) => {
						$$renderer.push(`<table class="w-full border-collapse overflow-y-auto table-fixed"><thead><tr class="border divide-x divide-slate-200 dark:divide-zinc-800 border-slate-200 dark:border-zinc-800 *:px-4 *:py-2"><th style="width: 6%;"></th><th style="width: 60%;" class="text-left">User</th><th style="width: 5%;"></th></tr></thead><tbody class="divide-y divide-slate-200 dark:divide-zinc-800"><!--[-->`);
						const each_array = ensure_array_like(votes);
						for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
							let vote = each_array[$$index];
							$$renderer.push(`<tr><td class="py-1 px-1 w-full">`);
							Icon($$renderer, {
								src: vote.score == 1 ? ArrowUpCircle : ArrowDownCircle,
								mini: true,
								size: "20",
								class: vote.score == 1 ? "text-blue-400" : "text-red-400",
								"aria-label": vote.score == 1 ? "Upvoted" : "Downvoted"
							});
							$$renderer.push(`<!----></td><td class="text-sm w-full overflow-hidden">`);
							UserLink($$renderer, { user: {
								...vote.creator,
								banned: vote.creator_banned_from_community
							} });
							$$renderer.push(`<!----></td><td class="text-sm w-full text-right"><a${attr("href", `/modlog?user=${stringify(vote.creator.id)}`)} data-sveltekit-preload-data="tap" class="text-green-400 hover:underline flex flex-row items-center gap-1 font-medium text-xs" aria-label="User moderation log">`);
							Icon($$renderer, {
								src: Newspaper,
								size: "18",
								micro: true
							});
							$$renderer.push(`<!----></a></td></tr>`);
						}
						$$renderer.push(`<!--]--></tbody></table> `);
						if (!(votes.length < 50 && page == 1)) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<div class="flex flex-row justify-center items-center gap-2">`);
							Button($$renderer, {
								onclick: () => page--,
								color: "ghost",
								"aria-label": "Back",
								rounding: "pill",
								size: "square-md",
								disabled: page == 1,
								children: ($$renderer) => {
									Icon($$renderer, {
										src: ChevronLeft,
										size: "20",
										mini: true
									});
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> ${escape_html(page)} `);
							Button($$renderer, {
								onclick: () => page++,
								color: "ghost",
								"aria-label": "Next",
								rounding: "pill",
								size: "square-md",
								disabled: votes.length < 50,
								children: ($$renderer) => {
									Icon($$renderer, {
										src: ChevronRight,
										size: "20",
										mini: true
									});
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></div>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					});
					$$renderer.push(`<!--]--></div>`);
				},
				$$slots: { default: true }
			});
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			open,
			item
		});
	});
}
//#endregion
export { ViewVotesModal as default };

//# sourceMappingURL=ViewVotesModal.js.map
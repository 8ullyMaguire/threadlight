import { n as attr, o as escape_html, r as clsx } from "../../../chunks/validate.js";
import { a as bind_props, c as ensure_array_like, h as stringify, i as await_block, l as head, t as attr_class } from "../../../chunks/server.js";
import { $t as ViewColumns, At as settings, Ct as searchParam, Ht as Option, Lt as modal, M as Pageination, Qt as XMark, R as Header, Vt as Select, Yt as Spinner, Zt as Button, ar as page, at as RelativeDate, dt as postLink, f as toast, it as CommunityLink, nt as UserLink, o as profile, t as client, tt as errorMessage, yn as MagnifyingGlass, zn as CheckCircle } from "../../../chunks/client.svelte.js";
import { n as Icon, t as Placeholder } from "../../../chunks/Placeholder.js";
import { n as ModlogAction, t as ModlogItemCard } from "../../../chunks/ModlogItemCard.js";
import { t as XCircle } from "../../../chunks/XCircle.js";
import { t as UserAutocomplete } from "../../../chunks/UserAutocomplete.js";
import { t as ObjectAutocomplete } from "../../../chunks/ObjectAutocomplete.js";
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Bars3BottomRight.js
var Bars3BottomRight = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M2 3.75A.75.75 0 0 1 2.75 3h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75ZM2 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8Zm6 4.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z",
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
			"d": "M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm7 10.5a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1-.75-.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Z",
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
			"d": "M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{
			"fill-rule": "evenodd",
			"d": "M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm8.25 5.25a.75.75 0 0 1 .75-.75h8.25a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75Z",
			"clip-rule": "evenodd"
		}]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/HandThumbDown.js
var HandThumbDown = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M10.325 3H12v5c-.663 0-1.219.466-1.557 1.037a4.02 4.02 0 0 1-1.357 1.377c-.478.292-.907.706-.989 1.26v.005a9.031 9.031 0 0 0 0 2.642c.028.194-.048.394-.224.479A2 2 0 0 1 5 13c0-.812.08-1.605.234-2.371a.521.521 0 0 0-.5-.629H3C1.896 10 .99 9.102 1.1 8.003A19.827 19.827 0 0 1 2.18 3.215C2.45 2.469 3.178 2 3.973 2h2.703a2 2 0 0 1 .632.103l2.384.794a2 2 0 0 0 .633.103ZM14 2a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M18.905 12.75a1.25 1.25 0 1 1-2.5 0v-7.5a1.25 1.25 0 0 1 2.5 0v7.5ZM8.905 17v1.3c0 .268-.14.526-.395.607A2 2 0 0 1 5.905 17c0-.995.182-1.948.514-2.826.204-.54-.166-1.174-.744-1.174h-2.52c-1.243 0-2.261-1.01-2.146-2.247.193-2.08.651-4.082 1.341-5.974C2.752 3.678 3.833 3 5.005 3h3.192a3 3 0 0 1 1.341.317l2.734 1.366A3 3 0 0 0 13.613 5h1.292v7h-.963c-.685 0-1.258.482-1.612 1.068a4.01 4.01 0 0 1-2.166 1.73c-.432.143-.853.386-1.011.814-.16.432-.248.9-.248 1.388Z" }]
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
			"d": "M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{ "d": "M15.73 5.5h1.035A7.465 7.465 0 0 1 18 9.625a7.465 7.465 0 0 1-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 0 1-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.499 4.499 0 0 0-.322 1.672v.633A.75.75 0 0 1 9 22a2.25 2.25 0 0 1-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H3.622c-1.026 0-1.945-.694-2.054-1.715A12.137 12.137 0 0 1 1.5 12.25c0-2.848.992-5.464 2.649-7.521C4.537 4.247 5.136 4 5.754 4H9.77a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23ZM21.669 14.023c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.958 8.958 0 0 1-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227Z" }]
	}
};
//#endregion
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/HandThumbUp.js
var HandThumbUp = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M2.09 15a1 1 0 0 0 1-1V8a1 1 0 1 0-2 0v6a1 1 0 0 0 1 1ZM5.765 13H4.09V8c.663 0 1.218-.466 1.556-1.037a4.02 4.02 0 0 1 1.358-1.377c.478-.292.907-.706.989-1.26V4.32a9.03 9.03 0 0 0 0-2.642c-.028-.194.048-.394.224-.479A2 2 0 0 1 11.09 3c0 .812-.08 1.605-.235 2.371a.521.521 0 0 0 .502.629h1.733c1.104 0 2.01.898 1.901 1.997a19.831 19.831 0 0 1-1.081 4.788c-.27.747-.998 1.215-1.793 1.215H9.414c-.215 0-.428-.035-.632-.103l-2.384-.794A2.002 2.002 0 0 0 5.765 13Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M1 8.25a1.25 1.25 0 1 1 2.5 0v7.5a1.25 1.25 0 1 1-2.5 0v-7.5ZM11 3V1.7c0-.268.14-.526.395-.607A2 2 0 0 1 14 3c0 .995-.182 1.948-.514 2.826-.204.54.166 1.174.744 1.174h2.52c1.243 0 2.261 1.01 2.146 2.247a23.864 23.864 0 0 1-1.341 5.974C17.153 16.323 16.072 17 14.9 17h-3.192a3 3 0 0 1-1.341-.317l-2.734-1.366A3 3 0 0 0 6.292 15H5V8h.963c.685 0 1.258-.483 1.612-1.068a4.011 4.011 0 0 1 2.166-1.73c.432-.143.853-.386 1.011-.814.16-.432.248-.9.248-1.388Z" }]
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
			"d": "M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{ "d": "M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" }]
	}
};
//#endregion
//#region src/routes/modlog/item/ModlogItemTable.svelte
function ModlogItemTable($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { item, decision = null, userVote = void 0, voting = false, trustPenalty = void 0, onvote = void 0 } = $$props;
		function itemInfo($$renderer) {
			if (item.link) {
				$$renderer.push("<!--[0-->");
				Button($$renderer, {
					color: "primary",
					rounding: "pill",
					class: "w-max",
					href: item.link,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Jump`);
					},
					$$slots: { default: true }
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (item.moderatee) {
				$$renderer.push("<!--[0-->");
				UserLink($$renderer, {
					avatar: true,
					user: item.moderatee
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <div>${escape_html(item.content)}</div>`);
		}
		$$renderer.push(`<tr><td style="width: 10%;"><span>`);
		RelativeDate($$renderer, { date: new Date(item.timestamp) });
		$$renderer.push(`<!----></span></td><td>`);
		if (item.moderator) {
			$$renderer.push("<!--[0-->");
			UserLink($$renderer, {
				showInstance: false,
				avatar: true,
				avatarSize: 20,
				user: item.moderator
			});
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<p class="text-slate-500 dark:text-zinc-500">Unknown</p> <p></p>`);
		}
		$$renderer.push(`<!--]--></td><td>`);
		if (item.community) {
			$$renderer.push("<!--[0-->");
			CommunityLink($$renderer, {
				showInstance: false,
				avatar: true,
				avatarSize: 20,
				community: item.community
			});
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></td><td>`);
		ModlogAction($$renderer, { action: item.actionName });
		$$renderer.push(`<!----></td><td>`);
		if (item.reason) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p>${escape_html(item.reason)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></td><td align="right">`);
		if (item.content) {
			$$renderer.push("<!--[0-->");
			Button($$renderer, {
				size: "sm",
				onclick: () => modal({
					title: "Info",
					snippet: itemInfo
				}),
				children: ($$renderer) => {
					$$renderer.push(`<!---->Info`);
				},
				$$slots: { default: true }
			});
		} else if (item.moderatee) {
			$$renderer.push("<!--[1-->");
			UserLink($$renderer, { user: item.moderatee });
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></td><td align="center">`);
		if (decision) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex flex-row items-center gap-2 justify-center"><span class="flex items-center gap-0.5 text-green-600 dark:text-green-400 text-xs" title="Fair reviews">`);
			Icon($$renderer, {
				src: HandThumbUp,
				size: "12",
				mini: true
			});
			$$renderer.push(`<!----> ${escape_html(decision.reviews_fair)}</span> <span class="flex items-center gap-0.5 text-red-600 dark:text-red-400 text-xs" title="Unfair reviews">`);
			Icon($$renderer, {
				src: HandThumbDown,
				size: "12",
				mini: true
			});
			$$renderer.push(`<!----> ${escape_html(decision.reviews_unfair)}</span> <span${attr_class(`text-[10px] font-mono ${decision.controversy_score > .5 ? "text-orange-500" : "text-slate-400"}`)}>${escape_html(decision.controversy_score.toFixed(2))}</span></div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<span class="text-slate-400 dark:text-zinc-500 text-xs">—</span>`);
		}
		$$renderer.push(`<!--]--></td><td align="center">`);
		if (decision && onvote) {
			$$renderer.push("<!--[0-->");
			if (userVote) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<span class="text-xs text-slate-500 dark:text-zinc-400">${escape_html(userVote === 1 ? "✓ Fair" : "✗ Unfair")}</span>`);
			} else if (voting) {
				$$renderer.push("<!--[1-->");
				Spinner($$renderer, { width: 14 });
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="flex flex-row items-center gap-1 justify-center"><button class="cursor-pointer hover:text-green-500 transition-colors p-0.5" title="Vote Fair">`);
				Icon($$renderer, {
					src: CheckCircle,
					size: "16",
					mini: true
				});
				$$renderer.push(`<!----></button> <button class="cursor-pointer hover:text-red-500 transition-colors p-0.5" title="Vote Unfair">`);
				Icon($$renderer, {
					src: XCircle,
					size: "16",
					mini: true
				});
				$$renderer.push(`<!----></button></div>`);
			}
			$$renderer.push(`<!--]-->`);
		} else if (!onvote) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<span class="text-slate-400 dark:text-zinc-500 text-xs">—</span>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		if (trustPenalty) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="text-[10px] text-orange-500 mt-1 font-medium leading-tight">Trust penalty: ${escape_html(trustPenalty)}</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></td></tr>`);
	});
}
//#endregion
//#region src/routes/modlog/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data = void 0 } = $$props;
		let view = `${settings.modlogCardView ?? false ? !window.matchMedia("(min-width: 1600px)").matches : false}`;
		let votingState = {};
		let voteMessages = {};
		let trustPenalties = {};
		let userVotes = {};
		async function castVote(actionId, vote) {
			if (!profile.current?.jwt) {
				toast({
					content: "You must be logged in to vote.",
					type: "warning"
				});
				return;
			}
			votingState[actionId] = "voting";
			try {
				const res = await client().castReview(actionId, vote);
				votingState[actionId] = "done";
				userVotes[actionId] = vote;
				if (res.trust_penalty) trustPenalties[actionId] = res.trust_penalty;
				voteMessages[actionId] = res.message || "Vote recorded.";
				if (res.trust_penalty) toast({
					content: `Trust penalty: ${res.trust_penalty}`,
					type: "warning"
				});
				toast({
					content: res.message || "Vote recorded.",
					type: "success"
				});
			} catch (err) {
				votingState[actionId] = "error";
				voteMessages[actionId] = errorMessage(err);
				toast({
					content: errorMessage(err),
					type: "error"
				});
			}
		}
		function getDecision(actionId) {
			if (actionId === void 0 || actionId === null) return null;
			return data.decisionsById?.[actionId] ?? null;
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("k5bzdb", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Modlog</title>`);
				});
			});
			$$renderer.push(`<div class="flex flex-col gap-4">`);
			{
				function extended($$renderer) {
					$$renderer.push(`<span class="font-medium text-lg">Filters</span> <ul class="font-normal flex flex-col gap-2 mt-2">`);
					if (data.params.community) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<li><div class="text-sm text-slate-600 dark:text-zinc-400">Community</div> `);
						await_block($$renderer, client().getCommunity({ id: data.params.community }), () => {
							Spinner($$renderer, { width: 24 });
						}, (community) => {
							CommunityLink($$renderer, { community: community.community_view.community });
						});
						$$renderer.push(`<!--]--></li>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (data.params.user) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<li><div class="text-sm text-slate-600 dark:text-zinc-400">User</div> `);
						await_block($$renderer, client().getPersonDetails({
							person_id: data.params.user,
							limit: 1
						}), () => {
							Spinner($$renderer, { width: 24 });
						}, (person) => {
							UserLink($$renderer, {
								class: "inline",
								user: person.person_view.person
							});
						});
						$$renderer.push(`<!--]--></li>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (data.params.moderator) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<li><div class="text-sm text-slate-600 dark:text-zinc-400">Moderator</div> `);
						await_block($$renderer, client().getPersonDetails({
							person_id: data.params.moderator,
							limit: 1
						}), () => {
							Spinner($$renderer, { width: 24 });
						}, (person) => {
							UserLink($$renderer, {
								class: "inline",
								user: person.person_view.person
							});
						});
						$$renderer.push(`<!--]--></li>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (data.params.post) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<li><div class="text-sm text-slate-600 dark:text-zinc-400">Post</div> `);
						await_block($$renderer, client().getPost({ id: data.params.post }), () => {
							Spinner($$renderer, { width: 24 });
						}, (post) => {
							$$renderer.push(`<a class="hover:underline block"${attr("href", postLink(post.post_view.post))}>${escape_html(post.post_view.post.name)}</a>`);
						});
						$$renderer.push(`<!--]--></li>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (data.params.comment) {
						$$renderer.push("<!--[0-->");
						$$renderer.push(`<li><div class="text-sm text-slate-600 dark:text-zinc-400">Comment</div> `);
						await_block($$renderer, client().getComment({ id: data.params.comment }), () => {
							Spinner($$renderer, { width: 24 });
						}, (comment) => {
							$$renderer.push(`<a class="hover:underline block"${attr("href", `/comment/${stringify(data.params.comment)}`)}>${escape_html(comment.comment_view.comment.content.slice(1, 200))}...</a>`);
						});
						$$renderer.push(`<!--]--></li>`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></ul>`);
				}
				Header($$renderer, {
					pageHeader: true,
					extended,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Modlog`);
					},
					$$slots: {
						extended: true,
						default: true
					}
				});
			}
			$$renderer.push(`<!----> <div class="flex flex-row flex-wrap gap-2">`);
			{
				function customLabel($$renderer) {
					$$renderer.push(`<span class="flex gap-1 items-center">`);
					Icon($$renderer, {
						src: Bars3BottomRight,
						size: "15",
						mini: true
					});
					$$renderer.push(`<!----> Type</span>`);
				}
				Select($$renderer, {
					onchange: () => searchParam(page.url, "type", data.type, "page"),
					class: "w-48",
					get value() {
						return data.type;
					},
					set value($$value) {
						data.type = $$value;
						$$settled = false;
					},
					customLabel,
					children: ($$renderer) => {
						Option($$renderer, {
							value: "All",
							children: ($$renderer) => {
								$$renderer.push(`<!---->All`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "ModRemovePost",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Remove post`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "ModLockPost",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Lock post`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "ModFeaturePost",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Feature post`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "ModRemoveComment",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Remove comment`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "ModRemoveCommunity",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Remove community`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "ModBanFromCommunity",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Ban from community`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "ModAddCommunity",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Add moderator`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "ModTransferCommunity",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Transfer community`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "ModAdd",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Add admin`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "ModBan",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Ban admin`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "ModHideCommunity",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Hide community`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "AdminPurgePerson",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Purge user`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "AdminPurgeCommunity",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Purge community`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "AdminPurgePost",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Purge post`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "AdminPurgeComment",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Purge comment`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!---->`);
					},
					$$slots: {
						customLabel: true,
						default: true
					}
				});
			}
			$$renderer.push(`<!----> `);
			{
				function customLabel($$renderer) {
					$$renderer.push(`<span class="flex gap-1 items-center">`);
					Icon($$renderer, {
						src: ViewColumns,
						size: "15",
						mini: true
					});
					$$renderer.push(`<!----> View</span>`);
				}
				Select($$renderer, {
					class: "w-36",
					get value() {
						return view;
					},
					set value($$value) {
						view = $$value;
						$$settled = false;
					},
					customLabel,
					children: ($$renderer) => {
						Option($$renderer, {
							value: "false",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Table`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "true",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Cards`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Option($$renderer, {
							value: "undefined",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Default`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!---->`);
					},
					$$slots: {
						customLabel: true,
						default: true
					}
				});
			}
			$$renderer.push(`<!----></div> <div class="flex flex-col md:flex-row md:items-center gap-2 w-full">`);
			ObjectAutocomplete($$renderer, {
				placeholder: "Filter by community",
				listing_type: "All",
				showWhenEmpty: true,
				label: "Community",
				q: page.url.searchParams.get("community") ? "Selected" : "",
				onselect: (e) => searchParam(page.url, "community", e?.community.id.toString() ?? "", "page")
			});
			$$renderer.push(`<!----> `);
			UserAutocomplete($$renderer, {
				instance: page.url.searchParams.get("instance") || void 0,
				placeholder: "Filter by user",
				listing_type: "All",
				showWhenEmpty: true,
				label: "User",
				q: page.url.searchParams.get("user") ? data.filters.user ?? "Selected" : "",
				onselect: (e) => searchParam(page.url, "user", e?.id.toString() ?? "", "page")
			});
			$$renderer.push(`<!----> `);
			if (profile.isAdmin) {
				$$renderer.push("<!--[0-->");
				UserAutocomplete($$renderer, {
					placeholder: "Filter by moderator",
					listing_type: "All",
					showWhenEmpty: true,
					label: "Moderator",
					q: page.url.searchParams.get("mod_id") ? data.filters.moderator ?? "Selected" : "",
					onselect: (e) => searchParam(page.url, "mod_id", e?.id.toString() ?? "", "page")
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			Button($$renderer, {
				onclick: () => {
					searchParam(page.url, "", "", "user", "moderator", "community", "instance");
				},
				size: "custom",
				class: "self-end shrink-0 h-8.5 aspect-square",
				title: "Clear filters",
				children: ($$renderer) => {
					Icon($$renderer, {
						src: XMark,
						size: "16",
						mini: true
					});
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div> `);
			if (data.modlog && data.modlog.length > 0) {
				$$renderer.push("<!--[0-->");
				if (settings.modlogCardView ?? !window.matchMedia("(min-width: 1600px)").matches) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`);
					const each_array = ensure_array_like(data.modlog);
					for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
						let modlog = each_array[$$index];
						const decision = getDecision(modlog.id);
						$$renderer.push(`<div class="flex flex-col gap-2">`);
						ModlogItemCard($$renderer, { item: modlog });
						$$renderer.push(`<!----> `);
						if (decision) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<div class="flex flex-row items-center gap-3 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800"><span class="font-medium text-slate-500 dark:text-zinc-400">Reviews:</span> <span class="flex items-center gap-1 text-green-600 dark:text-green-400">`);
							Icon($$renderer, {
								src: HandThumbUp,
								size: "14",
								mini: true
							});
							$$renderer.push(`<!----> ${escape_html(decision.reviews_fair)}</span> <span class="flex items-center gap-1 text-red-600 dark:text-red-400">`);
							Icon($$renderer, {
								src: HandThumbDown,
								size: "14",
								mini: true
							});
							$$renderer.push(`<!----> ${escape_html(decision.reviews_unfair)}</span> <span class="text-slate-400 dark:text-zinc-500">|</span> <span class="flex items-center gap-1"><span class="font-medium">Score:</span> <span${attr_class(clsx(decision.controversy_score > 0 ? "text-orange-500" : "text-slate-500"))}>${escape_html(decision.controversy_score.toFixed(2))}</span></span> <div class="flex-1"></div> `);
							if (profile.current?.jwt) {
								$$renderer.push("<!--[0-->");
								if (userVotes[decision.action_id]) {
									$$renderer.push("<!--[0-->");
									$$renderer.push(`<span class="text-xs text-slate-500 dark:text-zinc-400">${escape_html(userVotes[decision.action_id] === 1 ? "✓ Voted Fair" : "✗ Voted Unfair")}</span>`);
								} else if (votingState[decision.action_id] === "voting") {
									$$renderer.push("<!--[1-->");
									Spinner($$renderer, { width: 16 });
								} else if (votingState[decision.action_id] === "done") {
									$$renderer.push("<!--[2-->");
									$$renderer.push(`<span class="text-xs text-green-600 dark:text-green-400">Voted</span>`);
								} else {
									$$renderer.push("<!--[-1-->");
									$$renderer.push(`<button class="cursor-pointer hover:text-green-500 transition-colors" title="Vote Fair">`);
									Icon($$renderer, {
										src: CheckCircle,
										size: "16",
										mini: true
									});
									$$renderer.push(`<!----></button> <button class="cursor-pointer hover:text-red-500 transition-colors" title="Vote Unfair">`);
									Icon($$renderer, {
										src: XCircle,
										size: "16",
										mini: true
									});
									$$renderer.push(`<!----></button>`);
								}
								$$renderer.push(`<!--]-->`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--></div>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						if (decision && trustPenalties[decision.action_id]) {
							$$renderer.push("<!--[0-->");
							$$renderer.push(`<div class="px-3 py-1.5 text-xs rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300">Trust penalty: ${escape_html(trustPenalties[decision.action_id])}</div>`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--></div>`);
					}
					$$renderer.push(`<!--]--></div>`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<div style="width:100%; overflow-x: auto;" class="table-container svelte-k5bzdb"><table class="table overflow-x-auto table-fixed relative w-full min-w-2xl svelte-k5bzdb"><colgroup><col style="width: 10.6%;"/><col style="width: 12%;"/><col style="width: 12%;"/><col style="width: 12%;"/><col style="width: 12%;"/><col style="width: 12%;"/><col style="width: 14%;"/><col style="width: 15.4%;"/></colgroup><thead class="text-left svelte-k5bzdb"><tr class="rounded-t-lg overflow-hidden svelte-k5bzdb"><th class="svelte-k5bzdb">Time</th><th class="svelte-k5bzdb">Moderator</th><th class="svelte-k5bzdb">Community</th><th class="svelte-k5bzdb">Action</th><th class="svelte-k5bzdb">Reason</th><th align="right" class="svelte-k5bzdb">Content</th><th align="center" class="svelte-k5bzdb">Reviews</th><th align="center" class="svelte-k5bzdb">Vote</th></tr></thead><tbody class="text-sm divide-y divide-slate-200 dark:divide-zinc-800 svelte-k5bzdb"><!--[-->`);
					const each_array_1 = ensure_array_like(data.modlog);
					for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
						let modlog = each_array_1[$$index_1];
						const decision = getDecision(modlog.id);
						ModlogItemTable($$renderer, {
							item: modlog,
							decision,
							userVote: decision ? userVotes[decision.action_id] : void 0,
							voting: decision ? votingState[decision.action_id] === "voting" : false,
							trustPenalty: decision ? trustPenalties[decision.action_id] : void 0,
							onvote: (vote) => decision && castVote(decision.action_id, vote)
						});
					}
					$$renderer.push(`<!--]--></tbody></table></div>`);
				}
				$$renderer.push(`<!--]--> `);
				Pageination($$renderer, {
					page: data.page,
					hasMore: data.params.hasMore,
					href: (page) => `?page=${page}`
				});
				$$renderer.push(`<!---->`);
			} else {
				$$renderer.push("<!--[-1-->");
				Placeholder($$renderer, {
					title: "No results",
					description: "There are no mod logs with that filter. Try refining your search.",
					icon: MagnifyingGlass
				});
			}
			$$renderer.push(`<!--]--></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { data });
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map
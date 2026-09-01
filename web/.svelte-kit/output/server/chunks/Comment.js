import { n as attr, o as escape_html, r as clsx } from "./validate.js";
import { a as bind_props, c as ensure_array_like, f as spread_props, h as stringify, n as attr_style, o as derived, t as attr_class } from "./server.js";
import { At as settings, En as Fire, H as deleteItem, Hn as ChatBubbleOvalLeft, Jn as Bookmark, K as isCommentView, Ln as ChevronDown, Mt as MenuDivider, Nt as MenuButton, On as EllipsisHorizontal, Pn as ChevronUp, Pt as Menu, Qt as XMark, Rt as Modal, Sn as Language, V as shouldShowVoteColor, W as save, Zt as Button, _n as Megaphone, ar as page, at as RelativeDate, et as FormattedNumber, fn as Pencil, gn as Minus, hn as Newspaper, nn as Trash, nt as UserLink, o as profile, on as ShieldCheck, ot as formatRelativeDate, p as Markdown, qn as BookmarkSlash, r as site, sn as Share, tr as publishedToDate, un as Plus, xt as placeholders } from "./client.svelte.js";
import { n as Icon } from "./Placeholder.js";
import { t as ArrowUp } from "./ArrowUp.js";
import { t as ArrowsUpDown } from "./ArrowsUpDown.js";
import { t as MarkdownEditor } from "./MarkdownEditor.js";
import { t as Flag } from "./Flag.js";
import { t as PencilSquare } from "./PencilSquare.js";
import { t as ShieldExclamation } from "./ShieldExclamation.js";
import { a as remove, n as feature, o as report, s as viewVotes, t as ban } from "./moderation.js";
//#region node_modules/@xylightdev/svelte-hero-icons/dist/icons/Microphone.js
var Microphone = {
	"micro": {
		"a": {
			"viewBox": "0 0 16 16",
			"fill": "currentColor"
		},
		"path": [{ "d": "M8 1a2 2 0 0 0-2 2v4a2 2 0 1 0 4 0V3a2 2 0 0 0-2-2Z" }, { "d": "M4.5 7A.75.75 0 0 0 3 7a5.001 5.001 0 0 0 4.25 4.944V13.5h-1.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-1.5v-1.556A5.001 5.001 0 0 0 13 7a.75.75 0 0 0-1.5 0 3.5 3.5 0 1 1-7 0Z" }]
	},
	"mini": {
		"a": {
			"viewBox": "0 0 20 20",
			"fill": "currentColor"
		},
		"path": [{ "d": "M7 4a3 3 0 0 1 6 0v6a3 3 0 1 1-6 0V4Z" }, { "d": "M5.5 9.643a.75.75 0 0 0-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-1.5v-1.546A6.001 6.001 0 0 0 16 10v-.357a.75.75 0 0 0-1.5 0V10a4.5 4.5 0 0 1-9 0v-.357Z" }]
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
			"d": "M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
		}]
	},
	"solid": {
		"a": {
			"viewBox": "0 0 24 24",
			"fill": "currentColor"
		},
		"path": [{ "d": "M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" }, { "d": "M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" }]
	}
};
//#endregion
//#region src/lib/feature/moderation/CommentModerationMenu.svelte
function CommentModerationMenu($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { item = void 0, target, $$slots, $$events, ...rest } = $$props;
		Menu($$renderer, spread_props([rest, {
			placement: "bottom",
			target,
			children: ($$renderer) => {
				if (profile.isMod(item.community) || profile.isAdmin) {
					$$renderer.push("<!--[0-->");
					MenuDivider($$renderer, {
						hidden: true,
						children: ($$renderer) => {
							if (!item.community.local && !profile.isMod(item.community)) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`Moderation (Local only)`);
							} else {
								$$renderer.push("<!--[-1-->");
								$$renderer.push(`Moderation`);
							}
							$$renderer.push(`<!--]-->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					MenuButton($$renderer, {
						color: "danger-subtle",
						onclick: () => remove(item),
						icon: Trash,
						children: ($$renderer) => {
							if (isCommentView(item)) {
								$$renderer.push("<!--[0-->");
								$$renderer.push(`${escape_html(item.comment.removed ? "Restore" : "Remove")}`);
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]-->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					if (profile.current?.user && profile.current.user?.local_user_view.person.id != item.creator.id) {
						$$renderer.push("<!--[0-->");
						MenuButton($$renderer, {
							color: "danger-subtle",
							onclick: () => ban(item.creator_banned_from_community, item.creator, item.community),
							icon: ShieldExclamation,
							children: ($$renderer) => {
								$$renderer.push(`<!---->${escape_html(item.creator_banned_from_community ? "Unban user from community" : "Ban user from community")}`);
							},
							$$slots: { default: true }
						});
					} else {
						$$renderer.push("<!--[-1-->");
						MenuButton($$renderer, {
							color: "success-subtle",
							onclick: async () => {
								if (!profile.current.jwt) return;
								item.comment = (await feature(!item.comment.distinguished, item.comment, profile.current.jwt)).comment_view.comment;
							},
							icon: Megaphone,
							children: ($$renderer) => {
								$$renderer.push(`<!---->${escape_html(item.comment.distinguished ? "Unfeature" : "Feature")}`);
							},
							$$slots: { default: true }
						});
					}
					$$renderer.push(`<!--]--> `);
					MenuButton($$renderer, {
						color: "success-subtle",
						href: `/modlog?comment=${stringify(item.comment.id)}`,
						children: ($$renderer) => {
							Icon($$renderer, {
								src: Newspaper,
								size: "16",
								micro: true
							});
							$$renderer.push(`<!----> Comment moderation log`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					MenuButton($$renderer, {
						color: "success-subtle",
						href: `/modlog?user=${stringify(item.creator.id)}`,
						children: ($$renderer) => {
							Icon($$renderer, {
								src: Newspaper,
								size: "16",
								micro: true
							});
							$$renderer.push(`<!----> User moderation log`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					MenuButton($$renderer, {
						color: "blue-subtle",
						onclick: () => viewVotes(item),
						children: ($$renderer) => {
							Icon($$renderer, {
								src: ArrowsUpDown,
								size: "16",
								micro: true
							});
							$$renderer.push(`<!----> Votes`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (profile.isAdmin) {
					$$renderer.push("<!--[0-->");
					MenuDivider($$renderer, {
						showLabel: true,
						children: ($$renderer) => {
							$$renderer.push(`<!---->Administration`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					MenuButton($$renderer, {
						color: "danger-subtle",
						onclick: () => remove(item, true),
						icon: Fire,
						children: ($$renderer) => {
							$$renderer.push(`<!---->Purge`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!---->`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}]));
		bind_props($$props, { item });
	});
}
//#endregion
//#region src/lib/feature/comment/CommentVote.svelte
function CommentVote($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { vote = 0, upvotes = void 0, downvotes = void 0, comment } = $$props;
		let voteRatio = derived(() => Math.floor((upvotes ?? 0) / ((upvotes ?? 0) + (downvotes ?? 0)) * 100));
		function voteButton($$renderer, votes, target, vote) {
			const targetNum = target == "upvote" ? 1 : -1;
			$$renderer.push(`<button${attr_class(clsx([
				"flex items-center gap-0.5 transition-colors relative cursor-pointer px-1.5 py-1",
				"first:rounded-l-3xl last:rounded-r-3xl",
				"last:flex-row-reverse",
				vote == targetNum ? shouldShowVoteColor(vote, target == "upvote" ? "upvotes" : "downvotes") : "btn-tertiary"
			]), "svelte-qvcm8h")}${attr("aria-pressed", vote == targetNum)}${attr("aria-label", target == "upvote" ? "Upvote" : "Downvote")}>`);
			Icon($$renderer, {
				src: target == "upvote" ? ChevronUp : ChevronDown,
				size: "18",
				micro: true
			});
			$$renderer.push(`<!----> <div class="grid text-sm z-20"><!---->`);
			$$renderer.push(`<span style="grid-column: 1; grid-row: 1;"${attr("aria-label", target == "upvote" ? `${votes} upvotes` : `${votes} downvotes`)}>`);
			FormattedNumber($$renderer, { number: votes ?? 0 });
			$$renderer.push(`<!----></span>`);
			$$renderer.push(`<!----></div></button>`);
		}
		$$renderer.push(`<div${attr_class(clsx([
			"h-full relative flex items-center overflow-hidden rounded-full font-medium",
			voteRatio() < 85 && settings.voteRatioBar && "vote-ratio",
			"divide-x divide-slate-200 dark:divide-zinc-800 border border-slate-200 dark:border-zinc-800"
		]), "svelte-qvcm8h")}${attr_style(`--vote-ratio: ${stringify(voteRatio())}%;`)}>`);
		voteButton($$renderer, upvotes, "upvote", vote);
		$$renderer.push(`<!----> `);
		if (site.data?.site_view.local_site.enable_downvotes ?? true) {
			$$renderer.push("<!--[0-->");
			voteButton($$renderer, downvotes, "downvote", vote);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		bind_props($$props, {
			vote,
			upvotes,
			downvotes
		});
	});
}
//#endregion
//#region src/lib/feature/comment/CommentActions.svelte
function CommentActions($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { comment = void 0, replying = false, disabled = false, onedit } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div${attr_class(clsx(["flex flex-row items-center gap-0.5 w-full", settings.posts.reverseActions && "flex-row-reverse"]))}>`);
			CommentVote($$renderer, {
				upvotes: comment.counts.upvotes,
				downvotes: comment.counts.downvotes,
				vote: comment.my_vote,
				comment: comment.comment
			});
			$$renderer.push(`<!----> `);
			Button($$renderer, {
				color: "tertiary",
				rounding: "pill",
				size: "sm",
				class: "text-slate-500 dark:text-zinc-400 gap-1!",
				onclick: () => replying = !replying,
				disabled: comment.post.locked || disabled || !profile.current.jwt,
				icon: ChatBubbleOvalLeft,
				children: ($$renderer) => {
					$$renderer.push(`<!---->Reply`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			if (profile.current?.user && (profile.isMod(comment.community) || profile.isAdmin)) {
				$$renderer.push("<!--[0-->");
				{
					function target($$renderer, attachment) {
						Button($$renderer, {
							class: "dark:text-zinc-400 text-slate-600",
							color: "tertiary",
							size: "square-md",
							rounding: "pill",
							icon: ShieldCheck,
							"aria-label": "Moderation"
						});
					}
					CommentModerationMenu($$renderer, {
						get item() {
							return comment;
						},
						set item($$value) {
							comment = $$value;
							$$settled = false;
						},
						target,
						$$slots: { target: true }
					});
				}
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			{
				function target($$renderer, attachment) {
					Button($$renderer, {
						title: "Actions",
						color: "tertiary",
						rounding: "pill",
						size: "square-md",
						class: "text-slate-600 dark:text-zinc-400",
						icon: EllipsisHorizontal
					});
				}
				Menu($$renderer, {
					placement: "bottom",
					target,
					children: ($$renderer) => {
						MenuButton($$renderer, {
							onclick: () => {
								if (navigator.share) navigator.share?.({ url: comment.comment.ap_id });
								else navigator.clipboard.writeText(comment.comment.ap_id);
							},
							icon: Share,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Share`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						if (profile.current?.jwt) {
							$$renderer.push("<!--[0-->");
							if (comment.creator.id == profile.current.user?.local_user_view.person.id) {
								$$renderer.push("<!--[0-->");
								MenuButton($$renderer, {
									onclick: () => onedit?.(comment),
									icon: PencilSquare,
									children: ($$renderer) => {
										$$renderer.push(`<!---->Edit`);
									},
									$$slots: { default: true }
								});
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--> `);
							MenuButton($$renderer, {
								onclick: async () => {
									if (profile.current?.jwt) comment.saved = await save(comment, !comment.saved);
								},
								icon: comment.saved ? BookmarkSlash : Bookmark,
								children: ($$renderer) => {
									$$renderer.push(`<!---->${escape_html(comment.saved ? "Unsave" : "Save")}`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							if (profile.current?.user && profile.current.jwt && profile.current.user.local_user_view.person.id == comment.creator.id) {
								$$renderer.push("<!--[0-->");
								MenuButton($$renderer, {
									color: "danger-subtle",
									onclick: async () => {
										if (profile.current?.jwt) comment.comment.deleted = await deleteItem(comment, !comment.comment.deleted);
									},
									icon: Trash,
									children: ($$renderer) => {
										$$renderer.push(`<!---->${escape_html(comment.comment.deleted ? "Restore" : "Delete")}`);
									},
									$$slots: { default: true }
								});
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--> `);
							if (profile.current.jwt && profile.current.user?.local_user_view.person.id != comment.creator.id) {
								$$renderer.push("<!--[0-->");
								MenuButton($$renderer, {
									onclick: () => report(comment),
									color: "danger-subtle",
									icon: Flag,
									children: ($$renderer) => {
										$$renderer.push(`<!---->Report`);
									},
									$$slots: { default: true }
								});
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]-->`);
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					},
					$$slots: {
						target: true,
						default: true
					}
				});
			}
			$$renderer.push(`<!----> <div class="flex-1 w-full"></div></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			comment,
			replying
		});
	});
}
//#endregion
//#region src/lib/feature/comment/CommentForm.svelte
function CommentForm($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { postId, parentId = void 0, locked = false, banned = false, rows = 7, placeholder = void 0, value = "", actions = true, preview: previewAction = true, editing = false, oncancel, oncomment, $$slots, $$events, ...rest } = $$props;
		let loading = false;
		let language = void 0;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<form class="flex flex-col gap-2 relative">`);
			$$renderer.push("<!--[-1-->");
			MarkdownEditor($$renderer, spread_props([rest, {
				rows,
				placeholder: locked ? "This post is locked." : banned ? "You are banned from this community." : placeholder ?? placeholders.get("comment"),
				disabled: locked || banned,
				previewButton: previewAction,
				get value() {
					return value;
				},
				set value($$value) {
					value = $$value;
					$$settled = false;
				},
				children: ($$renderer) => {
					{
						function target($$renderer, attachment) {
							Button($$renderer, {
								size: "custom",
								rounding: "xl",
								class: "w-7.5 h-7.5",
								color: language != void 0 ? "primary" : "ghost",
								title: "Languages",
								children: ($$renderer) => {
									Icon($$renderer, {
										src: Language,
										size: "14",
										micro: true
									});
								},
								$$slots: { default: true }
							});
						}
						Menu($$renderer, {
							target,
							children: ($$renderer) => {
								if (site.data) {
									$$renderer.push("<!--[0-->");
									MenuButton($$renderer, {
										class: "min-h-[16px] py-0",
										onclick: () => language = void 0,
										children: ($$renderer) => {
											Icon($$renderer, {
												src: XMark,
												size: "16",
												micro: true
											});
											$$renderer.push(`<!----> Unset`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> <!--[-->`);
									const each_array = ensure_array_like(site.data?.all_languages);
									for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
										let languageOption = each_array[$$index];
										MenuButton($$renderer, {
											class: "min-h-[16px] py-0",
											onclick: () => {
												language = languageOption.id;
											},
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(languageOption.name)}`);
											},
											$$slots: { default: true }
										});
									}
									$$renderer.push(`<!--]-->`);
								} else $$renderer.push("<!--[-1-->");
								$$renderer.push(`<!--]-->`);
							},
							$$slots: {
								target: true,
								default: true
							}
						});
					}
					$$renderer.push(`<!----> <div class="flex-1"></div> `);
					if (actions) {
						$$renderer.push("<!--[0-->");
						Button($$renderer, {
							title: "Cancel",
							onclick: () => oncancel?.(true),
							color: "tertiary",
							size: "square-md",
							rounding: "xl",
							children: ($$renderer) => {
								Icon($$renderer, {
									src: XMark,
									size: "16",
									micro: true,
									class: "text-slate-600 dark:text-zinc-400"
								});
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						{
							function prefix($$renderer) {
								Icon($$renderer, {
									src: ArrowUp,
									size: "20",
									mini: true
								});
							}
							Button($$renderer, {
								submit: true,
								color: "primary",
								rounding: "xl",
								loading,
								disabled: locked || banned,
								title: "Submit",
								size: "square-lg",
								prefix,
								$$slots: { prefix: true }
							});
						}
						$$renderer.push(`<!---->`);
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]-->`);
				},
				$$slots: { default: true }
			}]));
			$$renderer.push(`<!--]--></form>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { value });
	});
}
//#endregion
//#region src/lib/feature/comment/Comment.svelte
function Comment($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { node = void 0, actions = true, meta = true, replying = false, open = true, contentClass = "", class: clazz = "", metaSuffix, children } = $$props;
		let editing = false;
		let newComment = node.comment_view.comment.content;
		let editingLoad = false;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (editing) {
				$$renderer.push("<!--[0-->");
				{
					function customTitle($$renderer) {
						$$renderer.push(`<div>Edit</div>`);
					}
					Modal($$renderer, {
						get open() {
							return editing;
						},
						set open($$value) {
							editing = $$value;
							$$settled = false;
						},
						customTitle,
						children: ($$renderer) => {
							$$renderer.push(`<form class="contents">`);
							CommentForm($$renderer, {
								postId: node.comment_view.comment.id,
								actions: false,
								preview: true,
								get value() {
									return newComment;
								},
								set value($$value) {
									newComment = $$value;
									$$settled = false;
								}
							});
							$$renderer.push(`<!----> `);
							Button($$renderer, {
								submit: true,
								color: "primary",
								size: "lg",
								loading: editingLoad,
								disabled: editingLoad,
								class: "w-full",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Submit`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></form>`);
						},
						$$slots: {
							customTitle: true,
							default: true
						}
					});
				}
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <li${attr_class(clsx(["py-3 relative", clazz]), "svelte-1te8jrp")}${attr("id", node.comment_view.comment.id.toString())}>`);
			if (meta) {
				$$renderer.push("<!--[0-->");
				const creatorIsOp = node.comment_view.creator.id == node.comment_view.post.creator_id;
				$$renderer.push(`<label${attr("for", `comment-expand-${stringify(node.comment_view.comment.id)}`)} class="flex flex-row cursor-pointer gap-2 items-center group text-sm flex-wrap w-full z-0 group relative svelte-1te8jrp"><div${attr_class(clsx(["absolute -inset-0.5 right-1 group-hover:right-0 group-hover:-inset-1.5 opacity-0 group-hover:opacity-100 transition-all", "bg-slate-100 dark:bg-zinc-900 -z-10 rounded-full inline-flex items-center justify-end"]))}>`);
				if (node.comment_view.counts.child_count > 0) {
					$$renderer.push("<!--[0-->");
					const children = node.comment_view.counts.child_count;
					$$renderer.push(`<div${attr("aria-label", `${children} children`)} class="font-medium">${escape_html(children)}</div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> <div${attr_class(clsx([!open && "rotate-90", "transition-all duration-500 ease-out my-auto h-full w-8 grid place-items-center"]))}>`);
				Icon($$renderer, {
					src: open ? Minus : Plus,
					size: "16",
					micro: true
				});
				$$renderer.push(`<!----></div></div> `);
				metaSuffix?.($$renderer);
				$$renderer.push(`<!----> <span${attr_class(clsx(["flex flex-row gap-1 items-center", creatorIsOp && "text-blue-600 dark:text-blue-400 font-bold"]))}>`);
				{
					function extraBadges($$renderer) {
						if (node.comment_view.creator_is_moderator) {
							$$renderer.push("<!--[0-->");
							Icon($$renderer, {
								src: ShieldCheck,
								size: "16",
								micro: true,
								class: "text-green-500",
								"aria-label": "Moderator"
							});
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]--> `);
						if (node.comment_view.creator_is_admin) {
							$$renderer.push("<!--[0-->");
							Icon($$renderer, {
								src: ShieldCheck,
								size: "16",
								micro: true,
								class: "text-red-500",
								"aria-label": "Administrator"
							});
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					}
					UserLink($$renderer, {
						inComment: true,
						avatarSize: 20,
						avatar: true,
						user: node.comment_view.creator,
						extraBadges,
						$$slots: { extraBadges: true }
					});
				}
				$$renderer.push(`<!----> `);
				if (creatorIsOp) {
					$$renderer.push("<!--[0-->");
					Icon($$renderer, {
						mini: true,
						size: "16",
						src: Microphone,
						class: "text-blue-500 dark:text-blue-400"
					});
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></span> `);
				RelativeDate($$renderer, {
					class: "text-slate-600 dark:text-zinc-400",
					date: publishedToDate(node.comment_view.comment.published)
				});
				$$renderer.push(`<!----> <span class="text-slate-600 dark:text-zinc-400 flex flex-row gap-2 ml-1">`);
				if (node.comment_view.comment.updated) {
					$$renderer.push("<!--[0-->");
					const edited = `Last edited ${formatRelativeDate(publishedToDate(node.comment_view.comment.updated), { style: "long" })}`;
					$$renderer.push(`<div${attr("title", edited)}>`);
					Icon($$renderer, {
						src: Pencil,
						micro: true,
						size: "14"
					});
					$$renderer.push(`<!----></div>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (node.comment_view.comment.deleted) {
					$$renderer.push("<!--[0-->");
					Icon($$renderer, {
						src: Trash,
						solid: true,
						size: "12",
						"aria-label": "Deleted",
						class: "text-red-600 dark:text-red-500"
					});
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (node.comment_view.comment.removed) {
					$$renderer.push("<!--[0-->");
					Icon($$renderer, {
						src: Trash,
						solid: true,
						size: "12",
						"aria-label": "Removed",
						class: "text-green-600 dark:text-green-500"
					});
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (node.comment_view.saved) {
					$$renderer.push("<!--[0-->");
					Icon($$renderer, {
						src: Bookmark,
						solid: true,
						size: "12",
						"aria-label": "Saved",
						class: "text-yellow-600 dark:text-yellow-500"
					});
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></span> `);
				if (settings.debugInfo) {
					$$renderer.push("<!--[0-->");
					$$renderer.push(`<span class="text-slate-600 dark:text-zinc-400 font-mono ml-auto">#${escape_html(node.comment_view.comment.id)}</span>`);
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--></label>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <input class="appearance-none absolute top-0 left-0 h-8 w-full pointer-events-none comment-expand svelte-1te8jrp" type="checkbox"${attr("id", `comment-expand-${stringify(node.comment_view.comment.id)}`)}${attr("checked", open, true)}/> <div${attr_class(clsx(["expand max-w-full", contentClass]), "svelte-1te8jrp")}${attr("inert", !open, true)}><div id="comment-content" class="svelte-1te8jrp"><div${attr_class(clsx(["flex flex-col whitespace-pre-wrap max-w-full gap-1 mt-1 relative w-full"]))}>`);
			Markdown($$renderer, {
				source: node.comment_view.comment.content,
				noStyle: true,
				class: ["text-[15px] font-reading sm:text-base text-slate-700 dark:text-zinc-300 *:leading-[1.6] wrap-break-word space-y-3", node.comment_view.comment.distinguished ? "material-success px-3 py-1.5 rounded-xl max-w-max" : page.url.hash.slice(1) == node.comment_view.comment.id.toString() && "material-info px-3 py-1.5 rounded-xl max-w-max"]
			});
			$$renderer.push(`<!----> `);
			if (actions) {
				$$renderer.push("<!--[0-->");
				CommentActions($$renderer, {
					comment: node.comment_view,
					onedit: () => editing = true,
					disabled: node.comment_view.banned_from_community || node.comment_view.post.locked,
					get replying() {
						return replying;
					},
					set replying($$value) {
						replying = $$value;
						$$settled = false;
					}
				});
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> `);
			if (replying) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div>`);
				CommentForm($$renderer, {
					label: "Reply",
					postId: node.comment_view.post.id,
					parentId: node.comment_view.comment.id,
					oncomment: (e) => {
						node.children = [{
							children: [],
							comment_view: e.comment_view,
							depth: node.depth + 1,
							expanded: true
						}, ...node.children];
						replying = false;
					},
					oncancel: () => replying = false
				});
				$$renderer.push(`<!----></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			children?.($$renderer);
			$$renderer.push(`<!----></div></div></li>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			node,
			replying,
			open
		});
	});
}
//#endregion
export { CommentForm as n, Comment as t };

//# sourceMappingURL=Comment.js.map
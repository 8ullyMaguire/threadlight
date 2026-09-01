import { n as attr, o as escape_html } from "./validate.js";
import { h as stringify, l as head } from "./server.js";
import { A as Sort, En as Fire, F as CommonList, Ht as Option, K as isCommentView, M as Pageination, Nt as MenuButton, On as EllipsisHorizontal, Pt as Menu, R as Header, Rt as Modal, Ut as TextInput, Vt as Select, Y as PostItem, Zt as Button, ar as page, d as removeToast, f as toast, hn as Newspaper, ht as communityLink, mn as NoSymbol, nt as UserLink, o as profile, on as ShieldCheck, ot as formatRelativeDate, rn as Tag, t as client, tr as publishedToDate, tt as errorMessage, zt as Expandable } from "./client.svelte.js";
import { n as Icon, t as Placeholder } from "./Placeholder.js";
import { t as AdjustmentsHorizontal } from "./AdjustmentsHorizontal.js";
import { t as AtSymbol } from "./AtSymbol.js";
import { t as Envelope } from "./Envelope.js";
import { t as PencilSquare } from "./PencilSquare.js";
import { t as ShieldExclamation } from "./ShieldExclamation.js";
import { t as EntityHeader } from "./EntityHeader.js";
import { t as ItemList } from "./ItemList.js";
import { t as ban } from "./moderation.js";
import { n as blockUser, r as isBlocked } from "./user.js";
import { t as CommentItem } from "./CommentItem.js";
//#region src/lib/feature/user/UserNote.svelte
function UserNote($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { note: passedNote = "", person, onsubmit } = $$props;
		let note = passedNote;
		let loading = false;
		async function submit(note) {
			try {
				loading = note ? true : null;
				if (!client().setNote) throw new Error("unsupported");
				await client().setNote({
					person_id: person,
					note
				});
				onsubmit?.(note);
			} catch (err) {
				toast({
					content: errorMessage(err),
					type: "error"
				});
			}
			loading = false;
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<form class="contents">`);
			TextInput($$renderer, {
				label: "Content",
				required: true,
				get value() {
					return note;
				},
				set value($$value) {
					note = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> <div class="flex flex-row gap-2 *:flex-1">`);
			Button($$renderer, {
				loading: loading === true,
				submit: true,
				color: "primary",
				size: "lg",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Submit`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----> `);
			Button($$renderer, {
				onclick: () => submit(null),
				loading: loading === null,
				color: "danger",
				size: "lg",
				children: ($$renderer) => {
					$$renderer.push(`<!---->Remove`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div></form>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
//#region src/routes/u/[name]/UserActions.svelte
function UserActions($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { person } = $$props;
		let purgingUser = false;
		let setNote = false;
		async function purgeUser() {
			purgingUser = false;
			const purgeToast = toast({
				content: "",
				loading: true
			});
			try {
				await client().purgePerson({ person_id: person.person.id });
				removeToast(purgeToast);
				toast({
					content: "Purged that user.",
					type: "success"
				});
			} catch (e) {
				toast({
					content: e,
					type: "error"
				});
			}
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (purgingUser) {
				$$renderer.push("<!--[0-->");
				{
					function customTitle($$renderer) {
						$$renderer.push(`<!---->Purging User`);
					}
					Modal($$renderer, {
						get open() {
							return purgingUser;
						},
						set open($$value) {
							purgingUser = $$value;
							$$settled = false;
						},
						customTitle,
						children: ($$renderer) => {
							$$renderer.push(`<p>Purging user <span class="font-bold">${escape_html(person.person.name)}</span></p> <p>Are you sure you want to do this?</p> <div class="flex flex-row gap-2">`);
							Button($$renderer, {
								size: "lg",
								onclick: () => purgingUser = false,
								class: "flex-1",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Cancel`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Button($$renderer, {
								size: "lg",
								color: "danger",
								onclick: purgeUser,
								class: "flex-1",
								children: ($$renderer) => {
									$$renderer.push(`<!---->Purge`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----></div>`);
						},
						$$slots: {
							customTitle: true,
							default: true
						}
					});
				}
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (setNote) {
				$$renderer.push("<!--[0-->");
				{
					function customTitle($$renderer) {
						$$renderer.push(`<!---->Set note`);
					}
					Modal($$renderer, {
						get open() {
							return setNote;
						},
						set open($$value) {
							setNote = $$value;
							$$settled = false;
						},
						customTitle,
						children: ($$renderer) => {
							UserNote($$renderer, {
								person: person.person.id,
								note: person.person.note,
								onsubmit: (e) => {
									person.person.note = e ?? void 0;
									setNote = !setNote;
									toast({
										content: "Success",
										type: "success"
									});
								}
							});
						},
						$$slots: {
							customTitle: true,
							default: true
						}
					});
				}
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (profile.current?.user && profile.current.jwt && person.person.id != profile.current.user.local_user_view.person.id) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex items-center gap-2 w-full flex-wrap">`);
				Button($$renderer, {
					size: "lg",
					color: "primary",
					href: `/inbox/messages/${stringify(person.person.id)}`,
					icon: Envelope,
					children: ($$renderer) => {
						$$renderer.push(`<!---->Message`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				if (person.person.matrix_user_id) {
					$$renderer.push("<!--[0-->");
					{
						function prefix($$renderer) {
							Icon($$renderer, {
								solid: true,
								size: "16",
								src: AtSymbol
							});
						}
						Button($$renderer, {
							size: "lg",
							color: "secondary",
							href: `https://matrix.to/#/${stringify(person.person.matrix_user_id)}`,
							prefix,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Chat on Matrix`);
							},
							$$slots: {
								prefix: true,
								default: true
							}
						});
					}
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				if (profile.isAdmin) {
					$$renderer.push("<!--[0-->");
					{
						function target($$renderer, attachment) {
							Button($$renderer, {
								size: "square-lg",
								rounding: "2xl",
								icon: ShieldCheck,
								"aria-label": "Moderation"
							});
						}
						Menu($$renderer, {
							class: "ml-auto",
							placement: "bottom-end",
							target,
							children: ($$renderer) => {
								MenuButton($$renderer, {
									href: `/modlog?user=${stringify(person.person.id)}`,
									color: "success-subtle",
									icon: Newspaper,
									children: ($$renderer) => {
										$$renderer.push(`<!---->User moderation log`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----> `);
								MenuButton($$renderer, {
									color: "danger-subtle",
									onclick: () => ban(person.person.banned, person.person),
									icon: ShieldExclamation,
									children: ($$renderer) => {
										$$renderer.push(`<!---->${escape_html(person.person.banned ? "Unban" : "Ban")}`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!----> `);
								MenuButton($$renderer, {
									color: "danger-subtle",
									onclick: () => purgingUser = !purgingUser,
									icon: Fire,
									children: ($$renderer) => {
										$$renderer.push(`<!---->Purge`);
									},
									$$slots: { default: true }
								});
								$$renderer.push(`<!---->`);
							},
							$$slots: {
								target: true,
								default: true
							}
						});
					}
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				{
					function target($$renderer, attachment) {
						Button($$renderer, {
							size: "square-lg",
							rounding: "2xl",
							icon: EllipsisHorizontal,
							"aria-label": "More actions"
						});
					}
					Menu($$renderer, {
						placement: "bottom-end",
						target,
						children: ($$renderer) => {
							MenuButton($$renderer, {
								onclick: () => setNote = !setNote,
								icon: Tag,
								children: ($$renderer) => {
									$$renderer.push(`<!---->Set note`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							{
								function prefix($$renderer) {
									Icon($$renderer, {
										mini: true,
										size: "16",
										src: NoSymbol
									});
								}
								MenuButton($$renderer, {
									color: "danger-subtle",
									onclick: async () => {
										if ((await blockUser(!isBlocked(profile.current.user, person.person.id), person.person.id)).blocked) profile.current.user.person_blocks.push({
											person: person.person,
											target: person.person
										});
										else {
											const index = profile.current.user.person_blocks.findIndex((i) => i.target.id == person.person.id);
											if (index != -1) profile.current.user.person_blocks.splice(index, 1);
										}
									},
									prefix,
									children: ($$renderer) => {
										$$renderer.push(`<!---->${escape_html(isBlocked(profile.current.user, person.person.id) ? "Unblock" : "Block")}`);
									},
									$$slots: {
										prefix: true,
										default: true
									}
								});
							}
							$$renderer.push(`<!---->`);
						},
						$$slots: {
							target: true,
							default: true
						}
					});
				}
				$$renderer.push(`<!----></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
//#region src/routes/u/[name]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, inline = false } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("16eh4ui", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>${escape_html(data.person_view.value.person.name)}</title>`);
				});
			});
			$$renderer.push(`<div class="flex flex-col gap-4 max-w-full w-full">`);
			if (!inline) {
				$$renderer.push("<!--[0-->");
				{
					function extended($$renderer) {
						$$renderer.push(`<div class="flex flex-col gap-4 max-w-full w-full min-w-0"><form${attr("action", page.url.origin + page.url.pathname)} method="GET" class="flex flex-row gap-4 flex-wrap">`);
						{
							function customLabel($$renderer) {
								$$renderer.push(`<span class="flex items-center gap-1">`);
								Icon($$renderer, {
									src: AdjustmentsHorizontal,
									size: "15",
									mini: true
								});
								$$renderer.push(`<!----> Type</span>`);
							}
							Select($$renderer, {
								name: "type",
								onchange: () => void 0,
								get value() {
									return data.filters.value.type;
								},
								set value($$value) {
									data.filters.value.type = $$value;
									$$settled = false;
								},
								customLabel,
								children: ($$renderer) => {
									Option($$renderer, {
										value: "all",
										children: ($$renderer) => {
											$$renderer.push(`<!---->All`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Option($$renderer, {
										value: "posts",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Posts`);
										},
										$$slots: { default: true }
									});
									$$renderer.push(`<!----> `);
									Option($$renderer, {
										value: "comments",
										children: ($$renderer) => {
											$$renderer.push(`<!---->Comments`);
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
						Sort($$renderer, {
							onchange: () => void 0,
							get selected() {
								return data.filters.value.sort;
							},
							set selected($$value) {
								data.filters.value.sort = $$value;
								$$settled = false;
							}
						});
						$$renderer.push(`<!----></form></div>`);
					}
					Header($$renderer, {
						pageHeader: true,
						class: "tracking-normal!",
						extended,
						children: ($$renderer) => {
							$$renderer.push(`<div class="w-full">`);
							{
								function nameDetail($$renderer) {
									$$renderer.push(`<span class="text-sm flex gap-0 items-center w-max">@ `);
									UserLink($$renderer, {
										showInstance: true,
										user: data.person_view.value.person,
										displayName: false,
										class: "font-normal"
									});
									$$renderer.push(`<!----></span>`);
								}
								function actions($$renderer) {
									UserActions($$renderer, { person: data.person_view.value });
								}
								EntityHeader($$renderer, {
									avatarCircle: true,
									avatar: data.person_view.value.person.avatar,
									name: data.person_view.value.person.display_name || data.person_view.value.person.name,
									banner: data.person_view.value.person.banner,
									bio: data.person_view.value.person.bio,
									stats: [
										{
											name: "Posts",
											value: data.person_view.value.counts.post_count.toString()
										},
										{
											name: "Comments",
											value: data.person_view.value.counts.comment_count.toString()
										},
										{
											name: "Joined",
											value: formatRelativeDate(publishedToDate(data.person_view.value.person.published), { style: "short" }).toString(),
											format: false
										}
									],
									nameDetail,
									actions,
									children: ($$renderer) => {
										if ((data.moderates.value ?? []).length > 0) {
											$$renderer.push("<!--[0-->");
											{
												function title($$renderer) {
													$$renderer.push(`<!---->Moderating <hr class="flex-1 w-full border-slate-200 dark:border-zinc-800 mx-3"/>`);
												}
												Expandable($$renderer, {
													class: "",
													title,
													children: ($$renderer) => {
														ItemList($$renderer, { items: data.moderates.value.map((m) => ({
															id: m.community.id,
															name: m.community.title,
															url: communityLink(m.community),
															avatar: m.community.icon,
															instance: new URL(m.community.actor_id).hostname
														})) });
													},
													$$slots: {
														title: true,
														default: true
													}
												});
											}
										} else $$renderer.push("<!--[-1-->");
										$$renderer.push(`<!--]-->`);
									},
									$$slots: {
										nameDetail: true,
										actions: true,
										default: true
									}
								});
							}
							$$renderer.push(`<!----></div>`);
						},
						$$slots: {
							extended: true,
							default: true
						}
					});
				}
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (data.items.value.length == 0) {
				$$renderer.push("<!--[0-->");
				Placeholder($$renderer, {
					icon: PencilSquare,
					title: "No submissions",
					description: "This user has no submissions that match this filter."
				});
			} else {
				$$renderer.push("<!--[-1-->");
				{
					function item($$renderer, item) {
						if (isCommentView(item)) {
							$$renderer.push("<!--[0-->");
							CommentItem($$renderer, { comment: item });
						} else if (!isCommentView(item)) {
							$$renderer.push("<!--[1-->");
							PostItem($$renderer, { post: item });
						} else $$renderer.push("<!--[-1-->");
						$$renderer.push(`<!--]-->`);
					}
					CommonList($$renderer, {
						items: data.items.value,
						item,
						$$slots: { item: true }
					});
				}
			}
			$$renderer.push(`<!--]--> `);
			Pageination($$renderer, {
				href: (page) => `?page=${page}`,
				get page() {
					return data.filters.value.page;
				},
				set page($$value) {
					data.filters.value.page = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
export { _page as t };

//# sourceMappingURL=_page5.js.map
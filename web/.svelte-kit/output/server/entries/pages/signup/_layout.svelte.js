import "../../../chunks/server.js";
//#region src/routes/signup/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	$$renderer.push(`<div class="fixed inset-0 bg-slate-50 dark:bg-zinc-925 z-50 p-8 sm:p-16 lg:p-24 overflow-auto">`);
	children?.($$renderer);
	$$renderer.push(`<!----></div>`);
}
//#endregion
export { _layout as default };

//# sourceMappingURL=_layout.svelte.js.map
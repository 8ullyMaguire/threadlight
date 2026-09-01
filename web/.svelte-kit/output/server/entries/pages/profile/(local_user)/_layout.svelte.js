import "../../../../chunks/server.js";
//#region src/routes/profile/(local_user)/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	children?.($$renderer);
	$$renderer.push(`<!---->`);
}
//#endregion
export { _layout as default };

//# sourceMappingURL=_layout.svelte.js.map
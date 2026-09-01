import { v as LINKED_INSTANCE_URL } from "../../../chunks/client.svelte.js";
//#region src/routes/explore/+layout.ts
function load({ url }) {
	const sort = url.searchParams.get("sort") || "TopDay";
	const page = Number(url.searchParams.get("page")) || 1;
	const query = url.searchParams.get("q") || "";
	const typeParam = url.searchParams.get("type");
	const typeInstance = typeParam?.split("instance-")[1];
	return {
		sort,
		page,
		query,
		type: typeInstance ? "Local" : typeParam || (LINKED_INSTANCE_URL ? "Local" : "All"),
		typeInstance
	};
}
//#endregion
export { load };

//# sourceMappingURL=_layout.ts.js.map
import { n as getClient, pt as ReactiveState } from "../../../../chunks/client.svelte.js";
//#region src/routes/admin/federation/+page.ts
async function load({ fetch }) {
	return { instances: new ReactiveState({ ...(await getClient(void 0, fetch).getFederatedInstances()).federated_instances }) };
}
//#endregion
export { load };

//# sourceMappingURL=_page.ts.js.map
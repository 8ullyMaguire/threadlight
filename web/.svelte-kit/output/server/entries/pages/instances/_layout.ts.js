import { n as getClient } from "../../../chunks/client.svelte.js";
//#region src/routes/instances/+layout.ts
async function load({ fetch }) {
	return (await getClient(void 0, fetch).getFederatedInstances()).federated_instances;
}
//#endregion
export { load };

//# sourceMappingURL=_layout.ts.js.map
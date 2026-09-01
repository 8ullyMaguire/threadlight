import "./server.js";
import { f as toast, n as getClient, o as profile, tt as errorMessage } from "./client.svelte.js";
//#region src/routes/communities/Subscribe.svelte
function Subscribe($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { community = void 0, children } = $$props;
		let subscribing = false;
		async function subscribe(id = community?.community.id, subscribed = community?.subscribed) {
			if (!profile.current?.jwt) return;
			if (!id || !subscribed) return;
			subscribing = true;
			try {
				const res = await getClient().followCommunity({
					community_id: id,
					follow: subscribed == "NotSubscribed"
				});
				subscribing = false;
				return res;
			} catch (err) {
				toast({
					content: errorMessage(err),
					type: "error"
				});
			}
			subscribing = false;
		}
		children?.($$renderer, {
			subscribe,
			subscribing
		});
		$$renderer.push(`<!---->`);
	});
}
//#endregion
export { Subscribe as t };

//# sourceMappingURL=Subscribe.js.map
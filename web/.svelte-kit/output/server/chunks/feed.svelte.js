import "./server.js";
import { St as recursiveEqual, Tt as SvelteMap } from "./client.svelte.js";
//#region src/lib/feature/feeds/feed.svelte.ts
var Feed = class {
	#data;
	#fetch;
	#lastParams;
	constructor(fetch) {
		this.#fetch = fetch;
	}
	async load(params) {
		if (!recursiveEqual(params, this.#lastParams)) this.#data = void 0;
		this.#lastParams = params;
		if (this.#data == null) this.#data = await this.#fetch(params);
		return this.#data;
	}
	peek() {
		return this.#data;
	}
	update(value) {
		this.#data = value;
	}
};
var feeds = new SvelteMap();
function feed(id, init) {
	feeds.get(id);
	const feedData = new Feed(init);
	feeds.set(id, feedData);
	return feedData;
}
//#endregion
export { feeds as n, feed as t };

//# sourceMappingURL=feed.svelte.js.map
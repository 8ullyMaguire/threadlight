import { F as createSubscriber, ht as noop } from "./validate.js";
import { i as on } from "./legacy-client.js";
//#region node_modules/svelte/src/reactivity/reactive-value.js
/**
* @template T
*/
var ReactiveValue = class {
	#fn;
	#subscribe;
	/**
	*
	* @param {() => T} fn
	* @param {(update: () => void) => void} onsubscribe
	*/
	constructor(fn, onsubscribe) {
		this.#fn = fn;
		this.#subscribe = createSubscriber(onsubscribe);
	}
	get current() {
		this.#subscribe();
		return this.#fn();
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/timing.js
/** @import { Raf } from '#client' */
var now = () => Date.now();
/** @type {Raf} */
var raf = {
	tick: (_) => noop(_),
	now: () => now(),
	tasks: /* @__PURE__ */ new Set()
};
//#endregion
//#region node_modules/svelte/src/internal/client/loop.js
/** @import { TaskCallback, Task, TaskEntry } from '#client' */
/**
* @returns {void}
*/
function run_tasks() {
	const now = raf.now();
	raf.tasks.forEach((task) => {
		if (!task.c(now)) {
			raf.tasks.delete(task);
			task.f();
		}
	});
	if (raf.tasks.size !== 0) raf.tick(run_tasks);
}
/**
* Creates a new task that runs on each raf frame
* until it returns a falsy value or is aborted
* @param {TaskCallback} callback
* @returns {Task}
*/
function loop(callback) {
	/** @type {TaskEntry} */
	let task;
	if (raf.tasks.size === 0) raf.tick(run_tasks);
	return {
		promise: new Promise((fulfill) => {
			raf.tasks.add(task = {
				c: callback,
				f: fulfill
			});
		}),
		abort() {
			raf.tasks.delete(task);
		}
	};
}
if (typeof HTMLElement === "function");
new ReactiveValue(() => void 0, (update) => on(window, "scroll", update));
new ReactiveValue(() => void 0, (update) => on(window, "scroll", update));
/**
* `innerWidth.current` is a reactive view of `window.innerWidth`. On the server it is `undefined`.
* @since 5.11.0
*/
var innerWidth = new ReactiveValue(() => void 0, (update) => on(window, "resize", update));
/**
* `innerHeight.current` is a reactive view of `window.innerHeight`. On the server it is `undefined`.
* @since 5.11.0
*/
var innerHeight = new ReactiveValue(() => void 0, (update) => on(window, "resize", update));
new ReactiveValue(() => void 0, (update) => on(window, "resize", update));
new ReactiveValue(() => void 0, (update) => on(window, "resize", update));
new ReactiveValue(() => void 0, (update) => {
	let value = window.screenLeft;
	let frame = requestAnimationFrame(function check() {
		frame = requestAnimationFrame(check);
		if (value !== (value = window.screenLeft)) update();
	});
	return () => {
		cancelAnimationFrame(frame);
	};
});
new ReactiveValue(() => void 0, (update) => {
	let value = window.screenTop;
	let frame = requestAnimationFrame(function check() {
		frame = requestAnimationFrame(check);
		if (value !== (value = window.screenTop)) update();
	});
	return () => {
		cancelAnimationFrame(frame);
	};
});
new ReactiveValue(() => void 0, (update) => {
	const unsub_online = on(window, "online", update);
	const unsub_offline = on(window, "offline", update);
	return () => {
		unsub_online();
		unsub_offline();
	};
});
//#endregion
export { raf as i, innerWidth as n, loop as r, innerHeight as t };

//# sourceMappingURL=window.js.map
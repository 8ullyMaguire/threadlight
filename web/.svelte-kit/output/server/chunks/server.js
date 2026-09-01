import { $ as UNINITIALIZED, U as async_mode_flag, V as get_stack, a as to_style, d as is_raw_text_element, f as is_void, h as subscribe_to_store, ht as noop, i as to_class, it as missing_context, l as is_boolean_attribute, mt as is_promise, n as attr, o as escape_html, pt as has_own_property, r as clsx, rt as lifecycle_outside_component, s as REGEX_VALID_TAG_NAME, st as STALE_REACTION, ut as deferred } from "./validate.js";
import * as devalue from "devalue";
//#region node_modules/svelte/src/internal/server/hydration.js
var BLOCK_OPEN = `<!--[-->`;
var BLOCK_OPEN_ELSE = `<!--[!-->`;
var BLOCK_CLOSE = `<!--]-->`;
var EMPTY_COMMENT = `<!---->`;
//#endregion
//#region node_modules/svelte/src/internal/server/abort-signal.js
/** @type {AbortController | null} */
var controller = null;
function abort() {
	controller?.abort(STALE_REACTION);
	controller = null;
}
function getAbortSignal() {
	return (controller ??= new AbortController()).signal;
}
//#endregion
//#region node_modules/svelte/src/internal/server/errors.js
/**
* The node API `AsyncLocalStorage` is not available, but is required to use async server rendering.
* @returns {never}
*/
function async_local_storage_unavailable() {
	const error = /* @__PURE__ */ new Error(`async_local_storage_unavailable\nThe node API \`AsyncLocalStorage\` is not available, but is required to use async server rendering.\nhttps://svelte.dev/e/async_local_storage_unavailable`);
	error.name = "Svelte error";
	throw error;
}
/**
* Encountered asynchronous work while rendering synchronously.
* @returns {never}
*/
function await_invalid() {
	const error = /* @__PURE__ */ new Error(`await_invalid\nEncountered asynchronous work while rendering synchronously.\nhttps://svelte.dev/e/await_invalid`);
	error.name = "Svelte error";
	throw error;
}
/**
* `<svelte:element this="%tag%">` is not a valid element name — the element will not be rendered
* @param {string} tag
* @returns {never}
*/
function dynamic_element_invalid_tag(tag) {
	const error = /* @__PURE__ */ new Error(`dynamic_element_invalid_tag\n\`<svelte:element this="${tag}">\` is not a valid element name — the element will not be rendered\nhttps://svelte.dev/e/dynamic_element_invalid_tag`);
	error.name = "Svelte error";
	throw error;
}
/**
* The `html` property of server render results has been deprecated. Use `body` instead.
* @returns {never}
*/
function html_deprecated() {
	const error = /* @__PURE__ */ new Error(`html_deprecated\nThe \`html\` property of server render results has been deprecated. Use \`body\` instead.\nhttps://svelte.dev/e/html_deprecated`);
	error.name = "Svelte error";
	throw error;
}
/**
* Attempted to set `hydratable` with key `%key%` twice with different values.
* 
* %stack%
* @param {string} key
* @param {string} stack
* @returns {never}
*/
function hydratable_clobbering(key, stack) {
	const error = /* @__PURE__ */ new Error(`hydratable_clobbering\nAttempted to set \`hydratable\` with key \`${key}\` twice with different values.

${stack}\nhttps://svelte.dev/e/hydratable_clobbering`);
	error.name = "Svelte error";
	throw error;
}
/**
* Failed to serialize `hydratable` data for key `%key%`.
* 
* `hydratable` can serialize anything [`uneval` from `devalue`](https://npmjs.com/package/uneval) can, plus Promises.
* 
* Cause:
* %stack%
* @param {string} key
* @param {string} stack
* @returns {never}
*/
function hydratable_serialization_failed(key, stack) {
	const error = /* @__PURE__ */ new Error(`hydratable_serialization_failed\nFailed to serialize \`hydratable\` data for key \`${key}\`.

\`hydratable\` can serialize anything [\`uneval\` from \`devalue\`](https://npmjs.com/package/uneval) can, plus Promises.

Cause:
${stack}\nhttps://svelte.dev/e/hydratable_serialization_failed`);
	error.name = "Svelte error";
	throw error;
}
/**
* `csp.nonce` was set while `csp.hash` was `true`. These options cannot be used simultaneously.
* @returns {never}
*/
function invalid_csp() {
	const error = /* @__PURE__ */ new Error(`invalid_csp\n\`csp.nonce\` was set while \`csp.hash\` was \`true\`. These options cannot be used simultaneously.\nhttps://svelte.dev/e/invalid_csp`);
	error.name = "Svelte error";
	throw error;
}
/**
* The `idPrefix` option cannot include `--`.
* @returns {never}
*/
function invalid_id_prefix() {
	const error = /* @__PURE__ */ new Error(`invalid_id_prefix\nThe \`idPrefix\` option cannot include \`--\`.\nhttps://svelte.dev/e/invalid_id_prefix`);
	error.name = "Svelte error";
	throw error;
}
/**
* `%name%(...)` is not available on the server
* @param {string} name
* @returns {never}
*/
function lifecycle_function_unavailable(name) {
	const error = /* @__PURE__ */ new Error(`lifecycle_function_unavailable\n\`${name}(...)\` is not available on the server\nhttps://svelte.dev/e/lifecycle_function_unavailable`);
	error.name = "Svelte error";
	throw error;
}
/**
* Could not resolve `render` context.
* @returns {never}
*/
function server_context_required() {
	const error = /* @__PURE__ */ new Error(`server_context_required\nCould not resolve \`render\` context.\nhttps://svelte.dev/e/server_context_required`);
	error.name = "Svelte error";
	throw error;
}
//#endregion
//#region node_modules/svelte/src/internal/server/context.js
/** @import { SSRContext } from '#server' */
/** @type {SSRContext | null} */
var ssr_context = null;
/** @param {SSRContext | null} v */
function set_ssr_context(v) {
	ssr_context = v;
}
/**
* @template T
* @returns {[() => T, (context: T) => T]}
* @since 5.40.0
*/
function createContext() {
	const key = {};
	return [() => {
		if (!hasContext(key)) missing_context();
		return getContext(key);
	}, (context) => setContext(key, context)];
}
/**
* @template T
* @param {any} key
* @returns {T}
*/
function getContext(key) {
	return get_or_init_context_map("getContext").get(key);
}
/**
* @template T
* @param {any} key
* @param {T} context
* @returns {T}
*/
function setContext(key, context) {
	get_or_init_context_map("setContext").set(key, context);
	return context;
}
/**
* @param {any} key
* @returns {boolean}
*/
function hasContext(key) {
	return get_or_init_context_map("hasContext").has(key);
}
/** @returns {Map<any, any>} */
function getAllContexts() {
	return get_or_init_context_map("getAllContexts");
}
/**
* @param {string} name
* @returns {Map<unknown, unknown>}
*/
function get_or_init_context_map(name) {
	if (ssr_context === null) lifecycle_outside_component(name);
	return ssr_context.c ??= new Map(get_parent_context(ssr_context) || void 0);
}
/**
* @param {Function} [fn]
*/
function push(fn) {
	ssr_context = {
		p: ssr_context,
		c: null,
		r: null
	};
}
function pop() {
	ssr_context = ssr_context.p;
}
/**
* @param {SSRContext} ssr_context
* @returns {Map<unknown, unknown> | null}
*/
function get_parent_context(ssr_context) {
	let parent = ssr_context.p;
	while (parent !== null) {
		const context_map = parent.c;
		if (context_map !== null) return context_map;
		parent = parent.p;
	}
	return null;
}
/**
* A `hydratable` value with key `%key%` was created, but at least part of it was not used during the render.
* 
* The `hydratable` was initialized in:
* %stack%
* @param {string} key
* @param {string} stack
*/
function unresolved_hydratable(key, stack) {
	console.warn(`https://svelte.dev/e/unresolved_hydratable`);
}
//#endregion
//#region node_modules/svelte/src/internal/server/render-context.js
/** @import { AsyncLocalStorage } from 'node:async_hooks' */
/** @import { RenderContext } from '#server' */
/** @type {Promise<void> | null} */
var current_render = null;
/** @type {RenderContext | null} */
var context = null;
/** @returns {RenderContext} */
function get_render_context() {
	const store = context ?? als?.getStore();
	if (!store) server_context_required();
	return store;
}
/**
* @template T
* @param {() => Promise<T>} fn
* @returns {Promise<T>}
*/
async function with_render_context(fn) {
	context = { hydratable: {
		lookup: /* @__PURE__ */ new Map(),
		comparisons: [],
		unresolved_promises: /* @__PURE__ */ new Map()
	} };
	if (in_webcontainer()) {
		const { promise, resolve } = deferred();
		const previous_render = current_render;
		current_render = promise;
		await previous_render;
		return fn().finally(resolve);
	}
	try {
		if (als === null) async_local_storage_unavailable();
		return als.run(context, fn);
	} finally {
		context = null;
	}
}
/** @type {AsyncLocalStorage<RenderContext | null> | null} */
var als = null;
/** @type {Promise<void> | null} */
var als_import = null;
/**
*
* @returns {Promise<void>}
*/
function init_render_context() {
	als_import ??= import("node:async_hooks").then((hooks) => {
		als = new hooks.AsyncLocalStorage();
	}).then(noop, noop);
	return als_import;
}
function in_webcontainer() {
	return !!globalThis.process?.versions?.webcontainer;
}
//#endregion
//#region node_modules/svelte/src/internal/server/crypto.js
var text_encoder;
var crypto;
/** @param {string} module_name */
var obfuscated_import = (module_name) => import(
	/* @vite-ignore */
	module_name
);
/** @param {string} data */
async function sha256(data) {
	text_encoder ??= new TextEncoder();
	crypto ??= globalThis.crypto?.subtle?.digest ? globalThis.crypto : (await obfuscated_import("node:crypto")).webcrypto;
	return base64_encode(await crypto.subtle.digest("SHA-256", text_encoder.encode(data)));
}
/**
* @param {Uint8Array} bytes
* @returns {string}
*/
function base64_encode(bytes) {
	if (globalThis.Buffer) return globalThis.Buffer.from(bytes).toString("base64");
	let binary = "";
	for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
	return btoa(binary);
}
//#endregion
//#region node_modules/svelte/src/internal/server/renderer.js
/** @import { Component } from 'svelte' */
/** @import { Csp, HydratableContext, RenderOutput, SSRContext, SyncRenderOutput, Sha256Source } from './types.js' */
/** @import { MaybePromise } from '#shared' */
/** @typedef {'head' | 'body'} RendererType */
/** @typedef {{ [key in RendererType]: string }} AccumulatedContent */
/**
* @typedef {string | Renderer} RendererItem
*/
/**
* Renderers are basically a tree of `string | Renderer`s, where each `Renderer` in the tree represents
* work that may or may not have completed. A renderer can be {@link collect}ed to aggregate the
* content from itself and all of its children, but this will throw if any of the children are
* performing asynchronous work. To asynchronously collect a renderer, just `await` it.
*
* The `string` values within a renderer are always associated with the {@link type} of that renderer. To switch types,
* call {@link child} with a different `type` argument.
*/
var Renderer = class Renderer {
	/**
	* The contents of the renderer.
	* @type {RendererItem[]}
	*/
	#out = [];
	/**
	* Any `onDestroy` callbacks registered during execution of this renderer.
	* @type {(() => void)[] | undefined}
	*/
	#on_destroy = void 0;
	/**
	* Whether this renderer is a component body.
	* @type {boolean}
	*/
	#is_component_body = false;
	/**
	* If set, this renderer is an error boundary. When async collection
	* of the children fails, the failed snippet is rendered instead.
	* @type {{
	* 	failed: (renderer: Renderer, error: unknown, reset: () => void) => void;
	* 	transformError: (error: unknown) => unknown;
	* 	context: SSRContext | null;
	* } | null}
	*/
	#boundary = null;
	/**
	* The type of string content that this renderer is accumulating.
	* @type {RendererType}
	*/
	type;
	/** @type {Renderer | undefined} */
	#parent;
	/**
	* Asynchronous work associated with this renderer
	* @type {Promise<void> | undefined}
	*/
	promise = void 0;
	/**
	* State which is associated with the content tree as a whole.
	* It will be re-exposed, uncopied, on all children.
	* @type {SSRState}
	* @readonly
	*/
	global;
	/**
	* State that is local to the branch it is declared in.
	* It will be shallow-copied to all children.
	*
	* @type {{ select_value: string | undefined }}
	*/
	local;
	/**
	* @param {SSRState} global
	* @param {Renderer | undefined} [parent]
	*/
	constructor(global, parent) {
		this.#parent = parent;
		this.global = global;
		this.local = parent ? { ...parent.local } : { select_value: void 0 };
		this.type = parent ? parent.type : "body";
	}
	/**
	* @param {(renderer: Renderer) => void} fn
	*/
	head(fn) {
		const head = new Renderer(this.global, this);
		head.type = "head";
		this.#out.push(head);
		head.child(fn);
	}
	/**
	* @param {Array<Promise<void>>} blockers
	* @param {(renderer: Renderer) => void} fn
	*/
	async_block(blockers, fn) {
		this.#out.push(BLOCK_OPEN);
		this.async(blockers, fn);
		this.#out.push(BLOCK_CLOSE);
	}
	/**
	* @param {Array<Promise<void>>} blockers
	* @param {(renderer: Renderer) => void} fn
	*/
	async(blockers, fn) {
		let callback = fn;
		if (blockers.length > 0) {
			const context = ssr_context;
			callback = (renderer) => {
				return Promise.all(blockers).then(() => {
					const previous_context = ssr_context;
					try {
						set_ssr_context(context);
						return fn(renderer);
					} finally {
						set_ssr_context(previous_context);
					}
				});
			};
		}
		this.child(callback);
	}
	/**
	* @param {Array<() => void>} thunks
	*/
	run(thunks) {
		const context = ssr_context;
		let promise = Promise.resolve(thunks[0]());
		const promises = [promise];
		for (const fn of thunks.slice(1)) {
			promise = promise.then(() => {
				const previous_context = ssr_context;
				set_ssr_context(context);
				try {
					return fn();
				} finally {
					set_ssr_context(previous_context);
				}
			});
			promises.push(promise);
		}
		promise.catch(noop);
		this.promise = promise;
		return promises;
	}
	/**
	* @param {(renderer: Renderer) => MaybePromise<void>} fn
	*/
	child_block(fn) {
		this.#out.push(BLOCK_OPEN);
		this.child(fn);
		this.#out.push(BLOCK_CLOSE);
	}
	/**
	* Create a child renderer. The child renderer inherits the state from the parent,
	* but has its own content.
	* @param {(renderer: Renderer) => MaybePromise<void>} fn
	*/
	child(fn) {
		const child = new Renderer(this.global, this);
		this.#out.push(child);
		const parent = ssr_context;
		set_ssr_context({
			...ssr_context,
			p: parent,
			c: null,
			r: child
		});
		const result = fn(child);
		set_ssr_context(parent);
		if (result instanceof Promise) {
			result.catch(noop);
			result.finally(() => set_ssr_context(null)).catch(noop);
			if (child.global.mode === "sync") await_invalid();
			child.promise = result;
		}
		return child;
	}
	/**
	* Render children inside an error boundary. If the children throw and the API-level
	* `transformError` transform handles the error (doesn't re-throw), the `failed` snippet is
	* rendered instead. Otherwise the error propagates.
	*
	* @param {{ failed?: (renderer: Renderer, error: unknown, reset: () => void) => void }} props
	* @param {(renderer: Renderer) => MaybePromise<void>} children_fn
	*/
	boundary(props, children_fn) {
		const child = new Renderer(this.global, this);
		this.#out.push(child);
		const parent_context = ssr_context;
		if (props.failed) child.#boundary = {
			failed: props.failed,
			transformError: this.global.transformError,
			context: parent_context
		};
		set_ssr_context({
			...ssr_context,
			p: parent_context,
			c: null,
			r: child
		});
		try {
			const result = children_fn(child);
			set_ssr_context(parent_context);
			if (result instanceof Promise) {
				if (child.global.mode === "sync") await_invalid();
				result.catch(noop);
				child.promise = result;
			}
		} catch (error) {
			set_ssr_context(parent_context);
			const failed_snippet = props.failed;
			if (!failed_snippet) throw error;
			const result = this.global.transformError(error);
			child.#out.length = 0;
			child.#boundary = null;
			if (result instanceof Promise) {
				if (this.global.mode === "sync") await_invalid();
				child.promise = result.then((transformed) => {
					set_ssr_context(parent_context);
					child.#out.push(Renderer.#serialize_failed_boundary(transformed));
					failed_snippet(child, transformed, noop);
					child.#out.push(BLOCK_CLOSE);
				});
				child.promise.catch(noop);
			} else {
				child.#out.push(Renderer.#serialize_failed_boundary(result));
				failed_snippet(child, result, noop);
				child.#out.push(BLOCK_CLOSE);
			}
		}
	}
	/**
	* Create a component renderer. The component renderer inherits the state from the parent,
	* but has its own content. It is treated as an ordering boundary for ondestroy callbacks.
	* @param {(renderer: Renderer) => MaybePromise<void>} fn
	* @param {Function} [component_fn]
	* @returns {void}
	*/
	component(fn, component_fn) {
		push(component_fn);
		const child = this.child(fn);
		child.#is_component_body = true;
		pop();
	}
	/**
	* @param {Record<string, any>} attrs
	* @param {(renderer: Renderer) => void} fn
	* @param {string | undefined} [css_hash]
	* @param {Record<string, boolean> | undefined} [classes]
	* @param {Record<string, string> | undefined} [styles]
	* @param {number | undefined} [flags]
	* @param {boolean | undefined} [is_rich]
	* @returns {void}
	*/
	select(attrs, fn, css_hash, classes, styles, flags, is_rich) {
		const { value, ...select_attrs } = attrs;
		this.push(`<select${attributes(select_attrs, css_hash, classes, styles, flags)}>`);
		this.child((renderer) => {
			renderer.local.select_value = value;
			fn(renderer);
		});
		this.push(`${is_rich ? "<!>" : ""}</select>`);
	}
	/**
	* @param {Record<string, any>} attrs
	* @param {string | number | boolean | ((renderer: Renderer) => void)} body
	* @param {string | undefined} [css_hash]
	* @param {Record<string, boolean> | undefined} [classes]
	* @param {Record<string, string> | undefined} [styles]
	* @param {number | undefined} [flags]
	* @param {boolean | undefined} [is_rich]
	*/
	option(attrs, body, css_hash, classes, styles, flags, is_rich) {
		this.#out.push(`<option${attributes(attrs, css_hash, classes, styles, flags)}`);
		/**
		* @param {Renderer} renderer
		* @param {any} value
		* @param {{ head?: string, body: any }} content
		*/
		const close = (renderer, value, { head, body }) => {
			if (has_own_property.call(attrs, "value")) value = attrs.value;
			if (value === this.local.select_value) renderer.#out.push(" selected=\"\"");
			renderer.#out.push(`>${body}${is_rich ? "<!>" : ""}</option>`);
			if (head) renderer.head((child) => child.push(head));
		};
		if (typeof body === "function") this.child((renderer) => {
			const r = new Renderer(this.global, this);
			body(r);
			if (this.global.mode === "async") return r.#collect_content_async().then((content) => {
				close(renderer, content.body.replaceAll("<!---->", ""), content);
			});
			else {
				const content = r.#collect_content();
				close(renderer, content.body.replaceAll("<!---->", ""), content);
			}
		});
		else close(this, body, { body: escape_html(body) });
	}
	/**
	* @param {(renderer: Renderer) => void} fn
	*/
	title(fn) {
		const path = this.get_path();
		/** @param {string} head */
		const close = (head) => {
			this.global.set_title(head, path);
		};
		this.child((renderer) => {
			const r = new Renderer(renderer.global, renderer);
			fn(r);
			if (renderer.global.mode === "async") return r.#collect_content_async().then((content) => {
				close(content.head);
			});
			else {
				const content = r.#collect_content();
				close(content.head);
			}
		});
	}
	/**
	* @param {string | (() => Promise<string>)} content
	*/
	push(content) {
		if (typeof content === "function") this.child(async (renderer) => renderer.push(await content()));
		else this.#out.push(content);
	}
	/**
	* @param {() => void} fn
	*/
	on_destroy(fn) {
		(this.#on_destroy ??= []).push(fn);
	}
	/**
	* @returns {number[]}
	*/
	get_path() {
		return this.#parent ? [...this.#parent.get_path(), this.#parent.#out.indexOf(this)] : [];
	}
	/**
	* @deprecated this is needed for legacy component bindings
	*/
	copy() {
		const copy = new Renderer(this.global, this.#parent);
		copy.#out = this.#out.map((item) => item instanceof Renderer ? item.copy() : item);
		copy.promise = this.promise;
		return copy;
	}
	/**
	* @param {Renderer} other
	* @deprecated this is needed for legacy component bindings
	*/
	subsume(other) {
		if (this.global.mode !== other.global.mode) throw new Error("invariant: A renderer cannot switch modes. If you're seeing this, there's a compiler bug. File an issue!");
		this.local = other.local;
		this.#out = other.#out.map((item, i) => {
			const current = this.#out[i];
			if (current instanceof Renderer && item instanceof Renderer) {
				current.subsume(item);
				return current;
			}
			return item;
		});
		this.promise = other.promise;
		this.type = other.type;
	}
	get length() {
		return this.#out.length;
	}
	/**
	* Creates the hydration comment that marks the start of a failed boundary.
	* The error is JSON-serialized and embedded inside an HTML comment for the client
	* to parse during hydration. The JSON is escaped to prevent `-->` or `<!--` sequences
	* from breaking out of the comment (XSS). Uses unicode escapes which `JSON.parse()`
	* handles transparently.
	* @param {unknown} error
	* @returns {string}
	*/
	static #serialize_failed_boundary(error) {
		return `<!--[?${JSON.stringify(error).replace(/>/g, "\\u003e").replace(/</g, "\\u003c")}-->`;
	}
	/**
	* Only available on the server and when compiling with the `server` option.
	* Takes a component and returns an object with `body` and `head` properties on it, which you can use to populate the HTML when server-rendering your app.
	* @template {Record<string, any>} Props
	* @param {Component<Props>} component
	* @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp }} [options]
	* @returns {RenderOutput}
	*/
	static render(component, options = {}) {
		/** @type {AccumulatedContent | undefined} */
		let sync;
		/** @type {Promise<AccumulatedContent & { hashes: { script: Sha256Source[] } }> | undefined} */
		let async;
		const result = {};
		Object.defineProperties(result, {
			html: { get: () => {
				return (sync ??= Renderer.#render(component, options)).body;
			} },
			head: { get: () => {
				return (sync ??= Renderer.#render(component, options)).head;
			} },
			body: { get: () => {
				return (sync ??= Renderer.#render(component, options)).body;
			} },
			hashes: { value: { script: "" } },
			then: { value: (onfulfilled, onrejected) => {
				if (!async_mode_flag) {
					const result = sync ??= Renderer.#render(component, options);
					const user_result = onfulfilled({
						head: result.head,
						body: result.body,
						html: result.body,
						hashes: { script: [] }
					});
					return Promise.resolve(user_result);
				}
				async ??= init_render_context().then(() => with_render_context(() => Renderer.#render_async(component, options)));
				return async.then((result) => {
					Object.defineProperty(result, "html", { get: () => {
						html_deprecated();
					} });
					return onfulfilled(result);
				}, onrejected);
			} }
		});
		return result;
	}
	/**
	* Collect all of the `onDestroy` callbacks registered during rendering. In an async context, this is only safe to call
	* after awaiting `collect_async`.
	*
	* Child renderers are "porous" and don't affect execution order, but component body renderers
	* create ordering boundaries. Within a renderer, callbacks run in order until hitting a component boundary.
	* @returns {Iterable<() => void>}
	*/
	*#collect_on_destroy() {
		for (const component of this.#traverse_components()) yield* component.#collect_ondestroy();
	}
	/**
	* Performs a depth-first search of renderers, yielding the deepest components first, then additional components as we backtrack up the tree.
	* @returns {Iterable<Renderer>}
	*/
	*#traverse_components() {
		for (const child of this.#out) if (typeof child !== "string") yield* child.#traverse_components();
		if (this.#is_component_body) yield this;
	}
	/**
	* @returns {Iterable<() => void>}
	*/
	*#collect_ondestroy() {
		if (this.#on_destroy) for (const fn of this.#on_destroy) yield fn;
		for (const child of this.#out) if (child instanceof Renderer && !child.#is_component_body) yield* child.#collect_ondestroy();
	}
	/**
	* Render a component. Throws if any of the children are performing asynchronous work.
	*
	* @template {Record<string, any>} Props
	* @param {Component<Props>} component
	* @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string }} options
	* @returns {AccumulatedContent}
	*/
	static #render(component, options) {
		var previous_context = ssr_context;
		try {
			const renderer = Renderer.#open_render("sync", component, options);
			const content = renderer.#collect_content();
			return Renderer.#close_render(content, renderer);
		} finally {
			abort();
			set_ssr_context(previous_context);
		}
	}
	/**
	* Render a component.
	*
	* @template {Record<string, any>} Props
	* @param {Component<Props>} component
	* @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp }} options
	* @returns {Promise<AccumulatedContent & { hashes: { script: Sha256Source[] } }>}
	*/
	static async #render_async(component, options) {
		const previous_context = ssr_context;
		try {
			const renderer = Renderer.#open_render("async", component, options);
			const content = await renderer.#collect_content_async();
			const hydratables = await renderer.#collect_hydratables();
			if (hydratables !== null) content.head = hydratables + content.head;
			return Renderer.#close_render(content, renderer);
		} finally {
			set_ssr_context(previous_context);
			abort();
		}
	}
	/**
	* Collect all of the code from the `out` array and return it as a string, or a promise resolving to a string.
	* @param {AccumulatedContent} content
	* @returns {AccumulatedContent}
	*/
	#collect_content(content = {
		head: "",
		body: ""
	}) {
		for (const item of this.#out) if (typeof item === "string") content[this.type] += item;
		else if (item instanceof Renderer) item.#collect_content(content);
		return content;
	}
	/**
	* Collect all of the code from the `out` array and return it as a string.
	* @param {AccumulatedContent} content
	* @returns {Promise<AccumulatedContent>}
	*/
	async #collect_content_async(content = {
		head: "",
		body: ""
	}) {
		await this.promise;
		for (const item of this.#out) if (typeof item === "string") content[this.type] += item;
		else if (item instanceof Renderer) if (item.#boundary) {
			/** @type {AccumulatedContent} */
			const boundary_content = {
				head: "",
				body: ""
			};
			try {
				await item.#collect_content_async(boundary_content);
				content.head += boundary_content.head;
				content.body += boundary_content.body;
			} catch (error) {
				const { context, failed, transformError } = item.#boundary;
				set_ssr_context(context);
				let promise = transformError(error);
				set_ssr_context(null);
				let transformed = await promise;
				set_ssr_context(context);
				const failed_renderer = new Renderer(item.global, item);
				failed_renderer.type = item.type;
				failed_renderer.#out.push(Renderer.#serialize_failed_boundary(transformed));
				failed(failed_renderer, transformed, noop);
				failed_renderer.#out.push(BLOCK_CLOSE);
				await failed_renderer.#collect_content_async(content);
			}
		} else await item.#collect_content_async(content);
		return content;
	}
	async #collect_hydratables() {
		const ctx = get_render_context().hydratable;
		for (const [_, key] of ctx.unresolved_promises) unresolved_hydratable(key, ctx.lookup.get(key)?.stack ?? "<missing stack trace>");
		for (const comparison of ctx.comparisons) await comparison;
		return await this.#hydratable_block(ctx);
	}
	/**
	* @template {Record<string, any>} Props
	* @param {'sync' | 'async'} mode
	* @param {import('svelte').Component<Props>} component
	* @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp; transformError?: (error: unknown) => unknown }} options
	* @returns {Renderer}
	*/
	static #open_render(mode, component, options) {
		if (options.idPrefix?.includes("--")) invalid_id_prefix();
		var previous_context = ssr_context;
		try {
			const renderer = new Renderer(new SSRState(mode, options.idPrefix ? options.idPrefix + "-" : "", options.csp, options.transformError));
			set_ssr_context({
				p: null,
				c: options.context ?? null,
				r: renderer
			});
			renderer.push(BLOCK_OPEN);
			component(renderer, options.props ?? {});
			renderer.push(BLOCK_CLOSE);
			return renderer;
		} finally {
			set_ssr_context(previous_context);
		}
	}
	/**
	* @param {AccumulatedContent} content
	* @param {Renderer} renderer
	* @returns {AccumulatedContent & { hashes: { script: Sha256Source[] } }}
	*/
	static #close_render(content, renderer) {
		for (const cleanup of renderer.#collect_on_destroy()) cleanup();
		let head = content.head + renderer.global.get_title();
		let body = content.body;
		for (const { hash, code } of renderer.global.css) head += `<style id="${hash}">${code}</style>`;
		return {
			head,
			body,
			hashes: { script: renderer.global.csp.script_hashes }
		};
	}
	/**
	* @param {HydratableContext} ctx
	*/
	async #hydratable_block(ctx) {
		if (ctx.lookup.size === 0) return null;
		let entries = [];
		let has_promises = false;
		for (const [k, v] of ctx.lookup) {
			if (v.promises) {
				has_promises = true;
				for (const p of v.promises) await p;
			}
			entries.push(`[${devalue.uneval(k)},${v.serialized}]`);
		}
		let prelude = `const h = (window.__svelte ??= {}).h ??= new Map();`;
		if (has_promises) prelude = `const r = (v) => Promise.resolve(v);
				${prelude}`;
		const body = `
			{
				${prelude}

				for (const [k, v] of [
					${entries.join(",\n					")}
				]) {
					h.set(k, v);
				}
			}
		`;
		let csp_attr = "";
		if (this.global.csp.nonce) csp_attr = ` nonce="${this.global.csp.nonce}"`;
		else if (this.global.csp.hash) {
			const hash = await sha256(body);
			this.global.csp.script_hashes.push(`sha256-${hash}`);
		}
		return `\n\t\t<script${csp_attr}>${body}<\/script>`;
	}
};
var SSRState = class {
	/** @readonly @type {Csp & { script_hashes: Sha256Source[] }} */
	csp;
	/** @readonly @type {'sync' | 'async'} */
	mode;
	/** @readonly @type {() => string} */
	uid;
	/** @readonly @type {Set<{ hash: string; code: string }>} */
	css = /* @__PURE__ */ new Set();
	/**
	* `transformError` passed to `render`. Called when an error boundary catches an error.
	* Throws by default if unset in `render`.
	* @type {(error: unknown) => unknown}
	*/
	transformError;
	/** @type {{ path: number[], value: string }} */
	#title = {
		path: [],
		value: ""
	};
	/**
	* @param {'sync' | 'async'} mode
	* @param {string} id_prefix
	* @param {Csp} csp
	* @param {((error: unknown) => unknown) | undefined} [transformError]
	*/
	constructor(mode, id_prefix = "", csp = { hash: false }, transformError) {
		this.mode = mode;
		this.csp = {
			...csp,
			script_hashes: []
		};
		this.transformError = transformError ?? ((error) => {
			throw error;
		});
		let uid = 1;
		this.uid = () => `${id_prefix}s${uid++}`;
	}
	get_title() {
		return this.#title.value;
	}
	/**
	* Performs a depth-first (lexicographic) comparison using the path. Rejects sets
	* from earlier than or equal to the current value.
	* @param {string} value
	* @param {number[]} path
	*/
	set_title(value, path) {
		const current = this.#title.path;
		let i = 0;
		let l = Math.min(path.length, current.length);
		while (i < l && path[i] === current[i]) i += 1;
		if (path[i] === void 0) return;
		if (current[i] === void 0 || path[i] > current[i]) {
			this.#title.path = path;
			this.#title.value = value;
		}
	}
};
//#endregion
//#region node_modules/svelte/src/internal/server/blocks/html.js
/**
* @param {string} value
*/
function html(value) {
	return "<!---->" + String(value ?? "") + "<!---->";
}
//#endregion
//#region node_modules/svelte/src/internal/server/dev.js
function get_user_code_location() {
	return get_stack().filter((line) => line.trim().startsWith("at ")).map((line) => line.replace(/\((.*):\d+:\d+\)$/, (_, file) => `(${file})`)).join("\n");
}
//#endregion
//#region node_modules/svelte/src/internal/server/index.js
var INVALID_ATTR_NAME_CHAR_REGEX = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
/**
* @param {Renderer} renderer
* @param {string} tag
* @param {() => void} attributes_fn
* @param {() => void} children_fn
* @returns {void}
*/
function element(renderer, tag, attributes_fn = noop, children_fn = noop) {
	renderer.push("<!---->");
	if (tag) {
		if (!REGEX_VALID_TAG_NAME.test(tag)) dynamic_element_invalid_tag(tag);
		renderer.push(`<${tag}`);
		attributes_fn();
		renderer.push(`>`);
		if (!is_void(tag)) {
			children_fn();
			if (!is_raw_text_element(tag)) renderer.push(EMPTY_COMMENT);
			renderer.push(`</${tag}>`);
		}
	}
	renderer.push("<!---->");
}
/**
* Only available on the server and when compiling with the `server` option.
* Takes a component and returns an object with `body` and `head` properties on it, which you can use to populate the HTML when server-rendering your app.
* @template {Record<string, any>} Props
* @param {Component<Props> | ComponentType<SvelteComponent<Props>>} component
* @param {{ props?: Omit<Props, '$$slots' | '$$events'>; context?: Map<any, any>; idPrefix?: string; csp?: Csp; transformError?: (error: unknown) => unknown }} [options]
* @returns {RenderOutput}
*/
function render(component, options = {}) {
	if (options.csp?.hash && options.csp.nonce) invalid_csp();
	return Renderer.render(component, options);
}
/**
* @param {string} hash
* @param {Renderer} renderer
* @param {(renderer: Renderer) => Promise<void> | void} fn
* @returns {void}
*/
function head(hash, renderer, fn) {
	renderer.head((renderer) => {
		renderer.push(`<!--${hash}-->`);
		renderer.child(fn);
		renderer.push(EMPTY_COMMENT);
	});
}
/**
* @param {Record<string, unknown>} attrs
* @param {string} [css_hash]
* @param {Record<string, boolean>} [classes]
* @param {Record<string, string>} [styles]
* @param {number} [flags]
* @returns {string}
*/
function attributes(attrs, css_hash, classes, styles, flags = 0) {
	if (styles) attrs.style = to_style(attrs.style, styles);
	if (attrs.class) attrs.class = clsx(attrs.class);
	if (css_hash || classes) attrs.class = to_class(attrs.class, css_hash, classes);
	let attr_str = "";
	let name;
	const is_html = (flags & 1) === 0;
	const lowercase = (flags & 2) === 0;
	const is_input = (flags & 4) !== 0;
	for (name of Object.keys(attrs)) {
		if (typeof attrs[name] === "function") continue;
		if (name[0] === "$" && name[1] === "$") continue;
		if (name === "" || INVALID_ATTR_NAME_CHAR_REGEX.test(name)) continue;
		var value = attrs[name];
		var lower = name.toLowerCase();
		if (lowercase) name = lower;
		if (lower.length > 2 && lower.startsWith("on")) continue;
		if (is_input) {
			if (name === "defaultvalue" || name === "defaultchecked") {
				name = name === "defaultvalue" ? "value" : "checked";
				if (attrs[name]) continue;
			}
		}
		attr_str += attr(name, value, is_html && is_boolean_attribute(name));
	}
	return attr_str;
}
/**
* @param {Record<string, unknown>[]} props
* @returns {Record<string, unknown>}
*/
function spread_props(props) {
	/** @type {Record<string, unknown>} */
	const merged_props = {};
	let key;
	for (let i = 0; i < props.length; i++) {
		const obj = props[i];
		if (obj == null) continue;
		for (key of Object.keys(obj)) {
			const desc = Object.getOwnPropertyDescriptor(obj, key);
			if (desc) Object.defineProperty(merged_props, key, desc);
			else merged_props[key] = obj[key];
		}
	}
	return merged_props;
}
/**
* @param {unknown} value
* @returns {string}
*/
function stringify(value) {
	return typeof value === "string" ? value : value == null ? "" : value + "";
}
/**
* @param {any} value
* @param {string | undefined} [hash]
* @param {Record<string, boolean>} [directives]
*/
function attr_class(value, hash, directives) {
	var result = to_class(value, hash, directives);
	return result ? ` class="${escape_html(result, true)}"` : "";
}
/**
* @param {any} value
* @param {Record<string,any>|[Record<string,any>,Record<string,any>]} [directives]
*/
function attr_style(value, directives) {
	var result = to_style(value, directives);
	return result ? ` style="${escape_html(result, true)}"` : "";
}
/**
* @template V
* @param {Record<string, [any, any, any]>} store_values
* @param {string} store_name
* @param {Store<V> | null | undefined} store
* @returns {V}
*/
function store_get(store_values, store_name, store) {
	if (store_name in store_values && store_values[store_name][0] === store) return store_values[store_name][2];
	store_values[store_name]?.[1]();
	store_values[store_name] = [
		store,
		null,
		void 0
	];
	const unsub = subscribe_to_store(
		store,
		/** @param {any} v */
		(v) => store_values[store_name][2] = v
	);
	store_values[store_name][1] = unsub;
	return store_values[store_name][2];
}
/**
* Sets the new value of a store and returns that value.
* @template V
* @param {Store<V>} store
* @param {V} value
* @returns {V}
*/
function store_set(store, value) {
	store.set(value);
	return value;
}
/**
* Updates a store with a new value.
* @template V
* @param {Record<string, [any, any, any]>} store_values
* @param {string} store_name
* @param {Store<V>} store
* @param {any} expression
*/
function store_mutate(store_values, store_name, store, expression) {
	store_set(store, store_get(store_values, store_name, store));
	return expression;
}
/** @param {Record<string, [any, any, any]>} store_values */
function unsubscribe_stores(store_values) {
	for (const store_name of Object.keys(store_values)) store_values[store_name][1]();
}
/**
* Legacy mode: If the prop has a fallback and is bound in the
* parent component, propagate the fallback value upwards.
* @param {Record<string, unknown>} props_parent
* @param {Record<string, unknown>} props_now
*/
function bind_props(props_parent, props_now) {
	for (const key of Object.keys(props_now)) {
		const initial_value = props_parent[key];
		const value = props_now[key];
		if (initial_value === void 0 && value !== void 0 && Object.getOwnPropertyDescriptor(props_parent, key)?.set) props_parent[key] = value;
	}
}
/**
* @template V
* @param {Renderer} renderer
* @param {Promise<V>} promise
* @param {null | (() => void)} pending_fn
* @param {(value: V) => void} then_fn
* @returns {void}
*/
function await_block(renderer, promise, pending_fn, then_fn) {
	if (is_promise(promise)) {
		renderer.push(BLOCK_OPEN);
		promise.then(null, noop);
		if (pending_fn !== null) pending_fn();
	} else if (then_fn !== null) {
		renderer.push(BLOCK_OPEN_ELSE);
		then_fn(promise);
	}
}
/** @param {any} array_like_or_iterator */
function ensure_array_like(array_like_or_iterator) {
	if (array_like_or_iterator) return array_like_or_iterator.length !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
	return [];
}
/**
* @template V
* @param {() => V} get_value
*/
function once(get_value) {
	let value = UNINITIALIZED;
	return () => {
		if (value === UNINITIALIZED) value = get_value();
		return value;
	};
}
/**
* Create an unique ID
* @param {Renderer} renderer
* @returns {string}
*/
function props_id(renderer) {
	const uid = renderer.global.uid();
	renderer.push("<!--$" + uid + "-->");
	return uid;
}
/**
* @template T
* @param {()=>T} fn
* @returns {(new_value?: T) => (T | void)}
*/
function derived(fn) {
	const get_value = ssr_context === null ? fn : once(fn);
	/** @type {T | undefined} */
	let updated_value;
	return function(new_value) {
		if (arguments.length === 0) return updated_value ?? get_value();
		updated_value = new_value;
		return updated_value;
	};
}
//#endregion
export { hasContext as C, hydratable_serialization_failed as D, hydratable_clobbering as E, lifecycle_function_unavailable as O, getContext as S, ssr_context as T, get_user_code_location as _, bind_props as a, createContext as b, ensure_array_like as c, render as d, spread_props as f, unsubscribe_stores as g, stringify as h, await_block as i, getAbortSignal as k, head as l, store_mutate as m, attr_style as n, derived as o, store_get as p, attributes as r, element as s, attr_class as t, props_id as u, html as v, setContext as w, getAllContexts as x, get_render_context as y };

//# sourceMappingURL=server.js.map
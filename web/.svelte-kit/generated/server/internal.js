
import root from '../root.js';
import { set_building, set_prerendering } from '$app/env/internal';
import { set_assets } from '$app/paths/internal/server';
import { set_manifest, set_read_implementation } from '__sveltekit/server';
import { set_private_env, set_public_env } from '../../../node_modules/@sveltejs/kit/src/runtime/shared-server.js';
import error from '../shared/error-template.js';

export const options = {
	app_template_contains_nonce: false,
	async: false,
	csp: {"mode":"auto","directives":{"script-src":["self"],"upgrade-insecure-requests":false,"block-all-mixed-content":false},"reportOnly":{"script-src":["self"],"report-uri":["/"],"upgrade-insecure-requests":false,"block-all-mixed-content":false}},
	csrf_check_origin: true,
	csrf_trusted_origins: [],
	embedded: false,
	env_public_prefix: 'PUBLIC_',
	env_private_prefix: '',
	hash_routing: false,
	hooks: null, // added lazily, via `get_hooks`
	preload_strategy: "modulepreload",
	root,
	service_worker: true,
	service_worker_options: undefined,
	server_error_boundaries: false,
	templates: {
		app: ({ head, body, assets, nonce, env }) => "<!doctype html>\n<html class=\"dark font-sans\" lang=\"en\">\n  <head>\n    <meta charset=\"utf-8\" />\n    <link rel=\"icon\" href=\"" + assets + "/img/logo-background.svg\" />\n    <link rel=\"manifest\" href=\"/manifest.json\" />\n    <meta name=\"viewport\" content=\"viewport-fit=cover, width=device-width, initial-scale=1\" />\n    " + head + "\n  </head>\n  <body>\n    <div\n      style=\"z-index:-50;position:absolute;inset:0;display:grid;place-items:center; \"\n    >\n      <svg width=\"50\" height=\"50\"><use width=\"50\" height=\"50\" href=\"/img/logo-isolated.svg#logo\"></use></svg>\n    </div>\n    <div style=\"display: contents;\" data-sveltekit-preload-code>\n      " + body + "\n    </div>\n  </body>\n</html>\n",
		error
	},
	version_hash: "1oab9q2"
};

export async function get_hooks() {
	let handle;
	let handleFetch;
	let handleError;
	let handleValidationError;
	let init;
	({ handle, handleFetch, handleError, handleValidationError, init } = await import("../../../src/hooks.server.ts"));

	let reroute;
	let transport;
	

	return {
		handle,
		handleFetch,
		handleError,
		handleValidationError,
		init,
		reroute,
		transport
	};
}

export { set_assets, set_building, set_manifest, set_prerendering, set_private_env, set_public_env, set_read_implementation };

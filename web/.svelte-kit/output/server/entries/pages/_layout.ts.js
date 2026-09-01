import { t as public_env } from "../../chunks/shared-server.js";
//#region src/routes/+layout.ts
var ssr = public_env.PUBLIC_SSR_ENABLED?.toLowerCase() == "true";
async function load() {}
//#endregion
export { load, ssr };

//# sourceMappingURL=_layout.ts.js.map
import * as universal from '../entries/pages/u/_name_/_page.ts.js';

export const index = 100;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/u/_name_/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/u/[name]/+page.ts";
export const imports = ["_app/immutable/nodes/100.B92-8yu2.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/CHv3bDr7.js","_app/immutable/chunks/DhdsNEKP.js","_app/immutable/chunks/CrIi_4GS.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/HclGiUj8.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/DwTTKvLd.js","_app/immutable/chunks/C8_XEMsh.js","_app/immutable/chunks/uDypdPe3.js","_app/immutable/chunks/B0YNOzD5.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/D2-ae_kb.js","_app/immutable/chunks/CtEQlUCg.js","_app/immutable/chunks/BN4AI1t_.js","_app/immutable/chunks/DcFQ0uQH.js","_app/immutable/chunks/D_jmBLRE2.js","_app/immutable/chunks/C5RTCAyd.js","_app/immutable/chunks/CtxCc_Q9.js","_app/immutable/chunks/Cz3OLUMZ.js"];
export const stylesheets = ["_app/immutable/assets/client.BpQTDGjo.css","_app/immutable/assets/Comment.BxX3pTC6.css"];
export const fonts = [];

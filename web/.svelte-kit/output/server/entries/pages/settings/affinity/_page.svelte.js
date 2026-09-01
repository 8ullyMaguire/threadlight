import { o as escape_html } from "../../../../chunks/validate.js";
import { c as ensure_array_like, l as head, t as attr_class } from "../../../../chunks/server.js";
import "../../../../chunks/client.svelte.js";
//#region src/routes/settings/affinity/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		function getBreakdown(breakdownStr) {
			try {
				return JSON.parse(breakdownStr);
			} catch {
				return {
					tag_overlap: 0,
					co_community: 0,
					reaction_agreement: 0,
					trust_distance: 0
				};
			}
		}
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			head("1reolnl", $$renderer, ($$renderer) => {
				$$renderer.title(($$renderer) => {
					$$renderer.push(`<title>Affinity - Settings</title>`);
				});
			});
			$$renderer.push(`<div class="p-4"><h2 class="text-2xl font-semibold mb-6">User Affinity</h2> <div class="flex gap-1 mb-6 border-b border-border"><button${attr_class(`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px border-primary text-primary`)}>My Affinities</button> <button${attr_class(`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px border-transparent text-muted-foreground hover:text-foreground`)}>Similar Users</button></div> `);
			$$renderer.push("<!--[0-->");
			if (data.affinities.length === 0) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<p class="text-muted-foreground mt-4">No affinity data available yet.</p>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<div class="overflow-x-auto mt-4"><table class="w-full border-collapse"><thead><tr class="border-b border-border"><th class="text-left py-2 px-3 font-medium text-sm">User ID</th><th class="text-left py-2 px-3 font-medium text-sm">Score</th><th class="text-left py-2 px-3 font-medium text-sm">Tag Overlap</th><th class="text-left py-2 px-3 font-medium text-sm">Co-Community</th><th class="text-left py-2 px-3 font-medium text-sm">Reaction Agreement</th><th class="text-left py-2 px-3 font-medium text-sm">Trust Distance</th></tr></thead><tbody><!--[-->`);
				const each_array = ensure_array_like(data.affinities);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let entry = each_array[$$index];
					const breakdown = getBreakdown(entry.breakdown);
					$$renderer.push(`<tr class="border-b border-border hover:bg-accent/50 transition-colors"><td class="py-2 px-3">${escape_html(entry.user_b_id)}</td><td class="py-2 px-3 font-mono">${escape_html((entry.affinity_score * 100).toFixed(1))}%</td><td class="py-2 px-3 font-mono">${escape_html((breakdown.tag_overlap * 100).toFixed(1))}%</td><td class="py-2 px-3 font-mono">${escape_html((breakdown.co_community * 100).toFixed(1))}%</td><td class="py-2 px-3 font-mono">${escape_html((breakdown.reaction_agreement * 100).toFixed(1))}%</td><td class="py-2 px-3 font-mono">${escape_html((breakdown.trust_distance * 100).toFixed(1))}%</td></tr>`);
				}
				$$renderer.push(`<!--]--></tbody></table></div>`);
			}
			$$renderer.push(`<!--]-->`);
			$$renderer.push(`<!--]--></div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map
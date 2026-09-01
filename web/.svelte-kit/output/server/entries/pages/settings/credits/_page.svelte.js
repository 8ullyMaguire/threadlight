import "../../../../chunks/internal.js";
import { o as escape_html } from "../../../../chunks/validate.js";
import { c as ensure_array_like, l as head, o as derived, t as attr_class } from "../../../../chunks/server.js";
import { An as CurrencyDollar, En as Fire, R as Header, Yt as Spinner, Zt as Button, t as client } from "../../../../chunks/client.svelte.js";
import { n as Icon } from "../../../../chunks/Placeholder.js";
import { t as ArrowPath } from "../../../../chunks/ArrowPath.js";
import "../../../../chunks/XCircle.js";
//#region src/lib/feature/credit/DailyQuests.svelte
function DailyQuests($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { compact = false } = $$props;
		derived(() => false);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex justify-center p-4">`);
		Spinner($$renderer, { width: 20 });
		$$renderer.push(`<!----></div>`);
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/feature/credit/WeeklyBounties.svelte
function WeeklyBounties($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex justify-center p-4">`);
		Spinner($$renderer, { width: 20 });
		$$renderer.push(`<!----></div>`);
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/routes/settings/credits/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let balance = null;
		let transactions = null;
		let costs = null;
		let loading = true;
		let error = null;
		let txPage = 1;
		async function loadData() {
			loading = true;
			error = null;
			try {
				const tl = client();
				const [bal, txs, cst] = await Promise.all([
					tl.getCreditBalance(),
					tl.getCreditTransactions({
						page: txPage,
						limit: 20
					}),
					tl.getCreditCosts()
				]);
				balance = bal;
				transactions = txs;
				costs = cst;
			} catch (e) {
				error = String(e);
			} finally {
				loading = false;
			}
		}
		head("19clk31", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Credits</title>`);
			});
		});
		Header($$renderer, {
			pageHeader: true,
			children: ($$renderer) => {
				$$renderer.push(`<!---->Credits`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----> `);
		if (loading && !balance) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="flex justify-center p-8">`);
			Spinner($$renderer, { width: 24 });
			$$renderer.push(`<!----></div>`);
		} else if (error) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="text-red-500 p-4">Failed to load credit data: ${escape_html(error)}</div>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div class="space-y-6 max-w-2xl"><div class="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6"><div class="flex items-center gap-3"><div class="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">`);
			Icon($$renderer, {
				src: CurrencyDollar,
				size: "24",
				class: "text-amber-600 dark:text-amber-400"
			});
			$$renderer.push(`<!----></div> <div><div class="text-3xl font-bold">${escape_html(balance?.credits ?? 0)}</div> <div class="text-sm text-zinc-500">Available credits</div></div></div> `);
			if (balance) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="flex gap-4 mt-4 text-sm text-zinc-500"><div><span class="font-medium text-zinc-700 dark:text-zinc-300">${escape_html(balance.lifetime_credits)}</span> lifetime earned</div> <div${attr_class("flex items-center gap-1", void 0, { "text-amber-500": balance.streak > 0 })}>`);
				Icon($$renderer, {
					src: Fire,
					size: "14",
					micro: true
				});
				$$renderer.push(`<!----> <span class="font-medium">${escape_html(balance.streak)} day streak</span></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> `);
			DailyQuests($$renderer, {});
			$$renderer.push(`<!----> `);
			WeeklyBounties($$renderer, {});
			$$renderer.push(`<!----> <div class="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4 text-sm"><p><strong>Transfer tax:</strong> Transfers are subject to a 10% platform tax.
        Sending 100 credits delivers 90 to the recipient.</p></div> `);
			if (costs) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4"><h3 class="font-semibold text-sm mb-3">Action Costs</h3> <table class="w-full text-sm"><thead><tr class="text-left text-zinc-500 border-b border-slate-200 dark:border-zinc-700"><th class="pb-2 font-medium">Action</th><th class="pb-2 font-medium text-right">Cost</th></tr></thead><tbody><tr class="border-b border-slate-100 dark:border-zinc-800"><td class="py-2">Post creation</td><td class="py-2 text-right">${escape_html(costs.post_creation)}</td></tr><tr class="border-b border-slate-100 dark:border-zinc-800"><td class="py-2">Image upload</td><td class="py-2 text-right">${escape_html(costs.image_upload)}</td></tr><tr class="border-b border-slate-100 dark:border-zinc-800"><td class="py-2">Search</td><td class="py-2 text-right">${escape_html(costs.search)}</td></tr><tr class="border-b border-slate-100 dark:border-zinc-800"><td class="py-2">Private message</td><td class="py-2 text-right">${escape_html(costs.private_message)}</td></tr><tr><td class="py-2">Reaction</td><td class="py-2 text-right">${escape_html(costs.reaction)}</td></tr></tbody></table></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (transactions?.transactions?.length) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4"><h3 class="font-semibold text-sm mb-3">Recent Transactions</h3> <div class="space-y-2"><!--[-->`);
				const each_array = ensure_array_like(transactions.transactions);
				for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
					let tx = each_array[$$index];
					$$renderer.push(`<div class="flex items-center justify-between text-sm py-1.5 border-b border-slate-100 dark:border-zinc-800 last:border-0"><div><div class="font-medium">${escape_html(tx.reason)}</div> <div class="text-xs text-zinc-500">${escape_html(new Date(tx.created_at).toLocaleDateString())}</div></div> <div${attr_class("font-medium", void 0, {
						"text-green-600": tx.amount > 0,
						"text-red-500": tx.amount < 0
					})}>${escape_html(tx.amount > 0 ? "+" : "")}${escape_html(tx.amount)}</div></div>`);
				}
				$$renderer.push(`<!--]--></div></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			Button($$renderer, {
				onclick: loadData,
				icon: ArrowPath,
				children: ($$renderer) => {
					$$renderer.push(`<!---->Refresh`);
				},
				$$slots: { default: true }
			});
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { _page as default };

//# sourceMappingURL=_page.svelte.js.map
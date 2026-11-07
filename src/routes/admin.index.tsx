import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatGBP } from "@/lib/foods";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data: orders } = await supabase.from("orders").select("id,status,total,created_at");
      const { data: items } = await supabase.from("order_items").select("name,quantity");
      const counts = (orders ?? []).reduce<Record<string, number>>((m, o) => { m[o.status] = (m[o.status] ?? 0) + 1; return m; }, {});
      const revenue = (orders ?? []).reduce((s, o) => s + Number(o.total), 0);
      const itemTally = (items ?? []).reduce<Record<string, number>>((m, i) => { m[i.name] = (m[i.name] ?? 0) + i.quantity; return m; }, {});
      const top = Object.entries(itemTally).sort((a, b) => b[1] - a[1]).slice(0, 5);
      return { total: orders?.length ?? 0, counts, revenue, top };
    },
    refetchInterval: 10_000,
  });

  const stats = [
    { label: "Total orders", value: data?.total ?? 0 },
    { label: "Pending", value: data?.counts.pending ?? 0 },
    { label: "Ready for pickup", value: data?.counts.ready ?? 0 },
    { label: "Completed", value: data?.counts.completed ?? 0 },
    { label: "Revenue", value: formatGBP(data?.revenue ?? 0) },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Dashboard</h1>
        <p className="text-muted-foreground">Live overview of your orders.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl bg-card shadow-soft p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="mt-2 font-display text-3xl">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-card shadow-soft p-6">
        <h2 className="font-display text-xl">Most ordered items</h2>
        {(!data?.top || data.top.length === 0) ? (
          <div className="mt-4 text-sm text-muted-foreground">No orders yet.</div>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {data.top.map(([name, qty]) => (
              <li key={name} className="flex justify-between py-3 text-sm">
                <span>{name}</span>
                <span className="font-semibold">{qty}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
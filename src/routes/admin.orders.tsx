import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatGBP } from "@/lib/foods";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const Route = createFileRoute("/admin/orders")({ component: OrdersPage });

const STATUSES = ["pending", "ready", "completed", "cancelled"] as const;
const COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-900",
  ready: "bg-sky-100 text-sky-900",
  completed: "bg-emerald-100 text-emerald-900",
  cancelled: "bg-rose-100 text-rose-900",
};

function OrdersPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>("all");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    refetchInterval: 8_000,
  });

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
  }

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-3xl">Orders</h1>
        <div className="flex gap-2 flex-wrap">
          {["all", ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={cn("rounded-full px-3 py-1.5 text-xs font-medium capitalize",
                filter === s ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-muted")}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 rounded-2xl bg-muted animate-pulse" />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-card shadow-soft p-12 text-center text-muted-foreground">No orders here.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map(o => (
            <div key={o.id} className="rounded-2xl bg-card shadow-soft p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display text-lg text-primary">{o.order_number}</span>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs capitalize", COLORS[o.status])}>{o.status}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {o.customer_name} · <a href={`tel:${o.customer_phone}`} className="hover:text-primary">{o.customer_phone}</a>
                  </div>
                  <div className="text-sm mt-1">Pickup: <strong>{o.pickup_date}</strong> at <strong>{o.pickup_time}</strong></div>
                </div>
                <div className="text-right">
                  <div className="font-display text-xl">{formatGBP(Number(o.total))}</div>
                  <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString("en-GB")}</div>
                </div>
              </div>
              <ul className="mt-3 text-sm border-t border-border pt-3 space-y-1">
                {o.order_items.map((i: any) => (
                  <li key={i.id} className="flex justify-between">
                    <span>{i.quantity} × {i.name}</span>
                    <span className="text-muted-foreground">{formatGBP(Number(i.unit_price) * i.quantity)}</span>
                  </li>
                ))}
              </ul>
              {o.notes && <div className="mt-2 text-sm bg-muted/60 rounded-lg p-2">Note: {o.notes}</div>}
              <div className="mt-4 flex gap-2 flex-wrap">
                {STATUSES.map(s => (
                  <button key={s} disabled={o.status === s} onClick={() => updateStatus(o.id, s)}
                    className={cn("rounded-full px-3 py-1.5 text-xs font-medium capitalize transition",
                      o.status === s ? "opacity-50 cursor-not-allowed bg-muted" : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground")}>
                    Mark {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
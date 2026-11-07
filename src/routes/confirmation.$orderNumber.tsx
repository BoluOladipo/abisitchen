import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Download, Printer } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { formatGBP } from "@/lib/foods";

export const Route = createFileRoute("/confirmation/$orderNumber")({
  head: () => ({
    meta: [{ title: "Order Confirmed — Abi's Kitchen" }, { name: "robots", content: "noindex" }],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { orderNumber } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["order", orderNumber],
    queryFn: async () => {
      const { data: order, error } = await supabase.from("orders").select("*").eq("order_number", orderNumber).maybeSingle();
      if (error) throw error;
      const { data: items } = await supabase.from("order_items").select("*").eq("order_id", order?.id ?? "");
      return { order, items: items ?? [] };
    },
  });

  function download() {
    if (!data?.order) return;
    const lines = [
      "ABI'S KITCHEN — Pickup Receipt",
      "================================",
      `Order #: ${data.order.order_number}`,
      `Name:    ${data.order.customer_name}`,
      `Phone:   ${data.order.customer_phone}`,
      `Pickup:  ${data.order.pickup_date} at ${data.order.pickup_time}`,
      "",
      "Items:",
      ...data.items.map(i => `  ${i.quantity} x ${i.name}  —  ${formatGBP(Number(i.unit_price) * i.quantity)}`),
      "",
      `TOTAL: ${formatGBP(Number(data.order.total))}`,
      "Payment due at pickup.",
      "",
      "Thank you for your order!",
    ].join("\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${data.order.order_number}.txt`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
        {isLoading ? (
          <div className="h-96 rounded-3xl bg-muted animate-pulse" />
        ) : !data?.order ? (
          <div className="text-center">
            <h1 className="font-display text-3xl">Order not found</h1>
            <Link to="/" className="mt-4 inline-flex text-primary hover:underline">Go home</Link>
          </div>
        ) : (
          <div className="rounded-3xl bg-card shadow-card p-8 sm:p-10 animate-scale-in print:shadow-none print:rounded-none">
            <div className="flex items-center gap-3">
              <div className="size-14 rounded-full gradient-leaf inline-flex items-center justify-center shadow-glow">
                <CheckCircle2 className="size-7 text-background" />
              </div>
              <div>
                <h1 className="font-display text-3xl">Thank you!</h1>
                <p className="text-muted-foreground">Your pre-order is confirmed.</p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-muted/50 p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Order number</div>
              <div className="font-display text-3xl text-primary">{data.order.order_number}</div>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
              <Info label="Name" value={data.order.customer_name} />
              <Info label="Phone" value={data.order.customer_phone} />
              <Info label="Pickup date" value={data.order.pickup_date} />
              <Info label="Pickup time" value={data.order.pickup_time} />
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Items</div>
              <ul className="space-y-2 text-sm">
                {data.items.map(i => (
                  <li key={i.id} className="flex justify-between">
                    <span>{i.quantity} × {i.name}</span>
                    <span className="text-muted-foreground">{formatGBP(Number(i.unit_price) * i.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between font-semibold text-lg border-t border-border pt-3">
                <span>Total</span><span>{formatGBP(Number(data.order.total))}</span>
              </div>
            </div>

          <p className="mt-6 text-sm text-muted-foreground">
  Please present this order number when collecting your food.
  <br /><br />
  Make payments to this account:  <br /><br /> <strong>Account Number: 66276007</strong>  <br /><br />
            <strong>Bank: Sumup Bank</strong>  <br /><br />
            <strong>SORT CODE :04-14-50</strong>
  <br />
  <strong>Account Name: Abi'sKitchen Limited</strong>
  <br /><br />
  Use the order number as the description when making the transfer.
  <br />
  <strong>NOTE: Payment validates order.</strong> 
</p>

            <div className="mt-6 flex flex-wrap gap-3 print:hidden">
              <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/85">
                <Printer className="size-4" /> Print
              </button>
              <button onClick={download} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow">
                <Download className="size-4" /> Download receipt
              </button>
              <Link to="/menu" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted">
                Order again
              </Link>
            </div>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  );
}

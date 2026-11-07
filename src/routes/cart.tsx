import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useCart } from "@/lib/cart";
import { formatGBP } from "@/lib/foods";
import { supabase } from "@/integrations/supabase/client";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_2q91tmp";
const EMAILJS_TEMPLATE_ID = "template_6p5b9lc";
const EMAILJS_PUBLIC_KEY = "G4WtTlVWLY30gGzFD";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Abi's Kitchen" },
      { name: "description", content: "Review your order and choose a pickup time. Pay at collection." },
    ],
  }),
  component: CartPage,
});

const schema = z.object({
  customer_name: z.string().trim().min(2, "Please enter your full name").max(80),
  customer_email: z.string().trim().email("Please enter a valid email address").max(120),
  customer_phone: z.string().trim().min(7, "Please enter a valid phone number").max(20).regex(/^[+\d\s()-]+$/, "Invalid phone number"),
  pickup_date: z.string().min(1, "Choose a pickup date"),
  pickup_time: z.string().min(1, "Choose a pickup time"),
  notes: z.string().max(300).optional(),
});

function makeOrderNumber() {
  return "AK-" + Date.now().toString(36).toUpperCase().slice(-6) + Math.random().toString(36).toUpperCase().slice(2, 5);
}

function CartPage() {
  const { items, setQty, remove, clear, total } = useCart();
  const nav = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ customer_name: "", customer_email: "", customer_phone: "", pickup_date: "", pickup_time: "", notes: "" });

  const today = new Date().toISOString().slice(0, 10);

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return toast.error("Your cart is empty.");
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      return toast.error(parsed.error.issues[0].message);
    }
    setSubmitting(true);
    const order_number = makeOrderNumber();
    try {
      const { data: order, error } = await supabase.from("orders").insert({
        order_number,
        customer_name: parsed.data.customer_name,
        customer_phone: parsed.data.customer_phone,
        pickup_date: parsed.data.pickup_date,
        pickup_time: parsed.data.pickup_time,
        notes: parsed.data.notes || null,
        total,
        status: "pending",
      }).select("id, order_number").single();
      if (error || !order) throw error;

      const { error: itemsErr } = await supabase.from("order_items").insert(
        items.map(i => ({
          order_id: order.id,
          food_id: i.id,
          name: i.name,
          unit_price: i.price,
          quantity: i.quantity,
        }))
      );
      if (itemsErr) throw itemsErr;

      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            order_number,
            customer_name: parsed.data.customer_name,
            customer_email: parsed.data.customer_email,
            customer_phone: parsed.data.customer_phone,
            pickup_date: parsed.data.pickup_date,
            pickup_time: parsed.data.pickup_time,
            notes: parsed.data.notes || "—",
            total: formatGBP(total),
            items: items
              .map(i => `${i.quantity} x ${i.name} — ${formatGBP(i.price * i.quantity)}`)
              .join("\n"),
          },
          { publicKey: EMAILJS_PUBLIC_KEY }
        );
      } catch (mailErr) {
        console.error("EmailJS notification failed", mailErr);
      }

      clear();
      toast.success("Order placed!");
      nav({ to: "/confirmation/$orderNumber", params: { orderNumber: order.order_number } });
    } catch (err) {
      console.error(err);
      toast.error("Could not place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="text-xs uppercase tracking-[0.2em] text-primary">Checkout</div>
        <h1 className="mt-2 font-display text-4xl">Your order</h1>

        {items.length === 0 ? (
          <div className="mt-12 text-center rounded-3xl bg-card shadow-card p-16">
            <ShoppingBag className="size-12 mx-auto text-muted-foreground" />
            <h2 className="mt-4 font-display text-2xl">Your cart is empty</h2>
            <p className="mt-2 text-muted-foreground">Add some delicious dishes to get started.</p>
            <Link to="/menu" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow">
              Browse menu
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid lg:grid-cols-[1fr_380px] gap-8">
            <div className="space-y-4">
              {items.map(i => (
                <div key={i.id} className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-soft">
                  <div className="flex-1">
                    <div className="font-medium">{i.name}</div>
                    <div className="text-sm text-muted-foreground">{formatGBP(i.price)} each</div>
                  </div>
                  <div className="inline-flex items-center rounded-full border border-border">
                    <button onClick={() => setQty(i.id, i.quantity - 1)} className="size-9 inline-flex items-center justify-center hover:text-primary"><Minus className="size-4" /></button>
                    <span className="w-8 text-center text-sm font-medium">{i.quantity}</span>
                    <button onClick={() => setQty(i.id, i.quantity + 1)} className="size-9 inline-flex items-center justify-center hover:text-primary"><Plus className="size-4" /></button>
                  </div>
                  <div className="w-20 text-right font-semibold">{formatGBP(i.price * i.quantity)}</div>
                  <button onClick={() => remove(i.id)} className="text-muted-foreground hover:text-destructive p-2"><Trash2 className="size-4" /></button>
                </div>
              ))}
              <Link to="/menu" className="inline-flex text-sm text-primary hover:underline">+ Add more items</Link>
            </div>

            <form onSubmit={placeOrder} className="rounded-3xl bg-card shadow-card p-6 space-y-4 h-fit sticky top-24">
              <h2 className="font-display text-2xl">Pickup details</h2>
              <Field label="Full name">
                <input required value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} className="input" placeholder="Jane Doe" />
              </Field>
              <Field label="Email address">
                <input type="email" required value={form.customer_email} onChange={e => setForm({ ...form, customer_email: e.target.value })} className="input" placeholder="jane@example.com" />
              </Field>
              <Field label="Phone number">
                <input required value={form.customer_phone} onChange={e => setForm({ ...form, customer_phone: e.target.value })} className="input" placeholder="07523 817416" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Pickup date">
                  <input type="date" required min={today} value={form.pickup_date} onChange={e => setForm({ ...form, pickup_date: e.target.value })} className="input" />
                </Field>
                <Field label="Pickup time">
                  <input type="time" required value={form.pickup_time} onChange={e => setForm({ ...form, pickup_time: e.target.value })} className="input" />
                </Field>
              </div>
              <Field label="Notes (optional)">
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className="input resize-none" placeholder="Any allergies or special requests" />
              </Field>

              <div className="border-t border-border pt-4 space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatGBP(total)}</span></div>
                <div className="flex justify-between text-lg font-semibold pt-2"><span>Total</span><span>{formatGBP(total)}</span></div>
                <div className="text-xs text-muted-foreground pt-1">Payment is made at pickup.</div>
              </div>

              <button disabled={submitting} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:translate-y-[-1px] transition disabled:opacity-60">
                {submitting ? "Placing order…" : "Place order"}
              </button>
            </form>
          </div>
        )}
      </section>
      <style>{`.input { width: 100%; padding: 0.625rem 0.875rem; border-radius: 0.625rem; border: 1px solid var(--color-border); background: var(--color-background); font-size: 0.875rem; outline: none; transition: box-shadow .15s, border-color .15s; }
      .input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 25%, transparent); }`}</style>
    </SiteLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">{label}</div>
      {children}
    </label>
  );
}
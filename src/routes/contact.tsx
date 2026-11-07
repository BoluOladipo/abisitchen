import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Abi's Kitchen" },
      { name: "description", content: "Get in touch with Abi's Kitchen. Call, email, WhatsApp or send a message." },
      { property: "og:title", content: "Contact — Abi's Kitchen" },
      { property: "og:description", content: "Call, email or message Abi's Kitchen." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  message: z.string().trim().min(5).max(800),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) return toast.error(r.error.issues[0].message);
    const body = `From ${r.data.name} (${r.data.email}):%0A%0A${encodeURIComponent(r.data.message)}`;
    window.location.href = `mailto:abiskitchen35@gmail.com?subject=Website%20enquiry&body=${body}`;
    toast.success("Opening your email app…");
  }

  return (
    <SiteLayout>
      <section className="relative gradient-hero text-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <div className="text-xs uppercase tracking-[0.2em] text-background/60">Contact</div>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">We'd love to hear from you.</h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <ContactItem icon={Phone} label="Call us" value="07523 817416" href="tel:+447523817416" />
          <ContactItem icon={Mail} label="Email" value="abiskitchen35@gmail.com" href="mailto:abiskitchen35@gmail.com" />
          <ContactItem icon={Instagram} label="Instagram" value="@abiskitchen35" href="https://instagram.com/abiskitchen35" />
          <ContactItem icon={MessageCircle} label="WhatsApp" value="Chat with us" href="https://wa.me/447523817416" highlight />
          <ContactItem icon={MapPin} label="Find us" value="United Kingdom · pitches & events" />

          <div className="mt-6 rounded-2xl overflow-hidden shadow-card">
            <iframe
              title="Map"
              src="https://www.google.com/maps?q=United+Kingdom&output=embed"
              className="w-full h-72 border-0"
              loading="lazy"
            />
          </div>
        </div>

        <form onSubmit={submit} className="rounded-3xl bg-card shadow-card p-6 sm:p-8 space-y-4 h-fit">
          <h2 className="font-display text-2xl">Send a message</h2>
          <label className="block">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Name</div>
            <input className="input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="block">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Email</div>
            <input type="email" className="input" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="block">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Message</div>
            <textarea rows={5} className="input resize-none" required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
          </label>
          <button className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:translate-y-[-1px] transition">
            Send message
          </button>
        </form>
      </section>
      <style>{`.input { width: 100%; padding: 0.625rem 0.875rem; border-radius: 0.625rem; border: 1px solid var(--color-border); background: var(--color-background); font-size: 0.875rem; outline: none; }
      .input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 25%, transparent); }`}</style>
    </SiteLayout>
  );
}

function ContactItem({ icon: Icon, label, value, href, highlight }: { icon: any; label: string; value: string; href?: string; highlight?: boolean }) {
  const inner = (
    <div className={`flex items-center gap-4 rounded-2xl p-5 transition ${highlight ? "gradient-leaf text-background shadow-glow hover:translate-y-[-2px]" : "bg-card shadow-soft hover:shadow-card"}`}>
      <div className={`inline-flex size-12 items-center justify-center rounded-xl ${highlight ? "bg-background/15" : "bg-muted"}`}>
        <Icon className="size-5" />
      </div>
      <div>
        <div className={`text-xs uppercase tracking-wider ${highlight ? "text-background/70" : "text-muted-foreground"}`}>{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block">{inner}</a> : inner;
}
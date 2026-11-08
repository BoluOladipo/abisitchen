import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import about1 from "@/assets/flyer.jpg";
import about2 from "@/assets/about-1.jpeg";
import about3 from "@/assets/about-3.jpeg";
import about4 from "@/assets/about-4.jpeg";
import { ArrowRight, Heart, Sparkles, Utensils } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Abi's Kitchen" },
      { name: "description", content: "The story behind Abi's Kitchen — a Nigerian takeaway bringing warm, authentic recipes to the UK." },
      { property: "og:title", content: "About — Abi's Kitchen" },
      { property: "og:description", content: "Family recipes, daily-made, served from our pitch across the UK." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="relative gradient-hero text-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-background/60">Our Story</div>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl max-w-2xl">From a family kitchen to the streets of the UK.</h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-5 text-foreground/85">
          <p className="text-lg">
            Abis Kitchen began with a simple belief — food should feel like home, no matter where you are.
            Every dish we serve carries the warmth of family Sunday lunches, the rhythm of a busy Lagos market,
            and the care of recipes passed down through generations.
          </p>
          <p>
            From our stainless-steel pitch on the high street, we slow-cook jollof in big pots, prepare
            peppered chicken to order, and fry plantain golden by hand. Nothing is rushed. Nothing comes pre-made.
          </p>
          <p>
            We're proud to be part of the UK's vibrant street-food community — and we'd love to feed you next.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src={about1} alt="" loading="lazy" className="rounded-2xl shadow-card aspect-[3/4] object-cover" />
          <img src={about2} alt="" loading="lazy" className="rounded-2xl shadow-card aspect-[3/4] object-cover mt-8" />
        </div>
      </section>

      <section className="bg-muted/40 border-y border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-xs uppercase tracking-[0.2em] text-primary">What we stand for</div>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">Our mission</h2>
            <p className="mt-3 text-muted-foreground">To serve authentic Nigerian food with the warmth, care and pride it deserves — to every guest, every time.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: Heart, title: "Made with love", text: "Small batches, prepared fresh every single day." },
              { icon: Utensils, title: "Authentic flavour", text: "Family recipes — no shortcuts, no substitutes." },
              { icon: Sparkles, title: "A warm welcome", text: "We treat every guest like family. That's our promise." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl bg-card p-6 shadow-soft">
                <div className="inline-flex items-center justify-center size-12 rounded-xl gradient-leaf text-background shadow-glow">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-display text-xl">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
        <div className="grid grid-cols-2 gap-4 order-2 lg:order-1">
          <img src={about3} alt="" loading="lazy" className="rounded-2xl shadow-card aspect-[3/4] object-cover mt-8" />
          <img src={about4} alt="" loading="lazy" className="rounded-2xl shadow-card aspect-[3/4] object-cover" />
        </div>
        <div className="order-1 lg:order-2 space-y-4">
          <div className="text-xs uppercase tracking-[0.2em] text-primary">Catering</div>
          <h2 className="font-display text-3xl sm:text-4xl">Book us for your event and any Special Orders (Pre-Orders)</h2>
          <p className="text-muted-foreground">Birthdays, weddings, funerals, corporate or community — we'd love to cater your next celebration with a full Nigerian spread.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:translate-y-[-2px] transition">
            Get in touch <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}

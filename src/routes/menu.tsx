import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Facebook, Instagram, MessageCircle, Music2, Phone } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { FoodCard } from "@/components/site/FoodCard";
import { Reveal } from "@/components/site/Reveal";
import type { Food } from "@/lib/foods";
import { CATEGORY_ORDER } from "@/lib/foods";
import { foodsQueryOptions } from "@/lib/foodQueries";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Abi's Kitchen" },
      {
        name: "description",
        content:
          "Browse our full menu: jollof rice, fried rice, peppered chicken, signature puff-puff, soups and drinks.",
      },
      { property: "og:title", content: "Menu — Abi's Kitchen" },
      {
        property: "og:description",
        content:
          "Browse our menu of Nigerian rice dishes, specials, signature puff-puff, soups and drinks.",
      },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { data: foods = [], isError, isLoading } = useQuery(foodsQueryOptions());

  const categories = useMemo(() => {
    const set = new Set<string>(foods.map((f) => f.category));
    const known = CATEGORY_ORDER.filter((category) => set.has(category));
    const extra = [...set].filter((c) => !(CATEGORY_ORDER as readonly string[]).includes(c));
    return ["All", ...known, ...extra];
  }, [foods]);

  const [active, setActive] = useState<string>("All");
  const shown = active === "All" ? foods : foods.filter((f) => f.category === active);
  const sections =
    active === "All"
      ? categories
          .slice(1)
          .map((category) => ({
            category,
            items: foods.filter((food) => food.category === category),
          }))
          .filter((section) => section.items.length > 0)
      : [{ category: active, items: shown }];

  return (
    <SiteLayout>
      <section className="relative gradient-hero text-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-background/60">Our Menu</div>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">
            Welcome to a taste of home, where every bite tells a story.
          </h1>
          <p className="mt-4 max-w-3xl text-background/75">
            We take pride in serving signature African dishes that beautifully blend tradition with
            culinary innovation. Every item on our menu is designed to celebrate our rich cultural
            heritage through vibrant, unforgettable flavours. Enjoy an authentic experience crafted
            just for you.
          </p>
          <p className="mt-4 text-sm text-background/65">
            Add items to your cart, then place your pre-order. Payment happens at pickup.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-2">
        <div className="rounded-2xl bg-card p-6 shadow-card">
          <h2 className="font-display text-2xl">Catering &amp; Special Events</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We bring authentic taste to your special celebrations:
          </p>
          <p className="mt-4 font-semibold">
            Outdoor catering <span className="text-primary">•</span> Weddings
            <br />
            Birthday parties <span className="text-primary">•</span> Naming ceremonies
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Ask our team about custom event catering packages.
          </p>
        </div>
        <aside className="rounded-2xl border border-primary/30 bg-primary/5 p-6" role="note">
          <h2 className="font-display text-2xl">Food Allergy Notice</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            If you have a food allergy, intolerance, or dietary requirement, please inform a member
            of our team before placing your order.
          </p>
        </aside>
      </section>

      <div className="sticky top-16 z-30 glass border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex gap-2 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
                active === c
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-muted text-foreground/70 hover:bg-muted/70",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        {isLoading ? (
          <div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            role="status"
            aria-label="Loading menu items"
            aria-busy="true"
          >
            <span className="sr-only">Loading menu items…</span>
            {Array.from({ length: 6 }).map((_, i) => (
              <article
                key={i}
                aria-hidden="true"
                className="overflow-hidden rounded-2xl bg-card shadow-card animate-pulse"
              >
                <div className="aspect-[4/3] bg-muted" />
                <div className="space-y-4 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="h-5 w-2/3 rounded bg-muted" />
                    <div className="h-5 w-1/5 rounded bg-muted" />
                  </div>
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-10 w-full rounded-full bg-muted" />
                </div>
              </article>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-muted-foreground" role="alert">
            The menu could not be loaded. Please try again later.
          </div>
        ) : shown.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            The menu is being updated. Please check back soon.
          </div>
        ) : (
          <div className="space-y-12">
            {sections.map(({ category, items }) => (
              <section key={category} aria-label={category}>
                <h2 className="mb-5 border-b border-border pb-3 font-display text-2xl sm:text-3xl">
                  {category}
                </h2>
                <Reveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 reveal-stagger">
                  {items.map((food) => (
                    <FoodCard key={food.id} food={food} />
                  ))}
                </Reveal>
              </section>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="rounded-3xl gradient-hero p-6 text-background shadow-card sm:p-10">
          <h2 className="font-display text-3xl sm:text-4xl">Ready to order?</h2>
          <p className="mt-3 text-background/90">
            Enjoy delicious African ready meals by ABIS KITCHEN.
          </p>
          <p className="mt-1 text-background/75">
            Enjoy fresh African meals at your convenience with UK-wide delivery.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/447523817416"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-background px-5 py-3 font-semibold text-foreground transition hover:-translate-y-0.5"
            >
              <MessageCircle className="size-5" />
              Message us on WhatsApp to order
            </a>
            <a href="tel:+447523817416" className="inline-flex items-center gap-2 font-semibold">
              <Phone className="size-4" />
              07523 817416
            </a>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t border-background/20 pt-5 text-sm">
            <a
              href="https://facebook.com/Abiskitchen"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 hover:underline"
            >
              <Facebook className="size-4" /> Abiskitchen
            </a>
            <a
              href="https://instagram.com/abiskitchen35"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 hover:underline"
            >
              <Instagram className="size-4" /> @Abiskitchen35
            </a>
            <a
              href="https://tiktok.com/@abiskitchen35"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 hover:underline"
            >
              <Music2 className="size-4" /> @Abiskitchen35
            </a>
          </div>
          <p className="mt-8 font-display text-xl italic text-background/90">
            Nigerian flavours for everyday &amp; every occasion.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}

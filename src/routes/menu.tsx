import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
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
      { name: "description", content: "Browse our full menu: jollof rice, fried rice, peppered chicken, signature puff-puff, soups and drinks." },
      { property: "og:title", content: "Menu — Abi's Kitchen" },
      { property: "og:description", content: "Browse our menu of Nigerian rice dishes, specials, signature puff-puff, soups and drinks." },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { data: foods = [], isLoading } = useQuery(foodsQueryOptions());

  const categories = useMemo(() => {
    const set = new Set<string>(foods.map(f => f.category));
    const known = CATEGORY_ORDER.filter(c => set.has(c));
    const extra = [...set].filter(c => !known.includes(c as never));
    return ["All", ...known, ...extra];
  }, [foods]);

  const [active, setActive] = useState<string>("All");
  const shown = active === "All" ? foods : foods.filter(f => f.category === active);

  return (
    <SiteLayout>
      <section className="relative gradient-hero text-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-background/60">The Menu</div>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">A taste of home, cooked daily.</h1>
          <p className="mt-3 max-w-xl text-background/75">Add items to your cart, then place your pre-order. Payment happens at pickup.</p>
        </div>
      </section>

      <div className="sticky top-16 z-30 glass border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex gap-2 overflow-x-auto">
          {categories.map(c => (
            <button key={c} onClick={() => setActive(c)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
                active === c ? "bg-primary text-primary-foreground shadow-glow" : "bg-muted text-foreground/70 hover:bg-muted/70"
              )}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : shown.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No items in this category yet.</div>
        ) : (
          <Reveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 reveal-stagger">
            {shown.map(f => <FoodCard key={f.id} food={f} />)}
          </Reveal>
        )}
      </section>
    </SiteLayout>
  );
}
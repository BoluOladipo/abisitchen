import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChefHat, Clock, Leaf, Sparkles, Star } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { FoodCard } from "@/components/site/FoodCard";
import { Reveal } from "@/components/site/Reveal";
import { LandingIntro } from "@/components/site/LandingIntro";
import { DishOrbitHero } from "@/components/site/DishOrbitHero";
import type { Food } from "@/lib/foods";
import { foodsQueryOptions } from "@/lib/foodQueries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Abi's Kitchen — Authentic Nigerian Takeaway in the UK" },
      { name: "description", content: "Pre-order jollof, fried rice, peppered chicken and more for fast pickup. Where every bite tells a story." },
      { property: "og:title", content: "Abi's Kitchen — Authentic Nigerian Takeaway" },
      { property: "og:description", content: "Pre-order jollof, fried rice, peppered chicken and more for fast pickup." },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: allFoods = [] } = useQuery(foodsQueryOptions());
  const foods = allFoods.filter(food => food.is_available);

  const featured = [
    foods.find(f => f.name === "Smokey Jollof Rice"),
    foods.find(f => f.name === "Fried Rice"),
    foods.find(f => f.name === "Peppered Chicken"),
    foods.find(f => f.name === "Ayamase & White Rice"),
  ].filter(Boolean) as Food[];

  return (
    <SiteLayout>
      <LandingIntro />
      {/* HERO */}
      <DishOrbitHero foods={foods} />

      {/* FEATURED */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary">Crowd favourites</div>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">Most loved dishes</h2>
          </div>
          <Link to="/menu" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all">
            See full menu <ArrowRight className="size-4" />
          </Link>
        </div>
        <Reveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 reveal-stagger">
          {featured.map(f => <FoodCard key={f.id} food={f} />)}
        </Reveal>
      </section>

      {/* WHY US */}
      <section className="bg-muted/40 border-y border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs uppercase tracking-[0.2em] text-primary">Why Abis</div>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">Cooked with care, ready with speed</h2>
          </div>
          <Reveal className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 reveal-stagger">
            {[
              { icon: Leaf, title: "Fresh ingredients", text: "Sourced locally, prepared in small batches every day." },
              { icon: Clock, title: "Fast preparation", text: "Pre-order ahead and your meal is hot when you arrive." },
              { icon: ChefHat, title: "Authentic recipes", text: "Family recipes from generations of Nigerian cooks." },
              { icon: Sparkles, title: "Convenient pickup", text: "Pick your slot — pay simply at the counter on collection." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl bg-card p-6 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all">
                <div className="inline-flex items-center justify-center size-12 rounded-xl gradient-warm text-brand-deep shadow-glow">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-display text-xl">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-[0.2em] text-primary">Reviews</div>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">What our customers say</h2>
        </div>
        <Reveal className="grid md:grid-cols-3 gap-6 reveal-stagger">
          {[
            { name: "Chiamaka O.", text: "The jollof took me straight back to Lagos. Best I've had in the UK — easily." },
            { name: "James W.", text: "Pre-ordered for a family pickup. Hot, packed beautifully, ready on the dot. 10/10." },
            { name: "Aisha B.", text: "Peppered chicken is unreal. Will be back every weekend, no question." },
          ].map(t => (
            <figure key={t.name} className="rounded-2xl bg-card p-6 shadow-soft">
              <div className="flex gap-0.5 text-primary mb-3">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-4 fill-primary" />)}
              </div>
              <blockquote className="text-foreground/85">"{t.text}"</blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">— {t.name}</figcaption>
            </figure>
          ))}
        </Reveal>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <Reveal className="cta-reveal">
        <div className="cta-motion relative overflow-hidden rounded-3xl gradient-warm p-10 sm:p-14 text-brand-deep shadow-glow">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_top_right,white,transparent_60%)]" />
          <div className="relative grid md:grid-cols-[1fr_auto] items-center gap-6">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl">Skip the queue. Pre-order in 60 seconds.</h2>
              <p className="mt-3 max-w-xl text-brand-deep/80">Pick your dishes, choose a pickup time, pay when you arrive. Easy.</p>
            </div>
            <Link to="/menu" className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground hover:translate-y-[-2px] transition shadow-card">
              Browse menu <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}

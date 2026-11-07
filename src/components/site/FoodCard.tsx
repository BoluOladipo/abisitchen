import { Plus } from "lucide-react";
import { type Food, formatGBP, imageFor } from "@/lib/foods";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export function FoodCard({ food }: { food: Food }) {
  const { add } = useCart();
  const oos = !food.is_available;

  return (
    <article className="food-card group relative overflow-hidden rounded-2xl bg-card shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-glow">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={imageFor(food.name, food.image_url)}
          alt={food.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {oos && (
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-[2px] flex items-center justify-center">
            <span className="rounded-full bg-destructive px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-destructive-foreground">
              Out of Stock
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3 rounded-full bg-background/90 backdrop-blur px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/70">
          {food.category}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-tight">{food.name}</h3>
          <div className="font-display text-lg text-primary whitespace-nowrap">{formatGBP(food.price)}</div>
        </div>
        {food.description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{food.description}</p>
        )}
        <button
          disabled={oos}
          onClick={() => {
            add({ id: food.id, name: food.name, price: Number(food.price) });
            toast.success(`${food.name} added to cart`);
          }}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground transition hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-secondary disabled:hover:text-secondary-foreground"
        >
          <Plus className="size-4" /> {oos ? "Unavailable" : "Add to order"}
        </button>
      </div>
    </article>
  );
}
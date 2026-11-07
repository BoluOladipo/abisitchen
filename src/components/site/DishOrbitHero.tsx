import { useMemo, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { type Food, formatGBP, imageFor } from "@/lib/foods";
import { useCart } from "@/lib/cart";

const CATEGORY_LABELS: Record<string, string> = {
  "Rice Dishes & Mains": "Rice & Mains",
  "Protein & Specials": "Specials",
  "ABIS Signature Puff-Puff": "Puff-Puff",
  "Classic Soups & Swallow (Okele)": "Soups",
  "Starters & Nibbles": "Starters",
  Sides: "Sides",
  Drinks: "Drinks",
};

const FEATURED_DISH_NAMES = [
  "Smokey Jollof Rice",
  "Egusi Soup & Pounded Yam",
  "Peppered Chicken",
  "Ayamase & White Rice",
  "Puff-puff (4pcs)",
];

export function DishOrbitHero({ foods }: { foods: Food[] }) {
  const { add } = useCart();
  const dishes = useMemo(() => {
    const featured = FEATURED_DISH_NAMES
      .map(name => foods.find(food => food.name === name && food.is_available))
      .filter((food): food is Food => Boolean(food));
    const remaining = foods.filter(food => food.is_available && !featured.some(item => item.id === food.id));
    return [...featured, ...remaining];
  }, [foods]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIndex = Math.max(0, dishes.findIndex(dish => dish.id === activeId));
  const activeDish = dishes[activeIndex];
  const orbitDishes = dishes.length > 1
    ? Array.from({ length: Math.min(5, dishes.length - 1) }, (_, index) => dishes[(activeIndex + index + 1) % dishes.length])
    : [];
  const categories = [...new Set(dishes.map(dish => dish.category))];

  function move(direction: -1 | 1) {
    if (dishes.length < 2) return;
    const nextIndex = (activeIndex + direction + dishes.length) % dishes.length;
    setActiveId(dishes[nextIndex].id);
  }

  if (!activeDish) {
    return (
      <section className="dish-hero">
        <div className="dish-hero-loading">
          <span className="dish-loading-mark" />
          <span>Preparing something delicious…</span>
        </div>
      </section>
    );
  }

  return (
    <section className="dish-hero">
      <div className="dish-hero-backdrop" aria-hidden="true" />
      <div className="dish-hero-inner">
        <div className="dish-hero-topline">
          <div className="dish-hero-edition"><span>AK</span> THE HOUSE MENU <i /> VOL. 01</div>
          <div className="dish-category-nav" aria-label="Browse menu categories">
            {categories.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  const item = dishes.find(dish => dish.category === category);
                  if (item) setActiveId(item.id);
                }}
                className={activeDish.category === category ? "is-active" : ""}
              >
                {CATEGORY_LABELS[category] ?? category}
              </button>
            ))}
          </div>
          <Link to="/cart" className="dish-bag-link" aria-label="Open your order">
            <span className="dish-bag-icon"><span /></span>
            <span>YOUR ORDER</span>
          </Link>
        </div>

        <div className="dish-hero-layout">
          <div className="dish-copy" key={activeDish.id}>
            <div className="dish-number"><span>FEATURED DISH</span><i /> {String(activeIndex + 1).padStart(2, "0")}</div>
            <div className="dish-price">{formatGBP(activeDish.price)}</div>
            <h1>{activeDish.name}</h1>
            <p>
              {activeDish.description ||
                "A much-loved taste of Nigeria, freshly prepared with bold, comforting flavour."}
            </p>
            <button
              type="button"
              className="dish-add-button"
              onClick={() => {
                add({ id: activeDish.id, name: activeDish.name, price: Number(activeDish.price) });
                toast.success(`${activeDish.name} added to cart`);
              }}
            >
              Add to your order <Plus size={16} />
            </button>
            <div className="dish-copy-footer">
              <Link to="/menu">EXPLORE FULL MENU <ArrowRight size={13} /></Link>
              <span>MADE FRESH. MADE WITH LOVE.</span>
            </div>
          </div>

          <div className="dish-art" aria-label={`Featured dish: ${activeDish.name}`}>
            <div className="dish-art-halo" />
            <div className="dish-art-crosshair" />
            <div className="dish-orbit dish-orbit-outer" />
            <div className="dish-orbit dish-orbit-inner" />
            <div className="dish-center-plate" key={activeDish.id}>
              <img src={imageFor(activeDish.name, activeDish.image_url)} alt={activeDish.name} />
              <span className="dish-plate-index">{String(activeIndex + 1).padStart(2, "0")}</span>
            </div>
            <div className="dish-orbit-items">
              {orbitDishes.map((dish, index) => (
                <button
                  type="button"
                  className={`dish-orbit-item dish-orbit-item-${index + 1}`}
                  key={dish.id}
                  style={{ "--dish-index": index } as CSSProperties}
                  onClick={() => setActiveId(dish.id)}
                  aria-label={`View ${dish.name}`}
                >
                  <img src={imageFor(dish.name, dish.image_url)} alt="" />
                  <span>{dish.name}</span>
                </button>
              ))}
            </div>
            <div className="dish-orbit-caption"><span /> ABIS KITCHEN · SIGNATURE SELECTION</div>
          </div>
        </div>

        <div className="dish-hero-bottom">
          <div className="dish-scroll-cue"><ArrowDown size={14} /> SCROLL TO EXPLORE</div>
          <div className="dish-pagination">
            <span>{String(activeIndex + 1).padStart(2, "0")}</span>
            <i />
            <span>{String(dishes.length).padStart(2, "0")}</span>
          </div>
          <div className="dish-controls">
            <button type="button" onClick={() => move(-1)} aria-label="Previous dish"><ArrowLeft size={17} /></button>
            <button type="button" onClick={() => move(1)} aria-label="Next dish"><ArrowRight size={17} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

import jollof from "@/assets/jollof rice.jpg";
import friedRice from "@/assets/fried rice.jpg";
import whiteRice from "@/assets/r&s.jpg";
import plantain from "@/assets/plantain.jpg";
import puffpuff from "@/assets/food-puffpuff.jpg";
import meatpie from "@/assets/meat pie.jpg";
import beef from "@/assets/beef stew.jpg";
import mackerel from "@/assets/makerel.jpg";
import pepperChicken from "@/assets/chicken.jpg";
import pepperTurkey from "@/assets/turkey.jpg";
import coke from "@/assets/coke2.jpeg";
import fanta from "@/assets/fanta2.jpg";
import water from "@/assets/water.jpg";
import malt from "@/assets/malta guiness.jpg";
import supermalt from "@/assets/supermalt.jpg";
import egusiSoup from "@/assets/egusi soup & pounded yam.jpg";

export const FOOD_IMAGE: Record<string, string> = {
  "Smokey Jollof Rice": jollof,
  "Fried Rice": friedRice,
  "White Rice & Stew": whiteRice,
  "Ayamase & White Rice": whiteRice,
  "Fried Yam & Sauce": plantain,
  "Plantain (3pcs)": plantain,
  "Puff-puff (4pcs)": puffpuff,
  "Chocolate Puff-puff (4pcs)": puffpuff,
  "Cookies + Milk Chocolate Puff-Puff": puffpuff,
  "Meat Pie": meatpie,
  "Fried Beef": beef,
  "Goat Meat": beef,
  "Egusi Soup & Pounded Yam": egusiSoup,
  "Fish": mackerel,
  "Peppered Chicken": pepperChicken,
  "Peppered Turkey": pepperTurkey,
  "Spicy Chili Asun": pepperTurkey,
  "Nigerian Coke": coke,
  "Nigerian Fanta": fanta,
  "Bottled Water — Small": water,
  "Bottled Water — Large": water,
  "Malta Guinness": malt,
  "Maltina": supermalt,
};

export function imageFor(name: string, fallback?: string | null): string {
  return fallback || FOOD_IMAGE[name] || jollof;
}

export const CATEGORY_ORDER = [
  "Starters & Nibbles",
  "ABIS Signature Puff-Puff",
  "Protein & Specials",
  "Rice Dishes & Mains",
  "Sides",
  "Classic Soups & Swallow (Okele)",
  "Drinks",
] as const;
export type Category = (typeof CATEGORY_ORDER)[number] | string;

export interface Food {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
}

const CATEGORY_INDEX = new Map<string, number>(
  CATEGORY_ORDER.map((category, index): [string, number] => [category, index])
);

export function sortFoodsByMenuOrder(foods: Food[]): Food[] {
  return [...foods].sort((a, b) => {
    const categoryDifference =
      (CATEGORY_INDEX.get(a.category) ?? CATEGORY_ORDER.length) -
      (CATEGORY_INDEX.get(b.category) ?? CATEGORY_ORDER.length);
    if (categoryDifference !== 0) return categoryDifference;
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.sort_order - b.sort_order;
  });
}

export function formatGBP(amount: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(amount);
}

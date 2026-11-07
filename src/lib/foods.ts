import jollof from "@/assets/jollof rice.jpg";
import friedRice from "@/assets/fried rice.jpg";
import whiteRice from "@/assets/r&s.jpg";
import plantain from "@/assets/plantain.jpg";
import puffpuff from "@/assets/food-puffpuff.jpg";
import meatpie from "@/assets/meat pie.jpg";
import mackerel from "@/assets/makerel.jpg";
import pepperChicken from "@/assets/chicken.jpg";
import pepperTurkey from "@/assets/turkey.jpg";
import coke from "@/assets/coke2.jpeg";
import fanta from "@/assets/fanta2.jpg";
import water from "@/assets/water.jpg";
import malt from "@/assets/malta guiness.jpg";
import egusiSoup from "@/assets/egusi soup & pounded yam.jpg";
import brandMark from "@/assets/brand-mark.jpg";

export const FOOD_IMAGE: Record<string, string> = {
  "Smokey Jollof Rice": jollof,
  "Fried Rice": friedRice,
  "White Rice & Stew": whiteRice,
  "Ayamase & White Rice": brandMark,
  "Fried Yam & Sauce": brandMark,
  "Plantain (3pcs)": plantain,
  "Puff-puff (4pcs)": puffpuff,
  "Chocolate Puff-puff (4pcs)": brandMark,
  "Cookies + Milk Chocolate Puff-Puff": brandMark,
  "Meat Pie": meatpie,
  "Fried Beef": brandMark,
  "Goat Meat": brandMark,
  "Egusi Soup & Pounded Yam": egusiSoup,
  Fish: mackerel,
  "Peppered Chicken": pepperChicken,
  "Peppered Turkey": pepperTurkey,
  "Spicy Chili Asun": brandMark,
  "Nigerian Coke": coke,
  "Nigerian Fanta": fanta,
  "Bottled Water — Small": water,
  "Bottled Water — Large": water,
  "Malta Guinness": malt,
  Maltina: brandMark,
};

function normalizeFoodName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function imageFor(name: string, fallback?: string | null): string {
  const normalizedName = normalizeFoodName(name);
  const mappedImage = Object.entries(FOOD_IMAGE).find(
    ([foodName]) => normalizeFoodName(foodName) === normalizedName,
  )?.[1];

  if (normalizedName.startsWith("bottledwater") || normalizedName.startsWith("bottlewater")) {
    return water;
  }

  return mappedImage ?? fallback ?? brandMark;
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

const MENU_ITEM_ORDER = new Map(
  [
    "Meat Pie",
    "Puff-puff (4pcs)",
    "Chocolate Puff-puff (4pcs)",
    "Cookies + Milk Chocolate Puff-Puff",
    "Peppered Chicken",
    "Peppered Turkey",
    "Goat Meat",
    "Spicy Chili Asun",
    "Fish",
    "Smokey Jollof Rice",
    "Fried Rice",
    "White Rice & Stew",
    "Ayamase & White Rice",
    "Fried Yam & Sauce",
    "Plantain (3pcs)",
    "Fried Beef",
    "Egusi Soup & Pounded Yam",
    "Nigerian Coke",
    "Nigerian Fanta",
    "Malta Guinness",
    "Maltina",
    "Bottled Water — Small",
    "Bottled Water — Large",
  ].map((name, index) => [normalizeFoodName(name), index]),
);

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
  CATEGORY_ORDER.map((category, index): [string, number] => [category, index]),
);

export function sortFoodsByMenuOrder(foods: Food[]): Food[] {
  return [...foods].sort((a, b) => {
    const categoryDifference =
      (CATEGORY_INDEX.get(a.category) ?? CATEGORY_ORDER.length) -
      (CATEGORY_INDEX.get(b.category) ?? CATEGORY_ORDER.length);
    if (categoryDifference !== 0) return categoryDifference;
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    const menuOrderA = MENU_ITEM_ORDER.get(normalizeFoodName(a.name));
    const menuOrderB = MENU_ITEM_ORDER.get(normalizeFoodName(b.name));
    if (menuOrderA !== undefined && menuOrderB !== undefined) {
      return menuOrderA - menuOrderB;
    }
    if (menuOrderA !== undefined) return -1;
    if (menuOrderB !== undefined) return 1;
    return a.sort_order - b.sort_order;
  });
}

export function formatGBP(amount: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(amount);
}

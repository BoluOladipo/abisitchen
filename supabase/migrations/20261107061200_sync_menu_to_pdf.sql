BEGIN;

CREATE TEMP TABLE pdf_menu_catalog (
  name text PRIMARY KEY,
  description text,
  price numeric(10, 2) NOT NULL,
  category text NOT NULL,
  sort_order integer NOT NULL,
  aliases text[] NOT NULL
) ON COMMIT DROP;

INSERT INTO pdf_menu_catalog (name, description, price, category, sort_order, aliases) VALUES
  ('Meat pie', NULL, 2.50, 'Starters & Nibbles', 1, ARRAY['meatpie']),
  ('Puff-puff (4pcs)', NULL, 1.00, 'ABIS Signature Puff-Puff', 1, ARRAY['puffpuff4pcs', 'puffpuff4']),
  ('Chocolate Puff-puff (4pcs)', NULL, 2.50, 'ABIS Signature Puff-Puff', 2, ARRAY['chocolatepuffpuff4pcs']),
  ('Cookies + Milk Chocolate Puff-Puff', NULL, 2.50, 'ABIS Signature Puff-Puff', 3, ARRAY['cookiesmilkchocolatepuffpuff']),
  ('Peppered Chicken', NULL, 4.00, 'Protein & Specials', 1, ARRAY['pepperedchicken', 'pepperchicken']),
  ('Peppered Turkey', NULL, 5.00, 'Protein & Specials', 2, ARRAY['pepperedturkey', 'pepperturkey']),
  ('Goat meat', NULL, 5.00, 'Protein & Specials', 3, ARRAY['goatmeat']),
  ('Spicy Chili Asun', NULL, 8.00, 'Protein & Specials', 4, ARRAY['spicychiliasun']),
  ('Fish', NULL, 5.00, 'Protein & Specials', 5, ARRAY['fish', 'mackerel']),
  ('Smokey Jollof rice', NULL, 7.00, 'Rice Dishes & Mains', 1, ARRAY['smokeyjollofrice', 'jollofrice']),
  ('Fried Rice', NULL, 8.00, 'Rice Dishes & Mains', 2, ARRAY['friedrice']),
  ('White Rice & Stew', 'Plain rice served with meat or fried fish.', 12.00, 'Rice Dishes & Mains', 3, ARRAY['whitericestew']),
  ('Ayamase & White Rice', 'Designer stew made with spicy blended green peppers, assorted meat and boiled egg.', 15.00, 'Rice Dishes & Mains', 4, ARRAY['ayamasewhiterice']),
  ('Fried Yam & Sauce', NULL, 7.00, 'Rice Dishes & Mains', 5, ARRAY['friedyamsauce']),
  ('Plantain (3pcs)', NULL, 1.00, 'Sides', 1, ARRAY['plantain3pcs', 'plantain4', 'plantain']),
  ('Fried Beef', NULL, 5.00, 'Sides', 2, ARRAY['friedbeef', 'beef']),
  ('Egusi Soup & Pounded Yam', 'Ground melon seed soup with spinach & spice.', 10.00, 'Classic Soups & Swallow (Okele)', 1, ARRAY['egusisouppoundedyam']),
  ('Nigerian Coke', NULL, 2.50, 'Drinks', 1, ARRAY['nigeriancoke']),
  ('Nigerian Fanta', NULL, 3.00, 'Drinks', 2, ARRAY['nigerianfanta']),
  ('Malta Guinness', NULL, 2.50, 'Drinks', 3, ARRAY['maltaguinness']),
  ('Maltina', NULL, 2.50, 'Drinks', 4, ARRAY['maltina']),
  ('Bottled Water — Small', NULL, 1.50, 'Drinks', 5, ARRAY['bottledwatersmall', 'bottlewatersmall', 'water']),
  ('Bottled Water — Large', NULL, 3.00, 'Drinks', 6, ARRAY['bottledwaterlarge', 'bottlewaterlarge']);

WITH duplicate_foods AS (
  SELECT
    foods.id,
    row_number() OVER (PARTITION BY catalog.name ORDER BY foods.created_at, foods.id) AS duplicate_number
  FROM public.foods AS foods
  JOIN pdf_menu_catalog AS catalog
    ON regexp_replace(lower(foods.name), '[^a-z0-9]', '', 'g') = ANY(catalog.aliases)
)
DELETE FROM public.foods AS foods
USING duplicate_foods
WHERE foods.id = duplicate_foods.id
  AND duplicate_foods.duplicate_number > 1;

UPDATE public.foods AS foods
SET
  name = catalog.name,
  description = catalog.description,
  price = catalog.price,
  category = catalog.category,
  sort_order = catalog.sort_order
FROM pdf_menu_catalog AS catalog
WHERE regexp_replace(lower(foods.name), '[^a-z0-9]', '', 'g') = ANY(catalog.aliases);

INSERT INTO public.foods (name, description, price, category, sort_order)
SELECT catalog.name, catalog.description, catalog.price, catalog.category, catalog.sort_order
FROM pdf_menu_catalog AS catalog
WHERE NOT EXISTS (
  SELECT 1
  FROM public.foods AS foods
  WHERE regexp_replace(lower(foods.name), '[^a-z0-9]', '', 'g') = ANY(catalog.aliases)
);

DELETE FROM public.foods AS foods
WHERE NOT EXISTS (
  SELECT 1
  FROM pdf_menu_catalog AS catalog
  WHERE regexp_replace(lower(foods.name), '[^a-z0-9]', '', 'g') = ANY(catalog.aliases)
);

DO $$
BEGIN
  IF (SELECT count(*) FROM public.foods) <> 23 THEN
    RAISE EXCEPTION 'Menu sync must leave exactly 23 PDF items';
  END IF;
END;
$$;

COMMIT;

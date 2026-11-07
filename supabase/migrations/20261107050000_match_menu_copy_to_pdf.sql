BEGIN;

UPDATE public.foods
SET name = 'Meat pie'
WHERE name IN ('Meat Pie', 'Meat pie');

UPDATE public.foods
SET name = 'Goat meat'
WHERE name IN ('Goat Meat', 'Goat meat');

UPDATE public.foods
SET name = 'Smokey Jollof rice'
WHERE name IN ('Smokey Jollof Rice', 'Smokey Jollof rice');

UPDATE public.foods
SET description = 'Ground melon seed soup with spinach & spice.'
WHERE name = 'Egusi Soup & Pounded Yam';

COMMIT;

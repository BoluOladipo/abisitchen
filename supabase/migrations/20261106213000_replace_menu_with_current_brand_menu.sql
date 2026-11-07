BEGIN;

DELETE FROM public.foods;

INSERT INTO public.foods (name, description, price, category, sort_order) VALUES
  ('Meat Pie', NULL, 2.50, 'Starters & Nibbles', 1),
  ('Puff-puff (4pcs)', NULL, 1.00, 'ABIS Signature Puff-Puff', 1),
  ('Chocolate Puff-puff (4pcs)', NULL, 2.50, 'ABIS Signature Puff-Puff', 2),
  ('Cookies + Milk Chocolate Puff-Puff', NULL, 2.50, 'ABIS Signature Puff-Puff', 3),
  ('Peppered Chicken', NULL, 4.00, 'Protein & Specials', 1),
  ('Peppered Turkey', NULL, 5.00, 'Protein & Specials', 2),
  ('Goat Meat', NULL, 5.00, 'Protein & Specials', 3),
  ('Spicy Chili Asun', NULL, 8.00, 'Protein & Specials', 4),
  ('Fish', NULL, 5.00, 'Protein & Specials', 5),
  ('Smokey Jollof Rice', NULL, 7.00, 'Rice Dishes & Mains', 1),
  ('Fried Rice', NULL, 8.00, 'Rice Dishes & Mains', 2),
  ('White Rice & Stew', 'Plain rice served with meat or fried fish.', 12.00, 'Rice Dishes & Mains', 3),
  ('Ayamase & White Rice', 'Designer stew made with spicy blended green peppers, assorted meat and boiled egg.', 15.00, 'Rice Dishes & Mains', 4),
  ('Fried Yam & Sauce', NULL, 7.00, 'Rice Dishes & Mains', 5),
  ('Plantain (3pcs)', NULL, 1.00, 'Sides', 1),
  ('Fried Beef', NULL, 5.00, 'Sides', 2),
  ('Egusi Soup & Pounded Yam', 'Ground melon seed soup with spinach and spice.', 10.00, 'Classic Soups & Swallow (Okele)', 1),
  ('Nigerian Coke', NULL, 2.50, 'Drinks', 1),
  ('Nigerian Fanta', NULL, 3.00, 'Drinks', 2),
  ('Malta Guinness', NULL, 2.50, 'Drinks', 3),
  ('Maltina', NULL, 2.50, 'Drinks', 4),
  ('Bottled Water — Small', NULL, 1.50, 'Drinks', 5),
  ('Bottled Water — Large', NULL, 3.00, 'Drinks', 6);

COMMIT;

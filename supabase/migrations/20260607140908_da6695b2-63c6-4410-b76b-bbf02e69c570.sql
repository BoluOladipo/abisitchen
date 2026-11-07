
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

-- Foods
CREATE TABLE public.foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  image_url text,
  is_available boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.foods TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.foods TO authenticated;
GRANT ALL ON public.foods TO service_role;
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view foods" ON public.foods FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage foods" ON public.foods FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Orders
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  pickup_date date NOT NULL,
  pickup_time text NOT NULL,
  notes text,
  total numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','ready','completed','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.orders TO anon, authenticated;
GRANT UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can view by order_number lookup" ON public.orders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete orders" ON public.orders FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Order items
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  food_id uuid REFERENCES public.foods(id) ON DELETE SET NULL,
  name text NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  quantity int NOT NULL CHECK (quantity > 0),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.order_items TO anon, authenticated;
GRANT UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create order items" ON public.order_items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can view order items" ON public.order_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage order items" ON public.order_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER foods_touch BEFORE UPDATE ON public.foods FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER orders_touch BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed menu
INSERT INTO public.foods (name, description, price, category, sort_order) VALUES
('Plantain (4)', 'Sweet ripe plantain, golden-fried in small batches.', 1.00, 'Appetisers', 1),
('Puff Puff (4)', 'Soft, fluffy Nigerian doughnuts dusted to perfection.', 1.00, 'Appetisers', 2),
('Meat Pie', 'Flaky pastry filled with seasoned beef, potato and carrots.', 2.50, 'Appetisers', 3),
('Beef', 'Tender, well-spiced Nigerian-style beef.', 2.00, 'Appetisers', 4),
('Mackerel', 'Grilled mackerel with peppered seasoning.', 3.00, 'Appetisers', 5),
('Pepper Chicken', 'Smoky chicken tossed in our signature pepper sauce.', 4.00, 'Appetisers', 6),
('Pepper Turkey', 'Juicy turkey in rich, fiery pepper sauce.', 5.00, 'Appetisers', 7),
('Jollof Rice', 'Smoky party-style jollof, slow-cooked in tomato and pepper.', 6.00, 'Rice', 1),
('Fried Rice', 'Nigerian fried rice with mixed vegetables and curry notes.', 6.00, 'Rice', 2),
('White Rice & Stew', 'Fluffy white rice paired with rich tomato stew.', 7.00, 'Rice', 3),
('Water', 'Still mineral water (500ml).', 1.00, 'Drinks', 1),
('Nigerian Coke', 'Classic Nigerian-bottled Coca-Cola.', 1.50, 'Drinks', 2),
('Nigerian Fanta', 'Bright, citrus Nigerian Fanta.', 1.50, 'Drinks', 3),
('Malta Guinness', 'Rich, malty non-alcoholic Guinness malt.', 2.50, 'Drinks', 4),
('Supermalt', 'Premium malt drink, smooth and full-bodied.', 2.50, 'Drinks', 5);

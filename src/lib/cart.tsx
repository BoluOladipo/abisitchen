import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

interface CartCtx {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "abis-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const value = useMemo<CartCtx>(() => ({
    items,
    add: (it, qty = 1) => setItems(prev => {
      const found = prev.find(p => p.id === it.id);
      if (found) return prev.map(p => p.id === it.id ? { ...p, quantity: p.quantity + qty } : p);
      return [...prev, { ...it, quantity: qty }];
    }),
    remove: id => setItems(prev => prev.filter(p => p.id !== id)),
    setQty: (id, qty) => setItems(prev => qty <= 0
      ? prev.filter(p => p.id !== id)
      : prev.map(p => p.id === id ? { ...p, quantity: qty } : p)),
    clear: () => setItems([]),
    total: items.reduce((s, p) => s + p.price * p.quantity, 0),
    count: items.reduce((s, p) => s + p.quantity, 0),
  }), [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used within CartProvider");
  return v;
}
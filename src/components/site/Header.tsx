import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.jpeg";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const path = useRouterState({ select: s => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src={logo} alt="Abi's Kitchen — Nigerian flavours for every day and every occasion" className="h-14 w-40 object-contain transition group-hover:opacity-90" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map(l => (
            <Link key={l.to} to={l.to}
              className={cn(
                "nav-link px-3 py-2 text-sm font-medium rounded-md transition-colors hover:text-primary",
                path === l.to ? "text-primary is-active" : "text-foreground/80"
              )}>
              {l.label}
            </Link>
          ))}
          <Link to="/cart" className="ml-2 relative inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow hover:translate-y-[-1px] transition">
            <ShoppingBag className="size-4" /> Cart
            {count > 0 && <span className="ml-1 rounded-full bg-background/20 px-2 text-xs">{count}</span>}
          </Link>
        </nav>

        <button className="md:hidden p-2 rounded-md hover:bg-muted" onClick={() => setOpen(o => !o)} aria-label="Menu">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur animate-float-up">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-1">
            {LINKS.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className={cn("px-3 py-3 rounded-md text-base", path === l.to ? "bg-muted text-primary" : "hover:bg-muted")}>
                {l.label}
              </Link>
            ))}
            <Link to="/cart" onClick={() => setOpen(false)} className="mt-1 inline-flex items-center justify-between rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground">
              <span className="inline-flex items-center gap-2"><ShoppingBag className="size-4" /> View Cart</span>
              {count > 0 && <span className="rounded-full bg-background/20 px-2 text-xs">{count}</span>}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
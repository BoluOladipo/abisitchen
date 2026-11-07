import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { ClipboardList, LayoutDashboard, LogOut, UtensilsCrossed } from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import logo from "@/assets/brand-mark.jpg";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Abi's Kitchen" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const NAV: { to: string; label: string; icon: any; end?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
];

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const path = useRouterState({ select: s => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [loading, user, nav]);

  if (loading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="rounded-3xl bg-card shadow-card p-8 max-w-md text-center">
          <h1 className="font-display text-2xl">Not authorised</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account ({user.email}) doesn't have admin access yet. Ask the owner to grant the <code className="px-1.5 py-0.5 rounded bg-muted text-xs">admin</code> role from the database.
          </p>
          <div className="mt-5 flex gap-2 justify-center">
            <button onClick={async () => {
              const { data, error } = await supabase.rpc("claim_admin_if_empty");
              if (error) return alert(error.message);
              if (data) { alert("You are now the admin! Reloading…"); window.location.reload(); }
              else alert("An admin already exists. Ask them to grant you access.");
            }} className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
              Claim admin (first owner)
            </button>
            <button onClick={() => supabase.auth.signOut().then(() => nav({ to: "/auth" }))} className="rounded-full bg-secondary px-5 py-2 text-sm text-secondary-foreground">Sign out</button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">"Claim admin" only works once, before any admin exists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-30 glass border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="" className="size-9 rounded-full" />
            <div className="font-display text-lg">Abi's Kitchen <span className="text-muted-foreground text-sm">/ Admin</span></div>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(n => {
              const active = n.end ? path === n.to : path.startsWith(n.to);
              return (
                <Link key={n.to} to={n.to as any} className={cn("inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm", active ? "bg-primary/10 text-primary" : "hover:bg-muted")}>
                  <n.icon className="size-4" /> {n.label}
                </Link>
              );
            })}
          </nav>
          <button onClick={() => supabase.auth.signOut().then(() => nav({ to: "/auth" }))} className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-secondary-foreground">
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
        <nav className="md:hidden border-t border-border bg-background/80 px-4 py-2 flex gap-2 overflow-x-auto">
          {NAV.map(n => {
            const active = n.end ? path === n.to : path.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to as any} className={cn("shrink-0 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm", active ? "bg-primary/10 text-primary" : "hover:bg-muted")}>
                <n.icon className="size-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8"><Outlet /></main>
    </div>
  );
}
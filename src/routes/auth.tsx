import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site/SiteLayout";
import logo from "@/assets/brand-mark.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin Sign in — Abi's Kitchen" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in");
        nav({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. You can now sign in.");
        setMode("in");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Authentication failed");
    } finally { setLoading(false); }
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-md px-4 sm:px-6 py-16">
        <div className="rounded-3xl bg-card shadow-card p-8">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="size-12 rounded-full" />
            <div>
              <div className="font-display text-2xl">Admin</div>
              <div className="text-xs text-muted-foreground">Abi's Kitchen dashboard</div>
            </div>
          </div>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Email</div>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input" />
            </label>
            <label className="block">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Password</div>
              <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="input" />
            </label>
            <button disabled={loading} className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60">
              {loading ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}
            </button>
          </form>
          <button onClick={() => setMode(m => m === "in" ? "up" : "in")} className="mt-4 text-xs text-muted-foreground hover:text-primary">
            {mode === "in" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
          <p className="mt-4 text-xs text-muted-foreground">
            New admins: sign up, then ask the owner to grant the admin role from the database.
          </p>
        </div>
      </section>
      <style>{`.input { width: 100%; padding: 0.625rem 0.875rem; border-radius: 0.625rem; border: 1px solid var(--color-border); background: var(--color-background); font-size: 0.875rem; outline: none; }
      .input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 25%, transparent); }`}</style>
    </SiteLayout>
  );
}
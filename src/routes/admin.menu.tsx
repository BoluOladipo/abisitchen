import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Pencil, Plus, Trash2, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORY_ORDER, formatGBP, imageFor, sortFoodsByMenuOrder, type Food } from "@/lib/foods";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/menu")({ component: MenuAdmin });

interface Draft { id?: string; name: string; description: string; price: string; category: string; image_url: string; is_available: boolean; sort_order: number }
const EMPTY: Draft = { name: "", description: "", price: "", category: CATEGORY_ORDER[0], image_url: "", is_available: true, sort_order: 0 };

function MenuAdmin() {
  const qc = useQueryClient();
  const [edit, setEdit] = useState<Draft | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    if (!edit) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be under 5MB");
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("food-images").upload(path, file, { upsert: false, contentType: file.type });
      if (error) throw error;
      const { data } = supabase.storage.from("food-images").getPublicUrl(path);
      setEdit({ ...edit, image_url: data.publicUrl });
      toast.success("Image uploaded");
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const { data: foods = [] } = useQuery({
    queryKey: ["admin-foods"],
    queryFn: async () => {
      const { data, error } = await supabase.from("foods").select("*").order("sort_order");
      if (error) throw error;
      return sortFoodsByMenuOrder(data as Food[]);
    },
  });

  async function save() {
    if (!edit) return;
    const price = Number(edit.price);
    if (!edit.name.trim() || !edit.category.trim() || isNaN(price) || price < 0) return toast.error("Fill all required fields");
    const payload = {
      name: edit.name.trim(), description: edit.description.trim() || null,
      price, category: edit.category.trim(),
      image_url: edit.image_url.trim() || null,
      is_available: edit.is_available, sort_order: edit.sort_order || 0,
    };
    const op = edit.id
      ? await supabase.from("foods").update(payload).eq("id", edit.id)
      : await supabase.from("foods").insert(payload);
    if (op.error) return toast.error(op.error.message);
    toast.success("Saved");
    setEdit(null);
    qc.invalidateQueries({ queryKey: ["admin-foods"] });
    qc.invalidateQueries({ queryKey: ["foods"] });
    qc.invalidateQueries({ queryKey: ["foods", "featured"] });
  }

  async function toggle(f: Food) {
    const { error } = await supabase.from("foods").update({ is_available: !f.is_available }).eq("id", f.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-foods"] });
    qc.invalidateQueries({ queryKey: ["foods"] });
  }

  async function del(id: string) {
    if (!confirm("Delete this menu item?")) return;
    const { error } = await supabase.from("foods").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-foods"] });
    qc.invalidateQueries({ queryKey: ["foods"] });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-3xl">Menu</h1>
        <button onClick={() => setEdit({ ...EMPTY })} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
          <Plus className="size-4" /> Add item
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {foods.map(f => (
          <div key={f.id} className="rounded-2xl bg-card shadow-soft overflow-hidden">
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img src={imageFor(f.name, f.image_url)} alt={f.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs text-muted-foreground">{f.category}</div>
                  <div className="font-display text-lg">{f.name}</div>
                </div>
                <div className="font-display text-lg text-primary">{formatGBP(Number(f.price))}</div>
              </div>
              <label className="mt-3 inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={f.is_available} onChange={() => toggle(f)} />
                <span>{f.is_available ? "Available" : "Out of stock"}</span>
              </label>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setEdit({
                  id: f.id, name: f.name, description: f.description ?? "", price: String(f.price),
                  category: f.category, image_url: f.image_url ?? "", is_available: f.is_available, sort_order: f.sort_order,
                })} className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs text-secondary-foreground"><Pencil className="size-3" /> Edit</button>
                <button onClick={() => del(f.id)} className="inline-flex items-center gap-1 rounded-full bg-destructive/10 text-destructive px-3 py-1.5 text-xs"><Trash2 className="size-3" /> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {edit && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm grid place-items-center p-4 animate-scale-in" onClick={() => setEdit(null)}>
          <div className="w-full max-w-lg rounded-3xl bg-card shadow-card p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-display text-2xl mb-4">{edit.id ? "Edit item" : "New item"}</h2>
            <div className="space-y-3">
              <Row label="Name"><input className="input" value={edit.name} onChange={e => setEdit({ ...edit, name: e.target.value })} /></Row>
              <Row label="Category"><input className="input" value={edit.category} onChange={e => setEdit({ ...edit, category: e.target.value })} placeholder={CATEGORY_ORDER.slice(0, 3).join(" / ")} /></Row>
              <Row label="Price (£)"><input type="number" step="0.01" min="0" className="input" value={edit.price} onChange={e => setEdit({ ...edit, price: e.target.value })} /></Row>
              <Row label="Description"><textarea rows={3} className="input resize-none" value={edit.description} onChange={e => setEdit({ ...edit, description: e.target.value })} /></Row>
              <Row label="Image URL (optional)"><input className="input" value={edit.image_url} onChange={e => setEdit({ ...edit, image_url: e.target.value })} placeholder="https://…" /></Row>
              <Row label="Or upload from device">
                <div className="flex items-center gap-3">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = ""; }}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-secondary-foreground disabled:opacity-60"
                  >
                    {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                    {uploading ? "Uploading…" : "Choose image"}
                  </button>
                  {edit.image_url && <img src={edit.image_url} alt="" className="size-12 rounded-lg object-cover" />}
                </div>
              </Row>
              <Row label="Sort order"><input type="number" className="input" value={edit.sort_order} onChange={e => setEdit({ ...edit, sort_order: Number(e.target.value) })} /></Row>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={edit.is_available} onChange={e => setEdit({ ...edit, is_available: e.target.checked })} /> Available
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setEdit(null)} className="rounded-full px-4 py-2 text-sm hover:bg-muted">Cancel</button>
              <button onClick={save} className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow">Save</button>
            </div>
          </div>
        </div>
      )}
      <style>{`.input { width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid var(--color-border); background: var(--color-background); font-size: 0.875rem; outline: none; }
      .input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 25%, transparent); }`}</style>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      {children}
    </label>
  );
}
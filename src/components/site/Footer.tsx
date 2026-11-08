import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/logo.jpeg";

export function Footer() {
  return (
    <footer className="mt-24 gradient-hero text-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Abi's Kitchen — Nigerian flavours for every day and every occasion" className="h-16 w-44 rounded-md bg-background p-1 object-contain" />
          </div>
          <p className="text-sm text-background/70 max-w-sm">
            Authentic Nigerian takeaway, slow-cooked daily and served from our pitch in the United Kingdom. Pre-order ahead, pay at pickup.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-background/50 mb-3">Explore</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/menu" className="hover:text-brand transition">Menu</Link></li>
            <li><Link to="/about" className="hover:text-brand transition">About</Link></li>
            <li><Link to="/contact" className="hover:text-brand transition">Contact</Link></li>
            <li><Link to="/cart" className="hover:text-brand transition">Cart</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-background/50 mb-3">Find Us</div>
          <ul className="space-y-2 text-sm text-background/80">
            <li className="flex items-start gap-2"><Phone className="size-4 mt-0.5" /><a href="tel:+447523817416" className="hover:text-brand">07523 817416</a></li>
            <li className="flex items-start gap-2"><Mail className="size-4 mt-0.5" /><a href="mailto:abiskitchen35@gmail.com" className="hover:text-brand break-all">abiskitchen35@gmail.com</a></li>
            <li className="flex items-start gap-2"><Instagram className="size-4 mt-0.5" /><a href="https://instagram.com/abiskitchen35" target="_blank" rel="noreferrer" className="hover:text-brand">@abiskitchen35</a></li>
            <li className="flex items-start gap-2"><MapPin className="size-4 mt-0.5" />United Kingdom · pitches & events</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-background/60">
          <div>© {new Date().getFullYear()} Abis Kitchen. All rights reserved.</div>
          <Link to="/auth" className="hover:text-primary">Admin login</Link>



<div>
  Built by{" "}
  <a
    href="https://nous-launchpad-prototype2.vercel.app/"
    target="_blank"
    rel="noreferrer"
    className="font-semibold text-primary hover:underline"
  >
    Nous Technologies Limited
  </a>
</div>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ShuttleMark } from "./shuttle-mark";

const NAV = [
  { to: "/", label: "Inicio" },
  { to: "/club", label: "El club" },
  { to: "/horarios", label: "Horarios" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-foreground/10 bg-ink/95 text-ink-foreground backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <ShuttleMark className="h-8 w-8 text-primary" />
          <span className="font-display text-sm uppercase leading-none tracking-wide">
            Badminton Pozuelo
            <span className="block text-primary">Shutte</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              className="rounded-md px-3 py-2 text-sm font-semibold uppercase tracking-wider text-ink-muted transition-colors hover:text-ink-foreground data-[status=active]:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild variant="hero" size="sm" className="ml-3">
            <Link to="/contacto">Pide información</Link>
          </Button>
        </nav>

        <button
          type="button"
          className="p-2 md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-ink-foreground/10 px-5 pb-5 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              onClick={() => setOpen(false)}
              className="block border-b border-ink-foreground/10 py-3 font-display text-lg uppercase data-[status=active]:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

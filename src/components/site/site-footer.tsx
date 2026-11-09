import { Link } from "@tanstack/react-router";
import { MapPin, Mail } from "lucide-react";

import { CLUB_LOCATION, CLUB_NAME } from "@/lib/club-data";
import logo from "@/assets/logo-shuttle-pozuelo.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="court-lines bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <img
            src={logo.url}
            alt={`Logo de ${CLUB_NAME}`}
            width={480}
            height={366}
            loading="lazy"
            className="h-24 w-auto mix-blend-lighten"
          />
          <p className="mt-3 font-display uppercase">{CLUB_NAME}</p>
          <p className="mt-4 max-w-xs text-ink-muted">
            Club de bádminton en Pozuelo para todas las edades y niveles.
          </p>
        </div>
        <div>
          <p className="eyebrow text-primary">Navega</p>
          <ul className="mt-4 space-y-2 text-ink-muted">
            <li><Link to="/club" className="hover:text-ink-foreground">El club</Link></li>
            <li><Link to="/horarios" className="hover:text-ink-foreground">Horarios</Link></li>
            <li><Link to="/contacto" className="hover:text-ink-foreground">Solicitar información</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-primary">Dónde estamos</p>
          <ul className="mt-4 space-y-3 text-ink-muted">
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{CLUB_LOCATION}</li>
            <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><Link to="/contacto" className="hover:text-ink-foreground">Escríbenos desde el formulario</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10 py-5 text-center text-sm text-ink-muted">
        © {new Date().getFullYear()} {CLUB_NAME}
      </div>
    </footer>
  );
}

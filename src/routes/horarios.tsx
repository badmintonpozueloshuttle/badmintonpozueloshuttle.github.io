import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TRAINING_GROUPS, WEEK_DAYS, WEEKLY_SESSIONS } from "@/lib/club-data";

export const Route = createFileRoute("/horarios")({
  head: () => ({
    meta: [
      { title: "Horarios de entrenamiento · Badminton Pozuelo Shuttle" },
      {
        name: "description",
        content:
          "Horarios semanales de los grupos de bádminton: escuela infantil, juvenil, adultos y competición en Pozuelo.",
      },
      { property: "og:title", content: "Horarios de entrenamiento · Badminton Pozuelo Shuttle" },
      {
        property: "og:description",
        content: "Consulta qué días y a qué hora entrena cada grupo del club.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HorariosPage,
});

function HorariosPage() {
  return (
    <>
      <section className="court-lines bg-ink text-ink-foreground">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <p className="eyebrow text-primary">Temporada actual</p>
          <h1 className="mt-4 text-4xl sm:text-6xl">Horarios de entrenamiento</h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-muted">
            Elige tu grupo y ven a probar. Los horarios pueden variar en festivos y periodos de
            vacaciones escolares.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-3xl">Semana tipo</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {WEEK_DAYS.map((day) => {
            const sessions = WEEKLY_SESSIONS.filter((s) => s.day === day).sort((a, b) =>
              a.start.localeCompare(b.start),
            );
            return (
              <div key={day} className="rounded-lg border bg-card p-4 shadow-card">
                <p className="font-display uppercase text-primary">{day}</p>
                <ul className="mt-3 space-y-2">
                  {sessions.length === 0 && (
                    <li className="text-sm text-muted-foreground">Sin entrenamientos</li>
                  )}
                  {sessions.map((s) => (
                    <li key={s.start} className="rounded-md bg-secondary px-3 py-2">
                      <p className="flex items-center gap-1.5 font-semibold text-secondary-foreground">
                        <Clock className="h-4 w-4 text-primary" /> {s.start} – {s.end}
                      </p>
                      <p className="mt-0.5 flex items-start gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> {s.venue}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-3xl">Grupos</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Escríbenos y te diremos qué horario encaja con tu edad y tu nivel.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TRAINING_GROUPS.map((g) => (
              <article key={g.id} className="rounded-lg border bg-card p-6 shadow-card">
                <h3 className="text-xl">{g.name}</h3>
                <p className="mt-1 text-muted-foreground">{g.audience}</p>
                <span className="mt-4 inline-block rounded-md bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                  {g.level}
                </span>
              </article>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="hero" size="xl">
              <Link to="/contacto">
                Reserva tu clase de prueba <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TRAINING_GROUPS, WEEK_DAYS } from "@/lib/club-data";

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
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {WEEK_DAYS.map((day) => {
            const sessions = TRAINING_GROUPS.flatMap((g) =>
              g.sessions.filter((s) => s.day === day).map((s) => ({ group: g, time: s.time })),
            ).sort((a, b) => a.time.localeCompare(b.time));
            return (
              <div key={day} className="rounded-lg border bg-card p-4 shadow-card">
                <p className="font-display uppercase text-primary">{day}</p>
                <ul className="mt-3 space-y-2">
                  {sessions.length === 0 && (
                    <li className="text-sm text-muted-foreground">Sin entrenamientos</li>
                  )}
                  {sessions.map(({ group, time }) => (
                    <li key={group.id} className="rounded-md bg-secondary px-3 py-2">
                      <p className="text-sm font-semibold text-secondary-foreground">{group.name}</p>
                      <p className="text-sm text-muted-foreground">{time}</p>
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
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {TRAINING_GROUPS.map((g) => (
              <article key={g.id} className="rounded-lg border bg-card p-7 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl">{g.name}</h3>
                    <p className="mt-1 text-muted-foreground">{g.audience}</p>
                  </div>
                  <span className="rounded-md bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
                    {g.level}
                  </span>
                </div>
                <ul className="mt-6 divide-y border-y">
                  {g.sessions.map((s) => (
                    <li key={s.day} className="flex items-center justify-between py-3">
                      <span className="font-semibold">{s.day}</span>
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary" /> {s.time}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" /> {g.venue}
                </p>
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

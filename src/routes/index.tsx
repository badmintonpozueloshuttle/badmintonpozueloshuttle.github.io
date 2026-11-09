import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarClock, Trophy, Users } from "lucide-react";

import heroImg from "@/assets/hero-badminton.jpg";
import trainingImg from "@/assets/club-training.jpg";
import { Button } from "@/components/ui/button";
import { TRAINING_GROUPS } from "@/lib/club-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Badminton Pozuelo Shutte · Club de bádminton en Pozuelo" },
      {
        name: "description",
        content:
          "Entrena bádminton en Pozuelo de Alarcón: escuela infantil, juvenil, adultos y competición. Consulta horarios y pide información.",
      },
      { property: "og:title", content: "Badminton Pozuelo Shutte" },
      {
        property: "og:description",
        content: "Club de bádminton en Pozuelo para todas las edades y niveles.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const FEATURES = [
  {
    icon: Users,
    title: "Para todas las edades",
    text: "Desde los 6 años hasta veteranos. Grupos por edad y nivel.",
    to: "/club" as const,
    cta: "Conoce el club",
  },
  {
    icon: CalendarClock,
    title: "Horarios de entrenamiento",
    text: "Sesiones entre semana y los sábados, con entrenadores titulados.",
    to: "/horarios" as const,
    cta: "Ver horarios",
  },
  {
    icon: Trophy,
    title: "Competición",
    text: "Equipo federado que compite en torneos regionales y nacionales.",
    to: "/contacto" as const,
    cta: "Únete al equipo",
  },
];

function Index() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
        <img
          src={heroImg}
          alt="Jugador de bádminton saltando para hacer un remate"
          width={1920}
          height={1088}
          className="absolute inset-0 -z-20 h-full w-full -scale-x-100 object-cover object-[35%_center]"
        />
        <div className="bg-hero-overlay absolute inset-0 -z-10" />
        <div className="mx-auto flex min-h-[min(80vh,760px)] max-w-6xl flex-col justify-center px-5 py-24">
          <p className="eyebrow animate-rise text-primary">Club de bádminton · Pozuelo de Alarcón</p>
          <h1 className="animate-rise mt-5 max-w-3xl text-[2.6rem] [animation-delay:80ms] sm:text-7xl">
            Badminton Pozuelo <span className="text-primary">Shutte</span>
          </h1>
          <p className="animate-rise mt-6 max-w-xl text-lg text-ink-muted [animation-delay:160ms]">
            Aprende, entrena y compite en un club cercano. Grupos para niños, jóvenes y adultos,
            de iniciación a competición.
          </p>
          <div className="animate-rise mt-9 flex flex-wrap gap-3 [animation-delay:240ms]">
            <Button asChild variant="hero" size="xl">
              <Link to="/contacto">
                Solicitar información <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="inkOutline" size="xl">
              <Link to="/horarios">Ver horarios</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-14 max-w-6xl px-5">
        <div className="grid gap-5 md:grid-cols-3">
          {FEATURES.map((f) => (
            <Link
              key={f.title}
              to={f.to}
              className="group relative rounded-lg border bg-card p-7 shadow-card transition-transform hover:-translate-y-1"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-secondary text-primary">
                <f.icon className="h-6 w-6" />
              </span>
              <h2 className="mt-5 text-xl">{f.title}</h2>
              <p className="mt-2 text-muted-foreground">{f.text}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-primary">
                {f.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 md:grid-cols-2">
        <img
          src={trainingImg}
          alt="Entrenador explicando un ejercicio a un grupo del club"
          width={1280}
          height={960}
          loading="lazy"
          className="aspect-[4/3] w-full rounded-lg object-cover shadow-card"
        />
        <div>
          <p className="eyebrow text-primary">Nuestros grupos</p>
          <h2 className="mt-3 text-4xl">Encuentra tu grupo</h2>
          <ul className="mt-8 divide-y border-y">
            {TRAINING_GROUPS.map((g) => (
              <li key={g.id} className="flex items-baseline justify-between gap-4 py-4">
                <span className="font-display uppercase">{g.name}</span>
                <span className="text-right text-muted-foreground">{g.audience}</span>
              </li>
            ))}
          </ul>
          <Button asChild variant="link" className="mt-6 px-0 text-base font-semibold uppercase tracking-wider">
            <Link to="/horarios">
              Consulta los horarios <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      <section className="bg-gradient-forest text-forest-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-16 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl">¿Quieres probar una clase?</h2>
            <p className="mt-2 text-lg opacity-85">Escríbenos y te contamos cómo empezar.</p>
          </div>
          <Button asChild variant="ink" size="xl">
            <Link to="/contacto">
              Pide información <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}

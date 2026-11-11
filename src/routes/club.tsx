import { ClientOnly, createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, GraduationCap, HeartHandshake, Medal, MapPin } from "lucide-react";

import teamImg from "@/assets/equipo-shuttle-pozuelo.jpg.asset.json";
import { VenuesMap } from "@/components/site/venue-map";
import { Button } from "@/components/ui/button";
import { CLUB_LOCATION, TRAINING_DAYS_COUNT } from "@/lib/club-data";

export const Route = createFileRoute("/club")({
  head: () => ({
    meta: [
      { title: "El club · Badminton Pozuelo Shuttle" },
      {
        name: "description",
        content:
          "Conoce Badminton Pozuelo Shuttle: nuestra historia, valores, entrenadores y dónde entrenamos en Pozuelo de Alarcón.",
      },
      { property: "og:title", content: "El club · Badminton Pozuelo Shuttle" },
      {
        property: "og:description",
        content: "Historia, valores y equipo técnico del club de bádminton de Pozuelo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClubPage,
});

const VALUES = [
  {
    icon: HeartHandshake,
    title: "Comunidad",
    text: "Un club cercano donde familias, jóvenes y adultos comparten pista y buen ambiente.",
  },
  {
    icon: GraduationCap,
    title: "Formación",
    text: "Entrenadores titulados que adaptan cada sesión a la edad y al nivel de cada jugador.",
  },
  {
    icon: Medal,
    title: "Competición",
    text: "Para quien quiere ir más allá: torneos, ligas y un equipo federado con ambición.",
  },
];

const STATS = [
  { value: "4", label: "Grupos de entrenamiento" },
  { value: "Todas", label: "Las edades son bienvenidas" },
  { value: String(TRAINING_DAYS_COUNT), label: "Días de entrenamiento" },
];

function ClubPage() {
  return (
    <>
      <section className="court-lines bg-ink text-ink-foreground">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <p className="eyebrow text-primary">El club</p>
          <p className="mt-4 max-w-2xl text-lg text-ink-muted">
            Pozuelo Shuttle nace para acercar el bádminton a todo Pozuelo. Es un proyecto donde la pasión por el bádminton se convierte en comunidad, formando desde la base a jugadores de todas las edades, pero sobre todo disfrutamos de un deporte rápido, técnico y muy divertido.
          </p>
          <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-6 border-t border-ink-foreground/15 pt-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-4xl text-primary">{s.value}</dt>
                <dd className="mt-1 text-sm text-ink-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="eyebrow text-primary">Lo que nos mueve</p>
        <h2 className="mt-3 text-4xl">Nuestros valores</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {VALUES.map((v) => (
            <article key={v.title} className="rounded-lg border bg-card p-7 shadow-card">
              <v.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-5 text-xl">{v.title}</h3>
              <p className="mt-2 text-muted-foreground">{v.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="eyebrow text-primary">Dónde entrenamos</p>
              <h2 className="mt-3 text-4xl">En el corazón de Pozuelo</h2>
              <p className="mt-5 text-lg text-muted-foreground">
                Entrenamos en el IES Camilo José Cela y en el colegio San Luis de los Franceses, en pistas cubiertas. Ponemos el material para
                las primeras clases: solo necesitas ropa deportiva y zapatillas de interior.
              </p>
              <p className="mt-6 flex items-center gap-2 font-semibold">
                <MapPin className="h-5 w-5 text-primary" /> {CLUB_LOCATION}
              </p>
              <Button asChild variant="hero" size="xl" className="mt-8">
                <Link to="/contacto">
                  Quiero apuntarme <ArrowRight />
                </Link>
              </Button>
            </div>
            <img
              src={teamImg.url}
              alt="Jugadores del club posando con la bandera de Shuttle Pozuelo"
              width={1920}
              height={1440}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-lg object-cover shadow-card"
            />
          </div>

          <div className="mt-14">
            <ClientOnly
              fallback={<div className="h-[340px] w-full rounded-lg border bg-background sm:h-[420px]" aria-hidden />}
            >
              <VenuesMap />
            </ClientOnly>
          </div>
        </div>
      </section>
    </>
  );
}

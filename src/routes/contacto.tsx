import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LEVEL_OPTIONS } from "@/lib/club-data";
import { infoRequestSchema } from "@/lib/info-request";
import { submitInfoRequest } from "@/lib/info-request.functions";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Solicitar información · Badminton Pozuelo Shutte" },
      {
        name: "description",
        content:
          "Pide información sobre el club, los grupos y las clases de prueba de Badminton Pozuelo Shutte.",
      },
      { property: "og:title", content: "Solicitar información · Badminton Pozuelo Shutte" },
      {
        property: "og:description",
        content: "Escríbenos y te contamos cómo empezar a jugar al bádminton en Pozuelo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactoPage,
});

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "level" | "message", string | undefined>>;

const EMPTY = { name: "", email: "", phone: "", level: "", message: "" };

function ContactoPage() {
  const submit = useServerFn(submitInfoRequest);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (field: keyof typeof EMPTY) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = infoRequestSchema.safeParse(values);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setSending(true);
    try {
      await submit({ data: parsed.data });
      setSent(true);
      setValues(EMPTY);
    } catch {
      toast.error("No hemos podido enviar tu solicitud. Inténtalo de nuevo en unos minutos.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="court-lines bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div>
          <p className="eyebrow text-primary">Contacto</p>
          <h1 className="mt-4 text-4xl sm:text-6xl">Solicita información</h1>
          <p className="mt-6 max-w-md text-lg text-ink-muted">
            ¿Quieres apuntarte, probar una clase o tienes alguna duda sobre el club? Déjanos tus
            datos y te responderemos lo antes posible.
          </p>
          <ul className="mt-10 space-y-4">
            {[
              "Clase de prueba para nuevos jugadores",
              "Grupos para niños, jóvenes y adultos",
              "Material disponible para empezar",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-card p-7 text-card-foreground shadow-card sm:p-9">
          {sent ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <CheckCircle2 className="h-14 w-14 text-primary" />
              <h2 className="mt-5 text-3xl">¡Solicitud enviada!</h2>
              <p className="mt-3 max-w-sm text-muted-foreground">
                Gracias por escribirnos. Hemos recibido tu mensaje y te contactaremos pronto.
              </p>
              <Button variant="outline" className="mt-8" onClick={() => setSent(false)}>
                Enviar otra solicitud
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <Field label="Nombre y apellidos" id="name" error={errors.name}>
                <Input
                  id="name"
                  value={values.name}
                  onChange={(e) => update("name")(e.target.value)}
                  maxLength={100}
                  autoComplete="name"
                  className="h-11"
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Email" id="email" error={errors.email}>
                  <Input
                    id="email"
                    type="email"
                    value={values.email}
                    onChange={(e) => update("email")(e.target.value)}
                    maxLength={255}
                    autoComplete="email"
                    className="h-11"
                  />
                </Field>
                <Field label="Teléfono (opcional)" id="phone" error={errors.phone}>
                  <Input
                    id="phone"
                    type="tel"
                    value={values.phone}
                    onChange={(e) => update("phone")(e.target.value)}
                    maxLength={30}
                    autoComplete="tel"
                    className="h-11"
                  />
                </Field>
              </div>
              <Field label="Tu nivel (opcional)" id="level" error={errors.level}>
                <select
                  id="level"
                  value={values.level}
                  onChange={(e) => update("level")(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Selecciona una opción</option>
                  {LEVEL_OPTIONS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Mensaje" id="message" error={errors.message}>
                <Textarea
                  id="message"
                  rows={5}
                  value={values.message}
                  onChange={(e) => update("message")(e.target.value)}
                  maxLength={1000}
                  placeholder="Ej.: Me gustaría apuntar a mi hijo de 9 años al grupo infantil."
                />
              </Field>
              <Button type="submit" variant="hero" size="xl" className="w-full" disabled={sending}>
                {sending ? <Loader2 className="animate-spin" /> : <Send />}
                {sending ? "Enviando…" : "Enviar solicitud"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-semibold">
        {label}
      </Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

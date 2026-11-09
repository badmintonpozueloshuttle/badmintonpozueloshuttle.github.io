import { z } from "zod";

import { LEVEL_OPTIONS } from "./club-data";

export const infoRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Escribe tu nombre" })
    .max(100, { message: "Máximo 100 caracteres" }),
  email: z
    .string()
    .trim()
    .email({ message: "Escribe un email válido" })
    .max(255, { message: "Máximo 255 caracteres" }),
  phone: z
    .string()
    .trim()
    .max(30, { message: "Máximo 30 caracteres" })
    .regex(/^[0-9+()\s-]*$/, { message: "Solo números y símbolos + ( ) -" })
    .optional()
    .or(z.literal("")),
  level: z.enum(LEVEL_OPTIONS).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(5, { message: "Cuéntanos un poco más" })
    .max(1000, { message: "Máximo 1000 caracteres" }),
});

export type InfoRequestInput = z.infer<typeof infoRequestSchema>;

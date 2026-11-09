import { createServerFn } from "@tanstack/react-start";

import { infoRequestSchema } from "./info-request";

export const submitInfoRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => infoRequestSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("info_requests").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      level: data.level || null,
      message: data.message,
    });
    if (error) {
      console.error("info_requests insert failed", error);
      throw new Error("No se pudo enviar la solicitud");
    }
    return { ok: true };
  });

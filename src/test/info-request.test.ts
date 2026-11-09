import { describe, expect, it } from "vitest";

import { infoRequestSchema } from "@/lib/info-request";

const valid = { name: "Ana López", email: "ana@example.com", phone: "", level: "", message: "Quiero probar una clase" };

describe("info request form rules", () => {
  it("accepts a request with name, email and message only", () => {
    expect(infoRequestSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a request without a valid email", () => {
    expect(infoRequestSchema.safeParse({ ...valid, email: "no-es-email" }).success).toBe(false);
  });

  it("rejects messages longer than 1000 characters", () => {
    expect(infoRequestSchema.safeParse({ ...valid, message: "a".repeat(1001) }).success).toBe(false);
  });
});

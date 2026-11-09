import { describe, expect, it } from "vitest";

import { WEEKLY_SESSIONS } from "@/lib/club-data";

const on = (day: string) =>
  WEEKLY_SESSIONS.filter((s) => s.day === day).map((s) => `${s.start}-${s.end} ${s.venue}`);

describe("weekly training schedule", () => {
  it("Monday and Wednesday train 20:00-21:30 at San Luis de los Franceses", () => {
    expect(on("Lunes")).toEqual(["20:00-21:30 San Luis de los Franceses"]);
    expect(on("Miércoles")).toEqual(["20:00-21:30 San Luis de los Franceses"]);
  });

  it("Tuesday has two sessions at IES Camilo José Cela", () => {
    expect(on("Martes")).toEqual([
      "16:00-17:30 IES Camilo José Cela",
      "17:30-19:00 IES Camilo José Cela",
    ]);
  });

  it("Thursday has three sessions, the last at San Luis de los Franceses", () => {
    expect(on("Jueves")).toEqual([
      "16:00-17:30 IES Camilo José Cela",
      "17:30-19:00 IES Camilo José Cela",
      "20:30-22:00 San Luis de los Franceses",
    ]);
  });

  it("Friday has no training", () => {
    expect(on("Viernes")).toEqual([]);
  });
});

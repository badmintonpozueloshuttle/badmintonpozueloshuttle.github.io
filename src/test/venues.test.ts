import { describe, expect, it } from "vitest";

import { VENUES_LOCATIONS, googleMapsUrl } from "@/lib/club-data";

const urlOf = (name: string) => {
  const venue = VENUES_LOCATIONS.find((v) => v.name === name);
  if (!venue) throw new Error(`Falta la pista ${name} en club-data.ts`);
  return googleMapsUrl(venue);
};

describe("club venues shown on the map", () => {
  it("marks both training schools with their geocoded coordinates", () => {
    expect(VENUES_LOCATIONS.map((v) => `${v.name} ${v.lat},${v.lng}`)).toEqual([
      "IES Camilo José Cela 40.4391176,-3.8196698",
      "San Luis de los Franceses 40.4364338,-3.8111148",
    ]);
  });

  it("opens each school in Google Maps by coordinates and place id", () => {
    expect(urlOf("IES Camilo José Cela")).toBe(
      "https://www.google.com/maps/search/?api=1&query=40.4391176%2C-3.8196698&query_place_id=ChIJXeAq6nmGQQ0RC-QsRlOMho0",
    );
    expect(urlOf("San Luis de los Franceses")).toBe(
      "https://www.google.com/maps/search/?api=1&query=40.4364338%2C-3.8111148&query_place_id=ChIJzWLe7m6GQQ0RJsxyR3tiLF8",
    );
  });
});

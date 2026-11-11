export const CLUB_NAME = "Badminton Pozuelo Shuttle";
export const CLUB_LOCATION = "Pozuelo de Alarcón, Madrid";
export const INSTAGRAM_HANDLE = "@badmintonpozueloshuttle";
export const INSTAGRAM_URL = "https://www.instagram.com/badmintonpozueloshuttle";

export const WEEK_DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] as const;

export type WeekDay = (typeof WEEK_DAYS)[number];

export const VENUES = {
  camiloJoseCela: "IES Camilo José Cela",
  sanLuis: "San Luis de los Franceses",
} as const;

export type TrainingSession = { day: WeekDay; start: string; end: string; venue: string };

/** Official weekly schedule supplied by the club. */
export const WEEKLY_SESSIONS: TrainingSession[] = [
  { day: "Lunes", start: "20:00", end: "21:30", venue: VENUES.sanLuis },
  { day: "Martes", start: "16:00", end: "17:30", venue: VENUES.camiloJoseCela },
  { day: "Martes", start: "17:30", end: "19:00", venue: VENUES.camiloJoseCela },
  { day: "Miércoles", start: "20:00", end: "21:30", venue: VENUES.sanLuis },
  { day: "Jueves", start: "16:00", end: "17:30", venue: VENUES.camiloJoseCela },
  { day: "Jueves", start: "17:30", end: "19:00", venue: VENUES.camiloJoseCela },
  { day: "Jueves", start: "20:30", end: "22:00", venue: VENUES.sanLuis },
];

export const TRAINING_DAYS_COUNT = new Set(WEEKLY_SESSIONS.map((s) => s.day)).size;

export type Venue = {
  name: string;
  address: string;
  lat: number;
  lng: number;
  placeId: string;
};

/**
 * Both training schools, with coordinates resolved through the Google Maps
 * Geocoding API so the club page can drop a marker on each one.
 */
export const VENUES_LOCATIONS: Venue[] = [
  {
    name: VENUES.camiloJoseCela,
    address: "C. Islas Cíes, 53, 28223 Pozuelo de Alarcón, Madrid",
    lat: 40.4391176,
    lng: -3.8196698,
    placeId: "ChIJXeAq6nmGQQ0RC-QsRlOMho0",
  },
  {
    name: VENUES.sanLuis,
    address: "C. de Portugalete, 1, 28223 Pozuelo de Alarcón, Madrid",
    lat: 40.4364338,
    lng: -3.8111148,
    placeId: "ChIJzWLe7m6GQQ0RJsxyR3tiLF8",
  },
];

/** Deep link that opens the venue in the Google Maps app / website. */
export function googleMapsUrl(venue: Venue): string {
  const query = encodeURIComponent(`${venue.lat},${venue.lng}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}&query_place_id=${venue.placeId}`;
}

export const LEVEL_OPTIONS = [
  "Nunca he jugado",
  "Nivel iniciación",
  "Nivel intermedio",
  "Nivel avanzado / competición",
] as const;

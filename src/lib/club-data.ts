export const CLUB_NAME = "Badminton Pozuelo Shuttle";
export const CLUB_LOCATION = "Pozuelo de Alarcón, Madrid";

export type TrainingGroup = {
  id: string;
  name: string;
  audience: string;
  level: string;
};

export const TRAINING_GROUPS: TrainingGroup[] = [
  {
    id: "escuela",
    name: "Escuela infantil",
    audience: "6 a 11 años",
    level: "Iniciación",
  },
  {
    id: "juvenil",
    name: "Juvenil",
    audience: "12 a 17 años",
    level: "Iniciación y perfeccionamiento",
  },
  {
    id: "adultos",
    name: "Adultos",
    audience: "Mayores de 18",
    level: "Iniciación e intermedio",
  },
  {
    id: "competicion",
    name: "Competición",
    audience: "Jugadores federados",
    level: "Avanzado",
  },
];

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

export const LEVEL_OPTIONS = [
  "Nunca he jugado",
  "Nivel iniciación",
  "Nivel intermedio",
  "Nivel avanzado / competición",
] as const;

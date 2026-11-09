export const CLUB_NAME = "Badminton Pozuelo Shuttle";
export const CLUB_LOCATION = "Pozuelo de Alarcón, Madrid";

export type TrainingGroup = {
  id: string;
  name: string;
  audience: string;
  level: string;
  sessions: { day: string; time: string }[];
  venue: string;
};

export const TRAINING_GROUPS: TrainingGroup[] = [
  {
    id: "escuela",
    name: "Escuela infantil",
    audience: "6 a 11 años",
    level: "Iniciación",
    sessions: [
      { day: "Lunes", time: "17:30 – 18:30" },
      { day: "Miércoles", time: "17:30 – 18:30" },
    ],
    venue: "Pista 1 y 2",
  },
  {
    id: "juvenil",
    name: "Juvenil",
    audience: "12 a 17 años",
    level: "Iniciación y perfeccionamiento",
    sessions: [
      { day: "Lunes", time: "18:30 – 20:00" },
      { day: "Miércoles", time: "18:30 – 20:00" },
      { day: "Viernes", time: "17:30 – 19:00" },
    ],
    venue: "Pista 1 a 4",
  },
  {
    id: "adultos",
    name: "Adultos",
    audience: "Mayores de 18",
    level: "Iniciación e intermedio",
    sessions: [
      { day: "Martes", time: "20:00 – 21:30" },
      { day: "Jueves", time: "20:00 – 21:30" },
    ],
    venue: "Pista 1 a 4",
  },
  {
    id: "competicion",
    name: "Competición",
    audience: "Jugadores federados",
    level: "Avanzado",
    sessions: [
      { day: "Martes", time: "18:30 – 20:00" },
      { day: "Jueves", time: "18:30 – 20:00" },
      { day: "Sábado", time: "10:00 – 12:00" },
    ],
    venue: "Pista central",
  },
];

export const WEEK_DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"] as const;

export const LEVEL_OPTIONS = [
  "Nunca he jugado",
  "Nivel iniciación",
  "Nivel intermedio",
  "Nivel avanzado / competición",
] as const;

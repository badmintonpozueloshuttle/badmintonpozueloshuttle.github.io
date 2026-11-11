import { useEffect, useRef, useState } from "react";
import { ExternalLink, MapPin } from "lucide-react";

import { VENUES_LOCATIONS, googleMapsUrl } from "@/lib/club-data";

type LatLng = { lat: number; lng: number };
type BoundsLiteral = { north: number; south: number; east: number; west: number };

type MapsMarker = {
  setMap: (map: null) => void;
  addListener: (event: string, handler: () => void) => { remove: () => void };
};

type MapsMap = {
  fitBounds: (bounds: BoundsLiteral, padding?: number) => void;
};

type GoogleMaps = {
  maps: {
    Map: new (el: HTMLElement, options: Record<string, unknown>) => MapsMap;
    Marker: new (options: Record<string, unknown>) => MapsMarker;
  };
};

const CALLBACK_NAME = "__shuttlePozueloMapsReady";

let mapsLoader: Promise<GoogleMaps> | null = null;

/** Loads the Maps JavaScript API once and resolves when it is usable. */
function loadGoogleMaps(): Promise<GoogleMaps> {
  if (mapsLoader) return mapsLoader;

  mapsLoader = new Promise<GoogleMaps>((resolve, reject) => {
    const browserKey = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];
    const trackingId = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID"];
    if (!browserKey) {
      reject(new Error("Google Maps browser key is not configured"));
      return;
    }

    const w = window as unknown as Record<string, unknown> & { google?: GoogleMaps };
    if (w.google?.maps) {
      resolve(w.google);
      return;
    }

    w[CALLBACK_NAME] = () => {
      if (w.google) resolve(w.google);
    };

    const channel = trackingId ? `&channel=${encodeURIComponent(trackingId)}` : "";
    const script = document.createElement("script");
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(browserKey)}` +
      `&loading=async&callback=${CALLBACK_NAME}&language=es&region=ES${channel}`;
    script.async = true;
    script.onerror = () => reject(new Error("No se ha podido cargar el mapa"));
    document.head.appendChild(script);
  });

  return mapsLoader;
}

export function VenuesMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let disposed = false;
    const teardown: Array<() => void> = [];

    loadGoogleMaps()
      .then((google) => {
        const el = containerRef.current;
        if (disposed || !el) return;

        const { Map, Marker } = google.maps;
        const lats = VENUES_LOCATIONS.map((v) => v.lat);
        const lngs = VENUES_LOCATIONS.map((v) => v.lng);

        const map = new Map(el, {
          clickableIcons: false,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "cooperative",
          center: {
            lat: (Math.min(...lats) + Math.max(...lats)) / 2,
            lng: (Math.min(...lngs) + Math.max(...lngs)) / 2,
          },
          zoom: 14,
        });
        map.fitBounds(
          {
            north: Math.max(...lats),
            south: Math.min(...lats),
            east: Math.max(...lngs),
            west: Math.min(...lngs),
          },
          56,
        );

        VENUES_LOCATIONS.forEach((venue, index) => {
          const marker = new Marker({
            map,
            position: { lat: venue.lat, lng: venue.lng } as LatLng,
            title: venue.name,
            label: String(index + 1),
          });
          const click = marker.addListener("click", () => {
            window.open(googleMapsUrl(venue), "_blank", "noopener,noreferrer");
          });
          teardown.push(() => click.remove(), () => marker.setMap(null));
        });

        setStatus("ready");
      })
      .catch(() => {
        if (!disposed) setStatus("error");
      });

    return () => {
      disposed = true;
      teardown.forEach((fn) => fn());
    };
  }, []);

  return (
    <div>
      {/* The map container must stay child-free: Google Maps injects its own
          nodes in there and React loses track of the DOM if it has children. */}
      <div className="relative h-[340px] w-full overflow-hidden rounded-lg border bg-muted shadow-card sm:h-[420px]">
        <div ref={containerRef} data-venues-map className="h-full w-full" />
        {status !== "ready" && (
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-muted-foreground">
            {status === "loading"
              ? "Cargando el mapa…"
              : "No hemos podido cargar el mapa. Abre cada pista desde los botones de abajo."}
          </p>
        )}
      </div>

      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {VENUES_LOCATIONS.map((venue, index) => (
          <li key={venue.placeId}>
            <a
              data-venue-link
              href={googleMapsUrl(venue)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full items-start gap-3 rounded-lg border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm text-primary-foreground">
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span data-venue-name className="font-display text-base uppercase">
                    {venue.name}
                  </span>
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">{venue.address}</span>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Abrir en Google Maps <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

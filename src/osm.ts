const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

const UA = "windy-mcp/0.5 (sailing-mcp.dutch-atlas.com)";

export type OsmPoiKind =
  | "marina"
  | "yacht_club"
  | "harbour"
  | "anchorage"
  | "slipway"
  | "fuel"
  | "drinking_water"
  | "pump_out";

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OverpassResponse {
  version: number;
  elements: OverpassElement[];
}

const FILTERS: Record<OsmPoiKind, string> = {
  marina: '["leisure"="marina"]',
  yacht_club: '["club"="yacht"]',
  harbour: '["harbour"="yes"]',
  anchorage: '["seamark:type"="anchorage"]',
  slipway: '["leisure"="slipway"]',
  fuel: '["seamark:type"="small_craft_facility"]["seamark:small_craft_facility:category"~"fuel_station"]',
  drinking_water: '["amenity"="drinking_water"]',
  pump_out: '["waste_disposal"="sewage"]',
};

export interface OsmPoi {
  kind: OsmPoiKind;
  id: number;
  type: string;
  lat: number;
  lon: number;
  name?: string;
  phone?: string;
  website?: string;
  email?: string;
  openingHours?: string;
  vhfChannel?: string;
  capacity?: string;
  maxDraft?: string;
  tags: Record<string, string>;
}

export async function fetchOsmPois(opts: {
  lat: number;
  lon: number;
  radiusKm: number;
  kinds: OsmPoiKind[];
}): Promise<OsmPoi[]> {
  const radius = Math.max(100, Math.min(50000, Math.round(opts.radiusKm * 1000)));
  const parts: string[] = [];
  for (const k of opts.kinds) {
    const f = FILTERS[k];
    parts.push(`node(around:${radius},${opts.lat},${opts.lon})${f};`);
    parts.push(`way(around:${radius},${opts.lat},${opts.lon})${f};`);
    parts.push(`relation(around:${radius},${opts.lat},${opts.lon})${f};`);
  }
  const ql = `[out:json][timeout:25];(${parts.join("")});out tags center 200;`;

  const res = await fetch(`${OVERPASS_URL}?data=${encodeURIComponent(ql)}`, {
    headers: { "user-agent": UA, accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Overpass ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = (await res.json()) as OverpassResponse;

  const out: OsmPoi[] = [];
  for (const e of data.elements) {
    const lat = e.lat ?? e.center?.lat;
    const lon = e.lon ?? e.center?.lon;
    if (lat == null || lon == null) continue;
    const tags = e.tags ?? {};
    const kind = classify(tags);
    if (!kind) continue;
    out.push({
      kind,
      id: e.id,
      type: e.type,
      lat,
      lon,
      name: tags.name ?? tags["seamark:name"],
      phone: tags.phone ?? tags["contact:phone"],
      website: tags.website ?? tags["contact:website"],
      email: tags.email ?? tags["contact:email"],
      openingHours: tags.opening_hours,
      vhfChannel: tags["seamark:radio_station:channel"] ?? tags["seamark:harbour:channel"],
      capacity: tags.capacity ?? tags["seamark:harbour:berth_count"],
      maxDraft: tags["seamark:harbour:max_draught"] ?? tags["draft"],
      tags,
    });
  }
  out.sort(
    (a, b) => haversineKm(opts.lat, opts.lon, a.lat, a.lon) - haversineKm(opts.lat, opts.lon, b.lat, b.lon),
  );
  return out;
}

function classify(tags: Record<string, string>): OsmPoiKind | null {
  if (tags.leisure === "marina") return "marina";
  if (tags.club === "yacht") return "yacht_club";
  if (tags["seamark:type"] === "anchorage") return "anchorage";
  if (tags.leisure === "slipway") return "slipway";
  if (tags.amenity === "drinking_water") return "drinking_water";
  if (tags.waste_disposal === "sewage") return "pump_out";
  if (tags["seamark:type"] === "small_craft_facility") return "fuel";
  if (tags.harbour === "yes") return "harbour";
  return null;
}

export function formatPois(opts: { lat: number; lon: number; radiusKm: number; kinds: OsmPoiKind[]; pois: OsmPoi[] }): string {
  const lines: string[] = [];
  lines.push(`# Points of interest — OpenStreetMap (Overpass)`);
  lines.push(`Centre: ${opts.lat}, ${opts.lon}`);
  lines.push(`Radius: ${opts.radiusKm} km`);
  lines.push(`Looking for: ${opts.kinds.join(", ")}`);
  lines.push(`Found: ${opts.pois.length}`);
  lines.push("");

  if (opts.pois.length === 0) {
    lines.push("(no matching POIs in OSM within the radius)");
    return lines.join("\n");
  }

  lines.push("kind\tname\tdist_km\tlat\tlon\tphone\thours\twebsite");
  for (const p of opts.pois) {
    const dist = haversineKm(opts.lat, opts.lon, p.lat, p.lon);
    lines.push(
      [
        p.kind,
        p.name ?? "(no name)",
        dist.toFixed(1),
        p.lat.toFixed(5),
        p.lon.toFixed(5),
        p.phone ?? "—",
        p.openingHours ?? "—",
        p.website ?? "—",
      ].join("\t"),
    );
  }
  return lines.join("\n");
}

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

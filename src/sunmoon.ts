import SunCalc from "suncalc";

export interface SunMoonOptions {
  lat: number;
  lon: number;
  date: Date;
  days: number;
}

export function formatSunMoon(opts: SunMoonOptions): string {
  const lines: string[] = [];
  lines.push(`# Sun & Moon — ${opts.lat}, ${opts.lon}`);
  lines.push(`Date range: ${ymd(opts.date)} → ${ymd(addDays(opts.date, opts.days - 1))} (${opts.days} day${opts.days > 1 ? "s" : ""})`);
  lines.push("All times UTC.");
  lines.push("");

  lines.push("## Sun (UTC)");
  lines.push("date\tdawn_civ\tsunrise\tsolar_noon\tsunset\tdusk_civ\tnaut_dusk\tastro_dusk");
  for (let i = 0; i < opts.days; i++) {
    const d = addDays(opts.date, i);
    const t = SunCalc.getTimes(d, opts.lat, opts.lon);
    lines.push(
      [
        ymd(d),
        fmt(t.dawn),
        fmt(t.sunrise),
        fmt(t.solarNoon),
        fmt(t.sunset),
        fmt(t.dusk),
        fmt(t.nauticalDusk),
        fmt(t.nightEnd ?? new Date(NaN)),
      ].join("\t"),
    );
  }

  lines.push("");
  lines.push("## Moon (UTC)");
  lines.push("date\tmoonrise\tmoonset\tphase\tillum_%\tphase_name");
  for (let i = 0; i < opts.days; i++) {
    const d = addDays(opts.date, i);
    const mt = SunCalc.getMoonTimes(d, opts.lat, opts.lon);
    const mi = SunCalc.getMoonIllumination(d);
    lines.push(
      [
        ymd(d),
        fmt(mt.rise ?? new Date(NaN)),
        fmt(mt.set ?? new Date(NaN)),
        mi.phase.toFixed(3),
        Math.round(mi.fraction * 100).toString(),
        phaseName(mi.phase),
      ].join("\t"),
    );
  }

  lines.push("");
  lines.push("Legend: phase 0=new, 0.25=first quarter, 0.5=full, 0.75=last quarter (cyclic).");
  lines.push("Twilight definitions: civil = sun 6° below horizon, nautical = 12°, astronomical = 18°.");
  return lines.join("\n");
}

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function fmt(d: Date): string {
  if (!d || Number.isNaN(d.getTime())) return "—";
  return d.toISOString().slice(11, 16) + "Z";
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setUTCDate(r.getUTCDate() + n);
  return r;
}

function phaseName(p: number): string {
  if (p < 0.03 || p > 0.97) return "new";
  if (p < 0.22) return "waxing crescent";
  if (p < 0.28) return "first quarter";
  if (p < 0.47) return "waxing gibbous";
  if (p < 0.53) return "full";
  if (p < 0.72) return "waning gibbous";
  if (p < 0.78) return "last quarter";
  return "waning crescent";
}

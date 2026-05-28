# sailing-mcp

A remote [MCP](https://modelcontextprotocol.io) server for sailing navigation. It gives an AI assistant (Claude Desktop, Claude.ai, Claude Code, or any MCP client) a set of tools for **wind & wave forecasts, tides, tidal currents, marinas, bridge schedules and live AIS vessel traffic** — with a strong focus on Dutch / North Sea waters.

It is **stateless** and **multi-tenant by design**: every user passes their own provider API keys in the MCP URL, so a single deployment can serve many people without storing anyone's credentials. Tools that need a key only appear in the tool list when that key is present.

## Tools

| Tool | Source | Key required |
| --- | --- | --- |
| `sailing_forecast_openmeteo` | [Open-Meteo](https://open-meteo.com) — ECMWF, GFS, ICON, UKMO, Météo-France, JMA + Marine waves + optional SST | – |
| `wind_consensus` | Open-Meteo — many models side-by-side with min/max/spread | – |
| `metar_taf` | [aviationweather.gov](https://aviationweather.gov) — real airport observations & terminal forecasts | – |
| `sun_moon` | Local calculation (SunCalc) — sunrise/sunset, twilights, moon phase | – |
| `tides_nl` | [RWS Matroos](https://noos.matroos.rws.nl) — HW/LW, astronomical, observed, forecast + surge, water temp (preferred for NL) | – |
| `tides_rws` | [RWS Waterinfo](https://waterinfo.rws.nl) — observed water level (fallback) | – |
| `marinas_osm` | [OpenStreetMap / Overpass](https://overpass-api.de) — marinas, harbours, yacht clubs, anchorages, fuel | – |
| `bridges_nl` | [NDW](https://opendata.ndw.nu) DATEX II — scheduled bridge openings (names via OSM) | – |
| `notices_nl` | [RWS / EU NtS](https://www.vaarweginformatie.nl) — official Notices to Skippers, geo-filtered | – |
| `fairway_nl` | [RWS FIS WFS](https://www.vaarweginformatie.nl) — fairway depths, bridge clearance (air draft), locks | – |
| `list_models` | Built-in reference card (models, parameters, station codes) | – |
| `sailing_forecast` / `point_forecast` | [Windy Point Forecast](https://api.windy.com) | Windy |
| `tides_worldtides` | [WorldTides](https://www.worldtides.info) — global tide predictions | WorldTides |
| `currents_stormglass` | [Stormglass](https://stormglass.io) — multi-source tidal/ocean currents | Stormglass |
| `ais_traffic` | [AISStream](https://aisstream.io) — live vessel snapshot | AISStream |

## URL format

The server speaks **Streamable HTTP** on `/mcp`. Pass each provider's key as a query parameter (all optional):

```
https://your-host/mcp?key=WINDY&worldtidesKey=WT&stormglassKey=SG&aisstreamKey=AIS
```

Accepted aliases:

| Provider | Query params | Headers |
| --- | --- | --- |
| Windy | `key`, `windyKey`, `apiKey` | `Authorization: Bearer …`, `X-Windy-Key`, `X-API-Key` |
| WorldTides | `worldtidesKey`, `wtKey` | `X-WorldTides-Key` |
| Stormglass | `stormglassKey`, `sgKey` | `X-Stormglass-Key` |
| AISStream | `aisstreamKey`, `aisKey` | `X-AISStream-Key` |

Where to get keys: [Windy](https://api.windy.com/keys) · [WorldTides](https://www.worldtides.info/developer) · [Stormglass](https://dashboard.stormglass.io/) · [AISStream](https://aisstream.io/apikeys). All except Windy have a usable free tier; everything else works with no key at all.

## Local run

```bash
npm install
npm run dev          # tsx watch
# or
npm run build && npm start
```

Quick test:

```bash
curl -sS -X POST 'http://localhost:8787/mcp' \
  -H 'content-type: application/json' \
  -H 'accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

## Deploy on a VPS

The included `Dockerfile` builds a small Node 22 image listening on `:8787`. Two ways to front it with TLS:

### Option A — Docker Compose + Caddy (self-contained)

```bash
cp .env.example .env
$EDITOR .env          # set DOMAIN and ACME_EMAIL
docker compose up -d --build
```

Caddy obtains a Let's Encrypt certificate automatically and reverse-proxies to the container.

### Option B — existing nginx

Run the container bound to localhost:

```bash
docker compose -f docker-compose.prod.yml up -d --build   # binds 127.0.0.1:8787
```

then add an nginx `server` block that proxies `https://your-host` → `http://127.0.0.1:8787`, with `proxy_buffering off;` on `/mcp` (the MCP Streamable HTTP transport needs unbuffered responses), and obtain a cert with `certbot --nginx -d your-host`.

Health check: `GET /healthz` → `{"ok":true}`. Landing page with a key-URL builder: `GET /`.

## Connect from Claude

### Claude Code

```bash
claude mcp add --transport http sailing "https://your-host/mcp?worldtidesKey=…&stormglassKey=…&aisstreamKey=…"
```

### Claude.ai (Pro / Max / Team / Enterprise)

Settings → **Connectors** → **Add custom connector** → paste the URL. No OAuth required.

### Claude Desktop (any plan, via `mcp-remote`)

```json
{
  "mcpServers": {
    "sailing": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://your-host/mcp?...", "--transport", "http-only"]
    }
  }
}
```

## Example prompts

> "Tomorrow morning Den Helder → Texel: full passage plan — wind, gusts, waves, HW/LW at Marsdiep, when to leave and why."

> "Wind consensus across ECMWF / GFS / ICON-EU / UKMO for Saturday at Marsdiep — where do the models disagree?"

> "What ships are within 5 km of Marsdiep right now? Any TESO ferry inbound?"

> "Find marinas with fuel within 20 km of IJmuiden, and the next bridge openings on the way."

## Notes

- All provider keys are read per-request from the URL/headers and are never logged or persisted.
- All times returned by tools are **UTC**.
- `tides_nl` (Matroos) is more accurate than `tides_worldtides` in Dutch waters; prefer it there.
- NDW bridge data carries only RIS-index codes + coordinates; `bridges_nl` enriches them with bridge names from OpenStreetMap (nearest movable bridge within 80 m). A few may still show "(name unknown)" if OSM has no nearby named bridge.
- AISStream is community-fed; coverage is excellent in coastal Europe/Americas, sparse mid-ocean.
- This is provided as-is for sailing use. **Always verify against official charts, almanacs and notices before relying on it for navigation safety.**

## Project layout

```
src/
  index.ts          # Express + Streamable HTTP transport, per-request key extraction
  server.ts         # MCP server, conditional tool registration
  keys.ts           # RequestKeys type
  landing.ts        # HTML landing page (GET /)
  openmeteo.ts      # Open-Meteo forecast + wind consensus
  windy.ts          # Windy Point Forecast client
  aviationweather.ts# METAR / TAF
  sunmoon.ts        # sun & moon (SunCalc)
  matroos.ts        # RWS Matroos tides (NL)
  rws.ts            # RWS Waterinfo (NL, fallback)
  worldtides.ts     # WorldTides global tides
  stormglass.ts     # Stormglass currents
  osm.ts            # OpenStreetMap / Overpass POIs
  ndw.ts            # NDW bridge schedule (DATEX II)
  nts.ts            # Notices to Skippers (RWS / EU NtS SOAP)
  fairway.ts        # Fairway depths / bridge clearance / locks (RWS FIS WFS)
  aisstream.ts      # AISStream live AIS snapshot
Dockerfile
docker-compose.yml        # + Caddy
docker-compose.prod.yml   # localhost-only, for existing nginx
Caddyfile
```

Built by [@ai_kulikov](https://x.com/ai_kulikov).

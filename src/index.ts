import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express, { type Request, type Response } from "express";
import { createMcpServer } from "./server.js";
import { type RequestKeys } from "./keys.js";
import { LANDING_HTML } from "./landing.js";

const PORT = Number(process.env.PORT ?? 8787);
const HOST = process.env.HOST ?? "0.0.0.0";
const PATH = process.env.MCP_PATH ?? "/mcp";

function extractKeys(req: Request): RequestKeys {
  const q = req.query;
  const windy =
    str(q.key) ||
    str(q.windyKey) ||
    str(q.apiKey) ||
    req.header("x-windy-key") ||
    bearer(req.header("authorization"));
  const worldtides =
    str(q.worldtidesKey) ||
    str(q.wtKey) ||
    req.header("x-worldtides-key");
  const stormglass =
    str(q.stormglassKey) ||
    str(q.sgKey) ||
    req.header("x-stormglass-key");
  const aisstream =
    str(q.aisstreamKey) ||
    str(q.aisKey) ||
    req.header("x-aisstream-key");
  return { windy, worldtides, stormglass, aisstream };
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function bearer(h: string | undefined): string | undefined {
  if (!h) return undefined;
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m ? m[1].trim() : undefined;
}

const app = express();
app.use(express.json({ limit: "2mb" }));

app.get("/", (_req, res) => {
  res
    .type("text/html; charset=utf-8")
    .set("cache-control", "public, max-age=300")
    .send(LANDING_HTML);
});

app.get("/healthz", (_req, res) => {
  res.json({ ok: true });
});

const handleMcp = async (req: Request, res: Response) => {
  const keys = extractKeys(req);
  const server = createMcpServer(keys);
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  res.on("close", () => {
    transport.close().catch(() => {});
    server.close().catch(() => {});
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: err instanceof Error ? err.message : "Internal error",
        },
        id: null,
      });
    }
  }
};

app.post(PATH, handleMcp);
app.get(PATH, (_req, res) => {
  res.status(405).json({
    jsonrpc: "2.0",
    error: { code: -32000, message: "Method Not Allowed. Use POST." },
    id: null,
  });
});
app.delete(PATH, (_req, res) => {
  res.status(405).json({
    jsonrpc: "2.0",
    error: { code: -32000, message: "Method Not Allowed." },
    id: null,
  });
});

app.listen(PORT, HOST, () => {
  console.log(`windy-mcp listening on http://${HOST}:${PORT}${PATH}`);
});

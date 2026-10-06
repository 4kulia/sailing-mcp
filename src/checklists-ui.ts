import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** MCP Apps resource that renders the checklists tool result as an interactive checklist. */
export const CHECKLISTS_UI_URI = "ui://checklists/v1.html";

// The view script is bundled by `npm run build:ui` into dist/ui/. When running from src/ via tsx,
// fall back to the bundle in dist/ so `npm run dev` works after one build.
const BUNDLE_CANDIDATES = [
  new URL("./ui/checklists-app.js", import.meta.url),
  new URL("../dist/ui/checklists-app.js", import.meta.url),
];

let cached: string | undefined;

export function checklistsUiHtml(): string {
  if (cached) return cached;
  let script: string | undefined;
  for (const url of BUNDLE_CANDIDATES) {
    try {
      script = readFileSync(fileURLToPath(url), "utf8");
      break;
    } catch {
      // try next
    }
  }
  if (!script) throw new Error("checklists UI bundle not found — run `npm run build:ui`");
  // A literal "</script" inside the bundle would end the inline script early.
  script = script.replace(/<\/script/gi, "<\\/script");
  cached = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sailing checklist</title>
<style>${CSS}</style>
</head>
<body>
<div id="root"></div>
<script>${script}</script>
</body>
</html>`;
  return cached;
}

// Host style variables (MCP Apps spec) win when provided; the fallbacks keep the view usable elsewhere.
const CSS = `
:root{
  --bg:var(--color-background-primary,#ffffff);
  --bg2:var(--color-background-secondary,#f3f5f7);
  --fg:var(--color-text-primary,#15202b);
  --muted:var(--color-text-secondary,#5b6873);
  --line:var(--color-border-primary,#d5dce1);
  --ink:var(--color-text-primary,#0f2a3f);
  --accent:#e8590c; --accent-soft:#fde7da;
  --ok:var(--color-text-success,#2f7d4f); --ok-soft:var(--color-background-success,#dcefe3);
  --sans:var(--font-sans,system-ui,-apple-system,"Segoe UI",sans-serif);
  --mono:var(--font-mono,ui-monospace,"SF Mono",Menlo,monospace);
  --radius:var(--border-radius-lg,12px);
  color-scheme:light;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --bg:var(--color-background-primary,#16222b); --bg2:var(--color-background-secondary,#111a20);
  --fg:var(--color-text-primary,#e3e9ee); --muted:var(--color-text-secondary,#93a1ac);
  --line:var(--color-border-primary,#2b3a45); --ink:var(--color-text-primary,#cfe0ee);
  --accent:#ff7a33; --accent-soft:#3a2216;
  --ok:var(--color-text-success,#5cc489); --ok-soft:var(--color-background-success,#15301f);
  color-scheme:dark}}
:root[data-theme="dark"]{
  --bg:var(--color-background-primary,#16222b); --bg2:var(--color-background-secondary,#111a20);
  --fg:var(--color-text-primary,#e3e9ee); --muted:var(--color-text-secondary,#93a1ac);
  --line:var(--color-border-primary,#2b3a45); --ink:var(--color-text-primary,#cfe0ee);
  --accent:#ff7a33; --accent-soft:#3a2216;
  --ok:var(--color-text-success,#5cc489); --ok-soft:var(--color-background-success,#15301f);
  color-scheme:dark}
*{box-sizing:border-box}
html,body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 var(--sans)}
#root{border:1px solid var(--line);border-radius:var(--radius);overflow:hidden}
button{font:inherit;color:inherit}
.head{padding:16px 18px 12px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 16px;align-items:end}
.eyebrow{font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--accent)}
.title{grid-column:1;margin:0;font-size:20px;line-height:1.2;font-weight:650;color:var(--ink);text-wrap:balance}
.count{grid-row:1/3;grid-column:2;text-align:right;font:500 24px/1 var(--mono);color:var(--ink);font-variant-numeric:tabular-nums}
.count small{display:block;font:500 11px var(--sans);color:var(--muted);margin-top:4px}
.bar{display:flex;gap:3px;padding:0 18px 14px;border-bottom:1px solid var(--line)}
.bar span{flex:var(--n) 1 0;height:6px;border-radius:2px;background:var(--line);position:relative;overflow:hidden}
.bar b{position:absolute;inset:0 auto 0 0;width:var(--p);background:var(--ok);transition:width .25s}
.sec{border-bottom:1px solid var(--line)}
.sec-head{all:unset;box-sizing:border-box;width:100%;display:flex;align-items:center;gap:10px;padding:11px 18px;cursor:pointer}
.sec-head:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
.chev{width:14px;height:14px;flex:none;color:var(--muted);transition:transform .2s}
.sec[data-open] .chev{transform:rotate(90deg)}
.st{flex:1;min-width:0;font-weight:600}
.pill{display:inline-flex;align-items:center;gap:3px;font:500 12px var(--mono);padding:2px 8px;border-radius:99px;background:var(--bg2);color:var(--muted);white-space:nowrap;font-variant-numeric:tabular-nums}
.pill svg{width:11px;height:11px}
.pill.done{background:var(--ok-soft);color:var(--ok)}
.pill.flag{background:var(--accent-soft);color:var(--accent)}
.notes{padding:0 18px 4px 42px;font-size:13px;color:var(--muted)}
.notes p{margin:0 0 4px}
.items{list-style:none;margin:0;padding:0 18px 10px}
.it{display:grid;grid-template-columns:22px minmax(0,1fr) auto;gap:10px;align-items:start;padding:7px 0;border-top:1px dashed var(--line)}
.it:first-child{border-top:0}
.it input[type=checkbox]{width:18px;height:18px;margin:2px 0 0;accent-color:var(--ok);cursor:pointer}
.it label{cursor:pointer;min-width:0;overflow-wrap:anywhere}
.it.checked label{color:var(--muted);text-decoration:line-through;text-decoration-color:var(--line)}
.it.flagged label{color:var(--fg);text-decoration:none}
.n{font:500 11px var(--mono);color:var(--muted);margin-right:6px}
.fl{all:unset;cursor:pointer;display:flex;padding:2px 4px;border-radius:4px;color:var(--muted)}
.fl:focus-visible{outline:2px solid var(--accent)}
.fl svg{width:16px;height:16px}
.it.flagged .fl{color:var(--accent)}
.note{grid-column:2/4}
.note input{width:100%;font:14px var(--sans);padding:6px 8px;border:1px solid var(--accent);border-radius:6px;background:var(--accent-soft);color:var(--fg)}
.foot{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:12px 18px;background:var(--bg2)}
.btn{font-weight:600;font-size:14px;padding:8px 14px;border-radius:8px;border:1px solid var(--line);background:var(--bg);cursor:pointer}
.btn.primary{background:var(--ink);border-color:var(--ink);color:var(--bg)}
.btn:disabled{opacity:.6;cursor:default}
.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.hint{flex:1 1 200px;min-width:0;font-size:12px;color:var(--muted)}
.credit{margin:0;padding:8px 18px 12px;font-size:12px;color:var(--muted);background:var(--bg2)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;padding:4px 18px 18px}
.card{all:unset;box-sizing:border-box;display:flex;flex-direction:column;gap:4px;padding:12px 14px;border:1px solid var(--line);border-radius:10px;cursor:pointer}
.card:hover,.card:focus-visible{border-color:var(--ink)}
.card b{font-size:16px;color:var(--ink)}
.card span{font-size:13px;color:var(--muted)}
.card em{font:500 12px var(--mono);font-style:normal;color:var(--accent)}
.err{padding:16px;color:var(--accent)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
`;

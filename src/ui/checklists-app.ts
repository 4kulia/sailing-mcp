// Interactive checklist view (MCP Apps). Bundled by esbuild into dist/ui/checklists-app.js
// and inlined into the ui://checklists resource — see src/checklists-ui.ts.
import { App, applyDocumentTheme, applyHostStyleVariables } from "@modelcontextprotocol/ext-apps";
import type { McpUiHostContext } from "@modelcontextprotocol/ext-apps";

interface Section {
  title: string;
  notes?: string[];
  items: string[];
}
interface Checklist {
  id: string;
  title: string;
  summary: string;
  credit?: string;
  sections: Section[];
}
interface IndexEntry {
  id: string;
  title: string;
  summary: string;
  items: number;
}
type Payload =
  | { view: "checklist"; checklist: Checklist }
  | { view: "index"; checklists: IndexEntry[] };

interface Progress {
  /** Item keys "section:item" that are ticked. */
  checked: string[];
  /** Item key → note for items flagged as a problem. */
  flags: Record<string, string>;
}

const STR = {
  en: {
    items: "items",
    checklists: "checklists",
    index: "Sailing checklists",
    flag: "Mark as a problem",
    note: "What's wrong?",
    send: "Send report to chat",
    reset: "Reset",
    resetConfirm: "Tap again to clear",
    hint: (f: number) =>
      f === 0 ? "The assistant sees your progress" : `The assistant sees your progress and ${f} flagged ${f === 1 ? "issue" : "issues"}`,
    loading: "Loading checklist…",
    sent: "Report sent",
    open: (t: string) => `Show me the "${t}" checklist.`,
    report: (title: string, d: number, n: number) => `${title}: ${d} of ${n} items checked, ${n - d} left.`,
    issues: "Problems found:",
    noIssues: "No problems flagged.",
    ask: "Help me deal with the problems and tell me what's left to check.",
  },
  ru: {
    items: "пунктов",
    checklists: "чеклистов",
    index: "Чеклисты для яхтинга",
    flag: "Пометить проблему",
    note: "Что не так?",
    send: "Отправить отчёт в чат",
    reset: "Сбросить",
    resetConfirm: "Нажми ещё раз",
    hint: (f: number) =>
      f === 0 ? "Ассистент видит твой прогресс" : `Ассистент видит прогресс и проблемы: ${f}`,
    loading: "Загружаю чеклист…",
    sent: "Отчёт отправлен",
    open: (t: string) => `Покажи чеклист «${t}».`,
    report: (title: string, d: number, n: number) => `${title}: проверено ${d} из ${n}, осталось ${n - d}.`,
    issues: "Найденные проблемы:",
    noIssues: "Проблем не отмечено.",
    ask: "Помоги разобраться с проблемами и скажи, что осталось проверить.",
  },
};
type Strings = (typeof STR)["en"];

const root = document.getElementById("root")!;
const app = new App({ name: "sailing-checklists", version: "1.0.0" });

let t: Strings = STR.en;
let payload: Payload | undefined;
let progress: Progress = { checked: [], flags: {} };
const open = new Set<number>([0]);
let resetArmed = false;
let contextTimer: ReturnType<typeof setTimeout> | undefined;

const FLAG_SVG =
  '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 14V2.5M3 2.5h8l-1.6 3 1.6 3H3"/></svg>';
const CHEVRON_SVG =
  '<svg class="chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg>';

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}

function applyContext(ctx: McpUiHostContext | undefined): void {
  if (!ctx) return;
  if (ctx.theme) applyDocumentTheme(ctx.theme);
  if (ctx.styles?.variables) applyHostStyleVariables(ctx.styles.variables);
  if (ctx.locale) t = ctx.locale.toLowerCase().startsWith("ru") ? STR.ru : STR.en;
}

// ---- persistence (per checklist, survives re-renders of the same widget in the host) ----

function storageKey(cl: Checklist): string {
  // Item counts per section act as a version: if the list changes, old progress is dropped.
  return `sailing-checklist:${cl.id}:${cl.sections.map((s) => s.items.length).join(".")}`;
}

function loadProgress(cl: Checklist): Progress {
  try {
    const raw = localStorage.getItem(storageKey(cl));
    if (raw) {
      const p = JSON.parse(raw) as Progress;
      if (Array.isArray(p.checked) && p.flags && typeof p.flags === "object") return p;
    }
  } catch {
    // storage unavailable — start fresh
  }
  return { checked: [], flags: {} };
}

function saveProgress(cl: Checklist): void {
  try {
    localStorage.setItem(storageKey(cl), JSON.stringify(progress));
  } catch {
    // ignore
  }
}

// ---- model context ----

function totals(cl: Checklist): { done: number; total: number; flagged: number } {
  const total = cl.sections.reduce((n, s) => n + s.items.length, 0);
  return { done: progress.checked.length, total, flagged: Object.keys(progress.flags).length };
}

function flaggedLines(cl: Checklist): string[] {
  return Object.entries(progress.flags).map(([key, note]) => {
    const [si, ii] = key.split(":").map(Number);
    const section = cl.sections[si];
    const item = section?.items[ii] ?? key;
    return `• ${section?.title ?? ""} — ${item}${note ? ` (${note})` : ""}`;
  });
}

function pushModelContext(cl: Checklist): void {
  clearTimeout(contextTimer);
  contextTimer = setTimeout(() => {
    const { done, total } = totals(cl);
    const checked = new Set(progress.checked);
    const remaining: Record<string, string[]> = {};
    cl.sections.forEach((s, si) => {
      const left = s.items.filter((_, ii) => !checked.has(`${si}:${ii}`));
      if (left.length) remaining[s.title] = left;
    });
    const flags = flaggedLines(cl);
    const text =
      `The user is working through the "${cl.title}" checklist in the interactive widget: ` +
      `${done}/${total} items checked.` +
      (flags.length ? `\nFlagged problems:\n${flags.join("\n")}` : "\nNo problems flagged.");
    app
      .updateModelContext({
        content: [{ type: "text", text }],
        structuredContent: { checklist: cl.id, checked: done, total, flagged: flags, remaining },
      })
      .catch(() => {});
  }, 600);
}

// ---- rendering ----

function renderChecklist(cl: Checklist): void {
  const { done, total, flagged } = totals(cl);
  const checked = new Set(progress.checked);
  let h =
    `<header class="head"><div class="eyebrow">${esc(cl.id.replace(/_/g, " "))}</div>` +
    `<div class="count">${done}/${total}<small>${t.items}</small></div>` +
    `<h1 class="title">${esc(cl.title)}</h1></header>`;
  h += '<div class="bar" aria-hidden="true">';
  cl.sections.forEach((s, si) => {
    const d = s.items.filter((_, ii) => checked.has(`${si}:${ii}`)).length;
    h += `<span style="--n:${s.items.length};--p:${(d / s.items.length) * 100}%"><b></b></span>`;
  });
  h += "</div>";

  cl.sections.forEach((s, si) => {
    const d = s.items.filter((_, ii) => checked.has(`${si}:${ii}`)).length;
    const f = s.items.filter((_, ii) => `${si}:${ii}` in progress.flags).length;
    const isOpen = open.has(si);
    h +=
      `<section class="sec"${isOpen ? " data-open" : ""}>` +
      `<button class="sec-head" data-sec="${si}" aria-expanded="${isOpen}">${CHEVRON_SVG}` +
      `<span class="st">${esc(s.title)}</span>` +
      (f ? `<span class="pill flag">${f} ${FLAG_SVG}</span>` : "") +
      `<span class="pill${d === s.items.length ? " done" : ""}">${d}/${s.items.length}</span></button>`;
    if (isOpen) {
      if (s.notes?.length) h += `<div class="notes">${s.notes.map((n) => `<p>${esc(n)}</p>`).join("")}</div>`;
      h += '<ul class="items">';
      s.items.forEach((item, ii) => {
        const key = `${si}:${ii}`;
        const isChecked = checked.has(key);
        const isFlagged = key in progress.flags;
        const id = `c${si}_${ii}`;
        h +=
          `<li class="it${isChecked ? " checked" : ""}${isFlagged ? " flagged" : ""}">` +
          `<input type="checkbox" id="${id}" data-key="${key}"${isChecked ? " checked" : ""}>` +
          `<label for="${id}"><span class="n">${ii + 1}</span>${esc(item)}</label>` +
          `<button class="fl" data-flag="${key}" aria-label="${t.flag}" title="${t.flag}" aria-pressed="${isFlagged}">${FLAG_SVG}</button>` +
          (isFlagged
            ? `<div class="note"><input id="n${si}_${ii}" data-note="${key}" placeholder="${t.note}" value="${esc(progress.flags[key] ?? "")}"></div>`
            : "") +
          "</li>";
      });
      h += "</ul>";
    }
    h += "</section>";
  });

  h +=
    `<footer class="foot"><button class="btn primary" id="send">${t.send}</button>` +
    `<button class="btn" id="reset">${resetArmed ? t.resetConfirm : t.reset}</button>` +
    `<span class="hint" id="hint">${t.hint(flagged)}</span></footer>`;
  if (cl.credit) h += `<p class="credit">${esc(cl.credit)}</p>`;
  root.innerHTML = h;
}

function renderIndex(list: IndexEntry[]): void {
  root.innerHTML =
    `<header class="head"><div class="eyebrow">sailing-mcp</div>` +
    `<div class="count">${list.length}<small>${t.checklists}</small></div>` +
    `<h1 class="title">${t.index}</h1></header>` +
    `<div class="grid">${list
      .map(
        (c) =>
          `<button class="card" data-open="${esc(c.id)}"><b>${esc(c.title)}</b>` +
          `<span>${esc(c.summary)}</span><em>${c.items} ${t.items}</em></button>`,
      )
      .join("")}</div>`;
}

function render(): void {
  if (!payload) return;
  if (payload.view === "checklist") renderChecklist(payload.checklist);
  else renderIndex(payload.checklists);
}

function show(p: Payload): void {
  payload = p;
  if (p.view === "checklist") {
    progress = loadProgress(p.checklist);
    open.clear();
    // Open the first section that still has unchecked items.
    const checked = new Set(progress.checked);
    const first = p.checklist.sections.findIndex((s, si) => s.items.some((_, ii) => !checked.has(`${si}:${ii}`)));
    open.add(first === -1 ? 0 : first);
  }
  render();
}

function isPayload(v: unknown): v is Payload {
  const p = v as Payload | undefined;
  return !!p && (p.view === "checklist" || p.view === "index");
}

// ---- events ----

function changed(cl: Checklist): void {
  saveProgress(cl);
  pushModelContext(cl);
}

root.addEventListener("click", async (e) => {
  const target = e.target as HTMLElement;
  if (payload?.view === "index") {
    const card = target.closest<HTMLElement>("[data-open]");
    if (!card) return;
    const id = card.dataset.open!;
    const entry = payload.checklists.find((c) => c.id === id);
    card.querySelector("em")!.textContent = t.loading;
    try {
      const res = await app.callServerTool({ name: "checklists", arguments: { checklist: id } });
      if (!res.isError && isPayload(res.structuredContent)) {
        show(res.structuredContent);
        return;
      }
    } catch {
      // host may not support tool calls from the view — fall back to asking in chat
    }
    await app.sendMessage({ role: "user", content: [{ type: "text", text: t.open(entry?.title ?? id) }] }).catch(() => {});
    render();
    return;
  }
  if (payload?.view !== "checklist") return;
  const cl = payload.checklist;

  const sec = target.closest<HTMLElement>("[data-sec]");
  if (sec) {
    const i = Number(sec.dataset.sec);
    if (open.has(i)) open.delete(i);
    else open.add(i);
    render();
    return;
  }
  const flag = target.closest<HTMLElement>("[data-flag]");
  if (flag) {
    const key = flag.dataset.flag!;
    if (key in progress.flags) delete progress.flags[key];
    else progress.flags[key] = "";
    changed(cl);
    render();
    if (key in progress.flags) document.querySelector<HTMLInputElement>(`[data-note="${key}"]`)?.focus();
    return;
  }
  if (target.id === "reset") {
    if (!resetArmed) {
      resetArmed = true;
      render();
      setTimeout(() => {
        resetArmed = false;
        render();
      }, 3000);
      return;
    }
    resetArmed = false;
    progress = { checked: [], flags: {} };
    changed(cl);
    render();
    return;
  }
  if (target.id === "send") {
    const { done, total } = totals(cl);
    const flags = flaggedLines(cl);
    const text = [
      t.report(cl.title, done, total),
      flags.length ? `${t.issues}\n${flags.join("\n")}` : t.noIssues,
      t.ask,
    ].join("\n\n");
    const btn = target as HTMLButtonElement;
    btn.disabled = true;
    await app.sendMessage({ role: "user", content: [{ type: "text", text }] }).catch(() => {});
    btn.disabled = false;
    const hint = document.getElementById("hint");
    if (hint) hint.textContent = t.sent;
  }
});

root.addEventListener("change", (e) => {
  const input = e.target as HTMLInputElement;
  const key = input.dataset.key;
  if (!key || payload?.view !== "checklist") return;
  const set = new Set(progress.checked);
  if (input.checked) set.add(key);
  else set.delete(key);
  progress.checked = [...set];
  changed(payload.checklist);
  render();
  document.getElementById(input.id)?.focus();
});

root.addEventListener("input", (e) => {
  const input = e.target as HTMLInputElement;
  const key = input.dataset.note;
  if (!key || payload?.view !== "checklist") return;
  progress.flags[key] = input.value;
  changed(payload.checklist);
});

// ---- host wiring (handlers must be set before connect) ----

app.ontoolresult = (result) => {
  if (isPayload(result.structuredContent)) show(result.structuredContent);
};
app.onhostcontextchanged = (ctx) => {
  applyContext(ctx);
  render();
};

app
  .connect()
  .then(() => {
    applyContext(app.getHostContext());
    render();
  })
  .catch((err) => {
    root.innerHTML = `<p class="err">${esc(String(err))}</p>`;
  });

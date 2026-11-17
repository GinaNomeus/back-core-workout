// Back & Core: a guided weekly workout. The app keeps nothing personal for long:
// the only thing saved on the phone is the workout in progress, and feedback is
// sent to Claude, who keeps the record in Dremur.

const DOC_TITLE = "Back & Core: preferences and workout log";
const KEY = "bcw.session";
const view = document.getElementById("view");
let plan = null;
let timers = [];

// ---------- helpers ----------
const $ = (sel) => view.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const ex = (id) => EXERCISES[id];
const videoUrl = (e) => "https://www.youtube.com/results?search_query=" + encodeURIComponent(e.video);

function figure(id, paused) {
  const f = ex(id).figure;
  return `<svg class="figure${paused ? " paused" : ""}" viewBox="0 0 260 168" role="img" aria-label="${esc(ex(id).name)}">` +
    `${f.still}<g class="fa">${f.a}</g><g class="fb">${f.b}</g></svg>`;
}

function clearTimers() { timers.forEach(clearInterval); timers = []; }

function beep(freq = 880, ms = 180) {
  try {
    const ctx = beep.ctx || (beep.ctx = new (window.AudioContext || window.webkitAudioContext)());
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.value = freq; o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.25, ctx.currentTime);
    o.start(); o.stop(ctx.currentTime + ms / 1000);
  } catch (e) { /* sound is optional */ }
  if (navigator.vibrate) navigator.vibrate(200);
}

let wakeLock = null;
async function keepAwake(on) {
  try {
    if (on && "wakeLock" in navigator && !wakeLock) wakeLock = await navigator.wakeLock.request("screen");
    if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch (e) { /* not supported */ }
}

// ---------- plan & session ----------
function steps() {
  const out = plan.warmup.map((s) => ({ ...s, section: "Warm-up", warm: true }));
  for (let r = 1; r <= plan.rounds; r++) {
    plan.exercises.forEach((s) => out.push({ ...s, section: `Round ${r} of ${plan.rounds}`, round: r }));
  }
  return out.map((s) => ({ ...s, dose: s.dose || ex(s.id).dose }));
}

function loadSession() {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { s = null; }
  if (!s || s.number !== plan.number) {
    s = { number: plan.number, step: 0, done: {}, ratings: {}, weights: {}, pain: null, notes: "", sent: false, started: null };
  }
  return s;
}
function saveSession(s) { localStorage.setItem(KEY, JSON.stringify(s)); }

// ---------- views ----------
function home() {
  const s = loadSession();
  const doneCount = Object.keys(s.done).length;
  const started = doneCount > 0 && !s.sent;
  const list = (items) => items.map((it) => {
    const e = ex(it.id);
    return `<li><a href="#/ex/${it.id}"><span class="thumb">${figure(it.id, true)}</span>
      <span><b>${esc(e.name)}</b><br><span class="muted">${esc(it.dose || e.dose)}</span></span></a></li>`;
  }).join("");
  view.innerHTML = `
    <div class="card hero">
      <div class="row spread"><h2 style="margin:0">Workout #${plan.number}</h2><span class="tag">≈10 min</span></div>
      ${plan.note ? `<p>${esc(plan.note)}</p>` : ""}
      ${s.sent ? `<p class="okmsg">✓ Done and sent to Claude. Your next workout will appear here soon.</p>` : ""}
      <a class="btn block" href="#/go">${started ? "Continue workout" : s.sent ? "Do it again" : "Start workout"}</a>
      ${started || s.sent ? `<p class="center"><a class="muted" href="#/feedback">Feedback screen</a></p>` : ""}
    </div>
    <h2>Warm-up · 2 min</h2>
    <ul class="plan">${list(plan.warmup)}</ul>
    <h2>Then ${plan.rounds} rounds · rest ${plan.restSeconds} s between</h2>
    <ul class="plan">${list(plan.exercises)}</ul>
    <div class="card muted small">
      <b>Pain rule of thumb:</b> mild discomfort (up to about 3/10) is OK if it settles by the next day.
      Stop an exercise if you get sharp pain or pain shooting down a leg.
    </div>`;
}

function exercisePage(id) {
  const e = ex(id);
  if (!e) { location.hash = "#/"; return; }
  view.innerHTML = `
    <p><a href="javascript:history.back()" class="muted">← Back</a></p>
    ${figure(id)}
    <h2>${esc(e.name)}</h2>
    <span class="pill">${esc(e.dose)}</span> <span class="tag">${esc(SLOTS[e.slot] || STRETCH_AREAS[e.area] || "")}</span>
    <ul class="cues">${e.cues.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
    <p class="why">${esc(e.why)}</p>
    <a class="vid" href="${videoUrl(e)}" target="_blank" rel="noopener">▶ Watch videos of this exercise</a>`;
}

function go() {
  if (!loadSession().started) { const s = loadSession(); s.started = new Date().toISOString(); saveSession(s); }
  keepAwake(true);
  renderStep();
}

function renderStep() {
  clearTimers();
  const s = loadSession();
  const all = steps();
  const i = Math.min(s.step, all.length - 1);
  const st = all[i];
  const e = ex(st.id);
  const hold = e.kind === "hold";
  const secs = st.seconds || e.seconds || 20;
  view.innerHTML = `
    <div class="row spread"><span class="muted">${esc(st.section)}</span><span class="muted">${i + 1} / ${all.length}</span></div>
    <div class="progress"><div style="width:${(i / all.length) * 100}%"></div></div>
    ${figure(st.id)}
    <h2>${esc(e.name)}</h2>
    <span class="pill">${esc(st.dose)}</span>
    ${hold ? `<div class="timer" id="tm">${secs}<small>${e.perSide ? "seconds · side 1" : "seconds"}</small></div>
      <button class="btn light block" id="tstart">Start ${secs} s timer${e.perSide ? " (then switch sides)" : ""}</button>` : ""}
    <ul class="cues">${e.cues.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
    <a class="vid" href="${videoUrl(e)}" target="_blank" rel="noopener">▶ Watch videos</a>
    <div class="row stick">
      <button class="btn ghost" id="back" ${i === 0 ? "disabled" : ""}>←</button>
      <button class="btn" id="done" style="flex:1">${i === all.length - 1 ? "Done: give feedback" : "Done ✓"}</button>
    </div>`;
  $("#back").onclick = () => { s.step = Math.max(0, i - 1); saveSession(s); renderStep(); };
  $("#done").onclick = () => {
    s.done[i] = true;
    s.step = i + 1;
    saveSession(s);
    if (i === all.length - 1) { keepAwake(false); location.hash = "#/feedback"; return; }
    if (!st.warm) rest(all[i + 1]); else renderStep();
  };
  if (hold) $("#tstart").onclick = () => runHold(secs, e.perSide);
}

function runHold(secs, perSide, tm = $("#tm"), btn = $("#tstart")) {
  clearTimers();
  btn.disabled = true;
  const phases = perSide ? [["side 1", secs], ["switch sides", 5], ["side 2", secs]] : [["hold", secs]];
  let p = 0, left = phases[0][1];
  beep(660);
  const show = () => { tm.innerHTML = `${left}<small>seconds · ${phases[p][0]}</small>`; };
  show();
  timers.push(setInterval(() => {
    left--;
    if (left <= 3 && left > 0) beep(520, 80);
    if (left <= 0) {
      p++;
      beep(990, 300);
      if (p >= phases.length) {
        clearTimers();
        tm.innerHTML = `✓<small>done</small>`;
        btn.disabled = false; btn.textContent = "Again";
        return;
      }
      left = phases[p][1];
    }
    show();
  }, 1000));
}

function rest(next) {
  let left = plan.restSeconds;
  const ov = document.createElement("div");
  ov.className = "overlay";
  ov.innerHTML = `<div>Rest</div><div class="timer" id="rt">${left}<small>seconds</small></div>
    <div class="next">Next: <b>${esc(ex(next.id).name)}</b></div>
    <button class="btn">Skip rest</button>`;
  document.body.appendChild(ov);
  const finish = () => { clearTimers(); ov.remove(); renderStep(); };
  ov.querySelector("button").onclick = finish;
  timers.push(setInterval(() => {
    left--;
    ov.querySelector("#rt").innerHTML = `${left}<small>seconds</small>`;
    if (left === 3) beep(520, 80);
    if (left <= 0) { beep(990, 300); finish(); }
  }, 1000));
}

function feedback() {
  keepAwake(false);
  const s = loadSession();
  const all = steps();
  const rated = [...plan.warmup, ...plan.exercises];
  const opts = [["love", "❤️ Loved"], ["ok", "👍 OK"], ["no", "👎 Don't love"]];
  view.innerHTML = `
    <h2>How was Workout #${plan.number}?</h2>
    <p class="muted">Tap what you thought of each exercise. Anything you skip is fine.</p>
    ${rated.map((it) => {
      const e = ex(it.id);
      const rounds = all.filter((st, k) => st.id === it.id && s.done[k]).length;
      return `<div class="card">
        <div class="row">${`<span class="thumb">${figure(it.id, true)}</span>`}
          <div><b>${esc(e.name)}</b><br><span class="muted small">${it.warm || plan.warmup.includes(it) ? "warm-up" : rounds ? `done: ${rounds} of ${plan.rounds} rounds` : "not checked off"}</span></div></div>
        <div class="seg" data-id="${it.id}">${opts.map(([v, l]) =>
          `<button class="${s.ratings[it.id] === v ? "on" : ""}" data-v="${v}">${l}</button>`).join("")}</div>
        ${e.weighted ? `<input class="wt" data-id="${it.id}" placeholder="Weight used (e.g. 8 lb)" value="${esc(s.weights[it.id] || "")}">` : ""}
      </div>`;
    }).join("")}
    <div class="card">
      <b>Back pain today</b>
      <div class="row spread"><span class="painval" id="pv">${s.pain === null ? "–" : s.pain}</span><span class="muted small">0 = none · 10 = worst</span></div>
      <input type="range" min="0" max="10" step="1" id="pain" value="${s.pain === null ? 0 : s.pain}">
    </div>
    <div class="card">
      <b>Anything else?</b>
      <p class="muted small">Tap the 🎤 on your keyboard to say it out loud.</p>
      <textarea id="notes" placeholder="e.g. The leg lift felt great, I have a mat now…">${esc(s.notes)}</textarea>
    </div>
    <button class="btn block" id="send">Copy feedback for Claude</button>
    ${navigator.share ? `<button class="btn ghost block" id="share" style="margin-top:8px">Share… (if Claude is in your share menu)</button>` : ""}
    <div id="out"></div>`;

  view.querySelectorAll(".seg").forEach((seg) => seg.addEventListener("click", (ev) => {
    const b = ev.target.closest("button"); if (!b) return;
    const id = seg.dataset.id;
    s.ratings[id] = s.ratings[id] === b.dataset.v ? undefined : b.dataset.v;
    seg.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x.dataset.v === s.ratings[id]));
    saveSession(s);
  }));
  view.querySelectorAll(".wt").forEach((inp) => inp.addEventListener("input", () => { s.weights[inp.dataset.id] = inp.value; saveSession(s); }));
  $("#pain").addEventListener("input", (ev) => { s.pain = Number(ev.target.value); $("#pv").textContent = s.pain; saveSession(s); });
  $("#notes").addEventListener("input", (ev) => { s.notes = ev.target.value; saveSession(s); });
  $("#send").onclick = () => send(s, all, false);
  if ($("#share")) $("#share").onclick = () => send(s, all, true);
}

function message(s, all) {
  const label = { love: "loved", ok: "OK", no: "don't love" };
  const day = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const lines = [
    `Back & Core: feedback for Workout #${plan.number} (${day})`,
    `Please save this in my Dremur document "${DOC_TITLE}" as the log entry for Workout #${plan.number}, and update my loved / not loved lists if anything changed.`,
    "",
  ];
  plan.warmup.forEach((it) => {
    const bits = ["warm-up"]; if (s.ratings[it.id]) bits.push(label[s.ratings[it.id]]);
    lines.push(`- ${ex(it.id).name} (${it.id}): ${bits.join(", ")}`);
  });
  plan.exercises.forEach((it) => {
    const rounds = all.filter((st, k) => st.id === it.id && s.done[k]).length;
    const bits = [rounds ? `${rounds} of ${plan.rounds} rounds` : "not checked off"];
    if (s.weights[it.id]) bits.push(`weight: ${s.weights[it.id]}`);
    if (s.ratings[it.id]) bits.push(label[s.ratings[it.id]]);
    lines.push(`- ${ex(it.id).name} (${it.id}): ${bits.join(", ")}`);
  });
  lines.push("", `Back pain today: ${s.pain === null ? "not rated" : s.pain + "/10"}`);
  if (s.notes.trim()) lines.push(`Notes: ${s.notes.trim()}`);
  return lines.join("\n");
}

// Main button: copy the feedback, then paste it into the Claude app.
// (A web app can't post into another app directly; the share menu is the other way.)
async function send(s, all, viaShare) {
  const text = message(s, all);
  const out = $("#out");
  let how = "copied";
  if (viaShare && navigator.share) {
    try { await navigator.share({ title: `Workout #${plan.number} feedback`, text }); how = "shared"; }
    catch (e) { if (e.name === "AbortError") return; }
  }
  if (how === "copied") {
    try { await navigator.clipboard.writeText(text); } catch (e) { how = "manual"; }
  }
  s.sent = true; saveSession(s);
  const msg = {
    copied: "<b>Copied!</b> Now open the Claude app, start a chat, paste (press and hold, then Paste) and send.",
    shared: "<b>Shared.</b> If you picked Claude, just send it there.",
    manual: "Press and hold the text below, Select All, Copy, then paste it into a chat in the Claude app.",
  }[how];
  out.innerHTML = `<div class="card">
    <p>${msg} Claude saves it to Dremur, and your next workout appears here by the next morning.</p>
    <textarea readonly rows="8">${esc(text)}</textarea>
    <a class="btn light block" href="#/">Back to today</a></div>`;
  out.scrollIntoView({ behavior: "smooth" });
}

function library() {
  const order = ["warmup", "hinge", "pull", "frontcore", "sidecore", "extra"];
  view.innerHTML = `<p class="muted">Every exercise the app can choose from. Claude picks 5 for each workout, one for each job, based on what you love and the equipment you have.</p>` +
    order.map((slot) => `<h2>${esc(SLOTS[slot])}</h2><ul class="plan">` +
      Object.entries(EXERCISES).filter(([, e]) => e.slot === slot).map(([id, e]) =>
        `<li><a href="#/ex/${id}"><span class="thumb">${figure(id, true)}</span>
          <span><b>${esc(e.name)}</b><br><span class="muted small">${e.equipment.length ? "Needs: " + e.equipment.join(", ") : "No equipment"}</span></span></a></li>`).join("") +
      "</ul>").join("") +
    `<h2>How this app works</h2><div class="card small">
      <p>1. Do this week's workout here. 2. Send your feedback to Claude, from the feedback screen or just by talking.
      3. Claude saves it in your private Dremur document "${esc(DOC_TITLE)}". 4. A helper on your laptop chooses your next 5 exercises and publishes them here.</p>
      <p class="muted">Your likes, pain ratings and history are never stored in this app or on GitHub.</p></div>`;
}

// ---------- evening stretches ----------
const WHERE = { floor: "on the floor", couch: "on the couch", standing: "standing" };

function stretchPage() {
  const key = "bcw.stretch." + new Date().toDateString();
  let done = {};
  try { done = JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { done = {}; }
  Object.keys(localStorage).filter((k) => k.startsWith("bcw.stretch.") && k !== key).forEach((k) => localStorage.removeItem(k));
  const total = STRETCH_ROUTINE.reduce((n, g) => n + g.ids.length, 0);
  const card = (id) => {
    const e = ex(id), hold = e.kind === "hold", secs = e.seconds || 30;
    return `<div class="card stretch${done[id] ? " done" : ""}" data-id="${id}">
      ${figure(id)}
      <div class="row spread" style="margin-top:8px"><h3>${esc(e.name)}</h3>
        <button class="check${done[id] ? " on" : ""}" aria-label="Done">${done[id] ? "✓" : ""}</button></div>
      <span class="pill">${esc(e.dose)}</span> <span class="tag">${esc(WHERE[e.where] || "on the floor")}</span>
      ${hold ? `<div class="timer small-timer">${secs}<small>${e.perSide ? "seconds · side 1" : "seconds"}</small></div>
        <button class="btn light block tbtn">Start ${secs} s timer${e.perSide ? " (then switch sides)" : ""}</button>` : ""}
      <ul class="cues">${e.cues.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
      <a class="vid" href="${videoUrl(e)}" target="_blank" rel="noopener">▶ Watch videos</a>
    </div>`;
  };
  view.innerHTML = `
    <div class="card hero">
      <div class="row spread"><h2 style="margin:0">Evening stretches</h2><span class="tag">≈10 min</span></div>
      <p>Gentle stretches for your lower, middle and upper back: on the couch or the floor while you watch TV.
      Do them in any order, and skip any that don't feel good.</p>
      <p class="muted small" id="count">${Object.keys(done).length} of ${total} done tonight</p>
    </div>
    <div class="card small gentle">
      <b>When your back hurts</b>
      <ul class="cues">
        <li>Move slowly and stretch only to a mild, comfortable pull, never into pain. No bouncing.</li>
        <li>Breathe out slowly as you settle into each stretch.</li>
        <li>Stop a stretch if pain gets sharper or runs down a leg.</li>
        <li>During TV, get up and walk around for a minute every 30–45 minutes. Long sitting stiffens the low back.</li>
      </ul>
      <p class="muted">See a doctor if the pain is severe or getting worse, lasts more than a few weeks, or comes with numbness, tingling or weakness in a leg, bladder or bowel changes, or fever.</p>
    </div>
    ${STRETCH_ROUTINE.map((g) => `<h2>${esc(STRETCH_AREAS[g.area])}</h2>${g.ids.map(card).join("")}`).join("")}`;

  view.querySelectorAll(".stretch").forEach((c) => {
    const id = c.dataset.id, e = ex(id);
    const tb = c.querySelector(".tbtn");
    if (tb) tb.onclick = () => runHold(e.seconds || 30, e.perSide, c.querySelector(".timer"), tb);
    c.querySelector(".check").onclick = (ev) => {
      if (done[id]) delete done[id]; else done[id] = true;
      localStorage.setItem(key, JSON.stringify(done));
      c.classList.toggle("done", !!done[id]);
      ev.currentTarget.classList.toggle("on", !!done[id]);
      ev.currentTarget.textContent = done[id] ? "✓" : "";
      $("#count").textContent = `${Object.keys(done).length} of ${total} done tonight`;
    };
  });
}

// ---------- router ----------
function route() {
  clearTimers();
  document.querySelectorAll(".overlay").forEach((o) => o.remove());
  const h = location.hash || "#/";
  const tab = h.startsWith("#/library") ? "library" : h.startsWith("#/stretch") ? "stretch" : "home";
  document.querySelectorAll(".tabs a").forEach((a) => a.classList.toggle("on", a.dataset.tab === tab));
  window.scrollTo(0, 0);
  if (h.startsWith("#/go")) return go();
  if (h.startsWith("#/feedback")) return feedback();
  if (h.startsWith("#/ex/")) return exercisePage(h.slice(5));
  if (h.startsWith("#/library")) return library();
  if (h.startsWith("#/stretch")) { keepAwake(true); return stretchPage(); }
  keepAwake(false);
  home();
}

async function start() {
  if (window.TEST_PLAN) { plan = window.TEST_PLAN; window.addEventListener("hashchange", route); return route(); }
  try {
    const r = await fetch("workout.json", { cache: "no-cache" });
    plan = await r.json();
  } catch (e) {
    view.innerHTML = `<div class="card">Couldn't load this week's workout. Check your connection and reload.</div>`;
    return;
  }
  window.addEventListener("hashchange", route);
  route();
}

if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js");
start();

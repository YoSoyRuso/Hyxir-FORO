/* ============================================================
   VERDAD AI — GAME ENGINE
   ============================================================ */
(() => {

  /* ----------------------------------------------------------
     ESTADO
     ---------------------------------------------------------- */
  const STORAGE_KEY = "verdad_ai_state_v1";

  const defaultState = () => ({
    caseId: null,
    prediction: null,
    discovered: [],           // strings de descubrimientos
    unlockedFiles: [],        // ids de documentos desbloqueados
    flags: {},                // banderas arbitrarias
    notes: "",
    phoneFinale: false,
    caseStatus: "OPEN"
  });

  let state = load();
  let currentCase = null;

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e){}
  }
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...defaultState(), ...JSON.parse(raw) };
    } catch(e){}
    return defaultState();
  }

  /* ----------------------------------------------------------
     HELPERS
     ---------------------------------------------------------- */
  const $  = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  function discover(label) {
    if (!state.discovered.includes(label)) {
      state.discovered.push(label);
      save();
      renderDiscoveries();
    }
  }

  function unlockFile(id) {
    if (!state.unlockedFiles.includes(id)) {
      state.unlockedFiles.push(id);
      save();
    }
  }

  function isUnlocked(id) {
    return state.unlockedFiles.includes(id);
  }

  function setFlag(k, v=true) {
    state.flags[k] = v;
    save();
  }

  /* ----------------------------------------------------------
     BOOT
     ---------------------------------------------------------- */
  const bootLog = $("#bootLog");
  const startBtn = $("#startBtn");

  const bootLines = [
    "> VERDAD.AI v0.9.4",
    "> loading predictive engine...",
    "> loading case database...",
    "> 1 case available.",
    "> awaiting user input.",
    ""
  ];

  let bi = 0, bj = 0;
  function typeBoot() {
    if (bi >= bootLines.length) {
      startBtn.classList.remove("hidden");
      return;
    }
    const line = bootLines[bi];
    if (bj <= line.length) {
      bootLog.textContent =
        bootLines.slice(0, bi).join("\n") +
        (bi > 0 ? "\n" : "") +
        line.slice(0, bj);
      bj++;
      setTimeout(typeBoot, 22);
    } else {
      bi++; bj = 0;
      setTimeout(typeBoot, 200);
    }
  }
  typeBoot();

  /* ----------------------------------------------------------
     INICIO DEL CASO
     ---------------------------------------------------------- */
  startBtn.addEventListener("click", () => {
    // Si ya hay partida, entra directo
    if (state.caseId) {
      currentCase = window.CASES.find(c => c.caseId === state.caseId);
      enterApp();
      return;
    }
    // Si no, lanza predicción
    $("#boot").classList.add("hidden");
    $("#predict").classList.remove("hidden");
    runPrediction();
  });

  function runPrediction() {
    const c = window.CASES[0];
    currentCase = c;
    state.caseId = c.caseId;
    state.prediction = c.prediction;
    save();

    const el = $("#prediction");
    // Animación: números aleatorios hasta asentarse
    let ticks = 0;
    const interval = setInterval(() => {
      el.textContent = Math.floor(Math.random() * 99) + 1;
      ticks++;
      if (ticks > 30) {
        clearInterval(interval);
        el.textContent = c.prediction;
        $("#enterNet").classList.remove("hidden");
      }
    }, 60);
  }

  $("#enterNet").addEventListener("click", enterApp);

  /* ----------------------------------------------------------
     APP
     ---------------------------------------------------------- */
  function enterApp() {
    $("#boot").classList.add("hidden");
    $("#predict").classList.add("hidden");
    $("#app").classList.remove("hidden");
    $("#predChip").textContent = "PRED: " + state.prediction;
    $("#caseStatus").textContent = state.caseStatus;
    $("#notes").value = state.notes || "";
    renderDiscoveries();
    renderView("home");
    seedAi();
  }

  /* ----------------------------------------------------------
     TABS
     ---------------------------------------------------------- */
  $$(".tab").forEach(t => {
    t.addEventListener("click", () => {
      $$(".tab").forEach(x => x.classList.remove("active"));
      t.classList.add("active");
      renderView(t.dataset.view);
    });
  });

  /* ----------------------------------------------------------
     RESET
     ---------------------------------------------------------- */
  $("#resetBtn").addEventListener("click", () => {
    if (!confirm("Reset all progress?")) return;
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });

  /* ----------------------------------------------------------
     NOTES (autoguardado)
     ---------------------------------------------------------- */
  $("#notes").addEventListener("input", (e) => {
    state.notes = e.target.value;
    save();
  });

  /* ----------------------------------------------------------
     DESCUBRIMIENTOS
     ---------------------------------------------------------- */
  function renderDiscoveries() {
    const ul = $("#discoveries");
    ul.innerHTML = "";
    if (!state.discovered.length) {
      ul.innerHTML = '<li class="empty">Nothing discovered yet.</li>';
      return;
    }
    state.discovered.forEach(d => {
      const li = document.createElement("li");
      li.textContent = d;
      ul.appendChild(li);
    });
  }

  /* ==========================================================
     VISTAS
     ========================================================== */
  const view = $("#view");

  function renderView(name) {
    view.innerHTML = "";
    switch(name) {
      case "home":         return renderHome();
      case "7.net":        return renderSeven();
      case "archive.net":  return renderArchive();
      case "people.net":   return renderPeople();
      case "news.net":     return renderNews();
      case "forum.net":    return renderForum();
      case "files.net":    return renderFiles();
      case "radio.net":    return renderRadio();
      case "maps.net":     return renderMaps();
      case "terminal.net": return renderTerminal();
    }
  }

  /* -------------------- HOME -------------------- */
  function renderHome() {
    const c = currentCase;
    const html = `
      <h2>HOME</h2>
      <p class="lead">VERDAD generated a single prediction. You must determine what it means.</p>
      <div class="doc" style="text-align:center;font-size:48px;color:var(--accent);letter-spacing:8px;">${state.prediction}</div>
      <p class="lead" style="margin-top:16px;">
        Available websites: <b>7.net</b>, <b>archive.net</b>, <b>people.net</b>,
        <b>news.net</b>, <b>forum.net</b>, <b>files.net</b>, <b>radio.net</b>,
        <b>maps.net</b>, <b>terminal.net</b>.
      </p>
      <p class="lead">
        Use the search bars, read documents, and cross-reference what you find.
        When you are confident about a phone number, use <b>terminal.net</b> to call it.
      </p>
    `;
    view.innerHTML = html;
  }

  /* -------------------- 7.net (buscador global) -------------------- */
  function renderSeven() {
    const html = `
      <h2>7.net — GLOBAL DATABASE</h2>
      <p class="lead">Search anything: numbers, names, places, keywords.</p>
      <form class="searchbar" id="sevenForm">
        <input id="sevenInput" placeholder="search..." autocomplete="off" />
        <button class="btn" type="submit">SEARCH</button>
      </form>
      <div id="sevenResults"></div>
    `;
    view.innerHTML = html;

    $("#sevenForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const q = $("#sevenInput").value.trim().toLowerCase();
      if (!q) return;
      const results = searchSeven(q);
      const box = $("#sevenResults");
      box.innerHTML = "";
      if (!results.length) {
        box.innerHTML = `<p class="dim">No results for "${q}".</p>`;
        return;
      }
      results.forEach(r => {
        const btn = document.createElement("button");
        btn.className = "result";
        btn.innerHTML =
          `<span class="tag ${r.tagClass||''}">${r.tag}</span>${r.title}
           <div class="meta">${r.meta||''}</div>`;
        btn.addEventListener("click", r.action);
        box.appendChild(btn);
      });
    });
  }

  function searchSeven(q) {
    const c = currentCase;
    const out = [];

    // "43" o "43" como palabra → apunta a ARCHIVE-043
    if (q === "43" || q.includes("43")) {
      out.push({
        tag: "ARCHIVE", tagClass: "warn",
        title: "ARCHIVE-043 — Motel Blackwood fire",
        meta: "filed 1998-10-17 · partially redacted",
        action: () => gotoDoc("ARCHIVE-043", "archive.net")
      });
      if (!state.flags.found43) {
        discover("43 → ARCHIVE-043 (leads to archive.net)");
        setFlag("found43");
      }
    }
    if (q.includes("hale") || q.includes("marcus")) {
      out.push({
        tag: "PEOPLE", title: "Marcus Hale — MISSING",
        meta: "last seen: Motel Blackwood",
        action: () => { setTab("people.net"); renderPeople(); }
      });
      out.push({
        tag: "NEWS", title: "Local man reported missing",
        meta: "news.net / 2026-10-18",
        action: () => { setTab("news.net"); renderNews(); }
      });
    }
    if (q.includes("blackwood") || q.includes("motel")) {
      out.push({
        tag: "ARCHIVE", title: "ARCHIVE-043 — Motel Blackwood",
        action: () => gotoDoc("ARCHIVE-043", "archive.net")
      });
      out.push({
        tag: "NEWS", title: "Fire consumes Motel Blackwood (1998)",
        action: () => { setTab("news.net"); renderNews(); }
      });
      out.push({
        tag: "FILES", title: "files.net — document portal",
        meta: "requires password",
        action: () => { setTab("files.net"); renderFiles(); }
      });
    }
    if (q.includes("1943") || q.includes("year")) {
      out.push({
        tag: "ARCHIVE", title: "ARCHIVE-1943 — unrelated fire, same district",
        meta: "decoy entry · not linked to the Hale case",
        action: () => showRedHerring1943()
      });
    }
    if (q.includes("password") || q.includes("key")) {
      out.push({
        tag: "HINT", title: "Password pattern: place + year, no space, caps.",
        meta: "source: forum.net / f4",
        action: () => { setTab("forum.net"); renderForum(); }
      });
    }
    if (q.includes("october") || q.includes("17") || q.includes("17th")) {
      out.push({
        tag: "HINT", title: "Date 10-17 appears in multiple events.",
        meta: "see ARCHIVE-043 and news.net",
        action: () => gotoDoc("ARCHIVE-043", "archive.net")
      });
    }
    return out;
  }

  /* -------------------- ARCHIVE.NET -------------------- */
  function renderArchive() {
    const html = `
      <h2>archive.net — HISTORICAL RECORDS</h2>
      <p class="lead">Search the archive by keyword.</p>
      <form class="searchbar" id="archForm">
        <input id="archInput" placeholder="keyword..." autocomplete="off" />
        <button class="btn" type="submit">SEARCH</button>
      </form>
      <div id="archResults"></div>
    `;
    view.innerHTML = html;
    // autocompletar con lo que el jugador ya sabe
    if (state.flags.found43) $("#archInput").value = "43";

    $("#archForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const q = $("#archInput").value.trim().toLowerCase();
      const box = $("#archResults");
      box.innerHTML = "";

      if (q.includes("43") || q.includes("blackwood")) {
        const b = document.createElement("button");
        b.className = "result";
        b.innerHTML = `<span class="tag warn">ENTRY</span>ARCHIVE-043
          <div class="meta">Motel Blackwood fire · 1998-10-17 · redacted</div>`;
        b.addEventListener("click", () => gotoDoc("ARCHIVE-043", "archive.net"));
        box.appendChild(b);
      }
      if (q.includes("1943")) {
        const b = document.createElement("button");
        b.className = "result";
        b.innerHTML = `<span class="tag">ENTRY</span>ARCHIVE-1943
          <div class="meta">unrelated · decoy</div>`;
        b.addEventListener("click", showRedHerring1943);
        box.appendChild(b);
      }
      if (!box.children.length) {
        box.innerHTML = `<p class="dim">No archive entries match "${q}".</p>`;
      }
    });
  }

  function gotoDoc(id, source) {
    const doc = currentCase.documents[id];
    if (!doc) return;
    renderDocView(doc, source);
  }

  function renderDocView(doc, source) {
    // Si está bloqueado por contraseña
    if (doc.password && !isUnlocked(doc.title)) {
      view.innerHTML = `
        <h2>${source} — ${doc.title}</h2>
        <div class="locked">
          🔒 This document is password-protected.<br><br>
          Hint: the password is hidden somewhere in the network.<br>
          Use <b>files.net</b> to enter it.
        </div>
      `;
      return;
    }

    view.innerHTML = `
      <h2>${source} — DOCUMENT</h2>
      <div class="doc">${escapeHtml(doc.body)}</div>
      <button class="wiki-btn" id="wikiBtn">SEARCH RELATED CONCEPT ON WIKIPEDIA</button>
    `;

    // Wikipedia: solo si hay un término real relacionado
    const wikiTerm = pickWikiTerm(doc.title);
    if (wikiTerm) {
      $("#wikiBtn").addEventListener("click", () => {
        window.open("https://en.wikipedia.org/wiki/Special:Search?search=" + encodeURIComponent(wikiTerm), "_blank");
      });
    } else {
      $("#wikiBtn").style.display = "none";
    }

    // Descubrimientos al leer
    if (doc.title === "ARCHIVE-043") {
      discover("ARCHIVE-043 read");
      setFlag("read_archive043");
    }
    if (doc.title === "CROSS-REF-43") {
      discover("CROSS-REF-43 read → phone 555-0143 revealed");
      setFlag("read_crossref");
    }
    if (doc.title === "MEMO-KOWALSKI") {
      discover("Detective memo read");
    }
  }

  function pickWikiTerm(title) {
    // Solo para conceptos reales, no personajes ficticios
    if (title === "ARCHIVE-043") return "Motel";
    return null;
  }

  /* -------------------- PEOPLE.NET -------------------- */
  function renderPeople() {
    const html = `
      <h2>people.net — PUBLIC RECORDS</h2>
      <p class="lead">Search for persons by name or identifier.</p>
      <form class="searchbar" id="pplForm">
        <input id="pplInput" placeholder="name..." autocomplete="off" />
        <button class="btn" type="submit">SEARCH</button>
      </form>
      <div id="pplResults"></div>
    `;
    view.innerHTML = html;

    $("#pplForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const q = $("#pplInput").value.trim().toLowerCase();
      const box = $("#pplResults");
      box.innerHTML = "";

      const hits = currentCase.characters.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q)
      );

      if (!hits.length) {
        box.innerHTML = `<p class="dim">No person found for "${q}".</p>`;
        return;
      }

      hits.forEach(p => {
        const b = document.createElement("button");
        b.className = "result";
        b.innerHTML =
          `<span class="tag ${p.role.includes('MISSING')?'danger':'ok'}">${p.role}</span>${p.name}
           <div class="meta">Age ${p.age} · Last location: ${p.lastLocation}</div>`;
        b.addEventListener("click", () => renderPersonDetail(p));
        box.appendChild(b);
      });

      if (q.includes("marcus") && !state.flags.found_marcus) {
        discover("Marcus Hale identified");
        setFlag("found_marcus");
      }
    });
  }

  function renderPersonDetail(p) {
    view.innerHTML = `
      <h2>people.net — ${p.name}</h2>
      <div class="doc">Name:    ${p.name}
Age:     ${p.age}
Role:    ${p.role}
Status:  ${p.status}
Last:    ${p.lastLocation}

Record:
${p.publicRecord}

Notes:
${p.notes}</div>
      <button class="btn ghost" style="margin-top:14px;" id="backPeople">← BACK TO SEARCH</button>
    `;
    $("#backPeople").addEventListener("click", renderPeople);
  }

  /* -------------------- NEWS.NET -------------------- */
  function renderNews() {
    const html = `
      <h2>news.net — ARCHIVE OF REPORTS</h2>
      <form class="searchbar" id="newsForm">
        <input id="newsInput" placeholder="keyword, date, name..." autocomplete="off" />
        <button class="btn" type="submit">SEARCH</button>
      </form>
      <div id="newsList"></div>
    `;
    view.innerHTML = html;

    const render = (list) => {
      const box = $("#newsList");
      box.innerHTML = "";
      if (!list.length) {
        box.innerHTML = `<p class="dim">No articles.</p>`;
        return;
      }
      list.forEach(n => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `<h4>${n.headline}</h4>
          <div class="meta">${n.date}</div>
          <p>${n.body}</p>`;
        box.appendChild(div);
      });
    };
    render(currentCase.news);

    $("#newsForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const q = $("#newsInput").value.trim().toLowerCase();
      const list = currentCase.news.filter(n =>
        (n.headline + n.body).toLowerCase().includes(q)
      );
      render(list);
      if (q.includes("blackwood")) {
        discover("News: 1998 fire at Motel Blackwood");
        setFlag("read_news_fire");
      }
    });
  }

  /* -------------------- FORUM.NET -------------------- */
  function renderForum() {
    const html = `
      <h2>forum.net — THREAD: BLACKWOOD MOTEL</h2>
      <p class="lead">Public posts, newest last.</p>
      <div id="forumList"></div>
    `;
    view.innerHTML = html;

    const box = $("#forumList");
    currentCase.forum.forEach(f => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <h4>${f.title}</h4>
        <div class="meta">@${f.user} · ${f.date}</div>
        <p>${f.body}</p>
      `;
      box.appendChild(div);
    });

    discover("forum.net: thread about Room 43");
    setFlag("read_forum");
  }

  /* -------------------- FILES.NET -------------------- */
  function renderFiles() {
    const html = `
      <h2>files.net — DOCUMENT PORTAL</h2>
      <p class="lead">Some documents require a password.</p>
      <div class="card">
        <h4>CROSS-REF-43</h4>
        <div class="meta">password required</div>
        <p>Enter password below. Pattern: place + year, no spaces, uppercase.</p>
        <form class="searchbar" id="fileForm" style="margin-top:10px;">
          <input id="fileInput" placeholder="password..." autocomplete="off" />
          <button class="btn" type="submit">UNLOCK</button>
        </form>
        <div id="fileMsg" style="margin-top:8px;"></div>
      </div>
    `;
    view.innerHTML = html;

    $("#fileForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const v = $("#fileInput").value.trim();
      const doc = currentCase.documents["CROSS-REF-43"];
      if (v === doc.password) {
        unlockFile(doc.title);
        discover("CROSS-REF-43 unlocked → phone number revealed");
        setFlag("unlocked_crossref");
        renderDocView(doc, "files.net");
      } else {
        $("#fileMsg").innerHTML = `<span class="tag danger">INVALID PASSWORD</span>`;
      }
    });
  }

  /* -------------------- RADIO.NET -------------------- */
  function renderRadio() {
    const html = `
      <h2>radio.net — RECOVERED TRANSMISSIONS</h2>
      <p class="lead">Click a transmission to read its transcript.</p>
      <div id="radioList"></div>
      <pre id="radioTranscript" class="doc" style="display:none;margin-top:14px;"></pre>
    `;
    view.innerHTML = html;

    const box = $("#radioList");
    currentCase.radio.forEach(r => {
      const div = document.createElement("div");
      div.className = "radio-item";
      div.innerHTML = `<span>${r.label}</span>
        <span class="wave"><span></span><span></span><span></span><span></span><span></span></span>`;
      div.addEventListener("click", () => {
        $$(".radio-item").forEach(x => x.classList.remove("playing"));
        div.classList.add("playing");
        const pre = $("#radioTranscript");
        pre.style.display = "block";
        pre.textContent = r.transcript;
      });
      box.appendChild(div);
    });

    if (!state.flags.read_radio) {
      discover("radio.net: call from Marcus at 23:47");
      setFlag("read_radio");
    }
  }

  /* -------------------- MAPS.NET -------------------- */
  function renderMaps() {
    const html = `
      <h2>maps.net — LOCATIONS</h2>
      <p class="lead">Click a location to see details.</p>
      <div class="map-grid" id="mapGrid"></div>
      <pre id="mapInfo" class="doc" style="display:none;margin-top:14px;"></pre>
    `;
    view.innerHTML = html;

    const grid = $("#mapGrid");
    currentCase.locations.forEach(l => {
      const d = document.createElement("div");
      d.className = "map-cell";
      d.textContent = l.name;
      d.addEventListener("click", () => {
        const info = $("#mapInfo");
        info.style.display = "block";
        info.textContent =
          `LOCATION: ${l.name}\nDISTRICT: ${l.district}\n\n${l.notes}`;
        if (l.id === "room_43" && !state.flags.found_room43) {
          discover("Room 43 exists (Motel Blackwood)");
          setFlag("found_room43");
        }
      });
      grid.appendChild(d);
    });
  }

  /* -------------------- TERMINAL.NET -------------------- */
  function renderTerminal() {
    const html = `
      <h2>terminal.net — SECURE SHELL</h2>
      <p class="lead">Commands: <b>help</b>, <b>call &lt;number&gt;</b>, <b>clear</b>, <b>exit</b></p>
      <div class="term" id="termBox"></div>
      <form class="term-input" id="termForm">
        <input id="termInput" placeholder="type command..." autocomplete="off" />
      </form>
    `;
    view.innerHTML = html;

    const box = $("#termBox");
    const print = (txt, cls) => {
      const line = document.createElement("div");
      if (cls) line.style.color = cls;
      line.textContent = txt;
      box.appendChild(line);
      box.scrollTop = box.scrollHeight;
    };

    print("VERDAD SECURE SHELL v0.3");
    print("type 'help' for commands");
    print("");

    $("#termForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const line = $("#termInput").value.trim();
      $("#termInput").value = "";
      if (!line) return;
      print("> " + line);
      const [cmd, ...args] = line.split(/\s+/);
      switch(cmd.toLowerCase()) {
        case "help":
          print("commands:");
          print("  help");
          print("  call <number>");
          print("  clear");
          print("  exit");
          break;
        case "clear":
          box.innerHTML = "";
          break;
        case "exit":
          print("session closed.");
          break;
        case "call":
          if (!args[0]) { print("usage: call <number>"); break; }
          if (args[0] === currentCase.finalPhone) {
            openPhone(currentCase.finalPhone);
          } else {
            print("NO CARRIER.", "#ff5c6a");
          }
          break;
        default:
          print("unknown command.", "#ff5c6a");
      }
      print("");
    });
  }

  /* ==========================================================
     IA VERDAD
     ========================================================== */
  const aiLog = $("#aiLog");
  const aiForm = $("#aiForm");
  const aiInput = $("#aiInput");

  function seedAi() {
    aiLog.innerHTML = "";
    aiMsg("sys", "VERDAD online. Ask anything. Most answers will be useless.");
    aiMsg("verdad", "PREDICTION: " + state.prediction);
  }

  function aiMsg(role, text) {
    const div = document.createElement("div");
    div.className = "ai-msg " + role;
    div.textContent = (role === "user" ? "> " : role === "verdad" ? "VERDAD: " : "· ") + text;
    aiLog.appendChild(div);
    aiLog.scrollTop = aiLog.scrollHeight;
  }

  aiForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = aiInput.value.trim();
    if (!q) return;
    aiInput.value = "";
    aiMsg("user", q);

    // Buscar respuesta por coincidencia de frases
    const lower = q.toLowerCase();
    let found = null;
    for (const r of currentCase.aiResponses) {
      if (r.match.some(m => lower.includes(m))) { found = r.reply; break; }
    }
    if (!found) {
      found = currentCase.aiFallbacks[Math.floor(Math.random() * currentCase.aiFallbacks.length)];
    }
    setTimeout(() => aiMsg("verdad", found), 400);
  });

  /* ==========================================================
     TELÉFONO SIMULADO
     ========================================================== */
  const phoneModal  = $("#phoneModal");
  const phoneNumber = $("#phoneNumber");
  const phoneStatus = $("#phoneStatus");
  const phoneTimer  = $("#phoneTimer");
  const phoneLog    = $("#phoneLog");
  const btnCall     = $("#phoneCall");
  const btnHang     = $("#phoneHang");
  const btnClose    = $("#phoneClose");

  let phoneInterval = null;
  let phoneSeconds = 0;

  function openPhone(num) {
    phoneModal.classList.remove("hidden");
    phoneNumber.textContent = num;
    phoneStatus.textContent = "READY";
    phoneTimer.textContent = "00:00";
    phoneLog.textContent = "";
    btnCall.disabled = false;
    btnHang.disabled = true;
    phoneSeconds = 0;
  }

  btnClose.addEventListener("click", () => {
    if (phoneInterval) clearInterval(phoneInterval);
    phoneModal.classList.add("hidden");
  });

  btnCall.addEventListener("click", () => {
    btnCall.disabled = true;
    btnHang.disabled = false;
    phoneStatus.textContent = "CALLING...";
    phoneSeconds = 0;
    phoneLog.textContent = "";
    phoneLog.textContent += "> DIALING " + phoneNumber.textContent + "\n";
    phoneInterval = setInterval(() => {
      phoneSeconds++;
      const mm = String(Math.floor(phoneSeconds/60)).padStart(2,"0");
      const ss = String(phoneSeconds%60).padStart(2,"0");
      phoneTimer.textContent = mm + ":" + ss;

      // Timings narrativos:
      if (phoneSeconds === 5) phoneLog.textContent += "> RING...\n";
      if (phoneSeconds === 9) phoneLog.textContent += "> RING...\n";
      if (phoneSeconds === 13) {
        // FINAL B (responde) — usamos siempre B para dar cierre narrativo
        phoneStatus.textContent = "CONNECTED";
        phoneLog.textContent += "\n\"¿Hola?\"\n";
        phoneLog.textContent += "\"Room 43. Blackwood. Please.\"\n";
        phoneLog.textContent += "\"The door is locked from the inside.\"\n";
        phoneLog.textContent += "\"Don't hang up.\"\n";
      }
      if (phoneSeconds === 30) {
        clearInterval(phoneInterval);
        phoneStatus.textContent = "DISCONNECTED";
        phoneLog.textContent += "\n[call ended]\n";
        finishCase("B");
      }
    }, 1000);
  });

  btnHang.addEventListener("click", () => {
    if (phoneInterval) clearInterval(phoneInterval);
    phoneStatus.textContent = "ENDED BY USER";
    phoneLog.textContent += "\n[you ended the call]\n";
    btnHang.disabled = true;
    finishCase("A");
  });

  /* ==========================================================
     FINAL DEL CASO
     ========================================================== */
  function finishCase(ending) {
    state.phoneFinale = true;
    state.caseStatus = "RESOLVED";
    setFlag("ending_" + ending);
    save();
    $("#caseStatus").textContent = "RESOLVED";

    const solution = currentCase.solutionSummary;
    const endingText = ending === "B"
      ? "The line stayed open. You reached Room 43. The file is closed — for now."
      : "You hung up. Some calls are not meant to be ended.";

    setTimeout(() => {
      view.innerHTML = `
        <h2>CASE CLOSED — ${currentCase.caseId}</h2>
        <div class="doc">
ENDING: ${ending === "B" ? "B — CONNECTION ESTABLISHED" : "A — CALL ABANDONED"}

${endingText}

----------------------------------------
WHAT 43 MEANT:
----------------------------------------
${solution}
----------------------------------------

This is a work of fiction.
All persons, places, phone numbers and events in this game are invented.
No real call was placed at any time.
        </div>
        <button class="btn ghost" style="margin-top:14px;" onclick="location.reload()">REPLAY CASE</button>
      `;
      // marcar tabs excepto home como bloqueadas (narrativamente)
      $$(".tab").forEach(t => {
        if (t.dataset.view !== "home") {
          t.style.opacity = ".4";
          t.style.pointerEvents = "none";
        }
      });
    }, 600);
  }

  /* ==========================================================
     RED HERRING: 1943
     ========================================================== */
  function showRedHerring1943() {
    view.innerHTML = `
      <h2>archive.net — ARCHIVE-1943</h2>
      <div class="doc">
ARCHIVE ENTRY 1943
----------------------------------------
An unrelated fire occurred in District 7 in 1943.
There is no evidence linking this event to CASE_001.

⚠ This document is a decoy. Do not follow this line of investigation.
      </div>
      <button class="btn ghost" style="margin-top:14px;" id="backArch">← BACK</button>
    `;
    $("#backArch").addEventListener("click", renderArchive);
    if (!state.flags.found_1943) {
      discover("Red herring: 1943 year — dead end");
      setFlag("found_1943");
    }
  }

  /* ==========================================================
     UTILIDADES
     ========================================================== */
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[c]));
  }

  function setTab(name) {
    $$(".tab").forEach(t => {
      t.classList.toggle("active", t.dataset.view === name);
    });
  }

  /* ----------------------------------------------------------
     SI YA HAY PARTIDA GUARDADA, MOSTRAR BOTÓN CONTINUE
     ---------------------------------------------------------- */
  if (state.caseId) {
    startBtn.textContent = "CONTINUE CASE";
  }

})();

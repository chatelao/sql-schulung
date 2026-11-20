(() => {
  "use strict";

  const STORAGE_KEY = "oracle_1z0_171_studio_v1";

  const SCOTT_DEPT = [
    { deptno: 10, dname: "ACCOUNTING", loc: "NEW YORK" },
    { deptno: 20, dname: "RESEARCH", loc: "DALLAS" },
    { deptno: 30, dname: "SALES", loc: "CHICAGO" },
    { deptno: 40, dname: "OPERATIONS", loc: "BOSTON" }
  ];

  const SCOTT_EMP = [
    { empno: 7369, ename: "SMITH", job: "CLERK", mgr: 7902, sal: 800, comm: null, deptno: 20 },
    { empno: 7499, ename: "ALLEN", job: "SALESMAN", mgr: 7698, sal: 1600, comm: 300, deptno: 30 },
    { empno: 7521, ename: "WARD", job: "SALESMAN", mgr: 7698, sal: 1250, comm: 500, deptno: 30 },
    { empno: 7566, ename: "JONES", job: "MANAGER", mgr: 7839, sal: 2975, comm: null, deptno: 20 },
    { empno: 7654, ename: "MARTIN", job: "SALESMAN", mgr: 7698, sal: 1250, comm: 1400, deptno: 30 },
    { empno: 7698, ename: "BLAKE", job: "MANAGER", mgr: 7839, sal: 2850, comm: null, deptno: 30 },
    { empno: 7782, ename: "CLARK", job: "MANAGER", mgr: 7839, sal: 2450, comm: null, deptno: 10 },
    { empno: 7788, ename: "SCOTT", job: "ANALYST", mgr: 7566, sal: 3000, comm: null, deptno: 20 },
    { empno: 7839, ename: "KING", job: "PRESIDENT", mgr: null, sal: 5000, comm: null, deptno: 10 },
    { empno: 7844, ename: "TURNER", job: "SALESMAN", mgr: 7698, sal: 1500, comm: 0, deptno: 30 },
    { empno: 7876, ename: "ADAMS", job: "CLERK", mgr: 7788, sal: 1100, comm: null, deptno: 20 },
    { empno: 7900, ename: "JAMES", job: "CLERK", mgr: 7698, sal: 950, comm: null, deptno: 30 },
    { empno: 7902, ename: "FORD", job: "ANALYST", mgr: 7566, sal: 3000, comm: null, deptno: 20 },
    { empno: 7934, ename: "MILLER", job: "CLERK", mgr: 7782, sal: 1300, comm: null, deptno: 10 }
  ];

  const SCOTT_SALGRADE = [
    { grade: 1, losal: 700, hisal: 1200 },
    { grade: 2, losal: 1201, hisal: 1400 },
    { grade: 3, losal: 1401, hisal: 2000 },
    { grade: 4, losal: 2001, hisal: 3000 },
    { grade: 5, losal: 3001, hisal: 9999 }
  ];

  function loadState() {
    const defaults = {
      completedLessons: [],
      variant: "B",
      checkpoints: {},
      activeCheckpoint: "CP-0",
      compilerAnswers: {},
      compilerFilter: "ALL",
      flashcardStatus: {},
      mockHistory: []
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return Object.assign({}, defaults, JSON.parse(raw));
    } catch (_) {}
    return defaults;
  }

  let state = loadState();
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  function escapeHtml(val) {
    return String(val)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function fmtCell(v) {
    return v === null || v === undefined ? '<span class="null-pill">NULL</span>' : escapeHtml(v);
  }

  let activeView = "curriculum";
  let activeLab = "joins";
  let activeSqlPlusPreset = "";
  let isApplyingRoute = false;

  function setRouteHash(hash, push = true) {
    const normalized = hash.startsWith("#") ? hash : `#${hash}`;
    const globalPermalink = document.getElementById("global-permalink");
    if (globalPermalink) globalPermalink.href = normalized;
    if (isApplyingRoute) return;
    if (window.location.hash !== normalized) {
      if (push) {
        history.pushState(null, "", normalized);
      } else {
        history.replaceState(null, "", normalized);
      }
    }
  }

  function getCanonicalHashForView(view) {
    if (view === "curriculum") {
      const ph = phaseFilter ? phaseFilter.value : "ALL";
      return ph && ph !== "ALL" ? `#curriculum/phase-${ph}` : "#curriculum";
    }
    if (view === "checkpoints") {
      return `#checkpoints/${state.activeCheckpoint || "CP-0"}`;
    }
    if (view === "labs") {
      if (activeLab === "joins") {
        const mode = document.getElementById("join-mode-select")?.value || "INNER";
        return `#labs/joins/${mode}`;
      }
      if (activeLab === "freesql") {
        const pack = document.getElementById("freesql-pack-select")?.value || "phase-1";
        return `#labs/freesql/${pack}`;
      }
      if (activeLab === "sqlplus" && activeSqlPlusPreset) {
        return `#labs/sqlplus/${activeSqlPlusPreset}`;
      }
      return `#labs/${activeLab}`;
    }
    if (view === "flashcards") {
      const dom = document.getElementById("fc-domain-filter")?.value || "ALL";
      return dom && dom !== "ALL" ? `#flashcards/D${dom}` : "#flashcards";
    }
    if (view === "mock") {
      return "#mock";
    }
    return "#curriculum";
  }

  function highlightAndScrollTo(el) {
    if (!el) return;
    document.querySelectorAll(".permalink-highlight").forEach((n) => n.classList.remove("permalink-highlight"));
    el.classList.add("permalink-highlight");
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    setTimeout(() => el.classList.remove("permalink-highlight"), 3200);
  }

  function switchView(view) {
    activeView = view;
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
    document.querySelectorAll(".view").forEach((v) => v.classList.toggle("active", v.id === `view-${view}`));
  }

  function switchLabPane(lab) {
    activeLab = lab;
    document.querySelectorAll(".subtab-btn").forEach((b) => b.classList.toggle("active", b.dataset.lab === lab));
    document.querySelectorAll(".lab-pane").forEach((p) => p.classList.toggle("active", p.id === `lab-${lab}`));
  }

  async function buildFreeSqlEmbedUrl(sqlText) {
    const clean = String(sqlText || "").replace(/\s+$/, "");
    if (!clean) return "https://freesql.com/";
    if (typeof CompressionStream === "undefined") {
      return "https://freesql.com/";
    }
    try {
      const payload = new TextEncoder().encode(clean + "--EOC");
      const cs = new CompressionStream("gzip");
      const writer = cs.writable.getWriter();
      writer.write(payload);
      writer.close();
      const gzBuffer = await new Response(cs.readable).arrayBuffer();
      const bytes = new Uint8Array(gzBuffer);
      let binary = "";
      const chunkSize = 0x8000;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
      }
      const b64 = btoa(binary);
      const encoded = encodeURIComponent(b64);
      return `https://freesql.com/embedded/?layout=vertical&compressed_code=${encoded}&code_language=PL_SQL&code_format=false`;
    } catch (_) {
      return "https://freesql.com/";
    }
  }

  async function openInFreeSqlTab(sqlText) {
    const win = window.open("about:blank", "_blank");
    const url = await buildFreeSqlEmbedUrl(sqlText);
    if (win) {
      try {
        win.opener = null;
      } catch (_) {}
      win.location.href = url;
    } else {
      window.open(url, "_blank", "noopener");
    }
  }

  // =========================================================================
  // NAVIGATION
  // =========================================================================
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      switchView(btn.dataset.view);
      setRouteHash(getCanonicalHashForView(btn.dataset.view));
    });
  });

  const globalPermalinkEl = document.getElementById("global-permalink");
  if (globalPermalinkEl) {
    globalPermalinkEl.addEventListener("click", async (e) => {
      e.preventDefault();
      const fullUrl = new URL(globalPermalinkEl.getAttribute("href") || "#curriculum", window.location.href).href;
      try {
        await navigator.clipboard.writeText(fullUrl);
      } catch (_) {}
      globalPermalinkEl.classList.add("copied");
      globalPermalinkEl.textContent = "Kopiert!";
      setTimeout(() => {
        globalPermalinkEl.classList.remove("copied");
        globalPermalinkEl.innerHTML = "&#x1F517; Permalink";
      }, 1500);
    });
  }

  // =========================================================================
  // VIEW 1: 200-LESSON TRACKER
  // =========================================================================
  const phaseFilter = document.getElementById("phase-filter");
  const lessonSearch = document.getElementById("lesson-search");
  const variantSelect = document.getElementById("variant-select");
  const variantBanner = document.getElementById("variant-banner");
  const phasesContainer = document.getElementById("phases-container");

  function initCurriculum() {
    phaseFilter.innerHTML = `<option value="ALL">Alle 10 Phasen (200 Lektionen)</option>` +
      window.CURRICULUM_PHASES.map((p) => `<option value="${p.id}">Phase ${p.id}: ${escapeHtml(p.title.replace(/^Phase \d+: /, ""))}</option>`).join("");

    variantSelect.value = state.variant || "B";
    variantSelect.addEventListener("change", () => {
      state.variant = variantSelect.value;
      saveState();
      renderVariantBanner();
    });

    phaseFilter.addEventListener("change", () => {
      renderPhases();
      setRouteHash(phaseFilter.value === "ALL" ? "#curriculum" : `#curriculum/phase-${phaseFilter.value}`);
    });
    lessonSearch.addEventListener("input", renderPhases);
    document.getElementById("reset-lessons-btn").addEventListener("click", () => {
      if (confirm("Alle 200 Lektions-Häkchen zurücksetzen?")) {
        state.completedLessons = [];
        saveState();
        renderPhases();
      }
    });

    renderVariantBanner();
    renderPhases();
  }

  function renderVariantBanner() {
    if (state.variant === "A") {
      variantBanner.innerHTML = `<strong>Variante A (In-House Oracle DB):</strong> Führe die <code>SCOTT/TIGER</code>- &amp; <code>HR</code>-Labs in VS Code / SQL Developer aus und teste <code>&amp;</code>/<code>&amp;&amp;</code> sowie Multi-User-DCL nativ in <code>sqlcl</code>/<code>sqlplus</code>.`;
    } else {
      variantBanner.innerHTML = `<strong>Variante B (Kostenlose Online-Cloud):</strong> Führe tägliche SQL-Queries in <a href="https://freesql.com/" target="_blank" rel="noopener">Oracle FreeSQL</a> (23ai, mit vorgeladenem <code>SCOTT</code> &amp; <code>HR</code>) aus, nutze unseren Tab <strong>SQL*Plus Simulator</strong> für <code>&amp;</code>/<code>&amp;&amp;</code> und <a href="https://www.oracle.com/cloud/free/" target="_blank" rel="noopener">OCI Always Free</a> für Multi-User-DCL.`;
    }
  }

  function renderPhases() {
    const doneSet = new Set(state.completedLessons);
    const totalDone = doneSet.size;
    document.getElementById("lessons-done-count").textContent = totalDone;
    const pct = Math.round((totalDone / 200) * 100);
    document.getElementById("lessons-done-pct").textContent = `${pct}%`;
    document.getElementById("lessons-progress-bar").style.width = `${pct}%`;

    const selectedPhase = phaseFilter.value;
    const q = lessonSearch.value.trim().toLowerCase();

    const html = window.CURRICULUM_PHASES
      .filter((p) => selectedPhase === "ALL" || String(p.id) === selectedPhase)
      .map((p) => {
        const filteredLessons = p.lessons.filter(
          (l) => !q || l.id.toLowerCase().includes(q) || l.title.toLowerCase().includes(q) || l.tag.toLowerCase().includes(q)
        );
        if (filteredLessons.length === 0) return "";
        const phaseDone = p.lessons.filter((l) => doneSet.has(l.id)).length;
        return `
          <div class="phase-block" id="phase-${p.id}">
            <div class="phase-header">
              <div class="phase-title-row">
                <span class="phase-tag">Phase ${p.id}</span>
                <strong>${escapeHtml(p.title.replace(/^Phase \d+:\s*/, ""))}</strong>
                <span class="muted-sm" style="margin:0;">(${escapeHtml(p.examNote)})</span>
                <a class="permalink-badge" href="#curriculum/phase-${p.id}" title="Permanente URL zu Phase ${p.id}">#phase-${p.id}</a>
              </div>
              <div class="phase-stats">
                <span><strong>${phaseDone}</strong> / ${p.lessons.length} erledigt</span>
                <button type="button" class="btn btn-sm btn-teal phase-freesql-btn" data-phase-id="${p.id}">Lab in FreeSQL &nearr;</button>
                <a class="docs-link" href="${p.docsUrl}" target="_blank" rel="noopener">Kapitel lesen &nearr;</a>
              </div>
            </div>
            <div class="lesson-grid">
              ${filteredLessons.map((l) => {
                const isDone = doneSet.has(l.id);
                return `
                  <label class="lesson-item ${isDone ? "done" : ""}" id="lesson-${l.id}">
                    <input type="checkbox" data-lesson-id="${l.id}" ${isDone ? "checked" : ""} />
                    <div style="width:100%;">
                      <div class="lesson-id-row">
                        <span class="lesson-id">${l.id} &middot; 45 Min.</span>
                        <a class="lesson-permalink" href="#curriculum/${l.id}" title="Permanente URL zu ${l.id}" onclick="event.stopPropagation()">#${l.id}</a>
                      </div>
                      <span class="lesson-title">${escapeHtml(l.title)}</span>
                      <span class="lesson-meta">${escapeHtml(l.tag)}</span>
                      <div style="display:flex;gap:0.65rem;flex-wrap:wrap;margin-top:0.2rem;">
                        <a class="lesson-ref-link" href="${p.docsUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Handbuch &nearr;</a>
                        ${l.toolHash ? `<a class="lesson-ref-link" href="${l.toolHash}" onclick="event.stopPropagation()">${escapeHtml(l.toolLabel)} &rarr;</a>` : ""}
                        ${l.refUrl ? `<a class="lesson-ref-link" href="${l.refUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()">SQL Ref: ${escapeHtml(l.refLabel)} &nearr;</a>` : ""}
                      </div>
                    </div>
                  </label>
                `;
              }).join("")}
            </div>
          </div>
        `;
      })
      .join("");

    phasesContainer.innerHTML = html || `<p class="muted-sm">Keine Lektionen gefunden für "${escapeHtml(q)}".</p>`;
    phasesContainer.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener("change", () => {
        const id = cb.dataset.lessonId;
        const set = new Set(state.completedLessons);
        if (cb.checked) set.add(id);
        else set.delete(id);
        state.completedLessons = Array.from(set);
        saveState();
        renderPhases();
      });
    });
    phasesContainer.querySelectorAll(".phase-freesql-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        openPhaseInFreeSqlLauncher(Number(btn.dataset.phaseId));
      });
    });
  }

  // =========================================================================
  // VIEW 2: IDENTICAL CHECKPOINTS (CP-0 to CP-5)
  // =========================================================================
  const cpStrip = document.getElementById("cp-selector-strip");
  const cpWorkspace = document.getElementById("cp-workspace");
  const cpChart = document.getElementById("cp-chart-container");
  const cpMatrix = document.getElementById("cp-domain-matrix");

  function initCheckpoints() {
    document.getElementById("export-cp-json").addEventListener("click", () => exportCheckpoints("json"));
    document.getElementById("export-cp-md").addEventListener("click", () => exportCheckpoints("md"));
    renderCheckpointsUI();
  }

  function getCpData(cpId) {
    if (!state.checkpoints[cpId]) {
      const conf = {};
      window.DOMAINS_1Z0_171.forEach((d) => (conf[d.id] = 2));
      state.checkpoints[cpId] = {
        answers: {},
        confidence: conf,
        tasksSelfGrade: {},
        reflection: { r1: "", r2: "", r3: "", r4: "" },
        submitted: false,
        submittedAt: null,
        unlockOverride: false
      };
    }
    return state.checkpoints[cpId];
  }

  function gradeCheckpoint(cpData) {
    let totalCorrect = 0;
    const domainScores = {};
    window.DOMAINS_1Z0_171.forEach((d) => (domainScores[d.id] = { correct: 0, total: 0 }));

    window.CHECKPOINT_QUESTIONS.forEach((q) => {
      domainScores[q.domainId].total += 1;
      const picked = (cpData.answers[q.id] || []).slice().sort((a, b) => a - b);
      const expected = q.answer.slice().sort((a, b) => a - b);
      const isRight = picked.length === expected.length && picked.every((v, idx) => v === expected[idx]);
      if (isRight) {
        totalCorrect += 1;
        domainScores[q.domainId].correct += 1;
      }
    });

    const pct = Math.round((totalCorrect / window.CHECKPOINT_QUESTIONS.length) * 100);
    return { totalCorrect, total: window.CHECKPOINT_QUESTIONS.length, pct, domainScores };
  }

  function renderCheckpointsUI() {
    const activeId = state.activeCheckpoint || "CP-0";

    cpStrip.innerHTML = window.CHECKPOINT_SLOTS.map((slot) => {
      const d = state.checkpoints[slot.id];
      const statusText = d && d.submitted
        ? `Ergebnis: <strong>${gradeCheckpoint(d).pct}%</strong> (${gradeCheckpoint(d).totalCorrect}/22)`
        : `Noch nicht absolviert &middot; Erwartet: ${slot.expected}`;
      return `
        <button class="cp-card-btn ${slot.id === activeId ? "active" : ""}" data-cp="${slot.id}">
          <div class="lesson-id-row">
            <span class="cp-card-code">${slot.id} (${slot.lessons})</span>
            <a class="cp-permalink" href="#checkpoints/${slot.id}" title="Permanente URL zu ${slot.id}" onclick="event.stopPropagation()">#${slot.id}</a>
          </div>
          <div style="font-size:0.84rem;font-weight:600;">${escapeHtml(slot.label)}</div>
          <div class="cp-card-score">${statusText}</div>
        </button>
      `;
    }).join("");

    cpStrip.querySelectorAll(".cp-card-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.activeCheckpoint = btn.dataset.cp;
        saveState();
        renderCheckpointsUI();
        setRouteHash(`#checkpoints/${btn.dataset.cp}`);
      });
    });

    renderCheckpointWorkspace(activeId);
    renderLongitudinalChart();
    renderDomainMatrix(activeId);
  }

  function renderCheckpointWorkspace(cpId) {
    const slot = window.CHECKPOINT_SLOTS.find((s) => s.id === cpId);
    const cpData = getCpData(cpId);
    const showKey = cpData.submitted && (cpId === "CP-5" || cpData.unlockOverride);
    const grades = cpData.submitted ? gradeCheckpoint(cpData) : null;

    let resultBanner = "";
    if (cpData.submitted) {
      const blindSpots = window.DOMAINS_1Z0_171.filter((dom) => {
        const sc = grades.domainScores[dom.id];
        const pct = Math.round((sc.correct / sc.total) * 100);
        return (cpData.confidence[dom.id] || 0) >= 4 && pct < 50;
      });

      resultBanner = `
        <div class="callout ${grades.pct >= 65 ? "callout-success" : "callout-warn"}">
          <strong>${cpId} eingereicht:</strong> ${grades.totalCorrect} / ${grades.total} (<strong>${grades.pct}%</strong>)
          ${cpId !== "CP-5" && !cpData.unlockOverride
            ? `<div style="margin-top:0.35rem;font-size:0.84rem;">Die Lösungen bleiben bei ${cpId} gesperrt, um Auswendiglernen vor CP-5 zu vermeiden. Sieh dir rechts die Domain Mastery Matrix an! <button class="btn btn-sm" id="cp-unlock-btn">Trainer-Freigabe: Lösung zeigen</button></div>`
            : `<div style="margin-top:0.35rem;font-size:0.84rem;">Vollständige Lösungen &amp; Erklärungen sind unten freigeschaltet.</div>`}
          ${blindSpots.length > 0
            ? `<div style="margin-top:0.4rem;"><strong>Blind-Spot-Warnung:</strong> Hohe Sicherheit (&ge;4/5), aber &lt;50% Trefferquote in: ${blindSpots.map((b) => escapeHtml(b.name)).join(", ")}.</div>`
            : ""}
        </div>
      `;
    }

    const questionsHtml = window.CHECKPOINT_QUESTIONS.map((q, idx) => {
      const dom = window.DOMAINS_1Z0_171.find((d) => d.id === q.domainId);
      const picked = cpData.answers[q.id] || [];
      const inputType = q.multi ? "checkbox" : "radio";
      return `
        <div class="question-block">
          <div class="q-header">
            <span>Frage ${idx + 1} von 22 ${q.multi ? "(Zwei auswählen)" : ""}</span>
            <span class="q-domain-badge">D${dom.id}: ${escapeHtml(dom.name)}</span>
          </div>
          <div class="q-prompt">${escapeHtml(q.prompt)}</div>
          <div class="q-options">
            ${q.options.map((opt, oi) => {
              const checked = picked.includes(oi);
              let cls = "";
              if (showKey) {
                if (q.answer.includes(oi)) cls = "opt-correct";
                else if (checked) cls = "opt-wrong";
              }
              return `
                <label class="q-option ${cls}">
                  <input type="${inputType}" name="cp_${q.id}" value="${oi}" ${checked ? "checked" : ""} ${cpData.submitted ? "disabled" : ""} />
                  <span>${escapeHtml(opt)}</span>
                </label>
              `;
            }).join("")}
          </div>
          ${showKey ? `<p class="muted-sm" style="margin-top:0.5rem;"><strong>Erklärung:</strong> ${escapeHtml(q.explanation)}</p>` : ""}
        </div>
      `;
    }).join("");

    cpData.taskSql = cpData.taskSql || {};
    const tasksHtml = window.CHECKPOINT_SQL_TASKS.map((t) => {
      const done = !!cpData.tasksSelfGrade[t.id];
      const userSql = cpData.taskSql[t.id] || "";
      return `
        <div class="question-block">
          <h3>${escapeHtml(t.title)}</h3>
          <p style="font-size:0.9rem;margin:0.3rem 0 0.6rem;">${escapeHtml(t.prompt)}</p>
          <textarea rows="4" class="cp-task-sql" data-task="${t.id}" placeholder="-- Schreibe hier zuerst dein SQL ohne Spicken..." style="width:100%;font-family:'JetBrains Mono',monospace;font-size:0.84rem;margin-bottom:0.5rem;">${escapeHtml(userSql)}</textarea>
          <div style="display:flex;gap:0.6rem;align-items:center;flex-wrap:wrap;margin-bottom:0.5rem;">
            <button type="button" class="btn btn-sm btn-teal cp-task-freesql" data-task="${t.id}">Meine Lösung in FreeSQL testen &nearr;</button>
            <label style="font-size:0.86rem;display:flex;align-items:center;gap:0.45rem;">
              <input type="checkbox" class="cp-task-cb" data-task="${t.id}" ${done ? "checked" : ""} />
              Syntax, NULL-Sicherheit &amp; Ergebniszeilen in einer Oracle DB erfolgreich geprüft
            </label>
          </div>
          ${showKey ? `<pre><code>${escapeHtml(t.reference)}</code></pre>` : `<span class="muted-sm">Musterlösung wird bei CP-5 (oder über Notfall-Freigabe) freigeschaltet.</span>`}
        </div>
      `;
    }).join("");

    const confHtml = window.DOMAINS_1Z0_171.map((d) => {
      const val = cpData.confidence[d.id] || 2;
      return `
        <div class="conf-item">
          <div style="display:flex;justify-content:space-between;">
            <strong>D${d.id}: ${escapeHtml(d.name)}</strong>
            <span id="conf-val-${d.id}">${val}/5</span>
          </div>
          <input type="range" min="1" max="5" value="${val}" data-conf-domain="${d.id}" />
        </div>
      `;
    }).join("");

    cpWorkspace.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:1rem;">
        <div>
          <h2 style="margin:0;">${slot.id}: ${escapeHtml(slot.label)}</h2>
          <span class="muted-sm">${slot.lessons} &middot; Erwartetes Niveau: ${slot.expected}</span>
        </div>
        <div style="display:flex;gap:0.5rem;">
          ${cpData.submitted
            ? `<button class="btn btn-secondary" id="cp-retake-btn">${cpId} wiederholen</button>`
            : `<span class="muted-sm">Erst Teil A, B und C (unten) ausfüllen, dann auswerten.</span>`}
        </div>
      </div>
      ${resultBanner}
      <h3>Teil A — 22 feste Domain-Fragen</h3>
      ${questionsHtml}
      <h3 style="margin-top:1.25rem;">Teil B — 3 Gold Standard SQL Tasks</h3>
      ${tasksHtml}
      <h3 style="margin-top:1.25rem;">Teil C — Selbsteinschätzung je Domain (1 = Raten, 5 = Prüfungsreif)</h3>
      <div class="confidence-grid">${confHtml}</div>
      ${!cpData.submitted ? `<div style="margin:1.1rem 0 1.4rem;"><button class="btn btn-primary" id="cp-submit-btn">${cpId} jetzt einreichen &amp; auswerten</button></div>` : ""}
      <h3>Lektion 2 — Strukturiertes Reflexionsprotokoll</h3>
      <div style="display:grid;gap:0.75rem;">
        <div class="field">
          <label>1. Welche 2 Domains haben sich seit dem letzten Checkpoint am stärksten verbessert, und wobei hat es Klick gemacht?</label>
          <textarea rows="2" class="cp-refl" data-rk="r1">${escapeHtml(cpData.reflection.r1 || "")}</textarea>
        </div>
        <div class="field">
          <label>2. Wo war meine Sicherheit hoch, mein Ergebnis aber niedrig (Blind Spots / Exam Traps)?</label>
          <textarea rows="2" class="cp-refl" data-rk="r2">${escapeHtml(cpData.reflection.r2 || "")}</textarea>
        </div>
        <div class="field">
          <label>3. Welcher Teil-B-SQL-Task ließ sich spürbar schneller oder sicherer aus dem Gedächtnis schreiben?</label>
          <textarea rows="2" class="cp-refl" data-rk="r3">${escapeHtml(cpData.reflection.r3 || "")}</textarea>
        </div>
        <div class="field">
          <label>4. Konkretes Lernziel bis zum nächsten Checkpoint:</label>
          <textarea rows="2" class="cp-refl" data-rk="r4">${escapeHtml(cpData.reflection.r4 || "")}</textarea>
        </div>
      </div>
    `;

    // Listeners
    window.CHECKPOINT_QUESTIONS.forEach((q) => {
      cpWorkspace.querySelectorAll(`input[name="cp_${q.id}"]`).forEach((inp) => {
        inp.addEventListener("change", () => {
          const selected = Array.from(cpWorkspace.querySelectorAll(`input[name="cp_${q.id}"]:checked`)).map((el) => Number(el.value));
          cpData.answers[q.id] = selected;
          saveState();
        });
      });
    });

    cpWorkspace.querySelectorAll(".cp-task-sql").forEach((ta) => {
      ta.addEventListener("input", () => {
        cpData.taskSql[ta.dataset.task] = ta.value;
        saveState();
      });
    });

    cpWorkspace.querySelectorAll(".cp-task-freesql").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sql = (cpData.taskSql[btn.dataset.task] || "").trim();
        openInFreeSqlTab(sql || "-- Schreibe zuerst deine Query für " + btn.dataset.task);
      });
    });

    cpWorkspace.querySelectorAll(".cp-task-cb").forEach((cb) => {
      cb.addEventListener("change", () => {
        cpData.tasksSelfGrade[cb.dataset.task] = cb.checked;
        saveState();
      });
    });

    cpWorkspace.querySelectorAll("input[data-conf-domain]").forEach((rng) => {
      rng.addEventListener("input", () => {
        const dId = Number(rng.dataset.confDomain);
        cpData.confidence[dId] = Number(rng.value);
        document.getElementById(`conf-val-${dId}`).textContent = `${rng.value}/5`;
        saveState();
        renderLongitudinalChart();
      });
    });

    cpWorkspace.querySelectorAll(".cp-refl").forEach((ta) => {
      ta.addEventListener("input", () => {
        cpData.reflection[ta.dataset.rk] = ta.value;
        saveState();
      });
    });

    const submitBtn = document.getElementById("cp-submit-btn");
    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        const allDefault = window.DOMAINS_1Z0_171.every((d) => (cpData.confidence[d.id] || 2) === 2);
        if (allDefault && !confirm("Alle Confidence-Slider (Teil C) stehen noch auf 2/5. Trotzdem jetzt auswerten?")) {
          return;
        }
        cpData.submitted = true;
        cpData.submittedAt = new Date().toISOString();
        saveState();
        renderCheckpointsUI();
      });
    }

    const retakeBtn = document.getElementById("cp-retake-btn");
    if (retakeBtn) {
      retakeBtn.addEventListener("click", () => {
        if (confirm(`Abgabe für ${cpId} löschen, um den Checkpoint zu wiederholen?`)) {
          cpData.submitted = false;
          cpData.answers = {};
          cpData.unlockOverride = false;
          saveState();
          renderCheckpointsUI();
        }
      });
    }

    const unlockBtn = document.getElementById("cp-unlock-btn");
    if (unlockBtn) {
      unlockBtn.addEventListener("click", () => {
        cpData.unlockOverride = true;
        saveState();
        renderCheckpointsUI();
      });
    }
  }

  function renderLongitudinalChart() {
    const W = 340;
    const H = 175;
    const padL = 34;
    const padR = 14;
    const padT = 14;
    const padB = 26;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    const points = window.CHECKPOINT_SLOTS.map((s, i) => {
      const d = state.checkpoints[s.id];
      const x = padL + (i / (window.CHECKPOINT_SLOTS.length - 1)) * plotW;
      const pct = d && d.submitted ? gradeCheckpoint(d).pct : null;
      const y = pct !== null ? padT + plotH - (pct / 100) * plotH : null;
      return { id: s.id, x, y, pct };
    });

    const passY = padT + plotH - 0.65 * plotH;
    const validPts = points.filter((p) => p.y !== null);
    const polyline = validPts.length >= 2
      ? `<polyline fill="none" stroke="#c74634" stroke-width="2.5" points="${validPts.map((p) => `${p.x},${p.y}`).join(" ")}" />`
      : "";

    cpChart.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Checkpoint-Verlaufsdiagramm">
        <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}" stroke="#c8c0b2" />
        <line x1="${padL}" y1="${padT + plotH}" x2="${W - padR}" y2="${padT + plotH}" stroke="#c8c0b2" />
        <line x1="${padL}" y1="${passY}" x2="${W - padR}" y2="${passY}" stroke="#0f6e6e" stroke-dasharray="4 3" />
        <text x="${W - padR}" y="${passY - 4}" text-anchor="end" font-size="9" fill="#0f6e6e" font-weight="600">65% Bestehen</text>
        <text x="${padL - 5}" y="${padT + 4}" text-anchor="end" font-size="9" fill="#707c8c">100%</text>
        <text x="${padL - 5}" y="${padT + plotH}" text-anchor="end" font-size="9" fill="#707c8c">0%</text>
        ${polyline}
        ${points.map((p) => `
          <text x="${p.x}" y="${H - 8}" text-anchor="middle" font-size="9" fill="#4e5a6b">${p.id}</text>
          ${p.y !== null
            ? `<circle cx="${p.x}" cy="${p.y}" r="4.5" fill="#c74634" /><text x="${p.x}" y="${p.y - 8}" text-anchor="middle" font-size="9" font-weight="700" fill="#1a222d">${p.pct}%</text>`
            : `<circle cx="${p.x}" cy="${padT + plotH}" r="3" fill="#d8d1c5" />`}
        `).join("")}
      </svg>
    `;
  }

  function renderDomainMatrix(activeId) {
    const cpData = getCpData(activeId);
    const grades = cpData.submitted ? gradeCheckpoint(cpData) : null;
    cpMatrix.innerHTML = `
      <table class="matrix-table">
        <thead><tr><th>Domain</th><th>Gew.</th><th>${activeId}</th><th>Sicherheit</th></tr></thead>
        <tbody>
          ${window.DOMAINS_1Z0_171.map((d) => {
            let scStr = "—";
            if (grades) {
              const s = grades.domainScores[d.id];
              scStr = `${Math.round((s.correct / s.total) * 100)}%`;
            }
            return `<tr><td>D${d.id}: ${escapeHtml(d.name)}</td><td>${d.weight}%</td><td><strong>${scStr}</strong></td><td>${cpData.confidence[d.id] || 2}/5</td></tr>`;
          }).join("")}
        </tbody>
      </table>
    `;
  }

  function exportCheckpoints(format) {
    const payload = {
      exportedAt: new Date().toISOString(),
      completedLessonsCount: state.completedLessons.length,
      checkpoints: {}
    };
    window.CHECKPOINT_SLOTS.forEach((s) => {
      const d = state.checkpoints[s.id];
      if (d && d.submitted) {
        payload.checkpoints[s.id] = {
          score: gradeCheckpoint(d),
          confidence: d.confidence,
          reflection: d.reflection,
          submittedAt: d.submittedAt
        };
      }
    });

    let content = "";
    let filename = `1z0-171-checkpoints.${format}`;
    let mime = "application/json";

    if (format === "json") {
      content = JSON.stringify(payload, null, 2);
    } else {
      mime = "text/markdown";
      const lines = [`# 1Z0-171 Checkpoint-Verlaufsbericht`, `Exportiert: ${payload.exportedAt}`, `Abgeschlossene Lektionen: ${payload.completedLessonsCount} / 200`, ""];
      Object.entries(payload.checkpoints).forEach(([cpId, info]) => {
        lines.push(`## ${cpId} — ${info.score.pct}% (${info.score.totalCorrect}/22)`);
        lines.push(`- Reflexion 1 (Verbessert): ${info.reflection.r1 || "-"}`);
        lines.push(`- Reflexion 2 (Blind Spots): ${info.reflection.r2 || "-"}`);
        lines.push(`- Reflexion 3 (Task-Tempo): ${info.reflection.r3 || "-"}`);
        lines.push(`- Reflexion 4 (Nächstes Ziel): ${info.reflection.r4 || "-"}`);
        lines.push("");
      });
      content = lines.join("\n");
    }

    const blob = new Blob([content], { type: mime });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // =========================================================================
  // VIEW 3: INTERACTIVE LABS
  // =========================================================================
  function initLabs() {
    document.querySelectorAll(".subtab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        switchLabPane(btn.dataset.lab);
        setRouteHash(getCanonicalHashForView("labs"));
      });
    });

    initJoinVisualizer();
    initStringSlicer();
    initSqlPlusSimulator();
    initHumanCompiler();
    initFreeSqlLauncher();
  }

  // Lab A: Join & Set Visualizer
  function initJoinVisualizer() {
    const sel = document.getElementById("join-mode-select");
    sel.addEventListener("change", () => {
      renderJoinVisualizer();
      setRouteHash(`#labs/joins/${sel.value}`);
    });
    document.getElementById("join-run-freesql-btn").addEventListener("click", () => {
      const sql = document.getElementById("join-sql-code").textContent;
      openInFreeSqlTab(sql);
    });
    document.getElementById("join-open-launcher-btn").addEventListener("click", () => {
      const mode = sel.value.toLowerCase();
      const sql = document.getElementById("join-sql-code").textContent;
      openCustomSqlInFreeSqlLauncher(`scott-${mode}-lab.sql`, sql);
    });
    renderJoinVisualizer();
  }

  function renderHtmlTable(cols, rows, rowClassFn) {
    return `
      <table class="data-table">
        <thead><tr>${cols.map((c) => `<th>${escapeHtml(c)}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map((r) => `<tr class="${rowClassFn ? rowClassFn(r) : ""}">${cols.map((c) => `<td>${fmtCell(r[c])}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    `;
  }

  function renderJoinVisualizer() {
    const mode = document.getElementById("join-mode-select").value;
    const sqlEl = document.getElementById("join-sql-code");
    const expEl = document.getElementById("join-explanation");
    const leftEl = document.getElementById("join-left-table");
    const rightEl = document.getElementById("join-right-table");
    const resEl = document.getElementById("join-result-table");
    const countEl = document.getElementById("join-result-count");

    let sql = "";
    let exp = "";
    let leftHtml = "";
    let rightHtml = "";
    let resCols = [];
    let resRows = [];

    const empDeptIds = new Set(SCOTT_EMP.map((e) => e.deptno));
    const deptIds = new Set(SCOTT_DEPT.map((d) => d.deptno));

    if (["INNER", "LEFT", "RIGHT", "FULL", "CROSS"].includes(mode)) {
      leftHtml = renderHtmlTable(["empno", "ename", "sal", "deptno"], SCOTT_EMP, (r) =>
        deptIds.has(r.deptno) ? "row-matched" : "row-unmatched"
      );
      rightHtml = renderHtmlTable(["deptno", "dname", "loc"], SCOTT_DEPT, (r) =>
        empDeptIds.has(r.deptno) ? "row-matched" : "row-unmatched"
      );
      resCols = ["empno", "ename", "deptno", "dname", "loc"];

      if (mode === "INNER") {
        sql = `SELECT e.empno, e.ename, e.deptno, d.dname, d.loc\nFROM scott.emp e\nINNER JOIN scott.dept d ON e.deptno = d.deptno;`;
        exp = "Nur übereinstimmende deptno-Werte erscheinen. Beachte: DEPT 40 (OPERATIONS) fehlt, weil 0 Employees zu deptno 40 gehören.";
        resRows = SCOTT_EMP.map((e) => {
          const d = SCOTT_DEPT.find((x) => x.deptno === e.deptno);
          return d ? { empno: e.empno, ename: e.ename, deptno: e.deptno, dname: d.dname, loc: d.loc } : null;
        }).filter(Boolean);
      } else if (mode === "LEFT") {
        sql = `SELECT e.empno, e.ename, e.deptno, d.dname, d.loc\nFROM scott.emp e\nLEFT OUTER JOIN scott.dept d ON e.deptno = d.deptno;`;
        exp = "Behält alle 14 Zeilen aus EMP (links). Da jeder Employee in SCOTT eine gültige deptno (10, 20, 30) hat, erscheint DEPT 40 weiterhin nicht.";
        resRows = SCOTT_EMP.map((e) => {
          const d = SCOTT_DEPT.find((x) => x.deptno === e.deptno) || {};
          return { empno: e.empno, ename: e.ename, deptno: e.deptno, dname: d.dname ?? null, loc: d.loc ?? null };
        });
      } else if (mode === "RIGHT") {
        sql = `SELECT e.empno, e.ename, d.deptno, d.dname, d.loc\nFROM scott.emp e\nRIGHT OUTER JOIN scott.dept d ON e.deptno = d.deptno;`;
        exp = "Behält alle 4 Zeilen aus DEPT (rechts)! DEPT 40 (OPERATIONS, BOSTON) erscheint nun mit NULL für empno und ename.";
        SCOTT_DEPT.forEach((d) => {
          const emps = SCOTT_EMP.filter((e) => e.deptno === d.deptno);
          if (emps.length === 0) resRows.push({ empno: null, ename: null, deptno: d.deptno, dname: d.dname, loc: d.loc });
          else emps.forEach((e) => resRows.push({ empno: e.empno, ename: e.ename, deptno: d.deptno, dname: d.dname, loc: d.loc }));
        });
      } else if (mode === "FULL") {
        sql = `SELECT e.empno, e.ename, COALESCE(e.deptno, d.deptno) AS deptno, d.dname, d.loc\nFROM scott.emp e\nFULL OUTER JOIN scott.dept d ON e.deptno = d.deptno;`;
        exp = "Behält nicht-passende Zeilen von BEIDEN Seiten (in SCOTT ist DEPT 40 OPERATIONS ohne Treffer; in HR bleibt links zudem Kimberely Grant ohne Department).";
        SCOTT_DEPT.forEach((d) => {
          const emps = SCOTT_EMP.filter((e) => e.deptno === d.deptno);
          if (emps.length === 0) resRows.push({ empno: null, ename: null, deptno: d.deptno, dname: d.dname, loc: d.loc });
          else emps.forEach((e) => resRows.push({ empno: e.empno, ename: e.ename, deptno: d.deptno, dname: d.dname, loc: d.loc }));
        });
      } else {
        sql = `SELECT e.empno, e.ename, d.deptno, d.dname, d.loc\nFROM scott.emp e\nCROSS JOIN scott.dept d;`;
        exp = "Das Cartesian Product kombiniert jeden der 14 Employees mit allen 4 Departments: 14 x 4 = 56 Zeilen.";
        SCOTT_EMP.forEach((e) => {
          SCOTT_DEPT.forEach((d) => {
            resRows.push({ empno: e.empno, ename: e.ename, deptno: d.deptno, dname: d.dname, loc: d.loc });
          });
        });
      }
    } else if (mode === "SELF") {
      sql = `SELECT e.empno, e.ename AS employee, e.mgr, m.ename AS manager\nFROM scott.emp e\nLEFT JOIN scott.emp m ON e.mgr = m.empno;`;
      exp = "Der Self-Join verknüpft den MGR jedes Employees mit der EMPNO seines Managers. LEFT JOIN behält KING (dessen MGR NULL ist).";
      leftHtml = renderHtmlTable(["empno", "ename", "mgr"], SCOTT_EMP, (r) => (r.mgr === null ? "row-unmatched" : "row-matched"));
      rightHtml = renderHtmlTable(["empno", "ename", "job"], SCOTT_EMP);
      resCols = ["empno", "employee", "mgr", "manager"];
      resRows = SCOTT_EMP.map((e) => {
        const m = SCOTT_EMP.find((x) => x.empno === e.mgr);
        return { empno: e.empno, employee: e.ename, mgr: e.mgr, manager: m ? m.ename : null };
      });
    } else if (mode === "NONEQUI") {
      sql = `SELECT e.ename, e.sal, s.grade, s.losal, s.hisal\nFROM scott.emp e\nJOIN scott.salgrade s ON e.sal BETWEEN s.losal AND s.hisal\nORDER BY s.grade, e.sal;`;
      exp = "Ein Non-Equijoin vergleicht e.sal über Salary-Band-Bereiche (losal..hisal) in SCOTT.SALGRADE statt mit =.";
      leftHtml = renderHtmlTable(["empno", "ename", "sal"], SCOTT_EMP, () => "row-matched");
      rightHtml = renderHtmlTable(["grade", "losal", "hisal"], SCOTT_SALGRADE, () => "row-matched");
      resCols = ["ename", "sal", "grade", "losal", "hisal"];
      resRows = SCOTT_EMP.map((e) => {
        const g = SCOTT_SALGRADE.find((s) => e.sal >= s.losal && e.sal <= s.hisal);
        return { ename: e.ename, sal: e.sal, grade: g.grade, losal: g.losal, hisal: g.hisal };
      }).sort((a, b) => a.grade - b.grade || a.sal - b.sal);
    } else {
      // SET Operators
      const leftSet = SCOTT_EMP.map((e) => ({ deptno: e.deptno }));
      const rightSet = SCOTT_DEPT.map((d) => ({ deptno: d.deptno }));
      leftHtml = renderHtmlTable(["deptno"], leftSet);
      rightHtml = renderHtmlTable(["deptno"], rightSet, (r) => (empDeptIds.has(r.deptno) ? "row-matched" : "row-unmatched"));
      resCols = ["deptno"];

      if (mode === "UNION") {
        sql = `SELECT deptno FROM scott.emp\nUNION\nSELECT deptno FROM scott.dept;`;
        exp = "UNION kombiniert beide Ergebnismengen und entfernt alle Duplikate -> {10, 20, 30, 40}.";
        resRows = [10, 20, 30, 40].map((v) => ({ deptno: v }));
      } else if (mode === "UNION_ALL") {
        sql = `SELECT deptno FROM scott.emp\nUNION ALL\nSELECT deptno FROM scott.dept;`;
        exp = "UNION ALL hängt alle 14 Zeilen aus EMP + 4 Zeilen aus DEPT direkt aneinander = 18 Zeilen, ohne Deduplizierung oder Sortierung.";
        resRows = [...leftSet, ...rightSet];
      } else if (mode === "INTERSECT") {
        sql = `SELECT deptno FROM scott.emp\nINTERSECT\nSELECT deptno FROM scott.dept;`;
        exp = "INTERSECT behält nur Werte, die in BEIDEN Queries vorkommen -> {10, 20, 30}.";
        resRows = [10, 20, 30].map((v) => ({ deptno: v }));
      } else {
        sql = `SELECT deptno FROM scott.dept\nMINUS\nSELECT deptno FROM scott.emp;`;
        exp = "DEPT MINUS EMP liefert Zeilen der ersten Query, die in der zweiten fehlen -> {40} (OPERATIONS)!";
        resRows = [{ deptno: 40 }];
      }
    }

    sqlEl.textContent = sql;
    expEl.textContent = exp;
    leftEl.innerHTML = leftHtml;
    rightEl.innerHTML = rightHtml;
    resEl.innerHTML = renderHtmlTable(resCols, resRows);
    countEl.textContent = resRows.length;
  }

  // Lab B: 1-Based SUBSTR & INSTR Slicer
  function initStringSlicer() {
    ["slicer-text", "slicer-start", "slicer-len", "instr-needle", "instr-occ"].forEach((id) => {
      document.getElementById(id).addEventListener("input", renderStringSlicer);
    });
    renderStringSlicer();
  }

  function renderStringSlicer() {
    const str = document.getElementById("slicer-text").value || "";
    const startRaw = Number(document.getElementById("slicer-start").value) || 1;
    const lenRaw = Number(document.getElementById("slicer-len").value) || 0;
    const needle = document.getElementById("instr-needle").value;
    const occ = Math.max(1, Number(document.getElementById("instr-occ").value) || 1);

    const n = str.length;
    // Oracle SUBSTR semantics: 1-based, 0 treated as 1; negative counts from end
    let zeroIdx = 0;
    if (startRaw > 0) zeroIdx = startRaw - 1;
    else if (startRaw < 0) zeroIdx = n + startRaw;
    else zeroIdx = 0;

    let substrOut = "";
    const sliceSet = new Set();
    if (zeroIdx >= 0 && zeroIdx < n) {
      const endIdx = lenRaw > 0 ? Math.min(n, zeroIdx + lenRaw) : n;
      substrOut = str.slice(zeroIdx, endIdx);
      for (let i = zeroIdx; i < endIdx; i++) sliceSet.add(i);
    }

    // Oracle INSTR(str, needle, 1, occ)
    let instrPos = 0;
    const needleSet = new Set();
    if (needle.length > 0 && n > 0) {
      let from = 0;
      let found = -1;
      for (let k = 0; k < occ; k++) {
        found = str.indexOf(needle, from);
        if (found === -1) break;
        from = found + 1;
      }
      if (found !== -1) {
        instrPos = found + 1;
        for (let i = found; i < found + needle.length; i++) needleSet.add(i);
      }
    }

    document.getElementById("slicer-grid").innerHTML = str.split("").map((ch, i) => `
      <div class="char-cell ${sliceSet.has(i) ? "in-slice" : ""} ${needleSet.has(i) ? "in-needle" : ""}">
        <div class="char-idx-pos">+${i + 1}</div>
        <div class="char-val">${escapeHtml(ch === " " ? "\u2423" : ch)}</div>
        <div class="char-idx-neg">${i - n}</div>
      </div>
    `).join("") || `<span class="muted-sm">Gib oben eine Zeichenkette ein, um Oracles 1-basierte &amp; negative Indizes zu sehen.</span>`;

    document.getElementById("substr-formula").textContent = lenRaw > 0
      ? `SUBSTR('${str}', ${startRaw}, ${lenRaw})`
      : `SUBSTR('${str}', ${startRaw})`;
    document.getElementById("substr-result").textContent = substrOut ? `'${substrOut}'` : "NULL";

    document.getElementById("instr-formula").textContent = `INSTR('${str}', '${needle}', 1, ${occ})`;
    document.getElementById("instr-result").textContent = String(instrPos);
  }

  // Lab C: SQL*Plus Substitution Simulator
  const SQLPLUS_PRESETS = {
    single: `SELECT empno, ename, sal\nFROM scott.emp\nWHERE deptno = &dept_num\n  AND job = '&job_title';`,
    double: `SELECT empno, ename, &&sort_col\nFROM scott.emp\nORDER BY &sort_col DESC;`,
    define: `DEFINE target_dept = 20\nSELECT ename, job, sal\nFROM scott.emp\nWHERE deptno = &target_dept;`
  };
  let sqlPlusSessionVars = {};

  function initSqlPlusSimulator() {
    const input = document.getElementById("sqlplus-input");
    input.value = SQLPLUS_PRESETS.single;

    document.querySelectorAll("[data-preset]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeSqlPlusPreset = btn.dataset.preset;
        input.value = SQLPLUS_PRESETS[btn.dataset.preset];
        setRouteHash(`#labs/sqlplus/${btn.dataset.preset}`);
      });
    });

    document.getElementById("sqlplus-clear-vars").addEventListener("click", () => {
      sqlPlusSessionVars = {};
      renderDefinedVars();
      document.getElementById("sqlplus-output").textContent = "Session-Variablen gelöscht (UNDEFINE).\n";
    });

    document.getElementById("sqlplus-run-btn").addEventListener("click", runSqlPlusSim);
    renderDefinedVars();
  }

  function renderDefinedVars() {
    const entries = Object.entries(sqlPlusSessionVars);
    document.getElementById("sqlplus-defined-vars").innerHTML = entries.length
      ? `<strong>Aktive DEFINE-Session-Variablen:</strong> ${entries.map(([k, v]) => `<code>${escapeHtml(k)} = "${escapeHtml(v)}"</code>`).join(" ")}`
      : `<em>Derzeit sind keine Session-Variablen per DEFINE gesetzt.</em>`;
  }

  function runSqlPlusSim() {
    const raw = document.getElementById("sqlplus-input").value;
    const verify = document.getElementById("sqlplus-verify").checked;
    const lines = raw.split(/\r?\n/);
    const out = [];
    const sqlLines = [];

    lines.forEach((line) => {
      const defMatch = line.match(/^\s*DEFINE\s+([A-Za-z_]\w*)\s*=\s*(.+?)\s*;?\s*$/i);
      const undefMatch = line.match(/^\s*UNDEFINE\s+([A-Za-z_]\w*)\s*;?\s*$/i);
      if (defMatch) {
        sqlPlusSessionVars[defMatch[1].toLowerCase()] = defMatch[2].replace(/^['"]|['"]$/g, "");
        out.push(`SQL> ${line}`);
      } else if (undefMatch) {
        delete sqlPlusSessionVars[undefMatch[1].toLowerCase()];
        out.push(`SQL> ${line}`);
      } else if (line.trim()) {
        sqlLines.push(line);
      }
    });

    if (sqlLines.length > 0) {
      const oldSql = sqlLines.join("\n");
      const newSqlLines = sqlLines.map((ln, idx) => {
        const replaced = ln.replace(/(&&)([A-Za-z_]\w*)|(&)([A-Za-z_]\w*)/g, (full, dbl, dblName, sgl, sglName) => {
          const isDouble = Boolean(dbl);
          const vName = (dblName || sglName).toLowerCase();
          let val = sqlPlusSessionVars[vName];
          if (val === undefined) {
            val = window.prompt(`Wert für ${dblName || sglName} eingeben:`, vName.includes("dept") ? "20" : vName.includes("job") ? "CLERK" : "sal");
            if (val === null) val = "";
            out.push(`Enter value for ${dblName || sglName}: ${val}`);
            if (isDouble) {
              sqlPlusSessionVars[vName] = val;
            }
          }
          return val;
        });
        if (verify && replaced !== ln) {
          out.push(`old ${idx + 1}: ${ln}`);
          out.push(`new ${idx + 1}: ${replaced}`);
        }
        return replaced;
      });
      out.push("");
      out.push("Ausgeführtes SQL an Oracle 23ai:");
      out.push(newSqlLines.join("\n"));
    }

    renderDefinedVars();
    document.getElementById("sqlplus-output").textContent = out.join("\n");
  }

  // Lab D: Human Compiler
  function initHumanCompiler() {
    const sel = document.getElementById("compiler-filter-select");
    if (sel) {
      sel.value = state.compilerFilter || "ALL";
      sel.addEventListener("change", () => {
        state.compilerFilter = sel.value;
        saveState();
        renderHumanCompiler();
        setRouteHash(sel.value === "ALL" ? "#labs/compiler" : `#labs/compiler/${sel.value}`);
      });
    }
    renderHumanCompiler();
  }

  function renderHumanCompiler() {
    const list = document.getElementById("compiler-list");
    const filterVal = state.compilerFilter || "ALL";
    const items = window.HUMAN_COMPILER_DRILLS.filter((d) => {
      if (filterVal === "ALL") return true;
      if (filterVal === "phase-1-4") return d.phaseGroup === "1-4";
      if (filterVal.startsWith("clinic-")) return String(d.clinic) === filterVal.replace("clinic-", "");
      return true;
    });

    let correctCount = 0;
    let answeredCount = 0;

    list.innerHTML = items.map((d, i) => {
      const picked = state.compilerAnswers[d.id];
      if (picked) {
        answeredCount += 1;
        if (picked === d.verdict) correctCount += 1;
      }
      const choices = [
        { k: "rows", label: "Liefert >= 1 Zeile" },
        { k: "zero", label: "Gültiges SQL, liefert 0 Zeilen" },
        { k: "error", label: "Wirft ORA-Fehler" }
      ];
      return `
        <div class="compiler-card" id="drill-${d.id}">
          <div class="q-header">
            <strong>Snippet ${i + 1} (${d.id} &middot; Clinic ${d.clinic})</strong>
            <a class="permalink-badge" href="#labs/compiler/${d.id}" title="Permanente URL zu ${d.id}">#${d.id}</a>
          </div>
          <pre><code>${escapeHtml(d.sql)}</code></pre>
          <div class="compiler-actions">
            ${choices.map((c) => {
              let style = "";
              if (picked) {
                if (c.k === d.verdict) style = "background:#effaf3;border-color:#166534;color:#166534;";
                else if (c.k === picked) style = "background:#fdf1ef;border-color:#c74634;color:#c74634;";
              }
              return `<button class="btn btn-sm hc-choice" data-hc="${d.id}" data-verdict="${c.k}" style="${style}">${c.label}</button>`;
            }).join("")}
          </div>
          ${picked ? `<p class="muted-sm" style="margin-top:0.65rem;"><strong>${picked === d.verdict ? "Richtig!" : "Prüfen:"}</strong> ${escapeHtml(d.explanation)}</p>` : ""}
        </div>
      `;
    }).join("");

    document.getElementById("compiler-score-val").textContent = `${correctCount} / ${answeredCount} (${items.length} angezeigt)`;
    list.querySelectorAll(".hc-choice").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.compilerAnswers[btn.dataset.hc] = btn.dataset.verdict;
        saveState();
        renderHumanCompiler();
      });
    });
  }

  // Lab E: Oracle FreeSQL (23ai) Launcher
  let freeSqlActiveFilename = "phase-01-foundations.sql";

  function setFreeSqlStatus(msg) {
    const el = document.getElementById("freesql-status");
    if (el) el.textContent = msg || "";
  }

  function loadFreeSqlPackByKey(key) {
    const packs = window.FREESQL_LAB_PACKS || [];
    const pack = packs.find((p) => p.key === key) || packs[0];
    if (!pack) return;
    const sel = document.getElementById("freesql-pack-select");
    const editor = document.getElementById("freesql-sql-editor");
    const fileLabel = document.getElementById("freesql-active-filename");
    if (sel) sel.value = pack.key;
    if (editor) editor.value = pack.sql;
    freeSqlActiveFilename = pack.filename;
    if (fileLabel) fileLabel.textContent = pack.filename;
    setFreeSqlStatus("");
  }

  function openPhaseInFreeSqlLauncher(phaseId) {
    loadFreeSqlPackByKey(`phase-${phaseId}`);
    switchView("labs");
    switchLabPane("freesql");
    setRouteHash(`#labs/freesql/phase-${phaseId}`);
  }

  function openCustomSqlInFreeSqlLauncher(filename, sqlText) {
    const editor = document.getElementById("freesql-sql-editor");
    const fileLabel = document.getElementById("freesql-active-filename");
    if (editor) editor.value = sqlText;
    freeSqlActiveFilename = filename || "custom-lab.sql";
    if (fileLabel) fileLabel.textContent = freeSqlActiveFilename;
    setFreeSqlStatus("Query aus dem Join & SET Visualizer geladen.");
    switchView("labs");
    switchLabPane("freesql");
    setRouteHash("#labs/freesql");
  }

  function initFreeSqlLauncher() {
    const packs = window.FREESQL_LAB_PACKS || [];
    const sel = document.getElementById("freesql-pack-select");
    const editor = document.getElementById("freesql-sql-editor");
    const embedContainer = document.getElementById("freesql-embed-container");
    const embedFrame = document.getElementById("freesql-embed-frame");
    if (!sel || !editor) return;

    sel.innerHTML = packs.map((p) => `<option value="${escapeHtml(p.key)}">${escapeHtml(p.title)}</option>`).join("");
    if (packs.length > 0) {
      loadFreeSqlPackByKey(packs[0].key);
    }

    sel.addEventListener("change", () => {
      loadFreeSqlPackByKey(sel.value);
      setRouteHash(`#labs/freesql/${sel.value}`);
      if (embedContainer && !embedContainer.hidden && embedFrame) {
        buildFreeSqlEmbedUrl(editor.value).then((url) => {
          embedFrame.src = url;
        });
      }
    });

    document.getElementById("freesql-open-tab-btn").addEventListener("click", () => {
      setFreeSqlStatus("Öffne Oracle 23ai FreeSQL in einem neuen Tab...");
      openInFreeSqlTab(editor.value);
    });

    document.getElementById("freesql-embed-btn").addEventListener("click", async () => {
      setFreeSqlStatus("Komprimiere SQL und lade eingebettete FreeSQL-Sandbox...");
      const url = await buildFreeSqlEmbedUrl(editor.value);
      embedFrame.src = url;
      embedContainer.hidden = false;
      setFreeSqlStatus("Eingebettete Oracle 23ai FreeSQL-Sandbox unten geladen.");
    });

    document.getElementById("freesql-hide-embed-btn").addEventListener("click", () => {
      embedContainer.hidden = true;
      embedFrame.src = "about:blank";
      setFreeSqlStatus("Eingebettete Sandbox ausgeblendet.");
    });

    document.getElementById("freesql-download-btn").addEventListener("click", () => {
      const blob = new Blob([editor.value], { type: "text/sql;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = freeSqlActiveFilename || "lab-script.sql";
      a.click();
      URL.revokeObjectURL(a.href);
      setFreeSqlStatus(`${freeSqlActiveFilename} heruntergeladen (Upload über FreeSQL -> My Content -> Upload Script).`);
    });

    document.getElementById("freesql-copy-btn").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(editor.value);
        setFreeSqlStatus("SQL in die Zwischenablage kopiert.");
      } catch (_) {
        editor.select();
        document.execCommand("copy");
        setFreeSqlStatus("SQL in die Zwischenablage kopiert.");
      }
    });
  }

  // =========================================================================
  // VIEW 4: FLASHCARDS
  // =========================================================================
  let fcDeck = window.FLASHCARDS_1Z0_171.slice();
  let fcIndex = 0;
  let fcFlipped = false;

  function applyFlashcardDomainFilter(val) {
    const sel = document.getElementById("fc-domain-filter");
    if (sel) sel.value = val;
    applyFlashcardFilters();
  }

  function applyFlashcardFilters() {
    const domSel = document.getElementById("fc-domain-filter");
    const phSel = document.getElementById("fc-phase-filter");
    const unsureCb = document.getElementById("fc-unsure-only");
    const domVal = domSel ? domSel.value : "ALL";
    const phVal = phSel ? phSel.value : "ALL";
    const unsureOnly = unsureCb ? unsureCb.checked : false;

    fcDeck = window.FLASHCARDS_1Z0_171.filter((c) => {
      if (domVal !== "ALL" && String(c.domainId) !== String(domVal)) return false;
      if (phVal !== "ALL" && String(c.phaseId) !== String(phVal)) return false;
      if (unsureOnly && state.flashcardStatus[c.id] === "known") return false;
      return true;
    });
    if (fcDeck.length === 0) {
      fcDeck = window.FLASHCARDS_1Z0_171.slice();
    }
    fcIndex = 0;
    fcFlipped = false;
    renderFlashcard();
  }

  function initFlashcards() {
    const sel = document.getElementById("fc-domain-filter");
    const phSel = document.getElementById("fc-phase-filter");
    const unsureCb = document.getElementById("fc-unsure-only");

    sel.innerHTML = `<option value="ALL">Alle 11 Domains (${window.FLASHCARDS_1Z0_171.length} Karten)</option>` +
      window.DOMAINS_1Z0_171.map((d) => `<option value="${d.id}">D${d.id}: ${escapeHtml(d.name)}</option>`).join("");

    if (phSel) {
      phSel.innerHTML = `<option value="ALL">Alle Phasen</option>` +
        window.CURRICULUM_PHASES.filter((p) => p.id <= 9).map((p) => `<option value="${p.id}">Phase ${p.id}</option>`).join("");
      phSel.addEventListener("change", applyFlashcardFilters);
    }
    if (unsureCb) unsureCb.addEventListener("change", applyFlashcardFilters);

    sel.addEventListener("change", () => {
      applyFlashcardFilters();
      setRouteHash(sel.value === "ALL" ? "#flashcards" : `#flashcards/D${sel.value}`);
    });

    document.getElementById("fc-shuffle-btn").addEventListener("click", () => {
      for (let i = fcDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fcDeck[i], fcDeck[j]] = [fcDeck[j], fcDeck[i]];
      }
      fcIndex = 0;
      fcFlipped = false;
      renderFlashcard();
    });

    const card = document.getElementById("flashcard-card");
    const flip = () => {
      fcFlipped = !fcFlipped;
      renderFlashcard();
    };
    card.addEventListener("click", flip);
    card.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        flip();
      } else if (e.code === "ArrowRight") {
        fcIndex = (fcIndex + 1) % fcDeck.length;
        fcFlipped = false;
        renderFlashcard();
      } else if (e.code === "ArrowLeft") {
        fcIndex = (fcIndex - 1 + fcDeck.length) % fcDeck.length;
        fcFlipped = false;
        renderFlashcard();
      }
    });

    document.getElementById("fc-flip-btn").addEventListener("click", flip);
    document.getElementById("fc-next-btn").addEventListener("click", () => {
      fcIndex = (fcIndex + 1) % fcDeck.length;
      fcFlipped = false;
      renderFlashcard();
    });
    document.getElementById("fc-prev-btn").addEventListener("click", () => {
      fcIndex = (fcIndex - 1 + fcDeck.length) % fcDeck.length;
      fcFlipped = false;
      renderFlashcard();
    });
    document.getElementById("fc-mark-known")?.addEventListener("click", () => {
      const cur = fcDeck[fcIndex];
      if (cur) {
        state.flashcardStatus[cur.id] = "known";
        saveState();
        fcIndex = (fcIndex + 1) % fcDeck.length;
        fcFlipped = false;
        renderFlashcard();
      }
    });
    document.getElementById("fc-mark-unsure")?.addEventListener("click", () => {
      const cur = fcDeck[fcIndex];
      if (cur) {
        state.flashcardStatus[cur.id] = "unsure";
        saveState();
        fcIndex = (fcIndex + 1) % fcDeck.length;
        fcFlipped = false;
        renderFlashcard();
      }
    });

    renderFlashcard();
  }

  function renderFlashcard() {
    const c = fcDeck[fcIndex];
    const dom = window.DOMAINS_1Z0_171.find((d) => d.id === c.domainId);
    const card = document.getElementById("flashcard-card");
    const status = state.flashcardStatus[c.id];
    const statusLabel = status === "known" ? " · [Sicher]" : status === "unsure" ? " · [Wiederholen]" : "";
    card.classList.toggle("flipped", fcFlipped);
    document.getElementById("fc-domain-tag").textContent = `D${dom.id}: ${dom.name} (Phase ${c.phaseId}) — ${fcFlipped ? "ANTWORT" : "FRAGE"}${statusLabel}`;
    document.getElementById("fc-counter").textContent = `${fcIndex + 1} / ${fcDeck.length}`;
    document.getElementById("fc-body").textContent = fcFlipped ? c.a : c.q;

    const summaryEl = document.getElementById("fc-mastery-summary");
    if (summaryEl) {
      const total = window.FLASHCARDS_1Z0_171.length;
      const known = Object.values(state.flashcardStatus).filter((v) => v === "known").length;
      const unsure = Object.values(state.flashcardStatus).filter((v) => v === "unsure").length;
      summaryEl.textContent = `Lernstatus gesamt: ${known} / ${total} sicher gewusst · ${unsure} zum Wiederholen markiert`;
    }
  }

  // =========================================================================
  // VIEW 5: 1Z0-171 TIMED MOCK EXAM
  // =========================================================================
  let mockSession = null;
  let mockTimerHandle = null;

  function initMockExam() {
    renderMockIntro();
  }

  function renderMockIntro() {
    if (mockTimerHandle) clearInterval(mockTimerHandle);
    const hist = state.mockHistory || [];
    const histHtml = hist.length > 0
      ? `
        <div class="panel-box" style="max-width:760px;margin-top:1rem;">
          <h3>Bisherige Mock-Exam-Ergebnisse</h3>
          <table class="matrix-table">
            <thead><tr><th>Modus</th><th>Ergebnis</th><th>Datum</th></tr></thead>
            <tbody>
              ${hist.slice(-6).reverse().map((h) => `<tr><td>${escapeHtml(h.label)}</td><td><strong>${h.correct} / ${h.total} (${h.pct}%)</strong></td><td>${escapeHtml(h.date.slice(0, 10))}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      `
      : "";

    document.getElementById("mock-root").innerHTML = `
      <div class="panel-box" style="max-width:760px;">
        <h2>Modus der Exam Simulation wählen</h2>
        <p class="muted-sm">Zwei unabhängige 60-Fragen-Pools nach offizieller 1Z0-171-Gewichtung (keine Teilpunkte bei Multi-Select) sowie gezielter Domain-Fokus-Drill für Remediation (<code>L190–L192</code>).</p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-top:1rem;">
          <button class="btn btn-primary" id="start-mock-1">Mock Exam #1 starten (60 Fragen / 120 Min.)</button>
          <button class="btn btn-teal" id="start-mock-2">Mock Exam #2 starten (60 neue Fragen / 120 Min.)</button>
          <button class="btn btn-secondary" id="start-sprint-mock">Schneller 15-Fragen-Sprint (30 Min.)</button>
        </div>
        <div style="display:flex;gap:0.6rem;align-items:center;flex-wrap:wrap;margin-top:1rem;padding-top:1rem;border-top:1px solid #e2ddd2;">
          <label for="mock-domain-select"><strong>Domain-Fokus-Drill:</strong></label>
          <select id="mock-domain-select">
            ${window.DOMAINS_1Z0_171.map((d) => `<option value="${d.id}">D${d.id}: ${escapeHtml(d.name)} (${d.weight}%)</option>`).join("")}
          </select>
          <button class="btn btn-secondary" id="start-domain-drill" type="button">Domain-Drill starten</button>
        </div>
      </div>
      ${histHtml}
    `;
    document.getElementById("start-mock-1").addEventListener("click", () => startMock(60, 120 * 60, "exam-1"));
    document.getElementById("start-mock-2").addEventListener("click", () => startMock(60, 120 * 60, "exam-2"));
    document.getElementById("start-sprint-mock").addEventListener("click", () => startMock(15, 30 * 60, "sprint"));
    document.getElementById("start-domain-drill").addEventListener("click", () => {
      const dId = Number(document.getElementById("mock-domain-select").value);
      startMock(30, 30 * 60, `domain-${dId}`);
    });
  }

  function startMock(count, seconds, mode = "exam-1") {
    let pool = [];
    let label = "Mock Exam #1";
    if (mode === "exam-2" && Array.isArray(window.MOCK_EXAM_2_QUESTIONS)) {
      pool = window.MOCK_EXAM_2_QUESTIONS.slice();
      label = "Mock Exam #2";
    } else if (mode.startsWith("domain-")) {
      const dId = Number(mode.replace("domain-", ""));
      const combined = [...window.MOCK_EXAM_QUESTIONS, ...(window.MOCK_EXAM_2_QUESTIONS || [])];
      pool = combined.filter((q) => q.domainId === dId);
      const dom = window.DOMAINS_1Z0_171.find((d) => d.id === dId);
      label = `Domain-Drill D${dId}: ${dom ? dom.name : ""}`;
    } else if (mode === "sprint") {
      pool = [...window.MOCK_EXAM_QUESTIONS, ...(window.MOCK_EXAM_2_QUESTIONS || [])];
      label = "15-Fragen-Sprint";
    } else {
      pool = window.MOCK_EXAM_QUESTIONS.slice();
      label = "Mock Exam #1";
    }

    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const chosen = pool.slice(0, Math.min(count, pool.length));
    mockSession = {
      label,
      mode,
      questions: chosen,
      answers: {},
      flagged: new Set(),
      idx: 0,
      remainingSec: seconds,
      totalSec: seconds,
      finished: false
    };

    if (mockTimerHandle) clearInterval(mockTimerHandle);
    mockTimerHandle = setInterval(() => {
      if (!mockSession || mockSession.finished) return;
      mockSession.remainingSec -= 1;
      const el = document.getElementById("mock-timer");
      if (el) el.textContent = formatTime(mockSession.remainingSec);
      if (mockSession.remainingSec <= 0) finishMock();
    }, 1000);

    renderMockQuestion();
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function renderMockQuestion() {
    const root = document.getElementById("mock-root");
    const q = mockSession.questions[mockSession.idx];
    const dom = window.DOMAINS_1Z0_171.find((d) => d.id === q.domainId);
    const picked = mockSession.answers[q.id] || [];
    const inputType = q.multi ? "checkbox" : "radio";
    const elapsedMin = Math.floor((mockSession.totalSec - mockSession.remainingSec) / 60);
    const passHint = elapsedMin < 75 ? "Durchgang 1: Direkte Fragen" : elapsedMin < 105 ? "Durchgang 2: Markierte Code-Traces" : "Durchgang 3: Multi-Select-Prüfung";

    root.innerHTML = `
      <div class="mock-topbar">
        <div><strong>Frage ${mockSession.idx + 1} von ${mockSession.questions.length}</strong> &middot; <span class="muted-sm">${passHint}</span></div>
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <span class="timer-pill" id="mock-timer">${formatTime(mockSession.remainingSec)}</span>
          <button class="btn btn-primary" id="mock-finish-btn">Prüfung abgeben</button>
        </div>
      </div>
      <div class="q-nav-grid">
        ${mockSession.questions.map((item, i) => {
          const isAns = (mockSession.answers[item.id] || []).length > 0;
          const isFlg = mockSession.flagged.has(item.id);
          return `<button class="q-pill ${isAns ? "answered" : ""} ${isFlg ? "flagged" : ""} ${i === mockSession.idx ? "current" : ""}" data-qi="${i}">${i + 1}</button>`;
        }).join("")}
      </div>
      <div class="panel-box">
        <div class="q-header">
          <span>${q.multi ? "Wähle ALLE zutreffenden Antworten (keine Teilpunkte)" : "Wähle EINE beste Antwort"}</span>
          <span class="q-domain-badge">D${dom.id}: ${escapeHtml(dom.name)}</span>
        </div>
        <div class="q-prompt" style="font-size:1.02rem;">${escapeHtml(q.prompt)}</div>
        <div class="q-options">
          ${q.options.map((opt, oi) => `
            <label class="q-option">
              <input type="${inputType}" name="mock_opt" value="${oi}" ${picked.includes(oi) ? "checked" : ""} />
              <span>${escapeHtml(opt)}</span>
            </label>
          `).join("")}
        </div>
        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;margin-top:1.1rem;">
          <div style="display:flex;gap:0.5rem;">
            <button class="btn btn-secondary" id="mock-prev" ${mockSession.idx === 0 ? "disabled" : ""}>&larr; Zurück</button>
            <button class="btn btn-secondary" id="mock-flag">${mockSession.flagged.has(q.id) ? "Markierung entfernen" : "Markieren (Durchgang 2)"}</button>
          </div>
          <button class="btn btn-teal" id="mock-next" ${mockSession.idx === mockSession.questions.length - 1 ? "disabled" : ""}>Weiter &rarr;</button>
        </div>
      </div>
    `;

    root.querySelectorAll(".q-pill").forEach((b) => b.addEventListener("click", () => {
      mockSession.idx = Number(b.dataset.qi);
      renderMockQuestion();
    }));

    root.querySelectorAll('input[name="mock_opt"]').forEach((inp) => {
      inp.addEventListener("change", () => {
        mockSession.answers[q.id] = Array.from(root.querySelectorAll('input[name="mock_opt"]:checked')).map((el) => Number(el.value));
        const pill = root.querySelector(`.q-pill[data-qi="${mockSession.idx}"]`);
        if (pill) pill.classList.toggle("answered", mockSession.answers[q.id].length > 0);
      });
    });

    document.getElementById("mock-prev").addEventListener("click", () => { mockSession.idx -= 1; renderMockQuestion(); });
    document.getElementById("mock-next").addEventListener("click", () => { mockSession.idx += 1; renderMockQuestion(); });
    document.getElementById("mock-flag").addEventListener("click", () => {
      if (mockSession.flagged.has(q.id)) mockSession.flagged.delete(q.id);
      else mockSession.flagged.add(q.id);
      renderMockQuestion();
    });
    document.getElementById("mock-finish-btn").addEventListener("click", () => {
      if (confirm("Mock Exam jetzt zur Auswertung abgeben?")) finishMock();
    });
  }

  function finishMock() {
    mockSession.finished = true;
    if (mockTimerHandle) clearInterval(mockTimerHandle);

    let correct = 0;
    const domStats = {};
    window.DOMAINS_1Z0_171.forEach((d) => (domStats[d.id] = { correct: 0, total: 0 }));

    const details = mockSession.questions.map((q, i) => {
      domStats[q.domainId].total += 1;
      const picked = (mockSession.answers[q.id] || []).slice().sort((a, b) => a - b);
      const expected = q.answer.slice().sort((a, b) => a - b);
      const isRight = picked.length === expected.length && picked.every((v, k) => v === expected[k]);
      if (isRight) {
        correct += 1;
        domStats[q.domainId].correct += 1;
      }
      return { q, i, picked, isRight };
    });

    const pct = Math.round((correct / mockSession.questions.length) * 100);
    state.mockHistory = state.mockHistory || [];
    state.mockHistory.push({
      label: mockSession.label || "Mock Exam",
      correct,
      total: mockSession.questions.length,
      pct,
      date: new Date().toISOString()
    });
    saveState();

    const statusCls = pct >= 75 ? "callout-success" : pct >= 65 ? "callout-info" : "callout-warn";
    const statusMsg = pct >= 75
      ? "Prüfungsreif! (Übertrifft die 75%-Zielmarke)"
      : pct >= 65
        ? "Bestanden (65%+), trainiere schwächere Domains weiter bis zum 75%-Sicherheitspuffer."
        : "Unter der 65%-Bestehensgrenze — wiederhole die verfehlten Domains in Read the Docs vor dem nächsten Versuch.";

    document.getElementById("mock-root").innerHTML = `
      <div class="callout ${statusCls}">
        <strong>Endergebnis: ${correct} / ${mockSession.questions.length} (${pct}%)</strong> — ${statusMsg}
      </div>
      <div style="display:flex;gap:0.75rem;margin-bottom:1rem;">
        <button class="btn btn-primary" id="mock-restart-btn">Neues Mock Exam</button>
      </div>
      <div class="panel-box" style="margin-bottom:1.25rem;">
        <h2>Auswertung nach Domains</h2>
        <table class="matrix-table">
          <thead><tr><th>Domain</th><th>Richtig</th><th>Ergebnis</th></tr></thead>
          <tbody>
            ${window.DOMAINS_1Z0_171.filter((d) => domStats[d.id].total > 0).map((d) => {
              const s = domStats[d.id];
              return `<tr><td>D${d.id}: ${escapeHtml(d.name)}</td><td>${s.correct} / ${s.total}</td><td><strong>${Math.round((s.correct / s.total) * 100)}%</strong></td></tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
      <div class="panel-box">
        <h2>Auswertung Frage für Frage</h2>
        ${details.map(({ q, i, picked, isRight }) => `
          <div class="question-block">
            <div class="q-header">
              <span>Frage ${i + 1} (${q.id})</span>
              <strong style="color:${isRight ? "#166534" : "#c74634"}">${isRight ? "RICHTIG" : "FALSCH"}</strong>
            </div>
            <div class="q-prompt">${escapeHtml(q.prompt)}</div>
            <div class="q-options">
              ${q.options.map((opt, oi) => {
                const cls = q.answer.includes(oi) ? "opt-correct" : picked.includes(oi) ? "opt-wrong" : "";
                return `<div class="q-option ${cls}">${escapeHtml(opt)}</div>`;
              }).join("")}
            </div>
            <p class="muted-sm" style="margin-top:0.45rem;"><strong>Erklärung:</strong> ${escapeHtml(q.explanation)}</p>
          </div>
        `).join("")}
      </div>
    `;
    document.getElementById("mock-restart-btn").addEventListener("click", renderMockIntro);
  }

  // =========================================================================
  // PERMANENT URL ROUTING
  // =========================================================================
  function applyRouteFromHash() {
    const raw = (window.location.hash || "").replace(/^#\/?/, "");
    if (!raw) {
      isApplyingRoute = true;
      switchView("curriculum");
      setRouteHash("#curriculum", false);
      isApplyingRoute = false;
      return;
    }

    const [pathPart, queryPart] = raw.split("?");
    const segments = pathPart.split("/").filter(Boolean);
    const params = new URLSearchParams(queryPart || "");
    const first = (segments[0] || "").toLowerCase();
    const second = segments[1] || "";
    const third = segments[2] || "";

    isApplyingRoute = true;
    try {
      // Shorthands: #L042 or #phase-3 or #CP-2
      if (/^l\d{3}$/i.test(first)) {
        const lessonId = first.toUpperCase();
        switchView("curriculum");
        phaseFilter.value = "ALL";
        lessonSearch.value = "";
        renderPhases();
        const target = document.getElementById(`lesson-${lessonId}`);
        highlightAndScrollTo(target);
        setRouteHash(`#curriculum/${lessonId}`, false);
        return;
      }
      if (/^phase-(\d+)$/i.test(first)) {
        const pId = first.match(/^phase-(\d+)$/i)[1];
        switchView("curriculum");
        phaseFilter.value = pId;
        lessonSearch.value = "";
        renderPhases();
        const target = document.getElementById(`phase-${pId}`);
        highlightAndScrollTo(target);
        setRouteHash(`#curriculum/phase-${pId}`, false);
        return;
      }
      if (/^cp-[0-5]$/i.test(first)) {
        const cpId = first.toUpperCase();
        switchView("checkpoints");
        state.activeCheckpoint = cpId;
        saveState();
        renderCheckpointsUI();
        window.scrollTo({ top: 0, behavior: "smooth" });
        setRouteHash(`#checkpoints/${cpId}`, false);
        return;
      }

      if (first === "curriculum") {
        switchView("curriculum");
        const vParam = (params.get("variant") || "").toUpperCase();
        if (vParam === "A" || vParam === "B") {
          state.variant = vParam;
          variantSelect.value = vParam;
          saveState();
          renderVariantBanner();
        }
        if (/^l\d{3}$/i.test(second)) {
          const lessonId = second.toUpperCase();
          phaseFilter.value = "ALL";
          lessonSearch.value = "";
          renderPhases();
          const target = document.getElementById(`lesson-${lessonId}`);
          highlightAndScrollTo(target);
          setRouteHash(`#curriculum/${lessonId}`, false);
        } else if (/^phase-(\d+)$/i.test(second)) {
          const pId = second.match(/^phase-(\d+)$/i)[1];
          phaseFilter.value = pId;
          lessonSearch.value = "";
          renderPhases();
          const target = document.getElementById(`phase-${pId}`);
          highlightAndScrollTo(target);
          setRouteHash(`#curriculum/phase-${pId}`, false);
        } else {
          if (params.has("phase")) {
            phaseFilter.value = params.get("phase") || "ALL";
          }
          if (params.has("q")) {
            lessonSearch.value = params.get("q") || "";
          }
          renderPhases();
          setRouteHash(getCanonicalHashForView("curriculum"), false);
        }
        return;
      }

      if (first === "checkpoints") {
        switchView("checkpoints");
        const cpMatch = second.toUpperCase();
        if (/^CP-[0-5]$/.test(cpMatch)) {
          state.activeCheckpoint = cpMatch;
          saveState();
        }
        renderCheckpointsUI();
        setRouteHash(`#checkpoints/${state.activeCheckpoint || "CP-0"}`, false);
        return;
      }

      if (first === "labs") {
        switchView("labs");
        const labKey = second.toLowerCase() || activeLab || "joins";
        const validLabs = ["joins", "slicer", "sqlplus", "compiler", "freesql"];
        const targetLab = validLabs.includes(labKey) ? labKey : "joins";
        switchLabPane(targetLab);

        if (targetLab === "joins") {
          const sel = document.getElementById("join-mode-select");
          if (third && sel) {
            const upperMode = third.toUpperCase();
            if (Array.from(sel.options).some((o) => o.value === upperMode)) {
              sel.value = upperMode;
            }
          }
          renderJoinVisualizer();
          setRouteHash(`#labs/joins/${sel ? sel.value : "INNER"}`, false);
        } else if (targetLab === "slicer") {
          if (params.has("text")) document.getElementById("slicer-text").value = params.get("text");
          if (params.has("start")) document.getElementById("slicer-start").value = params.get("start");
          if (params.has("len")) document.getElementById("slicer-len").value = params.get("len");
          if (params.has("needle")) document.getElementById("instr-needle").value = params.get("needle");
          if (params.has("occ")) document.getElementById("instr-occ").value = params.get("occ");
          renderStringSlicer();
          setRouteHash("#labs/slicer", false);
        } else if (targetLab === "sqlplus") {
          const presetKey = third.toLowerCase();
          if (presetKey && SQLPLUS_PRESETS[presetKey]) {
            activeSqlPlusPreset = presetKey;
            document.getElementById("sqlplus-input").value = SQLPLUS_PRESETS[presetKey];
            setRouteHash(`#labs/sqlplus/${presetKey}`, false);
          } else {
            setRouteHash("#labs/sqlplus", false);
          }
        } else if (targetLab === "compiler") {
          const lowerThird = third.toLowerCase();
          const cSel = document.getElementById("compiler-filter-select");
          if (lowerThird === "phase-1-4" || /^clinic-[1-6]$/.test(lowerThird)) {
            state.compilerFilter = lowerThird;
            if (cSel) cSel.value = lowerThird;
            saveState();
            renderHumanCompiler();
            setRouteHash(`#labs/compiler/${lowerThird}`, false);
          } else if (third) {
            state.compilerFilter = "ALL";
            if (cSel) cSel.value = "ALL";
            renderHumanCompiler();
            const drillId = third.toUpperCase();
            const drillEl = document.getElementById(`drill-${drillId}`);
            highlightAndScrollTo(drillEl);
            setRouteHash(drillEl ? `#labs/compiler/${drillId}` : "#labs/compiler", false);
          } else {
            setRouteHash("#labs/compiler", false);
          }
        } else if (targetLab === "freesql") {
          const packs = window.FREESQL_LAB_PACKS || [];
          const packMatch = packs.find((p) => p.key.toLowerCase() === third.toLowerCase());
          if (packMatch) {
            loadFreeSqlPackByKey(packMatch.key);
            setRouteHash(`#labs/freesql/${packMatch.key}`, false);
          } else {
            const curPack = document.getElementById("freesql-pack-select")?.value || "phase-1";
            setRouteHash(`#labs/freesql/${curPack}`, false);
          }
        }
        return;
      }

      if (first === "flashcards") {
        switchView("flashcards");
        if (second) {
          const cleaned = second.toUpperCase().replace(/^D/, "");
          if (cleaned === "ALL") {
            applyFlashcardDomainFilter("ALL");
            setRouteHash("#flashcards", false);
          } else if (/^\d+$/.test(cleaned)) {
            applyFlashcardDomainFilter(cleaned);
            setRouteHash(`#flashcards/D${cleaned}`, false);
          } else {
            setRouteHash(getCanonicalHashForView("flashcards"), false);
          }
        } else {
          setRouteHash(getCanonicalHashForView("flashcards"), false);
        }
        return;
      }

      if (first === "mock") {
        switchView("mock");
        const mSub = second.toLowerCase();
        if (mSub === "sprint") {
          startMock(15, 30 * 60, "sprint");
          setRouteHash("#mock/sprint", false);
        } else if (mSub === "exam-2") {
          startMock(60, 120 * 60, "exam-2");
          setRouteHash("#mock/exam-2", false);
        } else if (mSub === "full" || mSub === "exam-1") {
          startMock(60, 120 * 60, "exam-1");
          setRouteHash("#mock/exam-1", false);
        } else {
          renderMockIntro();
          setRouteHash("#mock", false);
        }
        return;
      }
    } finally {
      isApplyingRoute = false;
    }
  }

  window.addEventListener("hashchange", applyRouteFromHash);
  window.addEventListener("popstate", applyRouteFromHash);

  // Boot
  initCurriculum();
  initCheckpoints();
  initLabs();
  initFlashcards();
  initMockExam();
  applyRouteFromHash();
})();


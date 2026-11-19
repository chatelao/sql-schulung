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
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return {
      completedLessons: [],
      variant: "B",
      checkpoints: {},
      activeCheckpoint: "CP-0",
      compilerAnswers: {}
    };
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

  function switchView(view) {
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
    document.querySelectorAll(".view").forEach((v) => v.classList.toggle("active", v.id === `view-${view}`));
  }

  function switchLabPane(lab) {
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
    });
  });

  // =========================================================================
  // VIEW 1: 200-LESSON TRACKER
  // =========================================================================
  const phaseFilter = document.getElementById("phase-filter");
  const lessonSearch = document.getElementById("lesson-search");
  const variantSelect = document.getElementById("variant-select");
  const variantBanner = document.getElementById("variant-banner");
  const phasesContainer = document.getElementById("phases-container");

  function initCurriculum() {
    phaseFilter.innerHTML = `<option value="ALL">All 10 Phases (200 Lessons)</option>` +
      window.CURRICULUM_PHASES.map((p) => `<option value="${p.id}">Phase ${p.id}: ${escapeHtml(p.title.replace(/^Phase \d+: /, ""))}</option>`).join("");

    variantSelect.value = state.variant || "B";
    variantSelect.addEventListener("change", () => {
      state.variant = variantSelect.value;
      saveState();
      renderVariantBanner();
    });

    phaseFilter.addEventListener("change", renderPhases);
    lessonSearch.addEventListener("input", renderPhases);
    document.getElementById("reset-lessons-btn").addEventListener("click", () => {
      if (confirm("Reset all 200 lesson completion checkboxes?")) {
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
      variantBanner.innerHTML = `<strong>Variant A (In-House Oracle DB):</strong> Run <code>SCOTT/TIGER</code> &amp; <code>HR</code> labs in VS Code / SQL Developer and test <code>&amp;</code>/<code>&amp;&amp;</code> + multi-user DCL natively in <code>sqlcl</code>/<code>sqlplus</code>.`;
    } else {
      variantBanner.innerHTML = `<strong>Variant B (Free Online Cloud):</strong> Run daily SQL queries in <a href="https://freesql.com/" target="_blank" rel="noopener">Oracle FreeSQL</a> (23ai, preloaded <code>SCOTT</code> &amp; <code>HR</code>), use our <strong>SQL*Plus Simulator</strong> tab for <code>&amp;</code>/<code>&amp;&amp;</code>, and use <a href="https://www.oracle.com/cloud/free/" target="_blank" rel="noopener">OCI Always Free</a> for multi-user DCL.`;
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
          <div class="phase-block">
            <div class="phase-header">
              <div class="phase-title-row">
                <span class="phase-tag">Phase ${p.id}</span>
                <strong>${escapeHtml(p.title.replace(/^Phase \d+:\s*/, ""))}</strong>
                <span class="muted-sm" style="margin:0;">(${escapeHtml(p.examNote)})</span>
              </div>
              <div class="phase-stats">
                <span><strong>${phaseDone}</strong> / ${p.lessons.length} done</span>
                <button type="button" class="btn btn-sm btn-teal phase-freesql-btn" data-phase-id="${p.id}">Lab in FreeSQL &nearr;</button>
                <a class="docs-link" href="${p.docsUrl}" target="_blank" rel="noopener">Read Chapter &nearr;</a>
              </div>
            </div>
            <div class="lesson-grid">
              ${filteredLessons.map((l) => {
                const isDone = doneSet.has(l.id);
                return `
                  <label class="lesson-item ${isDone ? "done" : ""}">
                    <input type="checkbox" data-lesson-id="${l.id}" ${isDone ? "checked" : ""} />
                    <div>
                      <span class="lesson-id">${l.id} &middot; 45m</span>
                      <span class="lesson-title">${escapeHtml(l.title)}</span>
                      <span class="lesson-meta">${escapeHtml(l.tag)}</span>
                    </div>
                  </label>
                `;
              }).join("")}
            </div>
          </div>
        `;
      })
      .join("");

    phasesContainer.innerHTML = html || `<p class="muted-sm">No lessons matched "${escapeHtml(q)}".</p>`;
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
        ? `Score: <strong>${gradeCheckpoint(d).pct}%</strong> (${gradeCheckpoint(d).totalCorrect}/22)`
        : `Not taken &middot; Expected: ${slot.expected}`;
      return `
        <button class="cp-card-btn ${slot.id === activeId ? "active" : ""}" data-cp="${slot.id}">
          <div class="cp-card-code">${slot.id} (${slot.lessons})</div>
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
          <strong>${cpId} Submitted:</strong> ${grades.totalCorrect} / ${grades.total} (<strong>${grades.pct}%</strong>)
          ${cpId !== "CP-5" && !cpData.unlockOverride
            ? `<div style="margin-top:0.35rem;font-size:0.84rem;">Answer keys stay locked during ${cpId} to prevent memorization before CP-5. Check the Domain Mastery Matrix on the right! <button class="btn btn-sm" id="cp-unlock-btn">Instructor Override: Show Key</button></div>`
            : `<div style="margin-top:0.35rem;font-size:0.84rem;">Full answer key &amp; explanations unlocked below.</div>`}
          ${blindSpots.length > 0
            ? `<div style="margin-top:0.4rem;"><strong>Blind-Spot Alert:</strong> High confidence (&ge;4/5) yet &lt;50% score in: ${blindSpots.map((b) => escapeHtml(b.name)).join(", ")}.</div>`
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
            <span>Question ${idx + 1} of 22 ${q.multi ? "(Select Two)" : ""}</span>
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
          ${showKey ? `<p class="muted-sm" style="margin-top:0.5rem;"><strong>Explanation:</strong> ${escapeHtml(q.explanation)}</p>` : ""}
        </div>
      `;
    }).join("");

    const tasksHtml = window.CHECKPOINT_SQL_TASKS.map((t) => {
      const done = !!cpData.tasksSelfGrade[t.id];
      return `
        <div class="question-block">
          <h3>${escapeHtml(t.title)}</h3>
          <p style="font-size:0.9rem;margin:0.3rem 0 0.6rem;">${escapeHtml(t.prompt)}</p>
          <label style="font-size:0.86rem;display:flex;align-items:center;gap:0.45rem;margin-bottom:0.5rem;">
            <input type="checkbox" class="cp-task-cb" data-task="${t.id}" ${done ? "checked" : ""} />
            I wrote &amp; verified this query/DDL cleanly in Oracle DB
          </label>
          ${showKey ? `<pre><code>${escapeHtml(t.reference)}</code></pre>` : `<span class="muted-sm">Reference solution unlocks at CP-5 (or Instructor Override).</span>`}
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
          <span class="muted-sm">${slot.lessons} &middot; Expected Band: ${slot.expected}</span>
        </div>
        <div style="display:flex;gap:0.5rem;">
          ${cpData.submitted
            ? `<button class="btn btn-secondary" id="cp-retake-btn">Retake ${cpId}</button>`
            : `<button class="btn btn-primary" id="cp-submit-btn">Submit ${cpId} &amp; Score</button>`}
        </div>
      </div>
      ${resultBanner}
      <h3>Part A — 22 Fixed Domain Questions</h3>
      ${questionsHtml}
      <h3 style="margin-top:1.25rem;">Part B — 3 Gold Standard SQL Tasks</h3>
      ${tasksHtml}
      <h3 style="margin-top:1.25rem;">Part C — Domain Confidence Rating (1 = Guessing, 5 = Exam Ready)</h3>
      <div class="confidence-grid">${confHtml}</div>
      <h3>Lesson 2 — Structured Reflection Log</h3>
      <div style="display:grid;gap:0.75rem;">
        <div class="field">
          <label>1. Which 2 domains improved most since the previous checkpoint, and what clicked?</label>
          <textarea rows="2" class="cp-refl" data-rk="r1">${escapeHtml(cpData.reflection.r1 || "")}</textarea>
        </div>
        <div class="field">
          <label>2. Where was my confidence high, yet my score low (blind spots / exam traps)?</label>
          <textarea rows="2" class="cp-refl" data-rk="r2">${escapeHtml(cpData.reflection.r2 || "")}</textarea>
        </div>
        <div class="field">
          <label>3. Which Part B SQL task felt noticeably faster or easier to write from memory?</label>
          <textarea rows="2" class="cp-refl" data-rk="r3">${escapeHtml(cpData.reflection.r3 || "")}</textarea>
        </div>
        <div class="field">
          <label>4. Concrete study target before the next checkpoint:</label>
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
        cpData.submitted = true;
        cpData.submittedAt = new Date().toISOString();
        saveState();
        renderCheckpointsUI();
      });
    }

    const retakeBtn = document.getElementById("cp-retake-btn");
    if (retakeBtn) {
      retakeBtn.addEventListener("click", () => {
        if (confirm(`Clear ${cpId} submission so you can retake it?`)) {
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
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Checkpoint progress chart">
        <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}" stroke="#c8c0b2" />
        <line x1="${padL}" y1="${padT + plotH}" x2="${W - padR}" y2="${padT + plotH}" stroke="#c8c0b2" />
        <line x1="${padL}" y1="${passY}" x2="${W - padR}" y2="${passY}" stroke="#0f6e6e" stroke-dasharray="4 3" />
        <text x="${W - padR}" y="${passY - 4}" text-anchor="end" font-size="9" fill="#0f6e6e" font-weight="600">65% Pass</text>
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
        <thead><tr><th>Domain</th><th>Wt</th><th>${activeId}</th><th>Conf</th></tr></thead>
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
      const lines = [`# 1Z0-171 Longitudinal Checkpoint Report`, `Exported: ${payload.exportedAt}`, `Lessons Completed: ${payload.completedLessonsCount} / 200`, ""];
      Object.entries(payload.checkpoints).forEach(([cpId, info]) => {
        lines.push(`## ${cpId} — ${info.score.pct}% (${info.score.totalCorrect}/22)`);
        lines.push(`- Reflection 1 (Improved): ${info.reflection.r1 || "-"}`);
        lines.push(`- Reflection 2 (Blind spots): ${info.reflection.r2 || "-"}`);
        lines.push(`- Reflection 3 (Task speed): ${info.reflection.r3 || "-"}`);
        lines.push(`- Reflection 4 (Next goal): ${info.reflection.r4 || "-"}`);
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
    sel.addEventListener("change", renderJoinVisualizer);
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
        exp = "Only matching deptno values appear. Notice DEPT 40 (OPERATIONS) is excluded because 0 employees belong to deptno 40.";
        resRows = SCOTT_EMP.map((e) => {
          const d = SCOTT_DEPT.find((x) => x.deptno === e.deptno);
          return d ? { empno: e.empno, ename: e.ename, deptno: e.deptno, dname: d.dname, loc: d.loc } : null;
        }).filter(Boolean);
      } else if (mode === "LEFT") {
        sql = `SELECT e.empno, e.ename, e.deptno, d.dname, d.loc\nFROM scott.emp e\nLEFT OUTER JOIN scott.dept d ON e.deptno = d.deptno;`;
        exp = "Preserves all 14 rows from EMP (left). Because every employee in SCOTT has a valid deptno (10, 20, 30), DEPT 40 still does not appear.";
        resRows = SCOTT_EMP.map((e) => {
          const d = SCOTT_DEPT.find((x) => x.deptno === e.deptno) || {};
          return { empno: e.empno, ename: e.ename, deptno: e.deptno, dname: d.dname ?? null, loc: d.loc ?? null };
        });
      } else if (mode === "RIGHT") {
        sql = `SELECT e.empno, e.ename, d.deptno, d.dname, d.loc\nFROM scott.emp e\nRIGHT OUTER JOIN scott.dept d ON e.deptno = d.deptno;`;
        exp = "Preserves all 4 rows from DEPT (right)! DEPT 40 (OPERATIONS, BOSTON) now appears with NULL for empno and ename.";
        SCOTT_DEPT.forEach((d) => {
          const emps = SCOTT_EMP.filter((e) => e.deptno === d.deptno);
          if (emps.length === 0) resRows.push({ empno: null, ename: null, deptno: d.deptno, dname: d.dname, loc: d.loc });
          else emps.forEach((e) => resRows.push({ empno: e.empno, ename: e.ename, deptno: d.deptno, dname: d.dname, loc: d.loc }));
        });
      } else if (mode === "FULL") {
        sql = `SELECT e.empno, e.ename, COALESCE(e.deptno, d.deptno) AS deptno, d.dname, d.loc\nFROM scott.emp e\nFULL OUTER JOIN scott.dept d ON e.deptno = d.deptno;`;
        exp = "Preserves unmatched rows from BOTH sides (in SCOTT, DEPT 40 OPERATIONS is unmatched; in HR, Kimberely Grant is also unmatched on the left!).";
        SCOTT_DEPT.forEach((d) => {
          const emps = SCOTT_EMP.filter((e) => e.deptno === d.deptno);
          if (emps.length === 0) resRows.push({ empno: null, ename: null, deptno: d.deptno, dname: d.dname, loc: d.loc });
          else emps.forEach((e) => resRows.push({ empno: e.empno, ename: e.ename, deptno: d.deptno, dname: d.dname, loc: d.loc }));
        });
      } else {
        sql = `SELECT e.empno, e.ename, d.deptno, d.dname, d.loc\nFROM scott.emp e\nCROSS JOIN scott.dept d;`;
        exp = "Cartesian product pairs every one of the 14 employees with all 4 departments: 14 x 4 = 56 rows.";
        SCOTT_EMP.forEach((e) => {
          SCOTT_DEPT.forEach((d) => {
            resRows.push({ empno: e.empno, ename: e.ename, deptno: d.deptno, dname: d.dname, loc: d.loc });
          });
        });
      }
    } else if (mode === "SELF") {
      sql = `SELECT e.empno, e.ename AS employee, e.mgr, m.ename AS manager\nFROM scott.emp e\nLEFT JOIN scott.emp m ON e.mgr = m.empno;`;
      exp = "Self-join matches each employee's MGR to their manager's EMPNO. LEFT JOIN preserves KING (whose MGR is NULL).";
      leftHtml = renderHtmlTable(["empno", "ename", "mgr"], SCOTT_EMP, (r) => (r.mgr === null ? "row-unmatched" : "row-matched"));
      rightHtml = renderHtmlTable(["empno", "ename", "job"], SCOTT_EMP);
      resCols = ["empno", "employee", "mgr", "manager"];
      resRows = SCOTT_EMP.map((e) => {
        const m = SCOTT_EMP.find((x) => x.empno === e.mgr);
        return { empno: e.empno, employee: e.ename, mgr: e.mgr, manager: m ? m.ename : null };
      });
    } else if (mode === "NONEQUI") {
      sql = `SELECT e.ename, e.sal, s.grade, s.losal, s.hisal\nFROM scott.emp e\nJOIN scott.salgrade s ON e.sal BETWEEN s.losal AND s.hisal\nORDER BY s.grade, e.sal;`;
      exp = "Non-equijoin compares e.sal against salary band ranges (losal..hisal) in SCOTT.SALGRADE instead of using =.";
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
        exp = "UNION combines both sets and removes all duplicates -> {10, 20, 30, 40}.";
        resRows = [10, 20, 30, 40].map((v) => ({ deptno: v }));
      } else if (mode === "UNION_ALL") {
        sql = `SELECT deptno FROM scott.emp\nUNION ALL\nSELECT deptno FROM scott.dept;`;
        exp = "UNION ALL stacks all 14 rows from EMP + 4 rows from DEPT = 18 rows without deduplicating or sorting.";
        resRows = [...leftSet, ...rightSet];
      } else if (mode === "INTERSECT") {
        sql = `SELECT deptno FROM scott.emp\nINTERSECT\nSELECT deptno FROM scott.dept;`;
        exp = "INTERSECT keeps only values present in BOTH queries -> {10, 20, 30}.";
        resRows = [10, 20, 30].map((v) => ({ deptno: v }));
      } else {
        sql = `SELECT deptno FROM scott.dept\nMINUS\nSELECT deptno FROM scott.emp;`;
        exp = "DEPT MINUS EMP returns rows in the first query absent from the second -> {40} (OPERATIONS)!";
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
    `).join("") || `<span class="muted-sm">Type a string above to see Oracle 1-based &amp; negative indices.</span>`;

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
        input.value = SQLPLUS_PRESETS[btn.dataset.preset];
      });
    });

    document.getElementById("sqlplus-clear-vars").addEventListener("click", () => {
      sqlPlusSessionVars = {};
      renderDefinedVars();
      document.getElementById("sqlplus-output").textContent = "Session variables cleared (UNDEFINE).\n";
    });

    document.getElementById("sqlplus-run-btn").addEventListener("click", runSqlPlusSim);
    renderDefinedVars();
  }

  function renderDefinedVars() {
    const entries = Object.entries(sqlPlusSessionVars);
    document.getElementById("sqlplus-defined-vars").innerHTML = entries.length
      ? `<strong>DEFINE session variables:</strong> ${entries.map(([k, v]) => `<code>${escapeHtml(k)} = "${escapeHtml(v)}"</code>`).join(" ")}`
      : `<em>No session variables currently DEFINE'd.</em>`;
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
            val = window.prompt(`Enter value for ${dblName || sglName}:`, vName.includes("dept") ? "20" : vName.includes("job") ? "CLERK" : "sal");
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
      out.push("Executed SQL sent to Oracle 23ai:");
      out.push(newSqlLines.join("\n"));
    }

    renderDefinedVars();
    document.getElementById("sqlplus-output").textContent = out.join("\n");
  }

  // Lab D: Human Compiler
  function initHumanCompiler() {
    renderHumanCompiler();
  }

  function renderHumanCompiler() {
    const list = document.getElementById("compiler-list");
    let correctCount = 0;
    let answeredCount = 0;

    list.innerHTML = window.HUMAN_COMPILER_DRILLS.map((d, i) => {
      const picked = state.compilerAnswers[d.id];
      if (picked) {
        answeredCount += 1;
        if (picked === d.verdict) correctCount += 1;
      }
      const choices = [
        { k: "rows", label: "Returns >= 1 Row" },
        { k: "zero", label: "Valid SQL, Returns 0 Rows" },
        { k: "error", label: "Raises ORA- Error" }
      ];
      return `
        <div class="compiler-card">
          <div class="q-header"><strong>Snippet ${i + 1} (${d.id})</strong></div>
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
          ${picked ? `<p class="muted-sm" style="margin-top:0.65rem;"><strong>${picked === d.verdict ? "Correct!" : "Review:"}</strong> ${escapeHtml(d.explanation)}</p>` : ""}
        </div>
      `;
    }).join("");

    document.getElementById("compiler-score-val").textContent = `${correctCount} / ${answeredCount}`;
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
  }

  function openCustomSqlInFreeSqlLauncher(filename, sqlText) {
    const editor = document.getElementById("freesql-sql-editor");
    const fileLabel = document.getElementById("freesql-active-filename");
    if (editor) editor.value = sqlText;
    freeSqlActiveFilename = filename || "custom-lab.sql";
    if (fileLabel) fileLabel.textContent = freeSqlActiveFilename;
    setFreeSqlStatus("Loaded query from Join & SET Visualizer.");
    switchView("labs");
    switchLabPane("freesql");
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
      if (embedContainer && !embedContainer.hidden && embedFrame) {
        buildFreeSqlEmbedUrl(editor.value).then((url) => {
          embedFrame.src = url;
        });
      }
    });

    document.getElementById("freesql-open-tab-btn").addEventListener("click", () => {
      setFreeSqlStatus("Launching Oracle 23ai FreeSQL in a new tab...");
      openInFreeSqlTab(editor.value);
    });

    document.getElementById("freesql-embed-btn").addEventListener("click", async () => {
      setFreeSqlStatus("Compressing SQL and loading embedded FreeSQL sandbox...");
      const url = await buildFreeSqlEmbedUrl(editor.value);
      embedFrame.src = url;
      embedContainer.hidden = false;
      setFreeSqlStatus("Embedded Oracle 23ai FreeSQL sandbox loaded below.");
    });

    document.getElementById("freesql-hide-embed-btn").addEventListener("click", () => {
      embedContainer.hidden = true;
      embedFrame.src = "about:blank";
      setFreeSqlStatus("Embedded sandbox hidden.");
    });

    document.getElementById("freesql-download-btn").addEventListener("click", () => {
      const blob = new Blob([editor.value], { type: "text/sql;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = freeSqlActiveFilename || "lab-script.sql";
      a.click();
      URL.revokeObjectURL(a.href);
      setFreeSqlStatus(`Downloaded ${freeSqlActiveFilename} (upload via FreeSQL -> My Content -> Upload Script).`);
    });

    document.getElementById("freesql-copy-btn").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(editor.value);
        setFreeSqlStatus("SQL copied to clipboard.");
      } catch (_) {
        editor.select();
        document.execCommand("copy");
        setFreeSqlStatus("SQL copied to clipboard.");
      }
    });
  }

  // =========================================================================
  // VIEW 4: FLASHCARDS
  // =========================================================================
  let fcDeck = window.FLASHCARDS_1Z0_171.slice();
  let fcIndex = 0;
  let fcFlipped = false;

  function initFlashcards() {
    const sel = document.getElementById("fc-domain-filter");
    sel.innerHTML = `<option value="ALL">All 11 Domains (${window.FLASHCARDS_1Z0_171.length} cards)</option>` +
      window.DOMAINS_1Z0_171.map((d) => `<option value="${d.id}">D${d.id}: ${escapeHtml(d.name)}</option>`).join("");

    sel.addEventListener("change", () => {
      const val = sel.value;
      fcDeck = val === "ALL"
        ? window.FLASHCARDS_1Z0_171.slice()
        : window.FLASHCARDS_1Z0_171.filter((c) => String(c.domainId) === val);
      fcIndex = 0;
      fcFlipped = false;
      renderFlashcard();
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

    renderFlashcard();
  }

  function renderFlashcard() {
    const c = fcDeck[fcIndex];
    const dom = window.DOMAINS_1Z0_171.find((d) => d.id === c.domainId);
    const card = document.getElementById("flashcard-card");
    card.classList.toggle("flipped", fcFlipped);
    document.getElementById("fc-domain-tag").textContent = `D${dom.id}: ${dom.name} — ${fcFlipped ? "ANSWER" : "PROMPT"}`;
    document.getElementById("fc-counter").textContent = `${fcIndex + 1} / ${fcDeck.length}`;
    document.getElementById("fc-body").textContent = fcFlipped ? c.a : c.q;
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
    document.getElementById("mock-root").innerHTML = `
      <div class="panel-box" style="max-width:760px;">
        <h2>Choose Exam Simulation Mode</h2>
        <p class="muted-sm">Questions mirror the official 1Z0-171 domain weights. Multi-select questions award zero partial credit—just like Pearson VUE / Oracle MyLearn.</p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-top:1rem;">
          <button class="btn btn-primary" id="start-full-mock">Start Full 60-Question Exam (120 Min)</button>
          <button class="btn btn-secondary" id="start-sprint-mock">Quick 15-Question Sprint (30 Min)</button>
        </div>
      </div>
    `;
    document.getElementById("start-full-mock").addEventListener("click", () => startMock(60, 120 * 60));
    document.getElementById("start-sprint-mock").addEventListener("click", () => startMock(15, 30 * 60));
  }

  function startMock(count, seconds) {
    const pool = window.MOCK_EXAM_QUESTIONS.slice();
    if (count < pool.length) {
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
    }
    mockSession = {
      questions: pool.slice(0, count),
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
    const passHint = elapsedMin < 75 ? "Pass 1: Direct Questions" : elapsedMin < 105 ? "Pass 2: Flagged Tracing" : "Pass 3: Multi-Select Audit";

    root.innerHTML = `
      <div class="mock-topbar">
        <div><strong>Question ${mockSession.idx + 1} of ${mockSession.questions.length}</strong> &middot; <span class="muted-sm">${passHint}</span></div>
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <span class="timer-pill" id="mock-timer">${formatTime(mockSession.remainingSec)}</span>
          <button class="btn btn-primary" id="mock-finish-btn">Submit Exam</button>
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
          <span>${q.multi ? "Select ALL that apply (no partial credit)" : "Select ONE best answer"}</span>
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
            <button class="btn btn-secondary" id="mock-prev" ${mockSession.idx === 0 ? "disabled" : ""}>&larr; Prev</button>
            <button class="btn btn-secondary" id="mock-flag">${mockSession.flagged.has(q.id) ? "Unflag" : "Flag for Pass 2"}</button>
          </div>
          <button class="btn btn-teal" id="mock-next" ${mockSession.idx === mockSession.questions.length - 1 ? "disabled" : ""}>Next &rarr;</button>
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
      if (confirm("Submit your Mock Exam for scoring?")) finishMock();
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
    const statusCls = pct >= 75 ? "callout-success" : pct >= 65 ? "callout-info" : "callout-warn";
    const statusMsg = pct >= 75
      ? "Exam-Ready! (Exceeds the 75% target readiness gate)"
      : pct >= 65
        ? "Passed (65%+), keep drilling weak domains to reach 75%+ safety margin."
        : "Below 65% pass line — review missed domains in Read the Docs before retrying.";

    document.getElementById("mock-root").innerHTML = `
      <div class="callout ${statusCls}">
        <strong>Final Score: ${correct} / ${mockSession.questions.length} (${pct}%)</strong> — ${statusMsg}
      </div>
      <div style="display:flex;gap:0.75rem;margin-bottom:1rem;">
        <button class="btn btn-primary" id="mock-restart-btn">New Mock Exam</button>
      </div>
      <div class="panel-box" style="margin-bottom:1.25rem;">
        <h2>Domain Score Breakdown</h2>
        <table class="matrix-table">
          <thead><tr><th>Domain</th><th>Correct</th><th>Score</th></tr></thead>
          <tbody>
            ${window.DOMAINS_1Z0_171.filter((d) => domStats[d.id].total > 0).map((d) => {
              const s = domStats[d.id];
              return `<tr><td>D${d.id}: ${escapeHtml(d.name)}</td><td>${s.correct} / ${s.total}</td><td><strong>${Math.round((s.correct / s.total) * 100)}%</strong></td></tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
      <div class="panel-box">
        <h2>Question-by-Question Review</h2>
        ${details.map(({ q, i, picked, isRight }) => `
          <div class="question-block">
            <div class="q-header">
              <span>Q${i + 1} (${q.id})</span>
              <strong style="color:${isRight ? "#166534" : "#c74634"}">${isRight ? "CORRECT" : "MISSED"}</strong>
            </div>
            <div class="q-prompt">${escapeHtml(q.prompt)}</div>
            <div class="q-options">
              ${q.options.map((opt, oi) => {
                const cls = q.answer.includes(oi) ? "opt-correct" : picked.includes(oi) ? "opt-wrong" : "";
                return `<div class="q-option ${cls}">${escapeHtml(opt)}</div>`;
              }).join("")}
            </div>
            <p class="muted-sm" style="margin-top:0.45rem;"><strong>Explanation:</strong> ${escapeHtml(q.explanation)}</p>
          </div>
        `).join("")}
      </div>
    `;
    document.getElementById("mock-restart-btn").addEventListener("click", renderMockIntro);
  }

  // Boot
  initCurriculum();
  initCheckpoints();
  initLabs();
  initFlashcards();
  initMockExam();
})();

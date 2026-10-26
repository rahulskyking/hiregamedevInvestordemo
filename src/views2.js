/* HireGameDev — pipeline, matching, trust, operations, and settings views. */

function applicationStats() {
  const active = state.applications.filter(a => !['auto_declined', 'rejected'].includes(a.stage));
  const waiting = active.filter(a => ['applied', 'viewed'].includes(a.stage));
  const due = waiting.filter(a => a.lastActionDays >= 7);
  const shortlisted = active.filter(a => ['shortlisted', 'interview', 'offer'].includes(a.stage));
  return { active: active.length, waiting: waiting.length, due: due.length, shortlisted: shortlisted.length, responseRate: 86, medianHours: 31 };
}

function viewApplications() {
  const stats = applicationStats();
  return `
    ${pageHeader('Two-sided workflow · shared source of truth', 'Applications that never go silent', 'One shared application record powers the studio pipeline and candidate timeline. Status changes, reminders and auto-declines stay in sync.',
      `<button class="btn btn-secondary" data-action="open-ghost-sim">${icon('clock', 16)} Run 09:00 IST job</button><button class="btn btn-primary" data-page="match">${icon('sparkles', 16)} See ranking logic</button>`)}
    <section id="applicationsSummary" class="pipeline-summary">
      <article class="card summary-card"><div class="summary-label"><span>Active applications</span>${icon('route', 16)}</div><div class="summary-value">${stats.active}</div><div class="summary-note">${icon('trendingUp', 12)} 4 moved this week</div></article>
      <article class="card summary-card"><div class="summary-label"><span>Awaiting response</span>${icon('clock', 16)}</div><div class="summary-value">${stats.waiting}</div><div class="summary-note text-warning">${icon('alertTriangle', 12)} ${stats.due} over 7 days</div></article>
      <article class="card summary-card"><div class="summary-label"><span>Shortlist or later</span>${icon('userCheck', 16)}</div><div class="summary-value">${stats.shortlisted}</div><div class="summary-note text-success">${icon('checkCircle', 12)} 37.4% conversion</div></article>
      <article class="card summary-card"><div class="summary-label"><span>Studio response rate</span>${icon('gauge', 16)}</div><div class="summary-value">${stats.responseRate}%</div><div class="summary-note">${icon('clock', 12)} Median first reply ${stats.medianHours}h</div></article>
    </section>
    <section class="section" data-tour="pipeline">
      <div class="section-heading">
        <div><div class="kicker">Pipeline view</div><h2>One dataset, two perspectives</h2><p>Switch between the studio board and candidate timeline. Drag cards between stages or use the advance button.</p></div>
        <div class="segmented" role="group" aria-label="Application view">
          <button class="${state.applicationsView === 'studio' ? 'active' : ''}" data-action="set-app-view" data-view="studio">Studio board</button>
          <button class="${state.applicationsView === 'candidate' ? 'active' : ''}" data-action="set-app-view" data-view="candidate">Candidate timeline</button>
        </div>
      </div>
      <div id="applicationsBody">${renderApplicationsBody()}</div>
    </section>`;
}

function renderApplicationsSummary() {
  const stats = applicationStats();
  return `<article class="card summary-card"><div class="summary-label"><span>Active applications</span>${icon('route', 16)}</div><div class="summary-value">${stats.active}</div><div class="summary-note">${icon('trendingUp', 12)} 4 moved this week</div></article>
    <article class="card summary-card"><div class="summary-label"><span>Awaiting response</span>${icon('clock', 16)}</div><div class="summary-value">${stats.waiting}</div><div class="summary-note text-warning">${icon('alertTriangle', 12)} ${stats.due} over 7 days</div></article>
    <article class="card summary-card"><div class="summary-label"><span>Shortlist or later</span>${icon('userCheck', 16)}</div><div class="summary-value">${stats.shortlisted}</div><div class="summary-note text-success">${icon('checkCircle', 12)} 37.4% conversion</div></article>
    <article class="card summary-card"><div class="summary-label"><span>Studio response rate</span>${icon('gauge', 16)}</div><div class="summary-value">${stats.responseRate}%</div><div class="summary-note">${icon('clock', 12)} Median first reply ${stats.medianHours}h</div></article>`;
}

function renderApplicationsBody() {
  return state.applicationsView === 'studio' ? kanbanBoard() : candidateApplicationList();
}

function kanbanBoard() {
  return `<div class="kanban-wrap"><div class="kanban">
    ${APPLICATION_STAGES.map(stage => {
      const apps = state.applications.filter(a => a.stage === stage.id).sort((a, b) => b.score - a.score);
      return `<section class="kanban-col" data-stage="${stage.id}" style="--stage-color:${stage.color}" aria-label="${stage.label}">
        <div class="kanban-head"><strong><span class="stage-dot"></span>${stage.label}</strong><span class="kanban-count">${apps.length}</span></div>
        <div class="kanban-cards">
          ${apps.length ? apps.map(app => {
            const c = getCandidate(app.candidateId), job = getJob(app.jobId);
            const next = APPLICATION_STAGES[stageIndex(stage.id) + 1];
            return `<article class="kanban-card" draggable="true" data-app-id="${app.id}">
              <div class="cand-line"><span class="mini-avatar">${c.initials}</span><div><strong>${esc(c.name)}</strong><span class="cand-role">${esc(job ? job.title : 'Role')}</span></div></div>
              <div class="kanban-meta"><span>${relativeDay(app.appliedDays)}</span><span class="badge ${scoreTone(app.score)}">${app.score}%</span></div>
              ${app.lastActionDays >= 7 ? `<div class="warning-line">${icon('alertTriangle', 12)} ${app.reminder ? 'Reminder sent' : 'Reminder due'} · ${app.lastActionDays}d</div>` : ''}
              <div class="kanban-actions"><button class="btn btn-ghost btn-sm" data-action="view-candidate" data-candidate-id="${c.id}">Profile</button>${next ? `<button class="btn btn-soft btn-sm" data-action="advance-app" data-app-id="${app.id}">${next.label} ${icon('arrowRight', 12)}</button>` : '<span class="badge success">Offer</span>'}</div>
            </article>`;
          }).join('') : `<div class="text-xs text-muted text-right" style="padding:20px 6px">Drop applicants here</div>`}
        </div>
      </section>`;
    }).join('')}
  </div></div>`;
}

function appStageTrack(stage) {
  if (stage === 'auto_declined') return `<span class="badge danger">${icon('clock', 12)} Auto-declined</span><span class="status-label">Studio did not respond · no penalty to you</span>`;
  if (stage === 'rejected') return `<span class="badge danger">${icon('x', 12)} Rejected with reason</span><span class="status-label">Reason code shared with candidate</span>`;
  const idx = stageIndex(stage);
  return `<div class="status-track">${APPLICATION_STAGES.map((s, i) => `${i ? `<span class="status-line ${i <= idx ? 'done' : ''}"></span>` : ''}<span class="status-node ${i <= idx ? 'done' : ''} ${i === idx ? 'current' : ''}">${i < idx ? '✓' : i + 1}</span>`).join('')}</div><span class="status-label">${stageLabel(stage)}</span>`;
}

function candidateApplicationList() {
  const apps = [...state.applications].sort((a, b) => a.appliedDays - b.appliedDays);
  return `<div class="application-list">
    ${apps.map(app => {
      const c = getCandidate(app.candidateId), job = getJob(app.jobId);
      const isExit = ['auto_declined', 'rejected'].includes(app.stage);
      return `<article class="card application-row">
        <div class="app-job"><span class="studio-logo" style="--logo-bg:${job.logoBg};--logo-ink:${job.logoInk}">${job.initials}</span><div><strong>${esc(job.title)}</strong><span>${esc(job.studio)} · applied ${relativeDay(app.appliedDays)}</span></div></div>
        <div>${appStageTrack(app.stage)}</div>
        <div class="app-wait"><strong>${app.lastActionDays === 0 ? 'Today' : `${app.lastActionDays}d since action`}</strong>${isExit ? 'Closed loop' : `Studio replies in ${statsMedianText()}`}</div>
        <div class="flex gap-8">
          ${app.stage === 'auto_declined' ? `<button class="btn btn-secondary btn-sm" data-page="jobs">5 similar jobs</button>` : `<button class="btn btn-secondary btn-sm" data-action="view-candidate" data-candidate-id="${c.id}">Details</button>`}
          ${!isExit && !['offer'].includes(app.stage) ? `<button class="btn btn-ghost btn-sm" data-action="withdraw-app" data-app-id="${app.id}">Withdraw</button>` : ''}
        </div>
      </article>`;
    }).join('')}
  </div>`;
}

function statsMedianText() { return '~31h'; }

function advanceApplication(id, stageOverride) {
  const app = state.applications.find(a => a.id === id);
  if (!app) return;
  const current = stageIndex(app.stage);
  if (stageOverride && APPLICATION_STAGES.some(s => s.id === stageOverride)) {
    app.stage = stageOverride;
  } else if (current >= 0 && current < APPLICATION_STAGES.length - 1) {
    app.stage = APPLICATION_STAGES[current + 1].id;
  } else return;
  app.lastActionDays = 0;
  app.reminder = false;
  addNotification('Application stage updated', `${getCandidate(app.candidateId).name} moved to ${stageLabel(app.stage)}.`, 'route');
  addAudit(`application.${app.stage}`, app.id, `Status changed in ${state.role} workspace`);
  saveState();
  updateApplicationsView();
  renderTopbar();
  toast('Pipeline updated', `${getCandidate(app.candidateId).name} is now in ${stageLabel(app.stage)}.`);
}

function updateApplicationsView() {
  const body = $('#applicationsBody');
  const summary = $('#applicationsSummary');
  if (body) body.innerHTML = renderApplicationsBody();
  if (summary) summary.innerHTML = renderApplicationsSummary();
  $$('.segmented [data-action="set-app-view"]').forEach(btn => btn.classList.toggle('active', btn.dataset.view === state.applicationsView));
  saveState();
}

const LAB_PRESETS = {
  unity: {
    name: 'Unity Gameplay Developer', subtitle: 'Pune · 3–6 yrs · ₹10–14 LPA', minYears: 3, maxYears: 6, salaryMin: 10, salaryMax: 14,
    maxNotice: null, requiredEngine: 'Unity', xrRequired: false, weights: [{ key: 'unity', name: 'Unity', weight: 2.0, min: 3 }, { key: 'csharp', name: 'C#', weight: 1.6, min: 3 }, { key: 'shader', name: 'Shader Graph', weight: 1.6, min: 2 }]
  },
  junior: {
    name: 'Junior Unity Developer', subtitle: 'Pune · 0–2 yrs · ₹4–6 LPA', minYears: 0, maxYears: 2, salaryMin: 4, salaryMax: 6,
    maxNotice: null, requiredEngine: 'Unity', xrRequired: false, weights: [{ key: 'unity', name: 'Unity', weight: 2.0, min: 2 }, { key: 'csharp', name: 'C#', weight: 1.8, min: 2 }, { key: 'shader', name: 'Shader Graph', weight: 0.8, min: 1 }]
  },
  xr: {
    name: 'XR Gameplay Developer', subtitle: 'Kochi · 2–6 yrs · ₹9–15 LPA', minYears: 2, maxYears: 6, salaryMin: 9, salaryMax: 15,
    maxNotice: 15, requiredEngine: 'XR Toolkit', xrRequired: true, weights: [{ key: 'unity', name: 'Unity', weight: 1.6, min: 3 }, { key: 'csharp', name: 'C#', weight: 1.4, min: 3 }, { key: 'shader', name: 'Shader Graph', weight: 1.0, min: 1 }, { key: 'xr', name: 'XR Toolkit', weight: 2.0, min: 2 }]
  }
};

function profFactor(value) { return [0, .5, .75, .9, 1][clamp(Number(value), 0, 4)] || 0; }
function evidenceFactor(level) { return level === 'verified' ? 1 : level === 'backed' ? .9 : .7; }

function getLabResult() {
  const lab = state.lab;
  const job = LAB_PRESETS[lab.preset] || LAB_PRESETS.unity;
  const prof = { unity: Number(lab.unity), csharp: Number(lab.csharp), shader: Number(lab.shader), xr: 0 };
  const evidence = { unity: 'backed', csharp: lab.evidenceCSharp, shader: 'claimed', xr: 'claimed' };
  let weighted = 0, totalWeight = 0;
  const matched = [], missing = [];
  job.weights.forEach(skill => {
    const direct = profFactor(prof[skill.key]) * evidenceFactor(evidence[skill.key]);
    let credit = clamp(direct, 0, 1);
    if (prof[skill.key] < skill.min) credit *= .7;
    weighted += skill.weight * credit;
    totalWeight += skill.weight;
    if (credit >= .4) matched.push(skill.name); else missing.push(skill.name);
  });
  const skillScore = round1(totalWeight ? 100 * weighted / totalWeight : 0);
  const years = Number(lab.years), lo = job.minYears, hi = job.maxYears;
  let experience;
  if (years < 1 && lo === 0) experience = 100;
  else if (lo <= years && years <= hi) experience = 100;
  else if (years < lo) experience = Math.max(0, 100 - 25 * (lo - years));
  else experience = Math.max(30, 100 - 10 * (years - hi));
  experience = round1(experience);
  const expected = Number(lab.expected), min = job.salaryMin, max = job.salaryMax;
  let salaryScore;
  if (expected >= min && expected <= max) salaryScore = 100;
  else if (expected < min) salaryScore = 95;
  else {
    const excess = (expected - max) / max;
    salaryScore = excess <= .1 ? 70 : excess <= .2 ? 45 : excess <= .3 ? 20 : 0;
  }
  const notice = Number(lab.notice);
  const noticeScore = job.maxNotice == null ? 100 - (notice / 90) * 20 : (notice <= job.maxNotice ? 100 : 60);
  const logistics = round1(.4 * 100 + .4 * salaryScore + .2 * noticeScore);
  const finalScore = round1(.55 * skillScore + .20 * experience + .25 * logistics);
  const enginePass = job.requiredEngine === 'Unity' ? prof.unity >= 2 : !job.xrRequired;
  const filters = [
    { code: 'F1', label: 'Work mode', pass: true },
    { code: 'F2', label: job.xrRequired ? 'XR Toolkit gate' : 'Engine gate', pass: enginePass },
    { code: 'F3', label: 'Salary ceiling', pass: expected <= max * 1.3 },
    { code: 'F4', label: 'Notice period', pass: job.maxNotice == null || notice <= job.maxNotice },
    { code: 'F5', label: 'Availability', pass: true }
  ];
  return { job, skillScore, experience, salaryScore: round1(salaryScore), noticeScore: round1(noticeScore), logistics, finalScore, label: scoreLabel(finalScore), filters, passesFilters: filters.every(f => f.pass), matched, missing };
}

function labSlider(key, label, min, max, step, suffix = '') {
  const value = state.lab[key];
  return `<div class="lab-field"><div class="lab-field-head"><span>${label}</span><span class="value" id="labValue-${key}">${value}${suffix}</span></div><input class="range" type="range" min="${min}" max="${max}" step="${step}" value="${value}" data-lab-key="${key}" aria-label="${label}"></div>`;
}

function viewMatch() {
  const result = getLabResult();
  return `
    ${pageHeader('Algorithm v2 · fully auditable', 'Matching you can explain', 'Change candidate inputs and see the exact score update. A worked example shows how hard filters, skill evidence, experience and logistics combine into one transparent result.',
      `<button class="btn btn-secondary" data-action="load-worked-example">${icon('rotate', 16)} Load worked example</button><button class="btn btn-primary" data-action="prove-csharp">${icon('badgeCheck', 16)} Prove C# with portfolio</button>`)}
    <section class="match-lab" data-tour="match-lab">
      <article class="card lab-controls">
        <div class="card-head"><div><h3>Candidate & job inputs</h3><p>Drag any slider — score recalculates instantly.</p></div><span class="badge accent">${icon('sliders', 12)} Live</span></div>
        <div class="lab-group">
          <div class="lab-group-title"><span class="num">1</span><div><h3>Choose a job preset</h3><p>Changing the job changes requirements and hard filters.</p></div></div>
          <select id="labPreset" class="select" data-lab-preset>${Object.entries(LAB_PRESETS).map(([id, preset]) => `<option value="${id}" ${state.lab.preset === id ? 'selected' : ''}>${preset.name} — ${preset.subtitle}</option>`).join('')}</select>
        </div>
        <div class="lab-group">
          <div class="lab-group-title"><span class="num">2</span><div><h3>Skill proficiency</h3><p>1 = beginner · 4 = expert. Evidence multiplies the credit.</p></div></div>
          ${labSlider('unity', 'Unity', 0, 4, 1)}
          ${labSlider('csharp', 'C#', 0, 4, 1)}
          ${labSlider('shader', 'Shader Graph', 0, 4, 1)}
          <div class="evidence-select"><div><strong class="text-sm">C# evidence</strong><p class="text-xs text-muted">Claimed 0.70 · Backed 0.90 · Verified 1.00</p></div><select id="labEvidence" class="select" data-lab-evidence><option value="claimed" ${state.lab.evidenceCSharp === 'claimed' ? 'selected' : ''}>Claimed</option><option value="backed" ${state.lab.evidenceCSharp === 'backed' ? 'selected' : ''}>Portfolio backed</option><option value="verified" ${state.lab.evidenceCSharp === 'verified' ? 'selected' : ''}>Verified credit</option></select></div>
        </div>
        <div class="lab-group">
          <div class="lab-group-title"><span class="num">3</span><div><h3>Experience & logistics</h3><p>Years, expected CTC and notice period.</p></div></div>
          ${labSlider('years', 'Years of experience', 0, 15, .5, ' yrs')}
          ${labSlider('expected', 'Expected CTC', 2, 35, .5, ' LPA')}
          ${labSlider('notice', 'Notice period', 0, 90, 15, ' days')}
        </div>
        <div class="stuffing-test"><div><strong class="text-sm">Skill-stuffing test</strong><p>Add 20 irrelevant skills — the job-weighted score stays the same.</p></div><button class="btn btn-secondary btn-sm" data-action="toggle-stuffing">${state.lab.stuffing ? 'Remove extras' : 'Add 20 skills'}</button></div>
      </article>
      <div id="labResult">${renderLabResult(result)}</div>
    </section>
    <section class="section">
      ${sectionHeading('Why this design matters', 'A score candidates and studios can trust', 'The engine is a pure, testable function. Every module is independently explainable, and ranking adjustments never change the displayed percentage.')}
      <div class="algorithm-steps">
        <article class="card algorithm-step"><span class="step-num">${icon('shield', 13)} Step 1</span><h3>Dealbreakers first</h3><p>Work mode, engine gate, salary ceiling, notice period and availability remove impossible pairs before scoring.</p></article>
        <article class="card algorithm-step"><span class="step-num">${icon('database', 13)} Step 2</span><h3>Job-weighted skills</h3><p>Only the role’s 3–12 skills count. Required skills carry double weight, evidence boosts credit and related skills receive partial credit.</p></article>
        <article class="card algorithm-step"><span class="step-num">${icon('chart', 13)} Step 3</span><h3>Transparent total</h3><p><strong>0.55 × skill + 0.20 × experience + 0.25 × logistics.</strong> Freshness and studio quality adjust rank, not the displayed score.</p></article>
      </div>
    </section>`;
}

function renderLabResult(r) {
  const job = r.job;
  return `<article class="card score-card">
    <div class="score-hero">
      <div class="score-ring" style="--score:${r.finalScore}%"><div class="score-ring-content"><strong>${r.finalScore.toFixed(1)}</strong><span>final score</span></div></div>
      <div class="score-hero-copy"><div class="kicker">${esc(job.name)}</div><h2>${r.label}</h2><p>${r.passesFilters ? 'All hard filters passed. This pair is eligible for recommendations and Best match sorting.' : 'A hard filter failed. This pair is excluded from recommendations, but manual applying remains allowed with a clear warning.'}</p></div>
    </div>
    <div class="flex gap-8 flex-wrap mt-16"><span class="badge ${r.passesFilters ? 'success' : 'danger'}">${icon(r.passesFilters ? 'checkCircle' : 'alertTriangle', 12)} ${r.passesFilters ? 'Filters passed' : 'Filtered pair'}</span><span class="badge ${scoreTone(r.finalScore)}">${r.finalScore.toFixed(1)} · ${r.label}</span>${state.lab.stuffing ? '<span class="badge info">20 irrelevant skills ignored</span>' : ''}</div>
    <div class="score-bars">
      <div><div class="score-bar-head"><span>Skill score · 55%</span><span>${r.skillScore.toFixed(1)} / 100</span></div><div class="progress"><span style="width:${r.skillScore}%"></span></div></div>
      <div><div class="score-bar-head"><span>Experience fit · 20%</span><span>${r.experience.toFixed(1)} / 100</span></div><div class="progress"><span style="width:${r.experience}%"></span></div></div>
      <div><div class="score-bar-head"><span>Logistics · 25%</span><span>${r.logistics.toFixed(1)} / 100</span></div><div class="progress"><span style="width:${r.logistics}%"></span></div></div>
    </div>
    <div class="detail-section">
      <h4>${icon('shield', 16)} Hard-filter checks</h4>
      <div class="hard-filters">${r.filters.map(f => `<span class="filter-check ${f.pass ? '' : 'fail'}">${icon(f.pass ? 'checkCircle' : 'alertTriangle', 14)} ${f.code} ${f.label} ${f.pass ? 'pass' : 'fail'}</span>`).join('')}</div>
    </div>
    <div class="formula-box">${icon('sliders', 16)}<code>final = 0.55 × skills + 0.20 × experience + 0.25 × logistics = ${r.finalScore.toFixed(1)}</code></div>
    <div class="detail-section">
      <h4>${icon('fileText', 16)} Explanation JSON</h4>
      <pre class="code-block"><span class="key">"final"</span>: <span class="num">${r.finalScore.toFixed(1)}</span>, <span class="key">"label"</span>: <span class="str">"${r.label}"</span>, <span class="key">"passes_filters"</span>: ${r.passesFilters},
<span class="key">"skills"</span>: { <span class="key">"score"</span>: <span class="num">${r.skillScore.toFixed(1)}</span>, <span class="key">"matched"</span>: [<span class="str">"${r.matched.join('", "')}"</span>], <span class="key">"missing"</span>: [<span class="str">"${r.missing.join('", "')}"</span>] },
<span class="key">"experience"</span>: { <span class="key">"score"</span>: <span class="num">${r.experience.toFixed(1)}</span>, <span class="key">"years"</span>: <span class="num">${state.lab.years}</span>, <span class="key">"job_range"</span>: [<span class="num">${job.minYears}</span>, <span class="num">${job.maxYears}</span>] },
<span class="key">"logistics"</span>: { <span class="key">"score"</span>: <span class="num">${r.logistics.toFixed(1)}</span>, <span class="key">"location"</span>: <span class="num">100</span>, <span class="key">"salary"</span>: <span class="num">${r.salaryScore.toFixed(1)}</span>, <span class="key">"notice"</span>: <span class="num">${r.noticeScore.toFixed(1)}</span> }</pre>
    </div>
    <div class="why-note">${icon('sparkles', 15)} <span>Worked example: Unity 3 backed, C# 4 claimed, 4 years, ₹12 LPA, 30-day notice gives <strong>73.7</strong>. Backing C# raises it to roughly <strong>77.0</strong>.</span></div>
  </article>`;
}

function updateLabResult() {
  const result = getLabResult();
  const target = $('#labResult');
  if (target) target.innerHTML = renderLabResult(result);
  saveState();
}

function viewTrust() {
  const counts = ghostCounts();
  return `
    ${pageHeader('Trust & accountability', 'Close the loop, every time', 'A marketplace only works when evidence is believable, privacy is deliberate and silence has consequences. These rules come directly from the product blueprint.',
      `<button class="btn btn-secondary" data-page="admin">${icon('sliders', 16)} Open admin console</button><button class="btn btn-primary" data-action="open-ghost-sim">${icon('clock', 16)} Simulate daily job</button>`)}
    <section class="trust-hero" data-tour="trust">
      <article class="card pad">
        <div class="trust-score-card"><div class="big-ring" style="--score:86%"><strong>86%</strong></div><div><span class="kicker">PixelForge Studios</span><h2 style="margin-top:8px">Response rate, earned by action</h2><p class="text-sm text-muted mt-8">Measured over applications at least 14 days old in the last 90 days. Only real human status changes count — “viewed” never does.</p></div></div>
        <div class="trust-details"><div class="trust-detail"><span>Applications measured</span><strong>42</strong></div><div class="trust-detail"><span>Median first response</span><strong>31h</strong></div><div class="trust-detail"><span>Contact releases</span><strong>${state.shortlistedCandidates.length + 7}</strong></div></div>
        <div class="chart-wrap mt-20" style="height:120px">${chartSvg(RESPONSE_SERIES, 'responseGradient')}</div>
        <div class="chart-labels"><span>90 days ago</span><span>60 days ago</span><span>30 days ago</span><span>Today</span></div>
      </article>
      <article class="card pad">
        <div class="card-head"><div><h3>The anti-ghosting promise</h3><p>A predictable timeline candidates can plan around.</p></div><span class="badge accent">${icon('clock', 12)} 09:00 IST daily</span></div>
        <div class="timeline">
          <div class="timeline-step"><div class="timeline-dot">${icon('send', 15)}</div><strong>Day 0 · Applied</strong><p>Application enters the studio pipeline with a transparent match score.</p></div>
          <div class="timeline-step"><div class="timeline-dot">${icon('bell', 15)}</div><strong>Day 7 · Reminder</strong><p>One digest per studio lists applicants waiting for a human response.</p></div>
          <div class="timeline-step muted"><div class="timeline-dot">${icon('checkCircle', 15)}</div><strong>Day 14 · Closed loop</strong><p>No response? Auto-decline with similar roles suggested to the candidate.</p></div>
        </div>
        <div class="ghost-sim mt-24"><div><strong>${counts.reminders} reminder${counts.reminders === 1 ? '' : 's'} · ${counts.declines} auto-decline${counts.declines === 1 ? '' : 's'} pending</strong><p>Run the daily job to apply the rules to current applications.</p></div><button class="btn btn-primary" data-action="open-ghost-sim">Run job ${icon('arrowRight', 14)}</button></div>
      </article>
    </section>
    <section class="section">
      ${sectionHeading('Trust layers', 'Verification without friction')}
      <div class="trust-grid">
        <article class="card trust-card"><span class="trust-icon">${icon('building', 19)}</span><h3>Verified studios</h3><p>GSTIN format, work-email domain and a live website are checked before a studio can publish jobs or access candidate contacts.</p><div class="trust-flag">${icon('checkCircle', 14)} Admin review queue built in</div></article>
        <article class="card trust-card"><span class="trust-icon">${icon('badgeCheck', 19)}</span><h3>Shipped-title evidence</h3><p>Credits, portfolio links and work history turn claimed skills into backed or verified evidence — the lever that raises a match score.</p><div class="trust-flag">${icon('checkCircle', 14)} Evidence factor up to 1.00</div></article>
        <article class="card trust-card"><span class="trust-icon">${icon('lock', 19)}</span><h3>Contact gating</h3><p>Phone and email stay hidden until shortlist or mutual interest. Current CTC is hidden from studios by default.</p><div class="trust-flag">${icon('checkCircle', 14)} Every profile view logged</div></article>
        <article class="card trust-card"><span class="trust-icon">${icon('gauge', 19)}</span><h3>Response metrics</h3><p>Only shortlist, interview, offer, hired and reasoned rejection count. Bulk-reject patterns are flagged as non-responses.</p><div class="trust-flag">${icon('checkCircle', 14)} Badge shown after 10 applications</div></article>
        <article class="card trust-card"><span class="trust-icon">${icon('shieldAlert', 19)}</span><h3>Content & salary checks</h3><p>Job descriptions block contact details and external apply links. Salary spread beyond 1.5× is sent to admin review.</p><div class="trust-flag">${icon('checkCircle', 14)} First 3 jobs reviewed manually</div></article>
        <article class="card trust-card"><span class="trust-icon">${icon('database', 19)}</span><h3>Auditable decisions</h3><p>Every match explanation, admin action and status change is written to an append-only audit trail.</p><div class="trust-flag">${icon('checkCircle', 14)} Algorithm version logged with score</div></article>
      </div>
    </section>`;
}

function ghostCounts() {
  const waiting = state.applications.filter(a => ['applied', 'viewed'].includes(a.stage));
  return {
    reminders: waiting.filter(a => a.lastActionDays >= 7 && a.lastActionDays < 14 && !a.reminder).length + waiting.filter(a => a.lastActionDays >= 14 && !a.reminder).length,
    declines: waiting.filter(a => a.lastActionDays >= 14).length
  };
}

function openGhostModal() {
  const counts = ghostCounts();
  openModal(`${modalHead('Run the 09:00 IST anti-ghosting job', 'A deterministic daily rule over the current application set.')}
    <div class="modal-body">
      <div class="grid grid-2">
        <div class="apply-box"><span>Day-7 reminders</span><strong>${counts.reminders} studio digest${counts.reminders === 1 ? '' : 's'}</strong><p class="text-xs text-muted mt-4">Applications in applied or viewed with no action for 7+ days.</p></div>
        <div class="apply-box"><span>Day-14 auto-declines</span><strong>${counts.declines} application${counts.declines === 1 ? '' : 's'}</strong><p class="text-xs text-muted mt-4">Closed with a system history row and similar job suggestions.</p></div>
      </div>
      <div class="warning-banner">${icon('alertTriangle', 17)} <span>Only real status changes count toward response rate. This job will not penalize candidates, and it will write a system audit entry.</span></div>
      <div class="pii-notice">${icon('shield', 16)} <span>The scheduled job runs at 09:00 IST, sends one digest per studio and queues candidate notifications.</span></div>
    </div>
    <div class="modal-foot"><span class="modal-note">Changes are applied instantly to this workspace.</span><button class="btn btn-secondary" data-action="close-modal">Cancel</button><button class="btn btn-primary" data-action="run-ghost-job" ${counts.reminders + counts.declines === 0 ? 'disabled' : ''}>Run daily job</button></div>`, { label: 'Anti-ghosting job' });
}

function runGhostJob() {
  const counts = ghostCounts();
  let reminders = 0, declines = 0;
  state.applications.forEach(app => {
    if (!['applied', 'viewed'].includes(app.stage)) return;
    if (app.lastActionDays >= 14) {
      app.stage = 'auto_declined';
      app.reminder = true;
      declines++;
    } else if (app.lastActionDays >= 7 && !app.reminder) {
      app.reminder = true;
      reminders++;
    }
  });
  if (reminders) addNotification(`${reminders} applicant reminders sent`, 'Studios received one digest per active job.', 'bell');
  if (declines) addNotification(`${declines} applications auto-declined`, 'Candidates received up to five similar active roles.', 'clock');
  addAudit('antighost.daily_run', 'applications', `Reminders ${reminders} · auto-declines ${declines} · 09:00 IST simulation`);
  closeModal();
  saveState();
  renderTopbar();
  renderPage(false);
  toast('Daily job completed', `${reminders} reminders sent and ${declines} applications auto-declined.`);
}

function viewAdmin() {
  const pendingStudios = state.studioQueue.filter(q => q.status === 'pending').length;
  const pendingJobs = state.jobQueue.filter(q => q.status === 'pending').length;
  const openReports = state.reports.filter(r => r.status !== 'resolved').length;
  return `
    ${pageHeader('Operations console', 'Control the marketplace', 'Verification queues, job review, reports, runtime settings and an audit log — designed for safe launch and human oversight.',
      `<button class="btn btn-secondary" data-page="trust">${icon('shield', 16)} Trust rules</button><button class="btn btn-primary" data-action="export-workspace">${icon('download', 16)} Export state</button>`)}
    <section id="adminSummary" class="admin-stats">
      <article class="card summary-card"><div class="summary-label"><span>Studios awaiting review</span>${icon('building', 16)}</div><div class="summary-value">${pendingStudios}</div><div class="summary-note">Target SLA · 24 hours</div></article>
      <article class="card summary-card"><div class="summary-label"><span>Jobs in review</span>${icon('briefcase', 16)}</div><div class="summary-value">${pendingJobs}</div><div class="summary-note">First 3 jobs per studio</div></article>
      <article class="card summary-card"><div class="summary-label"><span>Open reports</span>${icon('flag', 16)}</div><div class="summary-value">${openReports}</div><div class="summary-note">${openReports ? 'High-priority queue active' : 'Queue clear'}</div></article>
      <article class="card summary-card"><div class="summary-label"><span>Algorithm version</span>${icon('database', 16)}</div><div class="summary-value">v2</div><div class="summary-note">Every score logged</div></article>
    </section>
    <section class="section" data-tour="admin">
      <div class="admin-tab-bar" role="tablist" aria-label="Admin sections">
        ${[['studios', 'Studio verification', 'building'], ['jobs', 'Job review', 'briefcaseCheck'], ['reports', 'Reports', 'flag'], ['settings', 'Settings & audit', 'sliders']].map(([id, label, iconName]) => `<button class="admin-tab ${state.adminTab === id ? 'active' : ''}" data-action="admin-tab" data-tab="${id}" role="tab" aria-selected="${state.adminTab === id}">${icon(iconName, 15)} ${label}</button>`).join('')}
      </div>
      <div id="adminContent">${renderAdminContent()}</div>
    </section>`;
}

function renderAdminSummary() {
  const pendingStudios = state.studioQueue.filter(q => q.status === 'pending').length;
  const pendingJobs = state.jobQueue.filter(q => q.status === 'pending').length;
  const openReports = state.reports.filter(r => r.status !== 'resolved').length;
  return `<article class="card summary-card"><div class="summary-label"><span>Studios awaiting review</span>${icon('building', 16)}</div><div class="summary-value">${pendingStudios}</div><div class="summary-note">Target SLA · 24 hours</div></article>
    <article class="card summary-card"><div class="summary-label"><span>Jobs in review</span>${icon('briefcase', 16)}</div><div class="summary-value">${pendingJobs}</div><div class="summary-note">First 3 jobs per studio</div></article>
    <article class="card summary-card"><div class="summary-label"><span>Open reports</span>${icon('flag', 16)}</div><div class="summary-value">${openReports}</div><div class="summary-note">${openReports ? 'High-priority queue active' : 'Queue clear'}</div></article>
    <article class="card summary-card"><div class="summary-label"><span>Algorithm version</span>${icon('database', 16)}</div><div class="summary-value">v2</div><div class="summary-note">Every score logged</div></article>`;
}

function renderAdminContent() {
  if (state.adminTab === 'studios') return renderStudioQueue();
  if (state.adminTab === 'jobs') return renderJobQueue();
  if (state.adminTab === 'reports') return renderReportsQueue();
  return renderAdminSettingsPanel();
}

function queueStatusChip(status) {
  if (status === 'pending') return '<span class="badge warning">Pending</span>';
  if (status === 'verified' || status === 'approved') return '<span class="badge success">Approved</span>';
  if (status === 'rejected') return '<span class="badge danger">Rejected</span>';
  if (status === 'paused') return '<span class="badge warning">Paused</span>';
  if (status === 'resolved') return '<span class="badge success">Resolved</span>';
  if (status === 'reviewing') return '<span class="badge info">Reviewing</span>';
  return '<span class="badge">Open</span>';
}

function renderStudioQueue() {
  return `<div class="card admin-panel"><div class="card-head mb-16"><div><h3>Studio verification queue</h3><p>Automated checks are shown; admin approval still requires a reason in the audit log.</p></div><span class="chip accent">${icon('shield', 12)} Basic verification</span></div>
    <div class="queue-list">${state.studioQueue.map(item => `<article class="queue-row ${item.status !== 'pending' ? 'resolved' : ''}">
      <div class="queue-main"><span class="studio-logo">${item.initials}</span><div><strong>${esc(item.name)}</strong><span>${esc(item.meta)}</span></div></div>
      <div class="queue-checks">${item.checks.map(c => `<span class="chip success">${icon('check', 11)} ${esc(c)}</span>`).join('')}</div>
      <div>${queueStatusChip(item.status)}</div>
      <div class="queue-actions">${item.status === 'pending' ? `<button class="btn btn-secondary btn-sm" data-action="reject-studio" data-queue-id="${item.id}">Reject</button><button class="btn btn-primary btn-sm" data-action="approve-studio" data-queue-id="${item.id}">Approve</button>` : `<button class="btn btn-ghost btn-sm" data-action="view-audit">Audit</button>`}</div>
    </article>`).join('')}</div></div>`;
}

function renderJobQueue() {
  return `<div class="card admin-panel"><div class="card-head mb-16"><div><h3>Job review queue</h3><p>Content filters and salary spread are checked before a role becomes active.</p></div><span class="chip accent">${icon('briefcaseCheck', 12)} Lifecycle guardrails</span></div>
    <div class="queue-list">${state.jobQueue.map(item => `<article class="queue-row ${item.status !== 'pending' ? 'resolved' : ''}">
      <div class="queue-main"><span class="studio-logo" style="--logo-bg:var(--accent-soft);--logo-ink:var(--accent-strong)">${icon('briefcase', 17)}</span><div><strong>${esc(item.title)}</strong><span>${esc(item.studio)} · ${esc(item.reason)}</span></div></div>
      <div class="queue-checks">${item.checks.map(c => `<span class="chip ${c.includes('found') || c.includes('flagged') ? 'danger' : 'success'}">${icon(c.includes('found') || c.includes('flagged') ? 'alertTriangle' : 'check', 11)} ${esc(c)}</span>`).join('')}</div>
      <div>${queueStatusChip(item.status)}</div>
      <div class="queue-actions">${item.status === 'pending' ? `<button class="btn btn-secondary btn-sm" data-action="pause-job" data-queue-id="${item.id}">Pause</button><button class="btn btn-primary btn-sm" data-action="approve-job" data-queue-id="${item.id}">Approve</button>` : `<button class="btn btn-ghost btn-sm" data-action="view-audit">Audit</button>`}</div>
    </article>`).join('')}</div></div>`;
}

function renderReportsQueue() {
  return `<div class="card admin-panel"><div class="card-head mb-16"><div><h3>Reports queue</h3><p>Scam or fee reports can immediately pause a job for review.</p></div><span class="chip danger">${icon('flag', 12)} Trust & safety</span></div>
    <div class="queue-list">${state.reports.map(item => `<article class="queue-row ${item.status === 'resolved' ? 'resolved' : ''}">
      <div class="queue-main"><span class="studio-logo" style="--logo-bg:var(--danger-soft);--logo-ink:var(--danger)">${icon('flag', 17)}</span><div><strong>${esc(item.title)}</strong><span>${esc(item.type)} · ${esc(item.target)}</span></div></div>
      <div class="queue-checks"><span class="chip ${item.severity === 'High' ? 'danger' : item.severity === 'Medium' ? 'warning' : ''}">${item.severity} severity</span></div>
      <div>${queueStatusChip(item.status)}</div>
      <div class="queue-actions">${item.status !== 'resolved' ? `<button class="btn btn-secondary btn-sm" data-action="dismiss-report" data-queue-id="${item.id}">Dismiss</button><button class="btn btn-primary btn-sm" data-action="resolve-report" data-queue-id="${item.id}">Actioned</button>` : '<span class="text-xs text-muted">Closed</span>'}</div>
    </article>`).join('')}</div></div>`;
}

function renderAdminSettingsPanel() {
  const s = state.adminSettings;
  const settingRow = (key, label, desc, options, suffix = '') => `<div class="setting-row"><div><strong>${label}</strong><span>${desc}</span></div><select class="select" data-admin-setting="${key}">${options.map(opt => `<option value="${opt}" ${String(s[key]) === String(opt) ? 'selected' : ''}>${opt}${suffix}</option>`).join('')}</select></div>`;
  return `<div class="grid grid-2">
    <div class="card admin-panel"><div class="card-head mb-16"><div><h3>Runtime settings</h3><p>Editable by admins without a deployment.</p></div><span class="badge accent">${icon('sliders', 12)} Live</span></div>
      <div class="settings-grid" style="grid-template-columns:1fr">
        ${settingRow('applyPerDay', 'Applications per candidate / day', 'limits.apply_per_day', [5, 10, 15, 20, 25])}
        ${settingRow('activeJobs', 'Free active jobs per studio', 'limits.free_active_jobs', [1, 2, 3, 5, 10])}
        ${settingRow('reminderDays', 'Anti-ghosting reminder', 'antighost.reminder_days', [3, 5, 7, 10], ' days')}
        ${settingRow('autoDeclineDays', 'Auto-decline after', 'antighost.autodecline_days', [7, 10, 14, 21], ' days')}
        ${settingRow('salarySpread', 'Max salary spread', 'job.salary_max_spread', ['1.3', '1.5', '1.8'], '×')}
        ${settingRow('firstJobsReview', 'Manually reviewed first jobs', 'First jobs per studio', [1, 3, 5])}
      </div>
    </div>
    <div class="card admin-panel"><div class="card-head mb-16"><div><h3>Audit log</h3><p>Append-only record of meaningful workspace actions.</p></div><button class="btn btn-secondary btn-sm" data-action="view-audit">${icon('eye', 14)} View all</button></div>
      <div class="data-table-wrap"><table class="audit-table"><thead><tr><th>Time</th><th>Action</th><th>Actor</th><th>Reason</th></tr></thead><tbody>${state.audit.slice(0, 6).map(row => `<tr><td>${esc(row.time)}</td><td><code>${esc(row.action)}</code><br><span class="text-xs text-muted">${esc(row.entity)}</span></td><td>${esc(row.actor)}</td><td>${esc(row.reason)}</td></tr>`).join('')}</tbody></table></div>
      <div class="pii-notice mt-16">${icon('lock', 16)} <span>View-as sessions in the production design are read-only, expire after 15 minutes and require a written reason.</span></div>
    </div>
  </div>`;
}

function updateAdminView() {
  const content = $('#adminContent');
  const summary = $('#adminSummary');
  const tabs = $$('.admin-tab');
  tabs.forEach(tab => {
    const active = tab.dataset.tab === state.adminTab;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  if (content) content.innerHTML = renderAdminContent();
  if (summary) summary.innerHTML = renderAdminSummary();
  renderSidebar();
  saveState();
}

function viewSettings() {
  const themeOptions = [
    { id: 'light', iconName: 'sun', title: 'Light', desc: 'White surfaces, dark text, warm gold accents.' },
    { id: 'dark', iconName: 'moon', title: 'Dark', desc: 'Obsidian surfaces, charcoal panels, neon accents.' },
    { id: 'system', iconName: 'monitor', title: 'System', desc: 'Follows your operating system setting automatically.' }
  ];
  return `
    ${pageHeader('Workspace settings', 'Set up your workspace', 'Choose a theme that works best for your team. Light, dark and system modes are available, and preferences are saved on this device.',
      `<button class="btn btn-secondary" data-action="export-workspace">${icon('download', 16)} Export workspace data</button><button class="btn btn-danger" data-action="reset-workspace">${icon('rotate', 16)} Reset workspace</button>`)}
    <section class="settings-layout">
      <div>
        <article class="card settings-section" data-tour="settings">
          <div class="card-head"><div><h3>Theme</h3><p>Choose how the product looks. “System” updates live when your OS theme changes.</p></div><span class="badge accent">${icon('sun', 12)} Neon Yellow + Obsidian</span></div>
          <div class="theme-options">${themeOptions.map(opt => `<button class="theme-option ${state.themePref === opt.id ? 'selected' : ''}" data-theme-option="${opt.id}" aria-pressed="${state.themePref === opt.id}"><span class="theme-preview"></span><span class="full-width"><span class="theme-option-head"><strong>${opt.title}</strong>${state.themePref === opt.id ? icon('checkCircle', 17) : ''}</span><span>${opt.desc}</span></span></button>`).join('')}</div>
        </article>
        <article class="card settings-section">
          <div class="card-head"><div><h3>Workspace behaviour</h3><p>Small controls that make the workspace easier to use.</p></div></div>
          <div class="setting-block"><div><strong>Display density</strong><p>Compact mode reduces card radii and page spacing for smaller screens.</p></div><select id="densitySelect" class="select"><option value="comfortable" ${state.density === 'comfortable' ? 'selected' : ''}>Comfortable</option><option value="compact" ${state.density === 'compact' ? 'selected' : ''}>Compact</option></select></div>
          <div class="setting-block"><div><strong>Reduce motion</strong><p>Disables non-essential transitions and smooth scrolling.</p></div><label class="toggle"><input id="motionToggle" type="checkbox" ${state.reduceMotion ? 'checked' : ''}><span class="toggle-track"></span><span class="toggle-label">Reduced</span></label></div>
          <div class="setting-block"><div><strong>Workspace data</strong><p>Restores applications, queues, saved jobs and workspace preferences. Your explicit theme choice is preserved.</p></div><button class="btn btn-secondary" data-action="reset-workspace">${icon('rotate', 15)} Reset data</button></div>
        </article>
        <article class="card settings-section">
          <div class="card-head"><div><h3>Accessibility & keyboard</h3><p>Clear focus rings, semantic controls and reduced-motion support are built into the workspace.</p></div></div>
          <div class="grid grid-2">
            <div><div class="shortcut-row"><span>Open command search</span><span class="kbd">⌘ / Ctrl + K</span></div><div class="shortcut-row"><span>Close dialog or menu</span><span class="kbd">Esc</span></div></div>
            <div><div class="shortcut-row"><span>Move through controls</span><span class="kbd">Tab</span></div><div class="shortcut-row"><span>Activate focused control</span><span class="kbd">Enter</span></div></div>
          </div>
        </article>
      </div>
      <aside>
        <article class="card pad"><div class="card-head"><div><h3>Design tokens</h3><p>Professional core, game-dev accent.</p></div></div>
          <div class="design-tokens mt-20">
            <div class="swatch-row"><span class="swatch" style="--swatch:var(--accent)"></span><div><strong>Accent</strong><span id="accentHex">${getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()} · neon / warm yellow</span></div></div>
            <div class="swatch-row"><span class="swatch" style="--swatch:var(--surface)"></span><div><strong>Surface</strong><span>Rounded cards and panels</span></div></div>
            <div class="swatch-row"><span class="swatch" style="--swatch:var(--ink)"></span><div><strong>Ink</strong><span>High-contrast body text</span></div></div>
            <div class="swatch-row"><span class="swatch" style="--swatch:var(--line)"></span><div><strong>Line</strong><span>Subtle separation</span></div></div>
          </div>
        </article>
        <article class="card pad mt-16"><div class="card-head"><div><h3>Typography</h3><p>Bundled for consistent rendering across devices.</p></div></div><div class="mt-16"><h3 style="font-size:1.7rem">Space Grotesk</h3><p class="text-sm text-muted">Headings and numerals</p></div><div class="divider"></div><div><p style="font-family:Inter,sans-serif;font-size:1.25rem;font-weight:700">Inter</p><p class="text-sm text-muted">Body text, labels and controls</p></div></article>
        <article class="card pad mt-16 accent-card"><div class="flex gap-10"><span class="feature-icon" style="display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:rgba(var(--accent-rgb),.3)">${icon('shield', 17)}</span><div><strong>Privacy-first workspace</strong><p class="text-xs text-soft mt-4">Contact details, preferences and application states are protected by clear rules and audit trails.</p></div></div></article>
      </aside>
    </section>`;
}

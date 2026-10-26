/* HireGameDev — overview, job discovery, and talent search views. */

function metricCard(iconName, label, value, trend, trendTone = 'text-success') {
  return `<article class="card metric-card card-hover">
    <div class="flex justify-between items-start">
      <span class="metric-icon">${icon(iconName, 18)}</span>
      <span class="metric-trend ${trendTone}">${icon(trend.startsWith('+') ? 'trendingUp' : 'activity', 13)} ${esc(trend)}</span>
    </div>
    <div class="metric-value">${value}</div>
    <div class="metric-label">${label}</div>
  </article>`;
}

function roleBannerContent() {
  const map = {
    candidate: { icon: 'userCheck', title: 'Candidate workspace — Aarav Mehta', body: 'Your Pune-based Unity profile is 92% complete, with evidence-backed skills and active applications.', cta: 'View recommended jobs' },
    studio: { icon: 'building', title: 'Recruiting workspace — PixelForge Studios', body: 'Your verified studio has three active roles, a ranked applicant pipeline and an 86% response rate.', cta: 'Open applicant pipeline' },
    admin: { icon: 'shield', title: 'Operations workspace', body: 'Verification, job review, reports, settings and audit logs are available in one console.', cta: 'Open admin console' }
  };
  return map[state.role] || map.studio;
}

function viewOverview() {
  const role = roleBannerContent();
  const roleTarget = state.role === 'candidate' ? 'jobs' : state.role === 'admin' ? 'admin' : 'applications';
  return `
  <section class="hero" data-tour="hero">
    <div class="hero-copy">
      <div class="kicker">The hiring layer for India's game studios</div>
      <h1>Game talent, matched on <span class="highlight">real signal.</span></h1>
      <p class="lede">HireGameDev turns portfolios, shipped titles, skills and hiring behaviour into a transparent two-sided marketplace — built to cut noise for candidates and cut screening time for studios.</p>
      <div class="hero-actions">
        <button class="btn btn-primary btn-lg" data-action="start-tour">${icon('play', 16)} Explore the product</button>
        <button class="btn btn-secondary btn-lg" data-page="match">${icon('sparkles', 16)} See the match engine</button>
        <button class="btn btn-ghost btn-lg" data-action="show-walkthrough">${icon('fileText', 16)} Product walkthrough</button>
      </div>
      <div class="hero-proof">
        <span class="proof-item">${icon('checkCircle', 15)} Explainable scoring</span>
        <span class="proof-item">${icon('checkCircle', 15)} Evidence-backed skills</span>
        <span class="proof-item">${icon('checkCircle', 15)} Anti-ghosting built in</span>
        <span class="proof-item">${icon('checkCircle', 15)} DPDP-minded privacy</span>
      </div>
    </div>
    <div class="hero-visual">
      <div class="pulse-card">
        <div class="pulse-top">
          <div class="pulse-title"><span class="pulse-icon">${icon('activity', 18)}</span><span>Marketplace pulse</span></div>
          <span class="badge success"><span class="badge-dot"></span> Healthy</span>
        </div>
        <div class="flex justify-between items-end mt-20">
          <div><div class="pulse-value">312 <small>live roles</small></div><p class="text-sm text-muted mt-4">+18.6% versus prior 30 days</p></div>
          <span class="text-xs text-muted">Last 30 days</span>
        </div>
        <div class="chart-wrap">${chartSvg(CHART_SERIES, 'overviewGradient')}</div>
        <div class="chart-labels"><span>1 Oct</span><span>8 Oct</span><span>15 Oct</span><span>22 Oct</span><span>26 Oct</span></div>
        <div class="pulse-stats">
          <div class="pulse-stat"><span>Applications</span><strong>8,429</strong></div>
          <div class="pulse-stat"><span>Shortlisted</span><strong>1,176</strong></div>
          <div class="pulse-stat"><span>Median reply</span><strong>31h</strong></div>
        </div>
      </div>
    </div>
  </section>

  <section class="grid grid-4" data-tour="metrics">
    ${metricCard('users', 'Active candidates', '1,248', '+12.4%')}
    ${metricCard('building', 'Verified studios', '86', '+9 this month')}
    ${metricCard('briefcase', 'Live game roles', '312', '+18.6%')}
    ${metricCard('gauge', 'Shortlist rate', '37.4%', '+4.1 pts')}
  </section>

  <section class="role-banner">
    <span class="role-icon">${icon(role.icon, 18)}</span>
    <div><strong>${role.title}</strong><p>${role.body}</p></div>
    ${roleTarget ? `<button class="btn btn-secondary btn-sm" data-page="${roleTarget}">${role.cta} ${icon('arrowRight', 14)}</button>` : `<button class="btn btn-secondary btn-sm" data-action="start-tour">${role.cta} ${icon('arrowRight', 14)}</button>`}
  </section>

  <section class="section">
    ${sectionHeading('The product loop', 'One structured loop replaces scattered hiring', 'The platform captures evidence once, applies hard filters first, then makes every ranking decision explainable and auditable.')}
    <div class="grid loop-grid">
      <article class="card loop-card card-hover">
        <span class="loop-number">01</span>
        <h3>Signal in</h3>
        <p>Candidates build structured profiles in five guided steps. Resume AI accelerates the work but never saves without a human review.</p>
        <ul class="loop-list">
          <li>${icon('check', 14)} Skills tied to portfolio or shipped-title evidence</li>
          <li>${icon('check', 14)} Studios verified by GSTIN and work-domain checks</li>
          <li>${icon('check', 14)} Salary, notice, work mode and availability normalized</li>
        </ul>
      </article>
      <article class="card loop-card card-hover">
        <span class="loop-number">02</span>
        <h3>Match and apply</h3>
        <p>Hard filters remove dealbreakers. Skill, experience and logistics scores explain exactly why a role ranks where it does.</p>
        <ul class="loop-list">
          <li>${icon('check', 14)} One-click apply with transparent match breakdown</li>
          <li>${icon('check', 14)} Stuffing a profile with extra skills cannot raise the score</li>
          <li>${icon('check', 14)} Stretch matches are labelled, not silently hidden</li>
        </ul>
      </article>
      <article class="card loop-card card-hover">
        <span class="loop-number">03</span>
        <h3>Response out</h3>
        <p>Real human status changes drive studio response metrics. A daily job prevents applications from disappearing into silence.</p>
        <ul class="loop-list">
          <li>${icon('check', 14)} Reminder at day 7, auto-decline at day 14</li>
          <li>${icon('check', 14)} Contact released only at shortlist</li>
          <li>${icon('check', 14)} Every ranking decision written to an audit log</li>
        </ul>
      </article>
    </div>
  </section>

  <section class="section">
    ${sectionHeading('Interactive product preview', 'The candidate and studio views, side by side', 'Both views share the same profiles, applications and match scores, so every action stays in sync across the workspace.')}
    <div class="card product-preview">
      <div class="preview-toolbar">
        <div class="flex gap-12"><div class="window-dots"><span></span><span></span><span></span></div><strong class="text-sm">Live workspace · 09:42 IST</strong></div>
        <span class="chip accent">${icon('sparkles', 13)} Matching v2</span>
      </div>
      <div class="preview-body">
        <div class="preview-pane">
          <div class="flex justify-between items-center mb-12"><div><h3>Recommended for Aarav</h3><p class="text-xs text-muted">Best match · 3 stretch roles hidden</p></div><button class="btn btn-ghost btn-sm" data-page="jobs">Open ${icon('chevronRight', 13)}</button></div>
          ${[JOBS[0], JOBS[2], JOBS[3]].map(job => `<div class="preview-job"><span class="studio-logo" style="--logo-bg:${job.logoBg};--logo-ink:${job.logoInk}">${job.initials}</span><div><h4>${esc(job.title)}</h4><p>${esc(job.studio)} · ${job.city} · ${formatLPA(job.salaryMin)}–${formatLPA(job.salaryMax)} LPA</p></div><div class="preview-score"><strong>${job.score}%</strong><span>${job.label}</span></div></div>`).join('')}
        </div>
        <div class="preview-pane">
          <div class="flex justify-between items-center mb-12"><div><h3>PixelForge pipeline</h3><p class="text-xs text-muted">Senior Unity Gameplay Developer</p></div><span class="badge success">86% reply rate</span></div>
          <div class="pipeline-mini">
            ${[['Applied', 18, 100], ['Viewed', 14, 78], ['Shortlisted', 7, 39], ['Interview', 4, 22], ['Offer', 2, 11]].map(row => `<div class="pipeline-mini-row"><span>${row[0]}</span><span class="progress"><span style="width:${row[2]}%"></span></span><strong>${row[1]}</strong></div>`).join('')}
          </div>
          <div class="why-note mt-16">${icon('sparkles', 15)} <span>Applicants are ordered by fit for studio. Candidate contact details stay locked until shortlist.</span></div>
          <button class="btn btn-secondary btn-sm mt-16" data-page="applications">Manage pipeline ${icon('arrowRight', 14)}</button>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    ${sectionHeading('Differentiators', 'Built to earn trust from both sides', 'Four design choices from the product blueprint shape the marketplace, not just the interface.')}
    <div class="grid feature-grid">
      <article class="card feature-card card-hover" role="button" tabindex="0" data-page="match" style="cursor:pointer"><span class="feature-icon">${icon('target', 19)}</span><h3>Hard filters first</h3><p>Engine, salary, notice and work-mode dealbreakers remove roles before scoring — no misleading percentage.</p><div class="feature-foot"><span>5 filter gates</span>${icon('arrowUpRight', 15)}</div></article>
      <article class="card feature-card card-hover" role="button" tabindex="0" data-page="candidates" style="cursor:pointer"><span class="feature-icon">${icon('badgeCheck', 19)}</span><h3>Evidence over claims</h3><p>Skills backed by shipped titles, portfolios or verified credits earn more weight than bare keywords.</p><div class="feature-foot"><span>3 evidence levels</span>${icon('arrowUpRight', 15)}</div></article>
      <article class="card feature-card card-hover" role="button" tabindex="0" data-page="trust" style="cursor:pointer"><span class="feature-icon">${icon('clock', 19)}</span><h3>Accountability</h3><p>Only real status changes count as responses. Visible metrics encourage studios to close the loop.</p><div class="feature-foot"><span>Day 7 / day 14 rules</span>${icon('arrowUpRight', 15)}</div></article>
      <article class="card feature-card card-hover" role="button" tabindex="0" data-page="admin" style="cursor:pointer"><span class="feature-icon">${icon('shield', 19)}</span><h3>Privacy by design</h3><p>Contact gating, consent, audit logs and admin review are first-class flows, not launch-week patches.</p><div class="feature-foot"><span>DPDP-minded</span>${icon('arrowUpRight', 15)}</div></article>
    </div>
  </section>

  <section class="section">
    ${sectionHeading('Product walkthrough', 'Explore the complete hiring workflow', 'Take the product tour for a narrated path, or jump directly to any screen in the workspace.')}
    <div class="grid tour-grid">
      <button class="card tour-card card-hover" data-page="jobs" data-tour="tour-jobs"><span class="tour-icon">${icon('briefcase', 18)}</span><h3>Candidate discovery</h3><p>Search, filters, match explanations and one-click apply.</p><span class="tour-arrow">${icon('arrowRight', 17)}</span></button>
      <button class="card tour-card card-hover" data-page="candidates"><span class="tour-icon">${icon('users', 18)}</span><h3>Studio talent search</h3><p>Evidence-backed profiles with privacy gating.</p><span class="tour-arrow">${icon('arrowRight', 17)}</span></button>
      <button class="card tour-card card-hover" data-page="match"><span class="tour-icon">${icon('sparkles', 18)}</span><h3>Explainable matching</h3><p>Change inputs and watch the score recalculate live.</p><span class="tour-arrow">${icon('arrowRight', 17)}</span></button>
      <button class="card tour-card card-hover" data-page="applications"><span class="tour-icon">${icon('route', 18)}</span><h3>Two-sided pipeline</h3><p>Candidate timeline and studio applicant board.</p><span class="tour-arrow">${icon('arrowRight', 17)}</span></button>
    </div>
  </section>

  <section class="section">
    ${sectionHeading('Why now', 'A focused wedge into a messy hiring workflow')}
    <div class="grid market-split">
      <article class="card pad">
        <h3>Generic tools miss game-specific signal</h3>
        <p class="text-sm text-muted mt-8">Resumes, job boards and spreadsheets do not understand engines, shipped credits, portfolio evidence or studio response behaviour.</p>
        <div class="problem-list">
          <div class="problem-item"><span class="problem-icon">${icon('x', 15)}</span><div><strong>Keyword-stuffed profiles</strong><span>No link between claimed skills and real work.</span></div></div>
          <div class="problem-item"><span class="problem-icon">${icon('x', 15)}</span><div><strong>Manual screening loops</strong><span>Recruiters repeat the same qualification checks.</span></div></div>
          <div class="problem-item"><span class="problem-icon">${icon('x', 15)}</span><div><strong>Candidate ghosting</strong><span>No status visibility and little accountability.</span></div></div>
        </div>
      </article>
      <article class="card pad">
        <div class="flex justify-between items-start"><div><h3>Phased path to defensible data</h3><p class="text-sm text-muted mt-8">Launch with a transparent, rule-based engine. Earn the interaction data needed for later ML ranking.</p></div><span class="badge accent">Blueprint v2.0</span></div>
        <div class="roadmap mt-24">
          <div class="roadmap-step"><div class="phase">Phase 1–3</div><strong>Structured profiles + matching</strong><p>Capture clean, explainable skill and preference data.</p></div>
          <div class="roadmap-step"><div class="phase">Phase 4</div><strong>Trust, admin and launch</strong><p>Notifications, privacy, dashboards and operations.</p></div>
          <div class="roadmap-step"><div class="phase">Phase 5–7</div><strong>Two-way trust loop</strong><p>Verified credits, invites, chat, scheduling and badges.</p></div>
          <div class="roadmap-step"><div class="phase">Phase 8+</div><strong>Learning marketplace</strong><p>ML re-ranking, API, international and ecosystem partnerships.</p></div>
        </div>
      </article>
    </div>
  </section>`;
}

function viewJobs() {
  const filtered = getFilteredJobs();
  return `
    ${pageHeader('Candidate workspace · Aarav Mehta', 'Discover roles worth your time', 'A full-text job search with hard filters, transparent match explanations and evidence-aware recommendations.',
      `<button class="btn btn-secondary" data-action="open-resume">${icon('fileText', 16)} Resume AI</button><button class="btn btn-primary" data-page="applications">${icon('route', 16)} My applications</button>`)}
    <section class="card toolbar-card" data-tour="jobs-toolbar">
      <div class="toolbar-row">
        <div class="input-icon-wrap">${icon('search', 16)}<input id="jobSearch" class="input" type="search" value="${esc(state.jobsQuery.q)}" placeholder="Search title, studio or skill (try “unity”)"></div>
        <select id="jobCategory" class="select" aria-label="Filter by category">
          ${['all', 'Programming', 'Art', 'Design', 'Audio', 'QA', 'Production'].map(c => `<option value="${c}" ${state.jobsQuery.category === c ? 'selected' : ''}>${c === 'all' ? 'All categories' : c}</option>`).join('')}
        </select>
        <select id="jobMode" class="select" aria-label="Filter by work mode">
          ${['all', 'Remote', 'Hybrid', 'Onsite'].map(c => `<option value="${c}" ${state.jobsQuery.mode === c ? 'selected' : ''}>${c === 'all' ? 'Any work mode' : c}</option>`).join('')}
        </select>
        <select id="jobCity" class="select" aria-label="Filter by city">
          ${['all', 'Pune', 'Remote', 'Hyderabad', 'Mumbai', 'Chennai', 'Noida', 'Ahmedabad', 'Kochi'].map(c => `<option value="${c}" ${state.jobsQuery.city === c ? 'selected' : ''}>${c === 'all' ? 'All locations' : c}</option>`).join('')}
        </select>
      </div>
      <div class="toolbar-row">
        <div class="active-filter-line">
          <span id="jobsResultCount" class="result-count"><strong>${filtered.length}</strong> roles found</span>
          <button class="chip chip-button ${state.jobsQuery.savedOnly ? 'active' : ''}" data-action="toggle-saved-only">${icon('bookmark', 13)} Saved only (${state.savedJobs.length})</button>
          <button class="chip chip-button ${state.jobsQuery.minSalary >= 10 ? 'active' : ''}" data-action="toggle-min-salary">${icon('wallet', 13)} ₹10 LPA+</button>
          <button class="chip chip-button ${state.jobsQuery.fresher ? 'active' : ''}" data-action="toggle-fresher">${icon('star', 13)} Fresher friendly</button>
          ${state.jobsQuery.q || state.jobsQuery.category !== 'all' || state.jobsQuery.mode !== 'all' || state.jobsQuery.city !== 'all' || state.jobsQuery.savedOnly || state.jobsQuery.minSalary ? `<button class="chip" data-action="clear-job-filters">Clear filters ${icon('x', 12)}</button>` : ''}
        </div>
        <div class="flex gap-12 flex-wrap">
          <label class="toggle"><input id="stretchToggle" type="checkbox" ${state.jobsQuery.stretch ? 'checked' : ''}><span class="toggle-track"></span><span class="toggle-label">Show stretch matches</span></label>
          <select id="jobSort" class="select" style="width:auto" aria-label="Sort jobs">
            <option value="match" ${state.jobsQuery.sort === 'match' ? 'selected' : ''}>Best match</option>
            <option value="newest" ${state.jobsQuery.sort === 'newest' ? 'selected' : ''}>Newest</option>
            <option value="salary" ${state.jobsQuery.sort === 'salary' ? 'selected' : ''}>Salary: high to low</option>
            <option value="expiry" ${state.jobsQuery.sort === 'expiry' ? 'selected' : ''}>Closing soon</option>
          </select>
        </div>
      </div>
    </section>
    <section id="jobsContent">${renderJobsContent()}</section>`;
}

function getFilteredJobs() {
  const q = state.jobsQuery.q.trim().toLowerCase();
  let jobs = JOBS.filter(job => {
    if (job.stretch && !state.jobsQuery.stretch) return false;
    if (state.jobsQuery.savedOnly && !state.savedJobs.includes(job.id)) return false;
    if (state.jobsQuery.fresher && !job.fresherFriendly) return false;
    if (state.jobsQuery.category !== 'all' && job.category !== state.jobsQuery.category) return false;
    if (state.jobsQuery.mode !== 'all' && job.mode !== state.jobsQuery.mode) return false;
    if (state.jobsQuery.city !== 'all' && job.city !== state.jobsQuery.city) return false;
    if (job.salaryMax < state.jobsQuery.minSalary) return false;
    if (q) {
      const haystack = `${job.title} ${job.studio} ${job.city} ${job.category} ${job.skills.map(s => s.name).join(' ')}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
  const sorters = {
    match: (a, b) => b.score - a.score,
    newest: (a, b) => a.postedDays - b.postedDays,
    salary: (a, b) => b.salaryMax - a.salaryMax,
    expiry: (a, b) => (30 - b.postedDays) - (30 - a.postedDays)
  };
  return jobs.sort(sorters[state.jobsQuery.sort] || sorters.match);
}

function responseBadge(rate) {
  const tone = rate >= 80 ? 'success' : rate >= 70 ? 'accent' : 'warning';
  return `<span class="badge ${tone}">${icon('zap', 12)} ${rate}% response</span>`;
}

function jobCard(job, selected) {
  const saved = state.savedJobs.includes(job.id);
  const applied = state.appliedJobs.includes(job.id);
  return `<article class="card job-card ${selected ? 'selected' : ''}" data-action="select-job" data-job-id="${job.id}" role="button" tabindex="0" aria-pressed="${selected}" aria-label="View ${esc(job.title)}">
    <div class="job-card-head">
      <span class="studio-logo" style="--logo-bg:${job.logoBg};--logo-ink:${job.logoInk}">${job.initials}</span>
      <div>
        <h3>${esc(job.title)} ${job.verified ? `<span title="Verified studio" style="color:var(--success);display:inline-flex;vertical-align:-2px">${icon('badgeCheck', 14)}</span>` : ''}</h3>
        <div class="job-meta"><span>${esc(job.studio)}</span><span class="dot"></span><span>${icon('mapPin', 12)} ${job.city}</span><span class="dot"></span><span>${job.mode}</span><span class="dot"></span><span>${relativeDay(job.postedDays)}</span></div>
      </div>
      <div class="job-score" style="--score:${job.score}%"><span>${job.score}</span></div>
    </div>
    <div class="job-tags">
      <span class="chip accent">${icon('sparkles', 12)} ${job.label}</span>
      <span class="chip">${job.category}</span>
      <span class="chip">${job.seniority}</span>
      ${job.fresherFriendly ? '<span class="chip success">Fresher friendly</span>' : ''}
      ${job.flags.length ? `<span class="chip warning">${icon('alertTriangle', 12)} Stretch · ${job.flags[0].replace('_', ' ')}</span>` : ''}
    </div>
    <div class="job-card-foot">
      <div><div class="salary">₹${formatLPA(job.salaryMin)}–${formatLPA(job.salaryMax)} LPA</div><span class="text-xs text-muted">${job.openings} opening${job.openings > 1 ? 's' : ''} · ${job.applicants} applicants</span></div>
      <div class="flex gap-8">
        <button class="save-btn ${saved ? 'saved' : ''}" data-action="toggle-save" data-job-id="${job.id}" aria-label="${saved ? 'Unsave' : 'Save'} ${esc(job.title)}">${icon('bookmark', 15)}</button>
        <button class="btn ${applied ? 'btn-secondary' : 'btn-primary'} btn-sm" data-action="open-apply" data-job-id="${job.id}">${applied ? 'Applied' : 'Apply'}</button>
      </div>
    </div>
  </article>`;
}

function skillStatusIcon(status) {
  if (status === 'matched') return `<span class="text-success" title="Matched">${icon('checkCircle', 16)}</span>`;
  if (status === 'partial') return `<span class="text-warning" title="Partial credit">${icon('route', 16)}</span>`;
  if (status === 'claimed') return `<span class="text-muted" title="Claimed only">${icon('help', 16)}</span>`;
  return `<span class="text-danger" title="Missing">${icon('x', 16)}</span>`;
}

function jobDetail(job) {
  const saved = state.savedJobs.includes(job.id);
  const applied = state.appliedJobs.includes(job.id);
  const checks = [
    { label: 'Work mode', fails: job.flags.includes('work_mode') },
    { label: 'Engine gate', fails: job.flags.includes('engine_mismatch') },
    { label: 'Salary ceiling', fails: job.flags.includes('salary_ceiling') },
    { label: 'Notice period', fails: job.flags.includes('notice_period') }
  ];
  return `<aside class="card job-detail" data-job-detail>
    <div class="detail-hero">
      <span class="studio-logo" style="--logo-bg:${job.logoBg};--logo-ink:${job.logoInk}">${job.initials}</span>
      <div><h2>${esc(job.title)}</h2><p class="text-sm text-muted mt-4">${esc(job.studio)} ${job.verified ? `<span class="text-success" title="Verified studio" style="display:inline-flex;vertical-align:-2px">${icon('badgeCheck', 14)}</span>` : ''}</p></div>
    </div>
    <div class="flex gap-8 flex-wrap mt-16">
      ${responseBadge(job.responseRate)}
      <span class="chip">${icon('mapPin', 12)} ${job.city}</span>
      <span class="chip">${job.mode}</span>
      <span class="chip">${job.type}</span>
    </div>
    <div class="detail-salary flex justify-between items-center">
      <div><strong>₹${formatLPA(job.salaryMin)}–${formatLPA(job.salaryMax)} LPA</strong><span>Transparent salary · normalized for matching</span></div>
      <span class="badge ${scoreTone(job.score)}">${job.score}% ${job.label}</span>
    </div>
    <div class="detail-section">
      <h4>${icon('sparkles', 16)} Why this match</h4>
      <div class="match-breakdown">
        ${[['Skills', job.breakdown.skills], ['Experience', job.breakdown.experience], ['Logistics', job.breakdown.logistics]].map(row => `<div class="meter-row"><span>${row[0]}</span><span class="progress"><span style="width:${row[1]}%"></span></span><span>${row[1]}</span></div>`).join('')}
      </div>
      <div class="why-note">${icon('sparkles', 15)} <span>${job.flags.length ? `This is a stretch match: ${esc(job.flags.join(', ').replace(/_/g, ' '))}. You can still apply manually; the studio will see the flag.` : 'All hard filters passed. The score is weighted 55% skills, 20% experience and 25% logistics.'}</span></div>
    </div>
    <div class="detail-section">
      <h4>${icon('listChecks', 16)} Skill evidence</h4>
      ${job.skills.map(skill => `<div class="skill-row"><span class="skill-name">${skillStatusIcon(skill.status)} <strong>${esc(skill.name)}</strong>${skill.required ? '<span class="badge accent">Required</span>' : ''}</span><span class="skill-evidence">${esc(skill.note)}</span></div>`).join('')}
    </div>
    <div class="detail-section">
      <h4>${icon('shield', 16)} Hard filters</h4>
      <div class="filter-checks">${checks.map(check => `<span class="filter-check ${check.fails ? 'fail' : ''}">${icon(check.fails ? 'alertTriangle' : 'checkCircle', 14)} ${check.label} ${check.fails ? 'flagged' : 'pass'}</span>`).join('')}</div>
    </div>
    <div class="detail-section">
      <h4>${icon('briefcase', 16)} About the role</h4>
      <p class="text-sm text-soft">${esc(job.description)}</p>
      <div class="flex gap-8 flex-wrap mt-12"><span class="chip">${job.minYears}–${job.maxYears} years</span><span class="chip">${job.seniority}</span><span class="chip">${job.openings} openings</span><span class="chip">Posted ${relativeDay(job.postedDays)}</span></div>
    </div>
    <div class="detail-actions">
      <button class="btn ${applied ? 'btn-secondary' : 'btn-primary'}" data-action="open-apply" data-job-id="${job.id}" ${applied ? 'disabled' : ''}>${applied ? 'Already applied' : `Apply with ${state.resumeImported ? '96' : '92'}% profile`}</button>
      <button class="btn btn-secondary btn-icon-only" data-action="toggle-save" data-job-id="${job.id}" aria-label="${saved ? 'Unsave' : 'Save'} job">${icon('bookmark', 17)}</button>
    </div>
  </aside>`;
}

function renderJobsContent() {
  const jobs = getFilteredJobs();
  if (!jobs.length) {
    return `<div class="card empty-state"><span class="empty-icon">${icon('search', 24)}</span><h3>No roles match these filters</h3><p>Try clearing the filters, or switch on stretch matches to see roles that fail an engine or salary gate.</p><button class="btn btn-primary" data-action="clear-job-filters">Clear all filters</button></div>`;
  }
  if (!jobs.some(job => job.id === state.jobsQuery.selectedJob)) state.jobsQuery.selectedJob = jobs[0].id;
  const selected = jobs.find(job => job.id === state.jobsQuery.selectedJob) || jobs[0];
  return `<div class="jobs-layout">
    <div class="job-list">${jobs.map(job => jobCard(job, job.id === selected.id)).join('')}</div>
    ${jobDetail(selected)}
  </div>`;
}

function updateJobsView() {
  const content = $('#jobsContent');
  if (content) content.innerHTML = renderJobsContent();
  const count = $('#jobsResultCount');
  if (count) count.innerHTML = `<strong>${getFilteredJobs().length}</strong> roles found`;
  const toolbar = $('[data-tour="jobs-toolbar"]');
  if (toolbar) {
    const old = $('[data-action="clear-job-filters"]', toolbar);
    const needsClear = Boolean(state.jobsQuery.q || state.jobsQuery.category !== 'all' || state.jobsQuery.mode !== 'all' || state.jobsQuery.city !== 'all' || state.jobsQuery.savedOnly || state.jobsQuery.minSalary || state.jobsQuery.fresher);
    if (needsClear && !old) {
      const line = $('.active-filter-line', toolbar);
      if (line) line.insertAdjacentHTML('beforeend', `<button class="chip" data-action="clear-job-filters">Clear filters ${icon('x', 12)}</button>`);
    }
    if (!needsClear && old) old.remove();
  }
  saveState();
}

function viewCandidates() {
  return `
    ${pageHeader('Talent workspace · PixelForge Studios', 'Find talent with proof behind the profile', 'Search evidence-backed candidates while contact details stay gated. Structured profiles make privacy and verification rules visible to the team.',
      `<button class="btn btn-secondary" data-page="jobs">${icon('briefcase', 16)} Job search</button><button class="btn btn-primary" data-page="applications">${icon('route', 16)} Applicant pipeline</button>`)}
    <section class="card toolbar-card" data-tour="candidate-toolbar">
      <div class="toolbar-row">
        <div class="input-icon-wrap">${icon('search', 16)}<input id="candidateSearch" class="input" type="search" value="${esc(state.candidatesQuery.q)}" placeholder="Search headline, skill or shipped title"></div>
        <select id="candidateEngine" class="select" aria-label="Filter by engine"><option value="all">Any engine</option>${['Unity', 'Unreal Engine 5', 'Blender', 'Go', 'FMOD'].map(e => `<option value="${e}" ${state.candidatesQuery.engine === e ? 'selected' : ''}>${e}</option>`).join('')}</select>
        <select id="candidateAvailability" class="select" aria-label="Filter by availability"><option value="all">Any availability</option><option value="Actively looking" ${state.candidatesQuery.availability === 'Actively looking' ? 'selected' : ''}>Actively looking</option><option value="Open to offers" ${state.candidatesQuery.availability === 'Open to offers' ? 'selected' : ''}>Open to offers</option></select>
        <select id="candidateCity" class="select" aria-label="Filter by city"><option value="all">All locations</option>${['Pune', 'Remote', 'Hyderabad', 'Bengaluru', 'Mumbai', 'Chennai', 'Noida', 'Kochi', 'Ahmedabad'].map(c => `<option value="${c}" ${state.candidatesQuery.city === c ? 'selected' : ''}>${c}</option>`).join('')}</select>
        <select id="candidateScore" class="select" aria-label="Minimum match score"><option value="0">Any score</option><option value="80" ${state.candidatesQuery.minScore === 80 ? 'selected' : ''}>80%+ strong</option><option value="85" ${state.candidatesQuery.minScore === 85 ? 'selected' : ''}>85%+ top fit</option></select>
      </div>
      <div class="toolbar-row"><div class="active-filter-line"><span id="candidatesResultCount" class="result-count"><strong>${getFilteredCandidates().length}</strong> discoverable candidates</span><span class="chip"><span class="badge-dot" style="background:var(--success)"></span> 70%+ profile completeness</span><span class="chip">${icon('lock', 12)} Contact hidden until shortlist</span></div><span class="text-xs text-muted">Profile views today: <strong>37 / 100</strong></span></div>
    </section>
    <section class="candidate-layout"><div id="candidatesContent">${renderCandidatesContent()}</div>${candidatePrivacyPanel()}</section>`;
}

function getFilteredCandidates() {
  const q = state.candidatesQuery.q.trim().toLowerCase();
  return CANDIDATES.filter(c => {
    if (c.completeness < 70) return false;
    if (state.candidatesQuery.engine !== 'all' && !c.skills.some(s => s.name === state.candidatesQuery.engine)) return false;
    if (state.candidatesQuery.availability !== 'all' && c.availability !== state.candidatesQuery.availability) return false;
    if (state.candidatesQuery.city !== 'all' && c.city !== state.candidatesQuery.city) return false;
    if (c.score < state.candidatesQuery.minScore) return false;
    if (q) {
      const haystack = `${c.name} ${c.headline} ${c.city} ${c.shipped} ${c.skills.map(s => s.name).join(' ')}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  }).sort((a, b) => b.score - a.score);
}

function candidateCard(c) {
  const shortlisted = state.shortlistedCandidates.includes(c.id);
  return `<article class="card candidate-card card-hover">
    <div class="candidate-top">
      <span class="candidate-avatar" style="--avatar-bg:${c.avatarBg}">${c.initials}</span>
      <div><div class="candidate-name">${esc(c.name)} ${c.verified ? `<span title="Verified profile">${icon('badgeCheck', 14)}</span>` : ''}</div><div class="candidate-headline">${esc(c.headline)}</div></div>
      <span class="badge ${scoreTone(c.score)}" style="margin-left:auto">${c.score}%</span>
    </div>
    <div class="candidate-facts">
      <span>${icon('mapPin', 13)} ${c.city}</span><span>${icon('briefcase', 13)} ${c.years} yrs</span><span>${icon('wallet', 13)} ₹${c.expected} LPA expected</span><span>${icon('clock', 13)} ${c.notice}d notice</span>
    </div>
    <div class="candidate-skills">${c.skills.slice(0, 3).map(s => `<span class="evidence-chip">${s.evidence === 'Claimed' ? icon('help', 11) : icon('checkCircle', 11)} ${esc(s.name)} · ${esc(s.evidence)}</span>`).join('')}</div>
    <div class="shipped-box"><span class="shipped-icon">${icon('gamepad', 15)}</span><div><strong>${esc(c.shipped)}</strong><span>${esc(c.shippedMeta)}</span></div></div>
    <div class="candidate-foot">
      <div class="score-block"><span class="chip accent">${icon('sparkles', 12)} ${scoreLabel(c.score)}</span><span>${c.availability}</span></div>
      <div class="flex gap-8"><button class="btn btn-secondary btn-sm" data-action="view-candidate" data-candidate-id="${c.id}">View profile</button><button class="btn ${shortlisted ? 'btn-secondary' : 'btn-primary'} btn-sm" data-action="shortlist-candidate" data-candidate-id="${c.id}">${shortlisted ? 'Shortlisted' : 'Shortlist'}</button></div>
    </div>
  </article>`;
}

function renderCandidatesContent() {
  const candidates = getFilteredCandidates();
  if (!candidates.length) return `<div class="card empty-state"><span class="empty-icon">${icon('users', 24)}</span><h3>No candidates in this slice</h3><p>Try a broader engine, city or score filter.</p><button class="btn btn-primary" data-action="clear-candidate-filters">Clear candidate filters</button></div>`;
  return `<div class="candidate-grid">${candidates.map(candidateCard).join('')}</div>`;
}

function candidatePrivacyPanel() {
  const shortlisted = state.shortlistedCandidates.length;
  return `<aside class="card pad privacy-panel">
    <div class="card-head"><div><h3>Privacy by design</h3><p>Marketplace rules visible to both sides.</p></div><span class="badge accent">${icon('shield', 12)} DPDP</span></div>
    <div class="privacy-list">
      <div class="privacy-item"><span class="privacy-icon">${icon('lock', 16)}</span><div><strong>Contact release gate</strong><span>Phone and email unlock only at shortlist or mutual interest.</span></div></div>
      <div class="privacy-item"><span class="privacy-icon">${icon('eye', 16)}</span><div><strong>Current CTC hidden</strong><span>Studios see expected CTC unless a candidate opts in.</span></div></div>
      <div class="privacy-item"><span class="privacy-icon">${icon('database', 16)}</span><div><strong>Every view logged</strong><span>Profile opens are counted and auditable for abuse control.</span></div></div>
      <div class="privacy-item"><span class="privacy-icon">${icon('activity', 16)}</span><div><strong>Discoverability floor</strong><span>Only 70%+ complete profiles appear in studio search.</span></div></div>
    </div>
    <div class="quota-card">
      <div class="quota-label"><span>Daily profile views</span><span>37 / 100</span></div>
      <div class="progress mt-8"><span style="width:37%"></span></div>
      <div class="quota-label mt-12"><span>Contacts unlocked</span><span>${shortlisted}</span></div>
    </div>
    <button class="btn btn-secondary btn-block mt-16" data-page="trust">Explore trust rules ${icon('arrowRight', 14)}</button>
  </aside>`;
}

function updateCandidatesView() {
  const content = $('#candidatesContent');
  if (content) content.innerHTML = renderCandidatesContent();
  const count = $('#candidatesResultCount');
  if (count) count.innerHTML = `<strong>${getFilteredCandidates().length}</strong> discoverable candidates`;
  const panel = $('.privacy-panel');
  if (panel) panel.outerHTML = candidatePrivacyPanel();
  saveState();
}

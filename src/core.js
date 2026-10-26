/* HireGameDev — state, shell rendering, and shared UI utilities. */

const STORAGE_KEY = 'hgd.workspaceState.v1';

const DEFAULT_STATE = {
  themePref: 'system',
  role: 'studio',
  page: 'overview',
  density: 'comfortable',
  reduceMotion: false,
  savedJobs: ['job-3'],
  appliedJobs: [],
  shortlistedCandidates: [],
  resumeImported: false,
  jobsQuery: { q: '', category: 'all', mode: 'all', city: 'all', minSalary: 0, sort: 'match', savedOnly: false, stretch: false, selectedJob: 'job-1' },
  candidatesQuery: { q: '', engine: 'all', availability: 'all', city: 'all', minScore: 0 },
  applicationsView: 'studio',
  adminTab: 'studios',
  adminSettings: { applyPerDay: 15, activeJobs: 3, reminderDays: 7, autoDeclineDays: 14, salarySpread: '1.5', firstJobsReview: '3' },
  lab: { preset: 'unity', unity: 3, csharp: 4, shader: 0, evidenceCSharp: 'claimed', years: 4, expected: 12, notice: 30, stuffing: false },
  applications: INITIAL_APPLICATIONS.map(a => ({ ...a })),
  notifications: INITIAL_NOTIFICATIONS.map(n => ({ ...n })),
  studioQueue: INITIAL_STUDIO_QUEUE.map(q => ({ ...q, checks: [...q.checks] })),
  jobQueue: INITIAL_JOB_QUEUE.map(q => ({ ...q, checks: [...q.checks] })),
  reports: INITIAL_REPORTS.map(r => ({ ...r })),
  audit: INITIAL_AUDIT.map(a => ({ ...a })),
  ui: { commandOpen: false, notifOpen: false, accountOpen: false, commandQuery: '', sidebarOpen: false, resumeOpen: false, resumeStep: 'upload', resumeFileName: '', tourIndex: -1 }
};

const state = loadState();
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  const base = deepClone(DEFAULT_STATE);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw);
    const merged = { ...base, ...saved };
    merged.jobsQuery = { ...base.jobsQuery, ...(saved.jobsQuery || {}) };
    merged.candidatesQuery = { ...base.candidatesQuery, ...(saved.candidatesQuery || {}) };
    merged.adminSettings = { ...base.adminSettings, ...(saved.adminSettings || {}) };
    merged.lab = { ...base.lab, ...(saved.lab || {}) };
    merged.ui = { ...base.ui, ...(saved.ui || {}), commandOpen: false, notifOpen: false, accountOpen: false, commandQuery: '', sidebarOpen: false, resumeOpen: false, tourIndex: -1 };
    for (const key of ['applications', 'notifications', 'studioQueue', 'jobQueue', 'reports', 'audit', 'savedJobs', 'appliedJobs', 'shortlistedCandidates']) {
      if (Array.isArray(saved[key])) merged[key] = saved[key];
    }
    return merged;
  } catch (e) {
    return base;
  }
}

function saveState() {
  try {
    const persistable = deepClone(state);
    persistable.ui = deepClone(DEFAULT_STATE.ui);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
  } catch (e) {}
}

function icon(name, size = 18, extra = '') {
  const path = ICONS[name] || ICONS.grid;
  return `<svg class="${extra}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }
function round1(n) { return Math.round(n * 10) / 10; }
function initials(name) { return name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase(); }
function formatLPA(value) { return Number(value).toFixed(Number.isInteger(Number(value)) ? 0 : 1); }
function relativeDay(days) { return days === 0 ? 'Today' : days === 1 ? '1 day ago' : `${days} days ago`; }
function scoreLabel(score) { return score >= 80 ? 'Strong match' : score >= 60 ? 'Good match' : score >= 40 ? 'Partial match' : 'Low match'; }
function scoreTone(score) { return score >= 80 ? 'success' : score >= 60 ? 'accent' : score >= 40 ? 'warning' : 'danger'; }
function getJob(id) { return JOBS.find(job => job.id === id); }
function getCandidate(id) { return CANDIDATES.find(candidate => candidate.id === id); }
function stageIndex(stage) { return APPLICATION_STAGES.findIndex(s => s.id === stage); }
function stageLabel(stage) {
  const found = APPLICATION_STAGES.find(s => s.id === stage);
  if (found) return found.label;
  if (stage === 'auto_declined') return 'Auto-declined';
  if (stage === 'rejected') return 'Rejected';
  return stage;
}

function brandMarkup() {
  return `<button class="brand" data-page="overview" aria-label="HireGameDev overview">
    <span class="brand-mark">${icon('gamepad', 22)}</span>
    <span><span class="brand-name">HireGameDev</span><span class="brand-sub">Talent infrastructure</span></span>
  </button>`;
}

function renderSidebar() {
  const pendingAdmin = state.studioQueue.filter(x => x.status === 'pending').length + state.jobQueue.filter(x => x.status === 'pending').length + state.reports.filter(x => x.status !== 'resolved').length;
  $('#sidebar').innerHTML = `
    ${brandMarkup()}
    <nav class="nav-scroll">
      ${NAV_ITEMS.map(group => `
        <div class="nav-label">${group.group}</div>
        ${group.items.map(item => `
          <button class="nav-item ${state.page === item.id ? 'active' : ''}" data-page="${item.id}" ${state.page === item.id ? 'aria-current="page"' : ''}>
            ${icon(item.icon, 18)}<span>${item.label}</span>
            ${item.id === 'applications' ? `<span class="nav-count">${state.applications.filter(a => !['auto_declined', 'rejected'].includes(a.stage)).length}</span>` : ''}
            ${item.id === 'admin' ? `<span class="nav-count">${pendingAdmin}</span>` : ''}
          </button>`).join('')}
      `).join('')}
    </nav>
    <div class="sidebar-card">
      <div class="status-live"><span class="live-dot"></span> All systems live</div>
      <strong>HireGameDev v2.0</strong>
      <p>Structured profiles, explainable matching and accountable hiring in one workspace.</p>
    </div>`;
}

function commandResults(query = '') {
  const q = query.trim().toLowerCase();
  const pages = NAV_ITEMS.flatMap(g => g.items).map(item => ({ label: item.label, sub: `Go to ${item.label.toLowerCase()}`, icon: item.icon, page: item.id }));
  const jobs = JOBS.slice(0, 8).map(job => ({ label: job.title, sub: `${job.studio} · ${job.city}`, icon: 'briefcase', page: 'jobs', jobId: job.id }));
  const actions = [
    { label: 'Start product tour', sub: 'Six-step product walkthrough', icon: 'play', action: 'start-tour' },
    { label: 'Import a resume', sub: 'Open the AI extraction review flow', icon: 'fileText', action: 'open-resume' },
    { label: 'Run anti-ghosting job', sub: 'Apply the 09:00 IST daily rules', icon: 'clock', action: 'open-ghost-sim' },
    { label: 'Reset workspace data', sub: 'Restore jobs, applications and queues', icon: 'rotate', action: 'reset-workspace' }
  ];
  return [...pages, ...jobs, ...actions].filter(item => !q || `${item.label} ${item.sub}`.toLowerCase().includes(q)).slice(0, 8);
}

function commandListMarkup() {
  const results = commandResults(state.ui.commandQuery);
  return `<div class="popover-title">${state.ui.commandQuery ? 'Results' : 'Suggested'}</div>
    <div id="commandList">
      ${results.length ? results.map((item, index) => `
        <button class="command-item" data-command-index="${index}">
          <span class="command-icon">${icon(item.icon, 16)}</span>
          <span class="command-text"><strong>${esc(item.label)}</strong><span>${esc(item.sub)}</span></span>
          ${index === 0 ? '<span class="kbd">↵</span>' : ''}
        </button>`).join('') : '<div class="popover-footer">No matching workspace actions.</div>'}
    </div>
    <div class="popover-footer"><span>HireGameDev workspace</span><span class="kbd">Esc</span></div>`;
}

function notifPopoverMarkup() {
  const unread = state.notifications.filter(n => !n.read).length;
  return `<div class="notif-popover" role="dialog" aria-label="Notifications">
    <div class="popover-title">Notifications · ${unread} unread</div>
    ${state.notifications.map(n => `
      <button class="notif-item ${n.read ? '' : 'unread'}" data-action="open-notification" data-notification-id="${n.id}">
        <span class="notif-icon">${icon(n.icon, 16)}</span>
        <span class="notif-text"><strong>${esc(n.title)}</strong><span>${esc(n.body)}</span></span>
        <span class="text-xs text-muted">${esc(n.time)}</span>
      </button>`).join('')}
    <div class="popover-footer"><button class="btn btn-ghost btn-sm" data-action="mark-all-read">Mark all read</button><button class="btn btn-soft btn-sm" data-page="applications">Open pipeline</button></div>
  </div>`;
}

function accountDisplayName(role) {
  return { candidate: 'Aarav Mehta', studio: 'Priya Sharma', admin: 'Aisha Rao' }[role] || 'Priya Sharma';
}

function accountPopoverMarkup() {
  return `<div class="account-popover" role="dialog" aria-label="Account">
    <div class="popover-title">Signed in as ${esc(accountDisplayName(state.role))}</div>
    <button class="account-item" data-page="settings"><span class="command-icon">${icon('settings', 16)}</span><span class="command-text"><strong>Workspace settings</strong><span>Theme, density and saved state</span></span></button>
    <button class="account-item" data-action="start-tour"><span class="command-icon">${icon('play', 16)}</span><span class="command-text"><strong>Product tour</strong><span>Show the six core product moments</span></span></button>
    <button class="account-item" data-action="export-workspace"><span class="command-icon">${icon('download', 16)}</span><span class="command-text"><strong>Export workspace data</strong><span>Download a JSON snapshot</span></span></button>
    <div class="popover-footer"><button class="btn btn-ghost btn-sm" data-action="reset-workspace">${icon('rotate', 14)} Reset workspace</button><span class="text-xs text-muted">Preferences saved on this device</span></div>
  </div>`;
}

function renderTopbar() {
  const roleAvatar = { candidate: 'AM', studio: 'PS', admin: 'AR' }[state.role] || 'PS';
  $('#topbar').innerHTML = `
    <div class="topbar-left">
      <button id="mobileMenu" class="icon-btn mobile-menu" data-action="toggle-sidebar" aria-label="Open navigation">${icon('menu', 19)}</button>
      <button class="brand hide-sm" data-page="overview" aria-label="HireGameDev overview" style="padding:0 4px">
        <span class="brand-mark" style="width:32px;height:32px;flex-basis:32px;border-radius:10px">${icon('gamepad', 18)}</span>
        <span><span class="brand-name" style="font-size:.88rem">HireGameDev</span></span>
      </button>
    </div>
    <div class="topbar-search-wrap">
      <div class="topbar-search">
        ${icon('search', 16)}
        <input id="globalSearch" type="search" value="${esc(state.ui.commandQuery)}" placeholder="Search pages, jobs, actions..." autocomplete="off" aria-label="Search workspace">
        <span class="kbd">⌘K</span>
      </div>
      ${state.ui.commandOpen ? `<div class="command-popover" role="dialog" aria-label="Quick navigation">${commandListMarkup()}</div>` : ''}
    </div>
    <div class="topbar-actions">
      <span class="workspace-chip"><span class="live-dot"></span> Live workspace</span>
      <div class="theme-switch" role="group" aria-label="Theme preference">
        <button class="theme-btn" data-theme-option="light" aria-pressed="${state.themePref === 'light'}" aria-label="Light theme">${icon('sun', 16)}</button>
        <button class="theme-btn" data-theme-option="dark" aria-pressed="${state.themePref === 'dark'}" aria-label="Dark theme">${icon('moon', 16)}</button>
        <button class="theme-btn" data-theme-option="system" aria-pressed="${state.themePref === 'system'}" aria-label="Follow system theme">${icon('monitor', 16)}</button>
      </div>
      <button id="notifButton" class="icon-btn" data-action="toggle-notifications" aria-label="Notifications">
        ${icon('bell', 18)}${state.notifications.some(n => !n.read) ? '<span class="notif-dot"></span>' : ''}
      </button>
      ${state.ui.notifOpen ? notifPopoverMarkup() : ''}
      <div class="role-picker hide-sm">
        <label class="role-label" for="roleSelect">Workspace</label>
        <select id="roleSelect" class="select-mini" aria-label="Workspace role">
          <option value="studio" ${state.role === 'studio' ? 'selected' : ''}>Studio</option>
          <option value="candidate" ${state.role === 'candidate' ? 'selected' : ''}>Candidate</option>
          <option value="admin" ${state.role === 'admin' ? 'selected' : ''}>Admin</option>
        </select>
      </div>
      <button id="avatarButton" class="avatar" data-action="toggle-account" aria-label="Account menu">${roleAvatar}</button>
      ${state.ui.accountOpen ? accountPopoverMarkup() : ''}
    </div>`;
}

function renderFooter() {
  return `<footer class="workspace-footer">
    <span>© 2026 HireGameDev · Talent infrastructure for game studios.</span>
    <div class="footer-links">
      <button data-action="show-about">About</button>
      <button data-page="settings">Theme settings</button>
      <button data-action="start-tour">Product tour</button>
    </div>
  </footer>`;
}

function pageHeader(kicker, title, description, actions = '') {
  return `<header class="page-heading">
    <div>
      <div class="kicker">${kicker}</div>
      <h1>${title}</h1>
      <p>${description}</p>
    </div>
    ${actions ? `<div class="page-actions">${actions}</div>` : ''}
  </header>`;
}

function sectionHeading(kicker, title, description, action = '') {
  return `<div class="section-heading">
    <div><div class="kicker">${kicker}</div><h2>${title}</h2>${description ? `<p>${description}</p>` : ''}</div>
    ${action}
  </div>`;
}

function chartSvg(series, gradientId = 'areaGradient', colorClass = '') {
  const w = 500, h = 140, pad = 8;
  const min = Math.min(...series) - 4, max = Math.max(...series) + 4;
  const points = series.map((value, i) => {
    const x = pad + (i / (series.length - 1)) * (w - pad * 2);
    const y = h - pad - ((value - min) / (max - min)) * (h - pad * 2);
    return [x, y];
  });
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${points[points.length - 1][0].toFixed(1)},${h} L${points[0][0].toFixed(1)},${h} Z`;
  const last = points[points.length - 1];
  return `<svg class="chart-svg ${colorClass}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="Upward trend chart">
    <defs><linearGradient id="${gradientId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--accent)" stop-opacity=".34"/><stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
    ${[.25, .5, .75].map(t => `<line class="chart-grid-line" x1="0" y1="${h * t}" x2="${w}" y2="${h * t}"/>`).join('')}
    <path class="chart-area" d="${area}" style="fill:url(#${gradientId})"/>
    <path class="chart-line" d="${line}"/>
    <circle class="chart-dot" cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="4"/>
  </svg>`;
}

function toast(title, body = '', type = 'success') {
  const toastIcon = type === 'warning' ? 'alertTriangle' : type === 'info' ? 'help' : 'checkCircle';
  const node = document.createElement('div');
  node.className = `toast ${type}`;
  node.innerHTML = `<span class="toast-icon">${icon(toastIcon, 16)}</span><div><strong>${esc(title)}</strong>${body ? `<p>${esc(body)}</p>` : ''}</div>`;
  $('#toastRoot').appendChild(node);
  setTimeout(() => {
    node.classList.add('out');
    setTimeout(() => node.remove(), 180);
  }, 2800);
}

function setModalContent(html, options = {}) {
  const root = $('#modalRoot');
  state.ui.resumeOpen = Boolean(options.resume);
  root.innerHTML = `<div class="modal-backdrop" data-action="close-modal-backdrop" role="presentation"><div class="modal ${options.wide ? 'wide' : ''}" role="dialog" aria-modal="true" aria-label="${esc(options.label || 'Dialog')}">${html}</div></div>`;
  document.body.classList.add('no-scroll');
  setTimeout(() => {
    const focusable = $('[data-autofocus], button, input, textarea, select', root);
    if (focusable) focusable.focus({ preventScroll: true });
  }, 30);
}

function openModal(html, options = {}) { setModalContent(html, options); }

function closeModal() {
  $('#modalRoot').innerHTML = '';
  document.body.classList.remove('no-scroll');
  state.ui.resumeOpen = false;
  state.ui.resumeStep = 'upload';
  state.ui.resumeFileName = '';
}

function modalHead(title, subtitle, close = true) {
  return `<div class="modal-head"><div><h2>${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ''}</div>${close ? `<button class="modal-close" data-action="close-modal" aria-label="Close dialog">${icon('x', 17)}</button>` : ''}</div>`;
}

function applyTheme(pref = state.themePref, persist = true) {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const effective = pref === 'system' ? (media.matches ? 'dark' : 'light') : pref;
  document.documentElement.setAttribute('data-theme', effective);
  document.documentElement.setAttribute('data-theme-pref', pref);
  state.themePref = pref;
  try { localStorage.setItem('hgd.themePref', pref); } catch (e) {}
  const metaTheme = $('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute('content', effective === 'dark' ? '#0b0c0a' : '#f4f5f1');
  const accentHex = $('#accentHex');
  if (accentHex) accentHex.textContent = `${getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()} · neon / warm yellow`;
  if (persist) saveState();
  renderTopbar();
  if (state.page === 'settings') renderPage(false);
}

function applyDensity() {
  document.body.setAttribute('data-density', state.density);
  document.documentElement.setAttribute('data-motion', state.reduceMotion ? 'reduced' : 'full');
}

function renderPage(scrollTop = true) {
  const views = {
    overview: viewOverview,
    jobs: viewJobs,
    candidates: viewCandidates,
    applications: viewApplications,
    match: viewMatch,
    trust: viewTrust,
    admin: viewAdmin,
    settings: viewSettings
  };
  const view = views[state.page] || viewOverview;
  $('#pageRoot').innerHTML = `<div class="page" data-page-view="${state.page}">${view()}${renderFooter()}</div>`;
  document.title = `${NAV_ITEMS.flatMap(g => g.items).find(i => i.id === state.page)?.label || 'Overview'} — HireGameDev`;
  updateRangeFills();
  if (scrollTop) window.scrollTo({ top: 0, behavior: state.reduceMotion ? 'auto' : 'smooth' });
  if (state.ui.tourIndex >= 0) setTimeout(highlightTourTarget, 80);
}

function renderChrome() {
  renderSidebar();
  renderTopbar();
}

function renderApp(scrollTop = false) {
  applyDensity();
  applyTheme(state.themePref, false);
  renderChrome();
  renderPage(scrollTop);
}

function parseHashPage() {
  const page = location.hash.replace(/^#\/?/, '').split('?')[0];
  return NAV_ITEMS.flatMap(g => g.items).some(i => i.id === page) ? page : 'overview';
}

function navigate(page, options = {}) {
  if (!NAV_ITEMS.flatMap(g => g.items).some(i => i.id === page)) page = 'overview';
  const changed = state.page !== page;
  state.page = page;
  state.ui.sidebarOpen = false;
  state.ui.commandOpen = false;
  state.ui.notifOpen = false;
  state.ui.accountOpen = false;
  const hash = `#${page}`;
  if (location.hash !== hash) history.pushState({ page }, '', hash);
  renderSidebar();
  renderTopbar();
  renderPage(options.scrollTop !== false && changed);
  updateSidebarBackdrop();
  saveState();
}

function updateSidebarBackdrop() {
  $('#sidebar').classList.toggle('open', state.ui.sidebarOpen);
  $('#sidebarBackdrop').classList.toggle('visible', state.ui.sidebarOpen);
}

function setRole(role) {
  state.role = role;
  state.ui.accountOpen = false;
  renderTopbar();
  if (state.page === 'overview') renderPage(false);
  saveState();
  const names = { candidate: 'Candidate workspace', studio: 'Studio workspace', admin: 'Admin console' };
  toast(`${names[role] || 'Workspace'} selected`, 'Your workspace view is ready.');
}

function resetWorkspace() {
  const fresh = deepClone(DEFAULT_STATE);
  fresh.themePref = state.themePref;
  fresh.role = state.role;
  fresh.page = state.page;
  Object.keys(fresh).forEach(key => { state[key] = fresh[key]; });
  closeModal();
  saveState();
  renderApp(true);
  toast('Workspace restored', 'All jobs, applications and queues are back to their starting state.');
}

function updateRangeFills() {
  $$('.range').forEach(input => {
    const min = Number(input.min || 0), max = Number(input.max || 100), value = Number(input.value || 0);
    const pct = ((value - min) / (max - min)) * 100;
    input.style.setProperty('--range-fill', `${pct}%`);
  });
}

function addAudit(action, entity, reason) {
  state.audit.unshift({ time: 'Just now', actor: 'admin@hiregamedev.in', action, entity, reason });
  state.audit = state.audit.slice(0, 8);
  saveState();
}

function addNotification(title, body, iconName = 'bell') {
  state.notifications.unshift({ id: `n-${Date.now()}`, title, body, time: 'Now', icon: iconName, read: false });
  state.notifications = state.notifications.slice(0, 8);
}

function exportWorkspaceState() {
  const snapshot = { exportedAt: new Date().toISOString(), notice: 'HireGameDev workspace export.', state: deepClone(state) };
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'hiregamedev-workspace.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  toast('Workspace data exported', 'A JSON snapshot has been downloaded.');
}

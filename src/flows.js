/* HireGameDev — interactive flows, modals, product tour, and event wiring. */

const TOUR_STEPS = [
  { page: 'overview', target: 'hero', title: 'Start with the problem', body: 'Generic hiring tools miss game-specific signal. This screen frames the marketplace, performance metrics and the phased product path.' },
  { page: 'jobs', target: 'jobs-toolbar', title: 'Candidate discovery', body: 'Search and filter live roles. Select a job card to see its full match explanation, skill evidence and hard-filter checks on the right.' },
  { page: 'match', target: 'match-lab', title: 'Explainable matching', body: 'The ranking logic is transparent by design. Change proficiency, evidence, years or expected salary and watch the score update instantly.' },
  { page: 'applications', target: 'pipeline', title: 'Two-sided pipeline', body: 'Switch between the studio board and candidate timeline. Drag cards or use the advance buttons to move applications forward.' },
  { page: 'trust', target: 'trust', title: 'Anti-ghosting', body: 'Studio response metrics are earned by real actions. Run the 09:00 IST daily job to apply day-7 reminders and day-14 auto-declines.' },
  { page: 'admin', target: 'admin', title: 'Safe operations', body: 'Verification, job review, reports, runtime settings and an audit log show how the marketplace is governed day to day.' }
];

function openApplyModal(jobId) {
  const job = getJob(jobId);
  if (!job) return;
  if (state.appliedJobs.includes(jobId)) {
    toast('Already applied', 'This application is already in your pipeline.', 'info');
    return;
  }
  const warnings = [];
  if (job.flags.includes('engine_mismatch')) warnings.push('Required engine evidence is missing. You can still apply, and the studio will see the flag.');
  if (job.flags.includes('salary_ceiling')) warnings.push(`Your expected CTC is more than 30% above the role maximum. The studio will see a salary-ceiling flag.`);
  openModal(`${modalHead('Confirm your application', `One-click apply to ${esc(job.title)} at ${esc(job.studio)}.`)}
    <div class="modal-body">
      <div class="flex justify-between items-start gap-12">
        <div class="flex gap-12"><span class="studio-logo" style="--logo-bg:${job.logoBg};--logo-ink:${job.logoInk}">${job.initials}</span><div><strong>${esc(job.title)}</strong><p class="text-sm text-muted">${esc(job.studio)} · ${job.city} · ${job.mode}</p></div></div>
        <span class="badge ${scoreTone(job.score)}">${job.score}% ${job.label}</span>
      </div>
      <div class="apply-summary mt-20">
        <div class="apply-box"><span>Profile completeness</span><strong>${state.resumeImported ? '96' : '92'}% · ready to apply</strong></div>
        <div class="apply-box"><span>Salary</span><strong>₹${formatLPA(job.salaryMin)}–${formatLPA(job.salaryMax)} LPA</strong></div>
        <div class="apply-box"><span>Expected CTC shared</span><strong>₹12 LPA</strong></div>
        <div class="apply-box"><span>Notice period</span><strong>30 days</strong></div>
      </div>
      ${warnings.map(w => `<div class="warning-banner">${icon('alertTriangle', 17)} <span>${esc(w)}</span></div>`).join('')}
      ${job.screening ? `<div class="field mt-20"><label for="applyScreening">${esc(job.screening)}</label><textarea id="applyScreening" class="textarea" placeholder="Type a short answer..."></textarea></div>` : ''}
      <div class="field mt-16"><label for="applyNote">Optional note to the studio</label><textarea id="applyNote" class="textarea" style="min-height:72px" placeholder="Add context about your shipped work or availability..."></textarea></div>
      <div class="pii-notice">${icon('lock', 16)} <span>Your phone and email remain hidden. Contact details are released only when the studio shortlists you.</span></div>
    </div>
    <div class="modal-foot"><span class="modal-note">Your contact details stay private until shortlist.</span><button class="btn btn-secondary" data-action="close-modal">Cancel</button><button class="btn btn-primary" data-action="confirm-apply" data-job-id="${job.id}">Confirm application ${icon('send', 14)}</button></div>`, { label: 'Apply to role' });
}

function confirmApply(jobId, el) {
  const job = getJob(jobId);
  if (!job || state.appliedJobs.includes(jobId)) return;
  const note = $('#applyNote') ? $('#applyNote').value.trim() : '';
  const screening = $('#applyScreening') ? $('#applyScreening').value.trim() : '';
  state.appliedJobs.push(jobId);
  const app = { id: `app-${Date.now()}`, candidateId: 'cand-1', jobId, stage: 'applied', score: job.score, appliedDays: 0, lastActionDays: 0, reminder: false, note, screening };
  state.applications.unshift(app);
  addNotification('Application sent', `${job.title} at ${job.studio} · match score ${job.score}%.`, 'send');
  addAudit('application.apply', app.id, `Candidate applied with ${state.resumeImported ? 96 : 92}% profile completeness`);
  closeModal();
  saveState();
  renderTopbar();
  renderSidebar();
  if (state.page === 'jobs') updateJobsView();
  openModal(`<div class="modal-body"><div class="success-panel">
    <span class="success-icon">${icon('checkCircle', 32)}</span>
    <h2>Application sent</h2>
    <p>Your application is now in the studio pipeline. You can follow every status change from the applications screen.</p>
    <div class="flex gap-8 flex-wrap mt-20" style="justify-content:center"><span class="badge success">${icon('checkCircle', 12)} Status: Applied</span><span class="badge accent">${icon('sparkles', 12)} ${job.score}% match</span><span class="badge">${icon('clock', 12)} Reply target 7 days</span></div>
  </div></div><div class="modal-foot"><span class="modal-note">Anti-ghosting tracking starts now.</span><button class="btn btn-secondary" data-action="close-modal">Keep exploring</button><button class="btn btn-primary" data-page="applications">View applications ${icon('arrowRight', 14)}</button></div>`, { label: 'Application sent' });
  toast('Application sent', `${job.title} is now in your pipeline.`);
}

function openResumeModal() {
  state.ui.resumeOpen = true;
  state.ui.resumeStep = 'upload';
  state.ui.resumeFileName = '';
  renderResumeModal();
}

function renderResumeModal() {
  const commonHead = modalHead('Resume AI — extraction review', 'PII is redacted before the model call. Nothing is saved until you confirm.');
  let body = '';
  let foot = '';
  if (state.ui.resumeStep === 'upload') {
    body = `<div class="modal-body">
      <div class="resume-drop">
        <span class="upload-icon">${icon('upload', 24)}</span>
        <h3>Upload a PDF or use a saved resume</h3>
        <p>Upload a PDF to extract a structured profile. Every field is reviewed before anything is saved to the workspace.</p>
        <div class="flex gap-8 flex-wrap mt-16" style="justify-content:center">
          <label class="btn btn-secondary" for="resumeFile">${icon('fileText', 15)} Choose PDF</label>
          <input id="resumeFile" class="input" type="file" accept="application/pdf,.pdf" style="display:none">
          <button class="btn btn-primary" data-action="use-saved-resume">${icon('sparkles', 15)} Use saved resume</button>
        </div>
      </div>
      <div class="grid grid-3 mt-16">
        <div class="parse-step done">${icon('checkCircle', 15)} PDF · max 2 MB</div>
        <div class="parse-step done">${icon('checkCircle', 15)} Contact details redacted</div>
        <div class="parse-step done">${icon('checkCircle', 15)} No resume text stored</div>
      </div>
    </div>`;
    foot = `<div class="modal-foot"><span class="modal-note">PII is redacted before AI processing.</span><button class="btn btn-secondary" data-action="close-modal">Cancel</button></div>`;
  } else if (state.ui.resumeStep === 'parsing') {
    body = `<div class="modal-body">
      <div class="flex gap-12 items-center"><span class="upload-icon" style="width:44px;height:44px;border-radius:14px;background:var(--accent-soft);color:var(--accent-strong);display:grid;place-items:center">${icon('fileText', 21)}</span><div><strong>${esc(state.ui.resumeFileName || 'Aarav_Mehta_Resume.pdf')}</strong><p class="text-xs text-muted">Reviewing extracted fields with a strict JSON schema.</p></div></div>
      <div class="parsing-steps">
        <div class="parse-step done">${icon('checkCircle', 15)} Text extracted locally</div>
        <div class="parse-step done">${icon('checkCircle', 15)} Emails, phone numbers and URLs redacted</div>
        <div class="parse-step done">${icon('checkCircle', 15)} Skills matched to master skill list</div>
        <div class="parse-step"><span class="spinner"></span> Preparing editable review screen</div>
      </div>
    </div>`;
    foot = `<div class="modal-foot"><span class="modal-note">Temperature 0 · JSON-only response · no training.</span></div>`;
  } else {
    body = `<div class="modal-body">
      <div class="flex justify-between items-center mb-16"><div><strong>Review before saving</strong><p class="text-xs text-muted">Every field is editable; nothing is inferred from silence.</p></div><span class="badge success">${icon('checkCircle', 12)} 18 fields found</span></div>
      <div class="review-grid">
        <div class="review-box"><span>Headline</span><strong>Unity Gameplay Programmer</strong></div>
        <div class="review-box"><span>Experience</span><strong>4.0 years</strong></div>
        <div class="review-box"><span>Recent role</span><strong>Gameplay Programmer · PixelForge Studios</strong></div>
        <div class="review-box"><span>Education</span><strong>B.Tech Computer Science · 2021</strong></div>
      </div>
      <h4 class="mt-20 mb-8">Skills matched to evidence</h4>
      <div class="flex gap-8 flex-wrap">${['Unity · portfolio', 'C# · shipped title', 'Shader Graph · claimed', 'Git · work history', 'HLSL · portfolio'].map(s => `<span class="evidence-chip">${icon('checkCircle', 12)} ${s}</span>`).join('')}</div>
      <h4 class="mt-20 mb-8">Shipped title</h4>
      <div class="shipped-box"><span class="shipped-icon">${icon('gamepad', 16)}</span><div><strong>Neon Drift</strong><span>PC · Unity · Gameplay programmer · 2024</span></div></div>
      <div class="pii-notice">${icon('shield', 16)} <span>Emails, phone numbers and URLs were redacted before the model call. Resume text is discarded after extraction.</span></div>
    </div>`;
    foot = `<div class="modal-foot"><span class="modal-note">Profile completeness will rise from 92% to 96%.</span><button class="btn btn-secondary" data-action="close-modal">Discard</button><button class="btn btn-primary" data-action="confirm-resume">Confirm and add to profile</button></div>`;
  }
  setModalContent(`${commonHead}${body}${foot}`, { resume: true, wide: true, label: 'Resume AI import' });
}

function startResumeParse(filename = 'Aarav_Mehta_Resume.pdf') {
  state.ui.resumeOpen = true;
  state.ui.resumeStep = 'parsing';
  state.ui.resumeFileName = filename;
  renderResumeModal();
  setTimeout(() => {
    if (!state.ui.resumeOpen || state.ui.resumeStep !== 'parsing') return;
    state.ui.resumeStep = 'review';
    renderResumeModal();
  }, 1150);
}

function confirmResume() {
  state.resumeImported = true;
  closeModal();
  addAudit('resume.review_confirmed', 'candidate_profile', 'User confirmed 18 extracted fields after PII redaction');
  saveState();
  renderPage(false);
  toast('Profile updated', 'Resume AI added evidence-backed fields. Profile completeness is now 96%.');
}

function openCandidateModal(id) {
  const c = getCandidate(id);
  if (!c) return;
  const shortlisted = state.shortlistedCandidates.includes(id);
  addAudit('profile.view', c.id, `Studio opened candidate profile in ${state.applicationsView === 'candidate' ? 'application' : 'search'} context`);
  saveState();
  const contact = shortlisted ? `<div class="apply-box mt-16"><span>Email · released at shortlist</span><strong>${esc(c.email)}</strong><span class="mt-8">Phone · released at shortlist</span><strong>${esc(c.phone)}</strong></div>` : `<div class="locked-contact">${icon('lock', 18)}<strong class="mt-8">Contact hidden</strong><p class="text-xs text-muted mt-4">Shortlist this candidate to release phone and email. Current CTC stays hidden by default.</p></div>`;
  openModal(`${modalHead('Candidate profile', `Studio view · ${c.completeness}% profile completeness`)}
    <div class="candidate-profile-modal">
      <aside class="profile-aside">
        <span class="candidate-avatar" style="--avatar-bg:${c.avatarBg};width:68px;height:68px;border-radius:20px;font-size:1.2rem">${c.initials}</span>
        <h3>${esc(c.name)} ${c.verified ? `<span style="color:var(--success);display:inline-flex;vertical-align:-2px">${icon('badgeCheck', 16)}</span>` : ''}</h3>
        <p>${esc(c.headline)}</p>
        <div class="flex gap-8 flex-wrap mt-12"><span class="badge ${scoreTone(c.score)}">${c.score}% match</span><span class="chip">${c.availability}</span></div>
        <div class="mt-20"><div class="lab-field-head"><span>Completeness</span><span class="value">${c.completeness}%</span></div><div class="progress"><span style="width:${c.completeness}%"></span></div></div>
        ${contact}
      </aside>
      <div class="profile-main">
        <h4>${icon('badgeCheck', 15)} Evidence-backed skills</h4>
        <div class="flex gap-8 flex-wrap">${c.skills.map(s => `<span class="evidence-chip">${icon(s.evidence === 'Claimed' ? 'help' : 'checkCircle', 12)} ${esc(s.name)} · ${esc(s.evidence)}</span>`).join('')}</div>
        <h4>${icon('gamepad', 15)} Shipped title</h4>
        <div class="shipped-box"><span class="shipped-icon">${icon('gamepad', 16)}</span><div><strong>${esc(c.shipped)}</strong><span>${esc(c.shippedMeta)}</span></div></div>
        <h4>${icon('target', 15)} Preferences</h4>
        <div class="review-grid">
          <div class="review-box"><span>Location</span><strong>${c.city}</strong></div>
          <div class="review-box"><span>Experience</span><strong>${c.years} years · ${c.seniority}</strong></div>
          <div class="review-box"><span>Expected CTC</span><strong>₹${c.expected} LPA</strong></div>
          <div class="review-box"><span>Notice</span><strong>${c.notice} days</strong></div>
        </div>
        <div class="why-note mt-20">${icon('sparkles', 16)} <span>Why ${c.score}%? Skills are scored only against the selected job, evidence multiplies credit, and location, salary and notice form the logistics score.</span></div>
      </div>
    </div>
    <div class="modal-foot"><span class="modal-note">Profile view logged · 38 / 100 today</span><button class="btn btn-secondary" data-action="close-modal">Close</button>${shortlisted ? `<span class="badge success">${icon('checkCircle', 12)} Shortlisted</span>` : `<button class="btn btn-primary" data-action="shortlist-candidate" data-candidate-id="${c.id}">Shortlist & reveal contact</button>`}</div>`, { wide: true, label: 'Candidate profile' });
}

function shortlistCandidate(id) {
  const c = getCandidate(id);
  if (!c) return;
  const wasShortlisted = state.shortlistedCandidates.includes(id);
  if (!wasShortlisted) {
    state.shortlistedCandidates.push(id);
    const existing = state.applications.find(a => a.candidateId === id);
    if (existing) {
      existing.stage = 'shortlisted';
      existing.lastActionDays = 0;
      existing.reminder = false;
    } else {
      state.applications.unshift({ id: `app-${Date.now()}`, candidateId: id, jobId: 'job-1', stage: 'shortlisted', score: c.score, appliedDays: 0, lastActionDays: 0, reminder: false });
    }
    addNotification('New shortlist', `${c.name} was shortlisted. Contact details are now released.`, 'userCheck');
    addAudit('application.shortlist', `candidate_${id}`, 'Contact released at shortlist');
  }
  saveState();
  if ($('#modalRoot .modal')) openCandidateModal(id);
  if (state.page === 'candidates') updateCandidatesView();
  if (state.page === 'applications') updateApplicationsView();
  renderTopbar();
  renderSidebar();
  toast(wasShortlisted ? 'Already shortlisted' : 'Contact released', wasShortlisted ? `${c.name} is already in the shortlist stage.` : `${c.name}'s phone and email are now visible to the studio.`);
}

function openWalkthroughModal() {
  const steps = [
    ['00:00–00:20', 'Start with the problem', 'Generic hiring tools miss game-specific signal: engines, shipped credits, evidence and response behaviour.'],
    ['00:20–00:50', 'Show candidate discovery', 'Search “Unity”, select Senior Unity Gameplay Developer, then open the match breakdown and skill evidence.'],
    ['00:50–01:20', 'Show the ranking logic', 'Go to Match engine, load the worked example, then click “Prove C# with portfolio”. The score rises from 73.7 to 77.0.'],
    ['01:20–01:45', 'Follow the application loop', 'Open Applications, switch to studio board, advance a candidate, then switch to candidate timeline.'],
    ['01:45–02:10', 'Finish with trust', 'Run the 09:00 IST anti-ghosting job, then show verification queues and audit logs in Admin.']
  ];
  openModal(`${modalHead('Product walkthrough — 2 minutes', 'A quick path through the highest-signal interactions.')}
    <div class="modal-body"><div class="queue-list">${steps.map((s, i) => `<div class="queue-row" style="grid-template-columns:105px 1fr auto"><span class="badge accent">${icon('clock', 12)} ${s[0]}</span><div><strong>${s[1]}</strong><span class="text-xs text-muted">${s[2]}</span></div><span class="badge">${i + 1}</span></div>`).join('')}</div>
      <div class="pii-notice">${icon('help', 16)} <span>Tip: use the top-right sun, moon and monitor controls to switch between light, dark and system themes at any point.</span></div>
    </div>
    <div class="modal-foot"><span class="modal-note">Use this sequence as a quick product walkthrough.</span><button class="btn btn-secondary" data-action="close-modal">Close</button><button class="btn btn-primary" data-action="start-tour">Start product tour ${icon('play', 14)}</button></div>`, { wide: true, label: 'Product walkthrough' });
}

function openAboutModal() {
  openModal(`${modalHead('About HireGameDev', 'A trusted hiring workspace built for game teams.')}
    <div class="modal-body">
      <div class="grid grid-2">
        <div class="apply-box"><strong>${icon('checkCircle', 15)} Connected workflows</strong><p class="text-xs text-muted mt-8">Search, matching, applications, shortlist contact release, anti-ghosting, admin queues and saved preferences work together.</p></div>
        <div class="apply-box"><strong>${icon('database', 15)} Structured talent data</strong><p class="text-xs text-muted mt-8">Profiles, roles, skills, evidence and preferences are organized for consistent matching.</p></div>
        <div class="apply-box"><strong>${icon('shield', 15)} Privacy by design</strong><p class="text-xs text-muted mt-8">Contact gating, consent, audit trails and admin review are built into every workflow.</p></div>
        <div class="apply-box"><strong>${icon('route', 15)} Rules you can trust</strong><p class="text-xs text-muted mt-8">Hard filters, evidence-weighted skills, response metrics and lifecycle rules are transparent.</p></div>
      </div>
      <div class="pii-notice">${icon('help', 16)} <span>Need a quick orientation? Start the product tour or open Settings to adjust your theme and workspace preferences.</span></div>
    </div>
    <div class="modal-foot"><span class="modal-note">HireGameDev · Workspace v2.0</span><button class="btn btn-primary" data-action="close-modal">Close</button></div>`, { wide: true, label: 'About HireGameDev' });
}

function openAuditModal() {
  openModal(`${modalHead('Audit log', 'Append-only record of meaningful workspace actions.')}
    <div class="modal-body"><div class="data-table-wrap"><table class="audit-table"><thead><tr><th>Time</th><th>Action</th><th>Entity</th><th>Actor</th><th>Reason</th></tr></thead><tbody>${state.audit.map(row => `<tr><td>${esc(row.time)}</td><td><code>${esc(row.action)}</code></td><td>${esc(row.entity)}</td><td>${esc(row.actor)}</td><td>${esc(row.reason)}</td></tr>`).join('')}</tbody></table></div></div>
    <div class="modal-foot"><span class="modal-note">In production, admin actions require a written reason and view-as sessions are read-only.</span><button class="btn btn-secondary" data-action="close-modal">Close</button></div>`, { wide: true, label: 'Audit log' });
}

function startTour() {
  state.ui.commandOpen = false;
  state.ui.notifOpen = false;
  state.ui.accountOpen = false;
  state.ui.tourIndex = 0;
  closeModal();
  renderTopbar();
  showTourStep();
  renderTour();
}

function showTourStep() {
  const step = TOUR_STEPS[state.ui.tourIndex];
  if (!step) return;
  if (state.page !== step.page) navigate(step.page, { scrollTop: false });
  setTimeout(highlightTourTarget, state.page === step.page ? 60 : 220);
}

function clearTourHighlights() {
  $$('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
}

function highlightTourTarget() {
  clearTourHighlights();
  const step = TOUR_STEPS[state.ui.tourIndex];
  if (!step) return;
  const target = $(`[data-tour="${step.target}"]`);
  if (target) {
    target.classList.add('tour-highlight');
    target.scrollIntoView({ behavior: state.reduceMotion ? 'auto' : 'smooth', block: step.target === 'hero' ? 'start' : 'center', inline: 'nearest' });
  }
}

function renderTour() {
  const root = $('#tourRoot');
  const step = TOUR_STEPS[state.ui.tourIndex];
  if (!step) { root.innerHTML = ''; clearTourHighlights(); return; }
  root.innerHTML = `<div class="tour-card-float" role="dialog" aria-label="Product tour">
    <div class="tour-kicker"><span>Product tour · ${state.ui.tourIndex + 1} of ${TOUR_STEPS.length}</span><button class="modal-close" style="width:28px;height:28px" data-action="tour-exit" aria-label="Exit tour">${icon('x', 14)}</button></div>
    <h3>${esc(step.title)}</h3><p>${esc(step.body)}</p>
    <div class="tour-progress">${TOUR_STEPS.map((_, i) => `<span class="${i <= state.ui.tourIndex ? 'active' : ''}"></span>`).join('')}</div>
    <div class="tour-actions"><button class="btn btn-ghost btn-sm" data-action="tour-back" ${state.ui.tourIndex === 0 ? 'disabled' : ''}>${icon('chevronRight', 13)} Back</button><button class="btn btn-primary btn-sm" data-action="tour-next">${state.ui.tourIndex === TOUR_STEPS.length - 1 ? 'Finish tour' : `Next ${icon('arrowRight', 13)}`}</button></div>
  </div>`;
}

function endTour() {
  state.ui.tourIndex = -1;
  $('#tourRoot').innerHTML = '';
  clearTourHighlights();
  toast('Tour complete', 'You can revisit any screen from the sidebar.', 'info');
}

function runCommand(item) {
  if (!item) return;
  state.ui.commandOpen = false;
  state.ui.commandQuery = '';
  renderTopbar();
  if (item.jobId) {
    const job = getJob(item.jobId);
    state.jobsQuery = { ...DEFAULT_STATE.jobsQuery, q: '', selectedJob: item.jobId, stretch: Boolean(job && job.stretch) };
    navigate('jobs');
    updateJobsView();
    return;
  }
  if (item.page) { navigate(item.page); return; }
  if (item.action) handleAction(item.action, { dataset: {} });
}

function updateCommandList() {
  const list = $('#commandList');
  if (!list) return;
  const results = commandResults(state.ui.commandQuery);
  list.innerHTML = results.length ? results.map((item, index) => `<button class="command-item" data-command-index="${index}"><span class="command-icon">${icon(item.icon, 16)}</span><span class="command-text"><strong>${esc(item.label)}</strong><span>${esc(item.sub)}</span></span>${index === 0 ? '<span class="kbd">↵</span>' : ''}</button>`).join('') : '<div class="popover-footer">No matching workspace actions.</div>';
  const title = $('.command-popover .popover-title');
  if (title) title.textContent = state.ui.commandQuery ? 'Results' : 'Suggested';
}

function handleAction(action, el = {}, event = null) {
  const data = el.dataset || {};
  switch (action) {
    case 'toggle-sidebar':
      state.ui.sidebarOpen = !state.ui.sidebarOpen;
      updateSidebarBackdrop();
      break;
    case 'toggle-notifications':
      state.ui.notifOpen = !state.ui.notifOpen;
      state.ui.accountOpen = false;
      state.ui.commandOpen = false;
      renderTopbar();
      break;
    case 'toggle-account':
      state.ui.accountOpen = !state.ui.accountOpen;
      state.ui.notifOpen = false;
      state.ui.commandOpen = false;
      renderTopbar();
      break;
    case 'mark-all-read':
      state.notifications.forEach(n => { n.read = true; });
      state.ui.notifOpen = false;
      renderTopbar();
      saveState();
      toast('Notifications cleared', 'All notifications are marked as read.');
      break;
    case 'open-notification':
      state.notifications.forEach(n => { if (n.id === data.notificationId) n.read = true; });
      state.ui.notifOpen = false;
      renderTopbar();
      navigate('applications');
      break;
    case 'close-modal': closeModal(); break;
    case 'close-modal-backdrop': break;
    case 'start-tour': startTour(); break;
    case 'tour-next':
      if (state.ui.tourIndex < TOUR_STEPS.length - 1) { state.ui.tourIndex++; showTourStep(); renderTour(); } else endTour();
      break;
    case 'tour-back':
      if (state.ui.tourIndex > 0) { state.ui.tourIndex--; showTourStep(); renderTour(); }
      break;
    case 'tour-exit': endTour(); break;
    case 'show-walkthrough': openWalkthroughModal(); break;
    case 'show-about': openAboutModal(); break;
    case 'open-resume': openResumeModal(); break;
    case 'use-saved-resume': startResumeParse('Aarav_Mehta_Resume.pdf'); break;
    case 'confirm-resume': confirmResume(); break;
    case 'open-apply': openApplyModal(data.jobId); break;
    case 'confirm-apply': confirmApply(data.jobId, el); break;
    case 'toggle-save': {
      const id = data.jobId;
      if (state.savedJobs.includes(id)) state.savedJobs = state.savedJobs.filter(x => x !== id);
      else state.savedJobs.push(id);
      saveState();
      if (state.page === 'jobs') updateJobsView();
      toast(state.savedJobs.includes(id) ? 'Job saved' : 'Job removed', 'Your saved jobs list is stored locally.');
      break;
    }
    case 'select-job':
      state.jobsQuery.selectedJob = data.jobId;
      updateJobsView();
      if (window.innerWidth <= 1120) setTimeout(() => $('[data-job-detail]')?.scrollIntoView({ behavior: state.reduceMotion ? 'auto' : 'smooth', block: 'start' }), 30);
      break;
    case 'toggle-saved-only':
      state.jobsQuery.savedOnly = !state.jobsQuery.savedOnly;
      updateJobsView();
      renderPage(false);
      break;
    case 'toggle-min-salary':
      state.jobsQuery.minSalary = state.jobsQuery.minSalary >= 10 ? 0 : 10;
      updateJobsView();
      renderPage(false);
      break;
    case 'toggle-fresher':
      state.jobsQuery.fresher = !state.jobsQuery.fresher;
      updateJobsView();
      renderPage(false);
      break;
    case 'clear-job-filters':
      state.jobsQuery = { ...DEFAULT_STATE.jobsQuery, stretch: state.jobsQuery.stretch, selectedJob: state.jobsQuery.selectedJob };
      updateJobsView();
      renderPage(false);
      toast('Job filters cleared', 'All roles are visible again.');
      break;
    case 'clear-candidate-filters':
      state.candidatesQuery = { ...DEFAULT_STATE.candidatesQuery };
      renderPage(false);
      break;
    case 'view-candidate': openCandidateModal(data.candidateId); break;
    case 'shortlist-candidate': shortlistCandidate(data.candidateId); break;
    case 'set-app-view':
      state.applicationsView = data.view;
      updateApplicationsView();
      break;
    case 'advance-app': advanceApplication(data.appId); break;
    case 'withdraw-app': {
      const app = state.applications.find(a => a.id === data.appId);
      if (app) { app.stage = 'rejected'; app.lastActionDays = 0; addAudit('application.withdraw', app.id, 'Candidate withdrew before offer'); saveState(); updateApplicationsView(); toast('Application withdrawn', 'The studio pipeline has been updated.', 'info'); }
      break;
    }
    case 'open-ghost-sim': openGhostModal(); break;
    case 'run-ghost-job': runGhostJob(); break;
    case 'load-worked-example':
      state.lab = { ...DEFAULT_STATE.lab };
      renderPage(false);
      toast('Worked example loaded', 'The reference score is 73.7 — Good match.');
      break;
    case 'prove-csharp':
      state.lab = { ...DEFAULT_STATE.lab, evidenceCSharp: 'backed' };
      renderPage(false);
      toast('C# is now portfolio-backed', 'The same proficiency earns more credit. Score rises to about 77.0.');
      break;
    case 'toggle-stuffing':
      state.lab.stuffing = !state.lab.stuffing;
      updateLabResult();
      renderPage(false);
      toast(state.lab.stuffing ? '20 irrelevant skills added' : 'Irrelevant skills removed', 'The job-weighted score did not change.', 'info');
      break;
    case 'admin-tab':
      state.adminTab = data.tab;
      updateAdminView();
      break;
    case 'approve-studio': {
      const item = state.studioQueue.find(x => x.id === data.queueId);
      if (item) { item.status = 'verified'; addAudit('studio.verify', item.name, 'GSTIN portal + domain + website confirmed'); }
      updateAdminView(); renderTopbar(); toast('Studio verified', `${item?.name || 'Studio'} can now publish jobs.`); break;
    }
    case 'reject-studio': {
      const item = state.studioQueue.find(x => x.id === data.queueId);
      if (item) { item.status = 'rejected'; addAudit('studio.reject', item.name, 'Verification evidence did not match'); }
      updateAdminView(); toast('Studio rejected', 'A reason was written to the audit log.', 'warning'); break;
    }
    case 'approve-job': {
      const item = state.jobQueue.find(x => x.id === data.queueId);
      if (item) { item.status = 'approved'; addAudit('job.approve', item.title, 'Content and salary checks reviewed'); }
      updateAdminView(); toast('Job approved', 'The role is now active.'); break;
    }
    case 'pause-job': {
      const item = state.jobQueue.find(x => x.id === data.queueId);
      if (item) { item.status = 'paused'; addAudit('job.pause', item.title, 'Held for admin review'); }
      updateAdminView(); toast('Job paused', 'The role is held pending review.', 'warning'); break;
    }
    case 'resolve-report': {
      const item = state.reports.find(x => x.id === data.queueId);
      if (item) { item.status = 'resolved'; addAudit('report.action', item.title, 'Trust & safety action recorded'); }
      updateAdminView(); toast('Report actioned', 'The queue and metrics have been updated.'); break;
    }
    case 'dismiss-report': {
      const item = state.reports.find(x => x.id === data.queueId);
      if (item) { item.status = 'resolved'; addAudit('report.dismiss', item.title, 'Insufficient evidence after review'); }
      updateAdminView(); toast('Report dismissed', 'The queue and metrics have been updated.', 'info'); break;
    }
    case 'view-audit': openAuditModal(); break;
    case 'export-workspace': exportWorkspaceState(); break;
    case 'reset-workspace': resetWorkspace(); break;
    default: break;
  }
  if (!['toggle-sidebar', 'tour-next', 'tour-back'].includes(action)) saveState();
}

function handlePageClick(page, el) {
  if ($('#modalRoot .modal')?.contains(el)) closeModal();
  state.ui.notifOpen = false;
  state.ui.accountOpen = false;
  state.ui.commandOpen = false;
  state.ui.sidebarOpen = false;
  updateSidebarBackdrop();
  navigate(page);
}

function initGlobalEvents() {
  document.addEventListener('click', event => {
    const target = event.target;
    if (target.classList && target.classList.contains('modal-backdrop')) { closeModal(); return; }

    const themeEl = target.closest('[data-theme-option]');
    if (themeEl) {
      applyTheme(themeEl.dataset.themeOption);
      return;
    }

    const commandEl = target.closest('[data-command-index]');
    if (commandEl) {
      const results = commandResults(state.ui.commandQuery);
      runCommand(results[Number(commandEl.dataset.commandIndex)]);
      return;
    }

    const pageEl = target.closest('[data-page]');
    if (pageEl) { event.preventDefault(); handlePageClick(pageEl.dataset.page, pageEl); return; }

    const actionEl = target.closest('[data-action]');
    if (actionEl) {
      if (actionEl.dataset.action === 'close-modal-backdrop' && actionEl !== target) return;
      event.preventDefault();
      handleAction(actionEl.dataset.action, actionEl, event);
      return;
    }

    let chromeChanged = false;
    if (state.ui.commandOpen && !target.closest('.topbar-search-wrap')) { state.ui.commandOpen = false; chromeChanged = true; }
    if (state.ui.notifOpen && !target.closest('.notif-popover') && !target.closest('#notifButton')) { state.ui.notifOpen = false; chromeChanged = true; }
    if (state.ui.accountOpen && !target.closest('.account-popover') && !target.closest('#avatarButton')) { state.ui.accountOpen = false; chromeChanged = true; }
    if (chromeChanged) renderTopbar();
  });

  document.addEventListener('focusin', event => {
    if (event.target.id === 'globalSearch' && !state.ui.commandOpen) {
      state.ui.commandOpen = true;
      state.ui.notifOpen = false;
      state.ui.accountOpen = false;
      renderTopbar();
      const input = $('#globalSearch');
      if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
    }
  });

  document.addEventListener('input', event => {
    const el = event.target;
    if (el.id === 'globalSearch') {
      state.ui.commandQuery = el.value;
      updateCommandList();
      return;
    }
    if (el.id === 'jobSearch') {
      state.jobsQuery.q = el.value;
      updateJobsView();
      return;
    }
    if (el.id === 'candidateSearch') {
      state.candidatesQuery.q = el.value;
      updateCandidatesView();
      return;
    }
    if (el.matches('[data-lab-key]')) {
      const key = el.dataset.labKey;
      state.lab[key] = Number(el.value);
      const suffix = { years: ' yrs', expected: ' LPA', notice: ' days' }[key] || '';
      const display = $(`#labValue-${key}`);
      if (display) display.textContent = `${el.value}${suffix}`;
      const min = Number(el.min || 0), max = Number(el.max || 100);
      el.style.setProperty('--range-fill', `${((Number(el.value) - min) / (max - min)) * 100}%`);
      updateLabResult();
    }
  });

  document.addEventListener('change', event => {
    const el = event.target;
    const id = el.id;
    if (id === 'roleSelect') { setRole(el.value); return; }
    if (id === 'densitySelect') { state.density = el.value; applyDensity(); saveState(); toast('Density updated', `${el.value[0].toUpperCase() + el.value.slice(1)} layout is active.`, 'info'); return; }
    if (id === 'motionToggle') { state.reduceMotion = el.checked; applyDensity(); saveState(); return; }
    if (id === 'resumeFile') { if (el.files && el.files[0]) startResumeParse(el.files[0].name); return; }
    if (id === 'jobCategory') { state.jobsQuery.category = el.value; updateJobsView(); return; }
    if (id === 'jobMode') { state.jobsQuery.mode = el.value; updateJobsView(); return; }
    if (id === 'jobCity') { state.jobsQuery.city = el.value; updateJobsView(); return; }
    if (id === 'jobSort') { state.jobsQuery.sort = el.value; updateJobsView(); return; }
    if (id === 'stretchToggle') { state.jobsQuery.stretch = el.checked; updateJobsView(); toast(el.checked ? 'Stretch matches shown' : 'Stretch matches hidden', 'Hard-filtered roles are clearly labelled.', 'info'); return; }
    if (id === 'candidateEngine') { state.candidatesQuery.engine = el.value; updateCandidatesView(); return; }
    if (id === 'candidateAvailability') { state.candidatesQuery.availability = el.value; updateCandidatesView(); return; }
    if (id === 'candidateCity') { state.candidatesQuery.city = el.value; updateCandidatesView(); return; }
    if (id === 'candidateScore') { state.candidatesQuery.minScore = Number(el.value); updateCandidatesView(); return; }
    if (el.matches('[data-lab-preset]')) { state.lab.preset = el.value; state.lab.stuffing = false; updateLabResult(); return; }
    if (el.matches('[data-lab-evidence]')) { state.lab.evidenceCSharp = el.value; updateLabResult(); return; }
    if (el.matches('[data-admin-setting]')) {
      const key = el.dataset.adminSetting;
      state.adminSettings[key] = isNaN(Number(el.value)) ? el.value : Number(el.value);
      addAudit('settings.update', key, `Workspace setting changed to ${el.value}`);
      saveState();
      toast('Setting updated', `${key} is now ${el.value}.`, 'info');
    }
  });

  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      state.ui.commandOpen = true;
      state.ui.commandQuery = '';
      renderTopbar();
      $('#globalSearch')?.focus();
      return;
    }
    if (event.key === 'Escape') {
      if ($('#modalRoot .modal')) closeModal();
      else if (state.ui.commandOpen || state.ui.notifOpen || state.ui.accountOpen || state.ui.sidebarOpen) {
        state.ui.commandOpen = false; state.ui.notifOpen = false; state.ui.accountOpen = false; state.ui.sidebarOpen = false;
        updateSidebarBackdrop(); renderTopbar();
      } else if (state.ui.tourIndex >= 0) endTour();
      return;
    }
    if (event.key === 'Enter' && event.target.id === 'globalSearch' && state.ui.commandOpen) {
      event.preventDefault();
      runCommand(commandResults(state.ui.commandQuery)[0]);
      return;
    }
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.job-card')) {
      event.preventDefault();
      handleAction('select-job', event.target);
      return;
    }
    const linkedCard = event.target.closest ? event.target.closest('[data-page][role="button"]') : null;
    if ((event.key === 'Enter' || event.key === ' ') && linkedCard) {
      event.preventDefault();
      handlePageClick(linkedCard.dataset.page, linkedCard);
    }
  });

  document.addEventListener('dragstart', event => {
    const card = event.target.closest('.kanban-card');
    if (!card) return;
    event.dataTransfer.setData('text/plain', card.dataset.appId);
    event.dataTransfer.effectAllowed = 'move';
    card.classList.add('dragging');
  });
  document.addEventListener('dragover', event => {
    const col = event.target.closest('.kanban-col');
    if (!col) return;
    event.preventDefault();
    col.classList.add('drag-over');
  });
  document.addEventListener('dragleave', event => {
    const col = event.target.closest('.kanban-col');
    if (col && !col.contains(event.relatedTarget)) col.classList.remove('drag-over');
  });
  document.addEventListener('drop', event => {
    const col = event.target.closest('.kanban-col');
    if (!col) return;
    event.preventDefault();
    col.classList.remove('drag-over');
    const appId = event.dataTransfer.getData('text/plain');
    if (appId) advanceApplication(appId, col.dataset.stage);
  });
  document.addEventListener('dragend', () => $$('.dragging, .drag-over').forEach(el => el.classList.remove('dragging', 'drag-over')));

  const syncHash = () => {
    const page = parseHashPage();
    if (page !== state.page) {
      state.page = page;
      renderSidebar();
      renderTopbar();
      renderPage(false);
      saveState();
    }
  };
  window.addEventListener('popstate', syncHash);
  window.addEventListener('hashchange', syncHash);

  const media = window.matchMedia('(prefers-color-scheme: dark)');
  if (media.addEventListener) media.addEventListener('change', () => { if (state.themePref === 'system') applyTheme('system', false); });
  else if (media.addListener) media.addListener(() => { if (state.themePref === 'system') applyTheme('system', false); });
}

function init() {
  if (location.hash) state.page = parseHashPage();
  applyDensity();
  applyTheme(state.themePref, false);
  renderSidebar();
  renderTopbar();
  renderPage(false);
  updateSidebarBackdrop();
  initGlobalEvents();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

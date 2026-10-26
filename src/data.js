/* HireGameDev workspace data — roles, profiles, applications and operational records. */

const ICONS = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M2 12h20"/>',
  sparkles: '<path d="m12 3 1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/><path d="M5 15l.6 1.4L7 17l-1.4.6L5 19l-.6-1.4L3 17l1.4-.6L5 15Z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
  sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3"/><path d="M1 14h6M9 8h6M17 16h6"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.36a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.63 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.55-1.04 1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.63a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.37 9v.1a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  bookmark: '<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/>',
  mapPin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  wallet: '<path d="M20 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5"/><path d="M17 13h.01"/>',
  star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.4l6.1-.9L12 3Z"/>',
  zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z"/>',
  arrowUpRight: '<path d="M7 17 17 7M8 7h9v9"/>',
  trendingUp: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  play: '<path d="m7 4 12 8-12 8V4Z"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M20 16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3"/>',
  fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01"/>',
  badgeCheck: '<path d="M12 2 15 5l4.3-.3.3 4.3L22 12l-2.4 3-.3 4.3L15 19l-3 3-3-3-4.3.3-.3-4.3L2 12l2.4-3L4.7 4.7 9 5l3-3Z"/><path d="m8.5 12 2.2 2.2 4.8-4.8"/>',
  alertTriangle: '<path d="M10.3 3.6 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
  message: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6"/>',
  rotate: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.6 2.2c-.8.4-1.1.9-1.1 1.8"/><path d="M12 17h.01"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.2 2.2 4.8-4.8"/>',
  send: '<path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/>',
  arrowRight: '<path d="M4 12h16M14 6l6 6-6 6"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  keyboard: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M7 13h10M8 16h8"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  chart: '<path d="M3 3v18h18"/><path d="m7 15 4-5 3 3 5-7"/>',
  userCheck: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>',
  flag: '<path d="M4 22V4M4 4h12l-2 4 2 4H4"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1Z"/>',
  gamepad: '<path d="M7 8h10a5 5 0 0 1 4.8 3.6l1.1 4A3 3 0 0 1 20 19c-1 0-1.7-.5-2.4-1.3L16 16H8l-1.6 1.7C5.7 18.5 5 19 4 19a3 3 0 0 1-2.9-3.4l1.1-4A5 5 0 0 1 7 8Z"/><path d="M7 11v4M5 13h4M16.5 12h.01M18.5 14h.01"/>',
  route: '<circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M9 19h4a4 4 0 0 0 0-8h-2a4 4 0 0 1 0-8h4"/>',
  gitBranch: '<path d="M6 3v12"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M6 9a9 9 0 0 0 9 9"/>',
  shieldAlert: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="M12 8v5M12 16h.01"/>',
  listChecks: '<path d="m3 6 2 2 3-3M3 13l2 2 3-3M3 20l2 2 3-3M12 7h9M12 14h9M12 21h9"/>',
  gauge: '<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="m13.4 10.6 4.6-4.6"/><path d="M3.5 18a9 9 0 1 1 17 0"/>',
  briefcaseCheck: '<path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M2 12h20v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7Z"/><path d="m9 15 2 2 4-4"/>'
};

const JOBS = [
  {
    id: 'job-1', title: 'Senior Unity Gameplay Developer', studio: 'PixelForge Studios', initials: 'PF',
    logoBg: '#fff1b8', logoInk: '#5b4800', city: 'Pune', mode: 'Hybrid', type: 'Full time', category: 'Programming',
    seniority: 'Senior', minYears: 4, maxYears: 7, salaryMin: 10, salaryMax: 14, postedDays: 1, responseRate: 91,
    applicants: 18, openings: 2, verified: true, score: 92, label: 'Strong match', fresherFriendly: false,
    skills: [
      { name: 'Unity', required: true, min: 3, status: 'matched', note: 'Proficiency 3 · evidence backed' },
      { name: 'C#', required: true, min: 3, status: 'matched', note: 'Proficiency 4 · evidence backed' },
      { name: 'Shader Graph', required: false, min: 2, status: 'partial', note: 'Related skill: HLSL · 60% credit' },
      { name: 'Git', required: false, min: 2, status: 'matched', note: 'Proficiency 3 · claimed' }
    ],
    breakdown: { skills: 88, experience: 100, logistics: 96 }, flags: [],
    description: 'Build responsive player systems and combat mechanics for a stylized action RPG shipping on PC and console. Partner with designers and technical artists to turn prototypes into production-ready features.',
    screening: 'Which shipped gameplay system are you most proud of, and what was your contribution?'
  },
  {
    id: 'job-2', title: 'Unreal Engine C++ Programmer', studio: 'Northstar Interactive', initials: 'NI',
    logoBg: '#dce9ff', logoInk: '#204b8a', city: 'Remote', mode: 'Remote', type: 'Full time', category: 'Programming',
    seniority: 'Senior', minYears: 5, maxYears: 9, salaryMin: 16, salaryMax: 24, postedDays: 2, responseRate: 88,
    applicants: 31, openings: 3, verified: true, score: 88, label: 'Strong match', fresherFriendly: false,
    skills: [
      { name: 'Unreal Engine 5', required: true, min: 3, status: 'partial', note: 'Related skill: Unity · 35% credit' },
      { name: 'C++', required: true, min: 3, status: 'matched', note: 'Proficiency 3 · claimed' },
      { name: 'Blueprints', required: false, min: 2, status: 'missing', note: 'No evidence on profile' },
      { name: 'Perforce', required: false, min: 2, status: 'matched', note: 'Proficiency 2 · claimed' }
    ],
    breakdown: { skills: 72, experience: 88, logistics: 100 }, flags: ['engine_mismatch'], stretch: true,
    description: 'Own core gameplay and tooling systems in Unreal Engine 5 for an unannounced multiplayer title. Strong C++ fundamentals and performance profiling experience are essential.',
    screening: 'Describe a profiling problem you diagnosed and the measured improvement.'
  },
  {
    id: 'job-3', title: 'Technical Artist — Shaders & Tools', studio: 'Moonlane Games', initials: 'MG',
    logoBg: '#eee0ff', logoInk: '#56327c', city: 'Hyderabad', mode: 'Hybrid', type: 'Full time', category: 'Art',
    seniority: 'Mid', minYears: 3, maxYears: 6, salaryMin: 12, salaryMax: 18, postedDays: 1, responseRate: 84,
    applicants: 22, openings: 1, verified: true, score: 84, label: 'Strong match', fresherFriendly: false,
    skills: [
      { name: 'Unity', required: true, min: 3, status: 'matched', note: 'Proficiency 3 · backed' },
      { name: 'Shader Graph', required: true, min: 3, status: 'partial', note: 'Related skill: HLSL · 70% credit' },
      { name: 'Blender', required: false, min: 2, status: 'matched', note: 'Proficiency 3 · backed' },
      { name: 'HLSL', required: false, min: 2, status: 'matched', note: 'Proficiency 2 · claimed' }
    ],
    breakdown: { skills: 81, experience: 100, logistics: 84 }, flags: [],
    description: 'Bridge art and engineering by crafting shaders, optimizing assets, and building tools that help a small team ship visually distinctive worlds.',
    screening: 'Share a shader or tool you made that improved an art team’s workflow.'
  },
  {
    id: 'job-4', title: 'Game Designer — Systems', studio: 'Dice & Doodle', initials: 'DD',
    logoBg: '#ffe5d9', logoInk: '#7a3b20', city: 'Mumbai', mode: 'Onsite', type: 'Full time', category: 'Design',
    seniority: 'Mid', minYears: 2, maxYears: 5, salaryMin: 8, salaryMax: 12, postedDays: 3, responseRate: 76,
    applicants: 47, openings: 2, verified: true, score: 79, label: 'Good match', fresherFriendly: false,
    skills: [
      { name: 'Game Design', required: true, min: 3, status: 'matched', note: 'Proficiency 3 · backed' },
      { name: 'Unity', required: true, min: 2, status: 'matched', note: 'Proficiency 3 · backed' },
      { name: 'C#', required: false, min: 2, status: 'matched', note: 'Proficiency 4 · backed' },
      { name: 'Excel', required: false, min: 2, status: 'missing', note: 'No evidence on profile' }
    ],
    breakdown: { skills: 76, experience: 100, logistics: 74 }, flags: [],
    description: 'Design progression, economy and combat systems for a cozy strategy game. Work from paper prototype to live balancing with a tight-knit team.',
    screening: 'What is one economy system you would change in a game you admire?'
  },
  {
    id: 'job-5', title: 'Multiplayer Backend Engineer', studio: 'PlayGrid', initials: 'PG',
    logoBg: '#dff6e8', logoInk: '#1d6848', city: 'Remote', mode: 'Remote', type: 'Full time', category: 'Programming',
    seniority: 'Senior', minYears: 5, maxYears: 10, salaryMin: 18, salaryMax: 28, postedDays: 4, responseRate: 82,
    applicants: 26, openings: 2, verified: true, score: 76, label: 'Good match', fresherFriendly: false,
    skills: [
      { name: 'Go', required: true, min: 3, status: 'partial', note: 'Related skill: C# · 45% credit' },
      { name: 'Kubernetes', required: true, min: 2, status: 'claimed', note: 'Proficiency 2 · claimed' },
      { name: 'Redis', required: false, min: 2, status: 'matched', note: 'Proficiency 2 · claimed' },
      { name: 'AWS', required: false, min: 2, status: 'missing', note: 'No evidence on profile' }
    ],
    breakdown: { skills: 62, experience: 90, logistics: 100 }, flags: [],
    description: 'Design reliable matchmaking, session and telemetry services for live games with millions of monthly sessions.',
    screening: 'Tell us about a production incident you helped resolve.'
  },
  {
    id: 'job-6', title: 'Junior Unity Developer', studio: 'Tiny Rocket Games', initials: 'TR',
    logoBg: '#fff1c9', logoInk: '#6a5000', city: 'Pune', mode: 'Onsite', type: 'Full time', category: 'Programming',
    seniority: 'Junior', minYears: 0, maxYears: 2, salaryMin: 4, salaryMax: 6, postedDays: 5, responseRate: 95,
    applicants: 62, openings: 4, verified: true, score: 74, label: 'Good match', fresherFriendly: true,
    skills: [
      { name: 'Unity', required: true, min: 2, status: 'matched', note: 'Proficiency 3 · backed' },
      { name: 'C#', required: true, min: 2, status: 'matched', note: 'Proficiency 4 · backed' },
      { name: 'Git', required: false, min: 1, status: 'matched', note: 'Proficiency 3 · claimed' }
    ],
    breakdown: { skills: 94, experience: 70, logistics: 42 }, flags: ['salary_ceiling'], stretch: true,
    description: 'Join a mentorship-first mobile studio and ship small, polished game features every week. Ideal for developers with a strong portfolio and 0–2 years of experience.',
    screening: 'Link one playable project and describe what you learned building it.'
  },
  {
    id: 'job-7', title: 'Environment Artist', studio: 'Monsoon Arcade', initials: 'MA',
    logoBg: '#dceef0', logoInk: '#28636b', city: 'Chennai', mode: 'Hybrid', type: 'Full time', category: 'Art',
    seniority: 'Mid', minYears: 2, maxYears: 5, salaryMin: 7, salaryMax: 11, postedDays: 6, responseRate: 71,
    applicants: 39, openings: 1, verified: true, score: 71, label: 'Good match', fresherFriendly: false,
    skills: [
      { name: 'Blender', required: true, min: 3, status: 'matched', note: 'Proficiency 3 · backed' },
      { name: 'Substance Painter', required: true, min: 2, status: 'partial', note: 'Related skill: Blender · 50% credit' },
      { name: 'Unreal Engine 5', required: false, min: 2, status: 'claimed', note: 'Proficiency 2 · claimed' }
    ],
    breakdown: { skills: 73, experience: 100, logistics: 64 }, flags: [],
    description: 'Create atmospheric, performance-conscious environments for a narrative exploration game set in a near-future Kerala.',
    screening: 'Which environment in your portfolio best demonstrates storytelling?'
  },
  {
    id: 'job-8', title: 'QA Automation Engineer', studio: 'Questworks', initials: 'QW',
    logoBg: '#e5e8ff', logoInk: '#3b408a', city: 'Noida', mode: 'Hybrid', type: 'Full time', category: 'QA',
    seniority: 'Mid', minYears: 2, maxYears: 5, salaryMin: 6, salaryMax: 10, postedDays: 7, responseRate: 68,
    applicants: 53, openings: 2, verified: true, score: 68, label: 'Good match', fresherFriendly: false,
    skills: [
      { name: 'Python', required: true, min: 2, status: 'claimed', note: 'Proficiency 2 · claimed' },
      { name: 'Selenium', required: true, min: 2, status: 'missing', note: 'No evidence on profile' },
      { name: 'Jira', required: false, min: 2, status: 'matched', note: 'Proficiency 3 · claimed' },
      { name: 'Unity', required: false, min: 2, status: 'matched', note: 'Proficiency 3 · backed' }
    ],
    breakdown: { skills: 58, experience: 100, logistics: 72 }, flags: [],
    description: 'Build automated regression suites and improve how a 40-person studio catches gameplay-breaking bugs before release.',
    screening: 'How would you automate a smoke test for a playable build?'
  },
  {
    id: 'job-9', title: 'Audio Designer — Interactive', studio: 'Sonic Pixel', initials: 'SP',
    logoBg: '#f7e3f3', logoInk: '#793b6a', city: 'Remote', mode: 'Remote', type: 'Full time', category: 'Audio',
    seniority: 'Mid', minYears: 3, maxYears: 6, salaryMin: 8, salaryMax: 13, postedDays: 8, responseRate: 80,
    applicants: 19, openings: 1, verified: true, score: 65, label: 'Good match', fresherFriendly: false,
    skills: [
      { name: 'FMOD', required: true, min: 3, status: 'missing', note: 'No evidence on profile' },
      { name: 'Wwise', required: false, min: 2, status: 'claimed', note: 'Proficiency 2 · claimed' },
      { name: 'Unity', required: true, min: 2, status: 'matched', note: 'Proficiency 3 · backed' },
      { name: 'Reaper', required: false, min: 2, status: 'missing', note: 'No evidence on profile' }
    ],
    breakdown: { skills: 48, experience: 100, logistics: 94 }, flags: [],
    description: 'Shape the sound of a rhythm-action game with adaptive music, responsive combat audio and accessible mix presets.',
    screening: 'Describe one interactive audio system you implemented end-to-end.'
  },
  {
    id: 'job-10', title: 'Game Producer', studio: 'Paper Lantern', initials: 'PL',
    logoBg: '#fff0df', logoInk: '#7c4d17', city: 'Ahmedabad', mode: 'Onsite', type: 'Full time', category: 'Production',
    seniority: 'Lead', minYears: 6, maxYears: 10, salaryMin: 14, salaryMax: 20, postedDays: 9, responseRate: 74,
    applicants: 14, openings: 1, verified: true, score: 61, label: 'Good match', fresherFriendly: false,
    skills: [
      { name: 'Production', required: true, min: 3, status: 'claimed', note: 'Proficiency 2 · claimed' },
      { name: 'Jira', required: true, min: 3, status: 'matched', note: 'Proficiency 3 · claimed' },
      { name: 'Agile', required: false, min: 2, status: 'matched', note: 'Proficiency 3 · claimed' },
      { name: 'Excel', required: false, min: 2, status: 'missing', note: 'No evidence on profile' }
    ],
    breakdown: { skills: 55, experience: 70, logistics: 72 }, flags: [],
    description: 'Lead planning, rituals and vendor relationships for simultaneous PC and console production tracks.',
    screening: 'How do you protect a team from crunch when a milestone slips?'
  },
  {
    id: 'job-11', title: 'AR/VR Gameplay Developer', studio: 'Immersive Mittens', initials: 'IM',
    logoBg: '#e1f0ff', logoInk: '#285b8e', city: 'Kochi', mode: 'Hybrid', type: 'Full time', category: 'Programming',
    seniority: 'Mid', minYears: 2, maxYears: 6, salaryMin: 9, salaryMax: 15, postedDays: 12, responseRate: 64,
    applicants: 21, openings: 2, verified: false, score: 58, label: 'Partial match', fresherFriendly: false,
    skills: [
      { name: 'Unity', required: true, min: 3, status: 'matched', note: 'Proficiency 3 · backed' },
      { name: 'C#', required: true, min: 3, status: 'matched', note: 'Proficiency 4 · backed' },
      { name: 'XR Toolkit', required: true, min: 2, status: 'missing', note: 'Required skill missing' },
      { name: 'Blender', required: false, min: 2, status: 'matched', note: 'Proficiency 3 · backed' }
    ],
    breakdown: { skills: 62, experience: 100, logistics: 40 }, flags: ['engine_mismatch'], stretch: true,
    description: 'Prototype hand-tracked puzzle mechanics and comfort-first locomotion for a location-based entertainment platform.',
    screening: 'What is the hardest comfort problem you have solved in XR?'
  },
  {
    id: 'job-12', title: 'Gameplay Engineer Intern', studio: 'Bright Byte Labs', initials: 'BB',
    logoBg: '#f4ffd9', logoInk: '#4e6411', city: 'Remote', mode: 'Remote', type: 'Internship', category: 'Programming',
    seniority: 'Fresher', minYears: 0, maxYears: 1, salaryMin: 2.4, salaryMax: 3.6, postedDays: 14, responseRate: 86,
    applicants: 74, openings: 5, verified: true, score: 55, label: 'Partial match', fresherFriendly: true,
    skills: [
      { name: 'Unity', required: true, min: 2, status: 'matched', note: 'Proficiency 3 · backed' },
      { name: 'C#', required: true, min: 2, status: 'matched', note: 'Proficiency 4 · backed' },
      { name: 'Git', required: false, min: 1, status: 'matched', note: 'Proficiency 3 · claimed' }
    ],
    breakdown: { skills: 96, experience: 30, logistics: 20 }, flags: ['salary_ceiling'], stretch: true,
    description: 'A paid six-month internship with weekly mentorship, code review and a shipped feature on a live mobile title.',
    screening: 'What game mechanic would you rebuild first to learn how it works?'
  }
];

const CANDIDATES = [
  {
    id: 'cand-1', name: 'Aarav Mehta', initials: 'AM', avatarBg: '#fff0b5', headline: 'Unity Gameplay Programmer',
    city: 'Pune', years: 4, seniority: 'Mid', expected: 12, notice: 30, availability: 'Actively looking',
    completeness: 92, score: 94, openRemote: true, relocate: true, verified: true,
    skills: [{ name: 'Unity', evidence: 'Shipped title' }, { name: 'C#', evidence: 'Portfolio' }, { name: 'Shader Graph', evidence: 'Claimed' }],
    shipped: 'Neon Drift', shippedMeta: 'PC · Unity · Gameplay programmer, 2024',
    email: 'aarav.mehta@proton.me', phone: '+91 98••• ••21'
  },
  {
    id: 'cand-2', name: 'Riya Sen', initials: 'RS', avatarBg: '#eadfff', headline: 'Technical Artist — Shaders & Tools',
    city: 'Hyderabad', years: 5, seniority: 'Mid', expected: 15, notice: 30, availability: 'Open to offers',
    completeness: 96, score: 91, openRemote: false, relocate: true, verified: true,
    skills: [{ name: 'Unity', evidence: 'Shipped title' }, { name: 'HLSL', evidence: 'Portfolio' }, { name: 'Blender', evidence: 'Shipped title' }],
    shipped: 'Cloudfall', shippedMeta: 'PC · Console · Technical art lead, 2023',
    email: 'riya.sen@riyasen.design', phone: '+91 97••• ••43'
  },
  {
    id: 'cand-3', name: 'Kabir Nair', initials: 'KN', avatarBg: '#dceaff', headline: 'Unreal Engine C++ Engineer',
    city: 'Bengaluru', years: 6, seniority: 'Senior', expected: 20, notice: 60, availability: 'Open to offers',
    completeness: 88, score: 89, openRemote: true, relocate: false, verified: true,
    skills: [{ name: 'Unreal Engine 5', evidence: 'Shipped title' }, { name: 'C++', evidence: 'Portfolio' }, { name: 'Blueprints', evidence: 'Shipped title' }],
    shipped: 'Rally Rift', shippedMeta: 'PC · Unreal Engine 5 · Core engineer, 2025',
    email: 'kabir.nair@kabirnair.dev', phone: '+91 96••• ••08'
  },
  {
    id: 'cand-4', name: 'Isha Kapoor', initials: 'IK', avatarBg: '#ffe3d7', headline: 'Game Designer — Systems & Economy',
    city: 'Mumbai', years: 3, seniority: 'Mid', expected: 10, notice: 15, availability: 'Actively looking',
    completeness: 84, score: 86, openRemote: true, relocate: true, verified: true,
    skills: [{ name: 'Game Design', evidence: 'Shipped title' }, { name: 'Unity', evidence: 'Portfolio' }, { name: 'C#', evidence: 'Claimed' }],
    shipped: 'Little Mars', shippedMeta: 'Mobile · Unity · Systems designer, 2024',
    email: 'isha.kapoor@ishakapoor.games', phone: '+91 95••• ••67'
  },
  {
    id: 'cand-5', name: 'Dev Patel', initials: 'DP', avatarBg: '#ddf5e9', headline: 'Multiplayer Backend Engineer',
    city: 'Remote', years: 7, seniority: 'Senior', expected: 24, notice: 30, availability: 'Open to offers',
    completeness: 90, score: 84, openRemote: true, relocate: false, verified: true,
    skills: [{ name: 'Go', evidence: 'Shipped title' }, { name: 'Kubernetes', evidence: 'Claimed' }, { name: 'Redis', evidence: 'Portfolio' }],
    shipped: 'Arena Loop', shippedMeta: 'PC · Live services · Backend lead, 2025',
    email: 'dev.patel@devpatel.dev', phone: '+91 94••• ••56'
  },
  {
    id: 'cand-6', name: 'Meera Iyer', initials: 'MI', avatarBg: '#dceef0', headline: 'Environment Artist',
    city: 'Chennai', years: 4, seniority: 'Mid', expected: 11, notice: 30, availability: 'Actively looking',
    completeness: 82, score: 81, openRemote: false, relocate: true, verified: false,
    skills: [{ name: 'Blender', evidence: 'Portfolio' }, { name: 'Substance Painter', evidence: 'Portfolio' }, { name: 'Unreal Engine 5', evidence: 'Claimed' }],
    shipped: 'Tidal Ruins', shippedMeta: 'PC · Unreal Engine 5 · Environment artist, 2023',
    email: 'meera.iyer@meeraiyer.art', phone: '+91 93••• ••92'
  },
  {
    id: 'cand-7', name: 'Arjun Rao', initials: 'AR', avatarBg: '#e7e9ff', headline: 'QA Automation Engineer',
    city: 'Noida', years: 3, seniority: 'Mid', expected: 8, notice: 15, availability: 'Actively looking',
    completeness: 78, score: 79, openRemote: true, relocate: true, verified: true,
    skills: [{ name: 'Python', evidence: 'Claimed' }, { name: 'Selenium', evidence: 'Claimed' }, { name: 'Unity', evidence: 'Portfolio' }, { name: 'Jira', evidence: 'Claimed' }],
    shipped: 'Rail Raiders', shippedMeta: 'Mobile · Unity · QA automation, 2024',
    email: 'arjun.rao@arjunrao.dev', phone: '+91 92••• ••31'
  },
  {
    id: 'cand-8', name: 'Nisha Verma', initials: 'NV', avatarBg: '#f7e3f3', headline: 'Interactive Audio Designer',
    city: 'Remote', years: 5, seniority: 'Mid', expected: 12, notice: 30, availability: 'Open to offers',
    completeness: 86, score: 78, openRemote: true, relocate: false, verified: true,
    skills: [{ name: 'FMOD', evidence: 'Shipped title' }, { name: 'Wwise', evidence: 'Portfolio' }, { name: 'Unity', evidence: 'Claimed' }],
    shipped: 'Beat Runner', shippedMeta: 'PC · FMOD · Audio designer, 2024',
    email: 'nisha.kapoor@ishakapoor.games', phone: '+91 91••• ••14'
  },
  {
    id: 'cand-9', name: 'Rohan Das', initials: 'RD', avatarBg: '#fff0df', headline: 'Game Producer',
    city: 'Ahmedabad', years: 8, seniority: 'Lead', expected: 18, notice: 60, availability: 'Open to offers',
    completeness: 80, score: 76, openRemote: false, relocate: false, verified: true,
    skills: [{ name: 'Production', evidence: 'Claimed' }, { name: 'Jira', evidence: 'Shipped title' }, { name: 'Agile', evidence: 'Claimed' }],
    shipped: 'Star Express', shippedMeta: 'PC · Console · Producer, 2022',
    email: 'rohan.das@rohandas.games', phone: '+91 90••• ••77'
  },
  {
    id: 'cand-10', name: 'Tanya Gill', initials: 'TG', avatarBg: '#e1f0ff', headline: 'XR Gameplay Developer',
    city: 'Kochi', years: 3, seniority: 'Mid', expected: 10, notice: 15, availability: 'Actively looking',
    completeness: 76, score: 74, openRemote: true, relocate: true, verified: false,
    skills: [{ name: 'Unity', evidence: 'Shipped title' }, { name: 'C#', evidence: 'Portfolio' }, { name: 'XR Toolkit', evidence: 'Shipped title' }],
    shipped: 'Float Lab', shippedMeta: 'Quest · Unity XR · Gameplay developer, 2025',
    email: 'tanya.gill@tanyagill.dev', phone: '+91 89••• ••26'
  }
];

const APPLICATION_STAGES = [
  { id: 'applied', label: 'Applied', color: '#e8bc05' },
  { id: 'viewed', label: 'Viewed', color: '#7e9bd8' },
  { id: 'shortlisted', label: 'Shortlisted', color: '#9d73dd' },
  { id: 'interview', label: 'Interview', color: '#55b98a' },
  { id: 'offer', label: 'Offer', color: '#e88d3f' }
];

const INITIAL_APPLICATIONS = [
  { id: 'app-1', candidateId: 'cand-1', jobId: 'job-1', stage: 'shortlisted', score: 92, appliedDays: 3, lastActionDays: 1, reminder: false },
  { id: 'app-2', candidateId: 'cand-2', jobId: 'job-3', stage: 'interview', score: 91, appliedDays: 6, lastActionDays: 2, reminder: false },
  { id: 'app-3', candidateId: 'cand-3', jobId: 'job-2', stage: 'offer', score: 89, appliedDays: 12, lastActionDays: 1, reminder: false },
  { id: 'app-4', candidateId: 'cand-4', jobId: 'job-4', stage: 'shortlisted', score: 86, appliedDays: 5, lastActionDays: 3, reminder: false },
  { id: 'app-5', candidateId: 'cand-5', jobId: 'job-5', stage: 'viewed', score: 84, appliedDays: 8, lastActionDays: 8, reminder: false },
  { id: 'app-6', candidateId: 'cand-6', jobId: 'job-7', stage: 'viewed', score: 81, appliedDays: 9, lastActionDays: 9, reminder: false },
  { id: 'app-7', candidateId: 'cand-7', jobId: 'job-8', stage: 'applied', score: 79, appliedDays: 4, lastActionDays: 4, reminder: false },
  { id: 'app-8', candidateId: 'cand-8', jobId: 'job-9', stage: 'applied', score: 78, appliedDays: 11, lastActionDays: 11, reminder: false },
  { id: 'app-9', candidateId: 'cand-9', jobId: 'job-10', stage: 'applied', score: 76, appliedDays: 15, lastActionDays: 15, reminder: true },
  { id: 'app-10', candidateId: 'cand-10', jobId: 'job-11', stage: 'applied', score: 74, appliedDays: 6, lastActionDays: 6, reminder: false },
  { id: 'app-11', candidateId: 'cand-4', jobId: 'job-6', stage: 'auto_declined', score: 71, appliedDays: 16, lastActionDays: 16, reminder: true },
  { id: 'app-12', candidateId: 'cand-7', jobId: 'job-12', stage: 'rejected', score: 68, appliedDays: 10, lastActionDays: 2, reminder: false }
];

const INITIAL_NOTIFICATIONS = [
  { id: 'n-1', title: 'Aarav moved to Shortlisted', body: 'Senior Unity Gameplay Developer · PixelForge Studios', time: '18m', icon: 'userCheck', read: false },
  { id: 'n-2', title: '3 applicants are waiting', body: 'A response is due within 7 days on your active jobs.', time: '2h', icon: 'clock', read: false },
  { id: 'n-3', title: 'Moonlane Games was verified', body: 'GSTIN and work-domain checks were approved.', time: '5h', icon: 'badgeCheck', read: false },
  { id: 'n-4', title: 'Daily digest is ready', body: '12 new candidates match your active roles.', time: 'Yesterday', icon: 'sparkles', read: true }
];

const INITIAL_STUDIO_QUEUE = [
  { id: 'sv-1', name: 'Monsoon Arcade', initials: 'MA', meta: 'Chennai · GSTIN 33AAFCM1234M1Z5 · monsoonarcade.in', checks: ['GSTIN format', 'Domain match', 'Website live'], status: 'pending' },
  { id: 'sv-2', name: 'Orbit Fox Games', initials: 'OF', meta: 'Pune · GSTIN 27AAACO5678F1Z2 · orbitfox.games', checks: ['GSTIN format', 'Domain match', 'Website live'], status: 'pending' },
  { id: 'sv-3', name: 'Studio Kite', initials: 'SK', meta: 'Kochi · GSTIN 32AADCS9012K1Z7 · studiokite.in', checks: ['GSTIN format', 'Domain match', 'Website live'], status: 'pending' }
];

const INITIAL_JOB_QUEUE = [
  { id: 'jr-1', title: 'Senior Combat Designer', studio: 'PixelForge Studios', reason: 'First 3 jobs require admin review', checks: ['No contact details', 'Salary spread 1.4×', '3–12 skills'], status: 'pending' },
  { id: 'jr-2', title: 'Lead Engine Programmer', studio: 'Northstar Interactive', reason: 'Salary range flagged', checks: ['No contact details', 'Salary spread 2.1×', '8 skills'], status: 'pending' },
  { id: 'jr-3', title: 'Narrative Designer', studio: 'Moonlane Games', reason: 'External link found in description', checks: ['External link found', 'Salary spread 1.3×', '6 skills'], status: 'pending' }
];

const INITIAL_REPORTS = [
  { id: 'rp-1', type: 'Job', title: '“Unpaid trial project” in job description', target: 'Quantum Quest Studios · Junior Game Artist', severity: 'High', status: 'open' },
  { id: 'rp-2', type: 'Studio', title: 'Possible misrepresented shipped title', target: 'Nebula Forge Labs', severity: 'Medium', status: 'reviewing' },
  { id: 'rp-3', type: 'Candidate', title: 'Portfolio appears copied', target: 'Candidate profile #A91F', severity: 'Low', status: 'open' }
];

const INITIAL_AUDIT = [
  { time: '09:41 IST', actor: 'admin@hiregamedev.in', action: 'studio.verify', entity: 'Moonlane Games', reason: 'GSTIN portal + live website confirmed' },
  { time: '09:18 IST', actor: 'system', action: 'antighost.auto_decline', entity: 'app_9f31', reason: '14 days without human response' },
  { time: '08:55 IST', actor: 'priya@pixelforge.in', action: 'application.shortlist', entity: 'app_44b2', reason: 'Contact released at shortlist' },
  { time: '08:22 IST', actor: 'admin@hiregamedev.in', action: 'settings.update', entity: 'limits.free_active_jobs', reason: 'Changed 2 → 3 for launch cohort' },
  { time: 'Yesterday', actor: 'system', action: 'match.refresh', entity: 'job_c71d', reason: 'Skills changed · 248 candidates recomputed' }
];

const NAV_ITEMS = [
  { group: 'Product', items: [
    { id: 'overview', label: 'Overview', icon: 'grid' },
    { id: 'jobs', label: 'Discover jobs', icon: 'briefcase' },
    { id: 'candidates', label: 'Find talent', icon: 'users' },
    { id: 'applications', label: 'Applications', icon: 'route' },
    { id: 'match', label: 'Match engine', icon: 'sparkles' }
  ]},
  { group: 'Trust & operations', items: [
    { id: 'trust', label: 'Trust & anti-ghosting', icon: 'shield' },
    { id: 'admin', label: 'Admin console', icon: 'sliders' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ]}
];

const CHART_SERIES = [22, 25, 24, 30, 28, 34, 33, 41, 39, 46, 49, 47, 56, 61, 59, 68, 72, 70, 78, 84, 82, 91, 94, 103];
const RESPONSE_SERIES = [42, 44, 48, 47, 53, 55, 58, 61, 60, 64, 67, 70, 69, 72, 76, 78, 77, 81, 84, 86];

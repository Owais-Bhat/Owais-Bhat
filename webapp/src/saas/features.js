export const FEATURE_CATEGORIES = {
  core: 'Core Operations',
  academics: 'Academic Depth',
  engagement: 'Engagement',
  ai: 'AI & Automation',
  extensions: 'Institution Extensions',
  platform: 'Platform Controls',
};

export const FEATURE_CATALOG = [
  { key: 'dashboard', label: 'Dashboard', category: 'core', route: '/dashboard', status: 'live' },
  { key: 'students', label: 'Students', category: 'core', route: '/students', status: 'live' },
  { key: 'admissions', label: 'Admissions CRM', category: 'core', route: '/admissions', status: 'live' },
  { key: 'attendance', label: 'Attendance', category: 'core', route: '/attendance', status: 'live' },
  { key: 'fees', label: 'Fees & Invoices', category: 'core', route: '/fees', status: 'live' },
  { key: 'communication', label: 'Communication Center', category: 'engagement', route: '/communication', status: 'live' },
  { key: 'exams', label: 'Exams & Results', category: 'academics', route: '/exams', status: 'live' },
  { key: 'lms', label: 'Learning Management', category: 'academics', route: '/lms', status: 'live' },
  { key: 'transport', label: 'Transport', category: 'extensions', route: '/transport', status: 'live' },
  { key: 'ai_tutor', label: 'AI Tutor', category: 'ai', route: '/ai-tutor', status: 'live' },
  { key: 'career_path', label: 'Career Path AI', category: 'ai', route: '/career-path', status: 'live' },
  { key: 'performance_analysis', label: 'Performance AI', category: 'ai', route: '/performance-analysis', status: 'live' },
  { key: 'fee_recovery', label: 'Fee Recovery AI', category: 'ai', route: '/fee-recovery', status: 'live' },
  { key: 'reports_builder', label: 'Custom Reports', category: 'platform', route: null, status: 'planned' },
  { key: 'payments', label: 'Payment Gateway', category: 'platform', route: null, status: 'planned' },
  { key: 'whatsapp_sms', label: 'WhatsApp & SMS', category: 'engagement', route: null, status: 'planned' },
  { key: 'hostel', label: 'Hostel', category: 'extensions', route: null, status: 'planned' },
  { key: 'library', label: 'Library', category: 'extensions', route: null, status: 'planned' },
  { key: 'inventory', label: 'Inventory', category: 'extensions', route: null, status: 'planned' },
  { key: 'payroll', label: 'HR & Payroll', category: 'extensions', route: null, status: 'planned' },
  { key: 'video_classes', label: 'Video Classes', category: 'engagement', route: null, status: 'planned' },
  { key: 'certificates', label: 'Certificates', category: 'academics', route: null, status: 'planned' },
  { key: 'api_access', label: 'API Access', category: 'platform', route: null, status: 'planned' },
  { key: 'custom_branding', label: 'Custom Branding', category: 'platform', route: null, status: 'planned' },
];

export const PLAN_DEFINITIONS = {
  free: {
    label: 'Free',
    monthlyPrice: 0,
    features: ['dashboard', 'students', 'attendance'],
    limits: { users: 5, students: 100, aiCredits: 0 },
  },
  starter: {
    label: 'Starter',
    monthlyPrice: 1999,
    features: ['dashboard', 'students', 'admissions', 'attendance', 'fees', 'exams', 'communication'],
    limits: { users: 25, students: 500, aiCredits: 100 },
  },
  growth: {
    label: 'Growth',
    monthlyPrice: 4999,
    features: ['dashboard', 'students', 'admissions', 'attendance', 'fees', 'communication', 'exams', 'lms', 'transport', 'ai_tutor', 'performance_analysis'],
    limits: { users: 100, students: 2000, aiCredits: 1000 },
  },
  pro: {
    label: 'Pro',
    monthlyPrice: 9999,
    features: ['dashboard', 'students', 'admissions', 'attendance', 'fees', 'communication', 'exams', 'lms', 'transport', 'ai_tutor', 'career_path', 'performance_analysis', 'fee_recovery', 'whatsapp_sms', 'reports_builder', 'payments'],
    limits: { users: 300, students: 10000, aiCredits: 5000 },
  },
  enterprise: {
    label: 'Enterprise',
    monthlyPrice: null,
    features: FEATURE_CATALOG.map(feature => feature.key),
    limits: { users: 'Unlimited', students: 'Unlimited', aiCredits: 'Custom' },
  },
};

export function getPlanFeatureMap(plan = 'free', overrides = {}) {
  const base = PLAN_DEFINITIONS[plan]?.features || PLAN_DEFINITIONS.free.features;
  const map = Object.fromEntries(FEATURE_CATALOG.map(feature => [feature.key, base.includes(feature.key)]));
  return { ...map, ...(overrides || {}) };
}

export function isFeatureEnabled(institution, featureKey) {
  if (!featureKey) return true;
  const plan = institution?.subscription_plan || 'free';
  const overrides = institution?.settings?.modules || {};
  return Boolean(getPlanFeatureMap(plan, overrides)[featureKey]);
}

export function getFeatureByRoute(pathname) {
  return FEATURE_CATALOG.find(feature => feature.route && pathname.startsWith(feature.route));
}

export function getPlanLimits(plan = 'free') {
  return PLAN_DEFINITIONS[plan]?.limits || PLAN_DEFINITIONS.free.limits;
}

export function getBillingState(institution) {
  const status = institution?.subscription_status || 'trialing';
  const now = Date.now();
  const trialEndsAt = institution?.trial_ends_at ? new Date(institution.trial_ends_at).getTime() : null;
  const periodEndsAt = institution?.current_period_ends_at ? new Date(institution.current_period_ends_at).getTime() : null;

  if (institution?.settings?.suspended === true || status === 'suspended') return 'suspended';
  if (status === 'trialing' && trialEndsAt && trialEndsAt < now) return 'trial_expired';
  if (status === 'active' && periodEndsAt && periodEndsAt < now) return 'past_due';
  return status;
}

export function isBillingBlocked(institution) {
  return ['suspended', 'trial_expired', 'past_due', 'cancelled'].includes(getBillingState(institution));
}

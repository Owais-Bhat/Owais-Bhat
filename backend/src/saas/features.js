export const FEATURE_CATALOG = [
  { key: 'dashboard', label: 'Dashboard', status: 'live' },
  { key: 'students', label: 'Students', status: 'live' },
  { key: 'admissions', label: 'Admissions CRM', status: 'live' },
  { key: 'attendance', label: 'Attendance', status: 'live' },
  { key: 'fees', label: 'Fees & Invoices', status: 'live' },
  { key: 'communication', label: 'Communication Center', status: 'live' },
  { key: 'exams', label: 'Exams & Results', status: 'live' },
  { key: 'lms', label: 'Learning Management', status: 'live' },
  { key: 'transport', label: 'Transport', status: 'live' },
  { key: 'ai_tutor', label: 'AI Tutor', status: 'live' },
  { key: 'career_path', label: 'Career Path AI', status: 'live' },
  { key: 'performance_analysis', label: 'Performance AI', status: 'live' },
  { key: 'fee_recovery', label: 'Fee Recovery AI', status: 'live' },
  { key: 'reports_builder', label: 'Custom Reports', status: 'planned' },
  { key: 'payments', label: 'Payment Gateway', status: 'planned' },
  { key: 'whatsapp_sms', label: 'WhatsApp & SMS', status: 'planned' },
  { key: 'hostel', label: 'Hostel', status: 'planned' },
  { key: 'library', label: 'Library', status: 'planned' },
  { key: 'inventory', label: 'Inventory', status: 'planned' },
  { key: 'payroll', label: 'HR & Payroll', status: 'planned' },
  { key: 'video_classes', label: 'Video Classes', status: 'planned' },
  { key: 'certificates', label: 'Certificates', status: 'planned' },
  { key: 'api_access', label: 'API Access', status: 'planned' },
  { key: 'custom_branding', label: 'Custom Branding', status: 'planned' },
];

export const PLAN_DEFINITIONS = {
  free: ['dashboard', 'students', 'attendance'],
  starter: ['dashboard', 'students', 'admissions', 'attendance', 'fees', 'exams', 'communication'],
  growth: ['dashboard', 'students', 'admissions', 'attendance', 'fees', 'communication', 'exams', 'lms', 'transport', 'ai_tutor', 'performance_analysis'],
  pro: ['dashboard', 'students', 'admissions', 'attendance', 'fees', 'communication', 'exams', 'lms', 'transport', 'ai_tutor', 'career_path', 'performance_analysis', 'fee_recovery', 'whatsapp_sms', 'reports_builder', 'payments'],
  enterprise: FEATURE_CATALOG.map(feature => feature.key),
};

export function getPlanFeatureMap(plan = 'free', overrides = {}) {
  const planFeatures = PLAN_DEFINITIONS[plan] || PLAN_DEFINITIONS.free;
  const base = Object.fromEntries(FEATURE_CATALOG.map(feature => [feature.key, planFeatures.includes(feature.key)]));
  return { ...base, ...(overrides || {}) };
}

export const PLAN_LIMITS = {
  free: { users: 5, students: 100, aiCredits: 0 },
  starter: { users: 25, students: 500, aiCredits: 100 },
  growth: { users: 100, students: 2000, aiCredits: 1000 },
  pro: { users: 300, students: 10000, aiCredits: 5000 },
  enterprise: { users: null, students: null, aiCredits: null },
};

export function getPlanLimits(plan = 'free') {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.free;
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

import 'dotenv/config';
import { adminClient, authClient } from '../src/supabase.js';

const API_HEALTH_URL = process.env.API_HEALTH_URL || 'http://localhost:5000/health';
const SUPER_ADMIN_EMAIL = process.env.DEMO_SUPER_ADMIN_EMAIL || 'superadmin@cybermilo.test';
const SUPER_ADMIN_PASSWORD = process.env.DEMO_SUPER_ADMIN_PASSWORD || 'CyberMilo@123';
const SCHOOL_ADMIN_EMAIL = process.env.DEMO_SCHOOL_ADMIN_EMAIL || 'admin@greenvalley.test';
const SCHOOL_ADMIN_PASSWORD = process.env.DEMO_SCHOOL_ADMIN_PASSWORD || 'SchoolAdmin@123';
const DEMO_INSTITUTION_EMAIL = process.env.DEMO_INSTITUTION_EMAIL || 'office@greenvalley.test';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function checkBackendHealth() {
  const response = await fetch(API_HEALTH_URL);
  assert(response.ok, `Backend health failed: HTTP ${response.status}`);
  const payload = await response.json();
  assert(payload.ok === true, 'Backend health did not return ok=true');
  return payload;
}

async function signIn(email, password) {
  const { data, error } = await authClient.auth.signInWithPassword({ email, password });
  if (error) throw error;
  assert(data.user?.id, `No auth user returned for ${email}`);
  await authClient.auth.signOut();
  return data.user;
}

async function getProfile(userId) {
  const { data, error } = await adminClient
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data;
}

async function countRows(table, institutionId) {
  const { count, error } = await adminClient
    .from(table)
    .select('*', { count: 'exact', head: true })
    .eq('institution_id', institutionId);
  if (error) throw error;
  return count || 0;
}

async function main() {
  console.log('Running Phase 1 smoke check...');

  const health = await checkBackendHealth();
  console.log(`Backend health: ${health.service}`);

  const superAdminUser = await signIn(SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD);
  const schoolAdminUser = await signIn(SCHOOL_ADMIN_EMAIL, SCHOOL_ADMIN_PASSWORD);
  console.log('Demo auth logins: OK');

  const superProfile = await getProfile(superAdminUser.id);
  const schoolProfile = await getProfile(schoolAdminUser.id);
  assert(superProfile.role === 'super_admin', 'Super admin profile role is not super_admin');
  assert(schoolProfile.role === 'institution_admin', 'School admin profile role is not institution_admin');
  assert(schoolProfile.institution_id, 'School admin has no institution_id');
  console.log('Demo roles/profiles: OK');

  const { data: institution, error: institutionError } = await adminClient
    .from('institutions')
    .select('*')
    .eq('email', DEMO_INSTITUTION_EMAIL)
    .single();
  if (institutionError) throw institutionError;
  assert(institution.id === schoolProfile.institution_id, 'School admin institution does not match demo institution');
  console.log(`Demo institution: ${institution.name}`);

  const expectedMinimums = {
    students: 4,
    teachers: 3,
    classes: 3,
    attendance: 20,
    fee_payments: 4,
    exams: 2,
    admissions: 2,
    activity_log: 3,
  };

  for (const [table, minimum] of Object.entries(expectedMinimums)) {
    const count = await countRows(table, institution.id);
    assert(count >= minimum, `${table} count too low: ${count} < ${minimum}`);
    console.log(`${table}: ${count}`);
  }

  console.log('\nPhase 1 smoke check passed.');
}

main().catch((error) => {
  console.error('\nPhase 1 smoke check failed:', error.message);
  process.exit(1);
});

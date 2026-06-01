import 'dotenv/config';
import { adminClient } from '../src/supabase.js';

const DEMO = {
  superAdmin: {
    email: process.env.DEMO_SUPER_ADMIN_EMAIL || 'superadmin@cybermilo.test',
    password: process.env.DEMO_SUPER_ADMIN_PASSWORD || 'CyberMilo@123',
    firstName: 'CyberMilo',
    lastName: 'Owner',
  },
  institutionAdmin: {
    email: process.env.DEMO_SCHOOL_ADMIN_EMAIL || 'admin@greenvalley.test',
    password: process.env.DEMO_SCHOOL_ADMIN_PASSWORD || 'SchoolAdmin@123',
    firstName: 'Owais',
    lastName: 'Bhat',
  },
  institution: {
    name: 'Green Valley International School',
    type: 'School',
    address: 'Airport Road, Srinagar, Jammu and Kashmir',
    phone: '9876543210',
    email: 'office@greenvalley.test',
    subscription_plan: 'growth',
  },
};

function isoDate(daysFromToday = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().slice(0, 10);
}

async function findAuthUserByEmail(email) {
  let page = 1;
  const perPage = 100;

  while (true) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    const found = data.users.find(user => user.email?.toLowerCase() === email.toLowerCase());
    if (found) return found;
    if (data.users.length < perPage) return null;
    page += 1;
  }
}

async function createOrUpdateAuthUser({ email, password, firstName, lastName, role, institutionId = null }) {
  const existing = await findAuthUserByEmail(email);
  const payload = {
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: firstName,
      last_name: lastName,
      role,
      institution_id: institutionId,
    },
  };

  if (existing) {
    const { data, error } = await adminClient.auth.admin.updateUserById(existing.id, payload);
    if (error) throw error;
    return data.user;
  }

  const { data, error } = await adminClient.auth.admin.createUser(payload);
  if (error) throw error;
  return data.user;
}

async function upsertProfile({ userId, institutionId, role, firstName, lastName }) {
  const { data, error } = await adminClient
    .from('user_profiles')
    .upsert(
      [{
        user_id: userId,
        institution_id: institutionId,
        role,
        first_name: firstName,
        last_name: lastName,
        is_active: true,
      }],
      { onConflict: 'user_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function getOrCreateInstitution() {
  const { data: existing, error: findError } = await adminClient
    .from('institutions')
    .select('*')
    .eq('email', DEMO.institution.email)
    .maybeSingle();

  if (findError) throw findError;
  if (existing) {
    const { data, error } = await adminClient
      .from('institutions')
      .update({
        ...DEMO.institution,
        settings: {
          modules: {
            lms: true,
            transport: true,
            fees: true,
            exams: true,
            ai: true,
            communication: true,
            admissions: true,
          },
          suspended: false,
        },
      })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await adminClient
    .from('institutions')
    .insert([{
      ...DEMO.institution,
      settings: {
        modules: {
          lms: true,
          transport: true,
          fees: true,
          exams: true,
          ai: true,
          communication: true,
          admissions: true,
        },
        suspended: false,
      },
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function clearDemoTenant(institutionId) {
  const tables = [
    'activity_log',
    'admissions',
    'fee_payments',
    'attendance',
    'exam_results',
    'exams',
    'classes',
    'teachers',
    'students',
  ];

  for (const table of tables) {
    const { error } = await adminClient.from(table).delete().eq('institution_id', institutionId);
    if (error && !String(error.message).includes('column')) throw error;
  }
}

async function insertRows(table, rows) {
  const { data, error } = await adminClient.from(table).insert(rows).select();
  if (error) throw error;
  return data || [];
}

async function seed() {
  console.log('Seeding CyberMilo demo data...');

  const institution = await getOrCreateInstitution();
  await clearDemoTenant(institution.id);

  const superUser = await createOrUpdateAuthUser({
    ...DEMO.superAdmin,
    role: 'super_admin',
  });
  await upsertProfile({
    userId: superUser.id,
    institutionId: null,
    role: 'super_admin',
    firstName: DEMO.superAdmin.firstName,
    lastName: DEMO.superAdmin.lastName,
  });

  const schoolAdminUser = await createOrUpdateAuthUser({
    ...DEMO.institutionAdmin,
    role: 'institution_admin',
    institutionId: institution.id,
  });
  const schoolAdminProfile = await upsertProfile({
    userId: schoolAdminUser.id,
    institutionId: institution.id,
    role: 'institution_admin',
    firstName: DEMO.institutionAdmin.firstName,
    lastName: DEMO.institutionAdmin.lastName,
  });

  const teachers = await insertRows('teachers', [
    {
      institution_id: institution.id,
      employee_id: 'TCH-001',
      first_name: 'Ayesha',
      last_name: 'Khan',
      email: 'ayesha.khan@greenvalley.test',
      phone: '9000000001',
      subjects: ['Mathematics', 'Physics'],
      qualification: 'M.Sc Mathematics',
    },
    {
      institution_id: institution.id,
      employee_id: 'TCH-002',
      first_name: 'Rahul',
      last_name: 'Mehta',
      email: 'rahul.mehta@greenvalley.test',
      phone: '9000000002',
      subjects: ['English', 'Social Studies'],
      qualification: 'M.A English',
    },
    {
      institution_id: institution.id,
      employee_id: 'TCH-003',
      first_name: 'Zara',
      last_name: 'Mir',
      email: 'zara.mir@greenvalley.test',
      phone: '9000000003',
      subjects: ['Biology', 'Chemistry'],
      qualification: 'M.Sc Biology',
    },
  ]);

  await insertRows('classes', [
    { institution_id: institution.id, name: '8', section: 'A', teacher_id: teachers[0].id, capacity: 35 },
    { institution_id: institution.id, name: '9', section: 'B', teacher_id: teachers[1].id, capacity: 35 },
    { institution_id: institution.id, name: '10', section: 'A', teacher_id: teachers[2].id, capacity: 40 },
  ]);

  const students = await insertRows('students', [
    {
      institution_id: institution.id,
      admission_no: 'GV-2026-001',
      first_name: 'Aarav',
      last_name: 'Sharma',
      email: 'aarav.sharma@student.test',
      phone: '9111111111',
      dob: '2012-02-12',
      gender: 'Male',
      class_name: '8',
      section: 'A',
      parent_name: 'Neha Sharma',
      parent_phone: '9222222221',
      parent_email: 'neha.sharma@example.test',
      address: 'Rajbagh, Srinagar',
    },
    {
      institution_id: institution.id,
      admission_no: 'GV-2026-002',
      first_name: 'Inaya',
      last_name: 'Bashir',
      email: 'inaya.bashir@student.test',
      phone: '9111111112',
      dob: '2011-08-18',
      gender: 'Female',
      class_name: '9',
      section: 'B',
      parent_name: 'Bashir Ahmad',
      parent_phone: '9222222222',
      parent_email: 'bashir.ahmad@example.test',
      address: 'Bemina, Srinagar',
    },
    {
      institution_id: institution.id,
      admission_no: 'GV-2026-003',
      first_name: 'Kabir',
      last_name: 'Wani',
      email: 'kabir.wani@student.test',
      phone: '9111111113',
      dob: '2010-05-22',
      gender: 'Male',
      class_name: '10',
      section: 'A',
      parent_name: 'Sana Wani',
      parent_phone: '9222222223',
      parent_email: 'sana.wani@example.test',
      address: 'Hyderpora, Srinagar',
    },
    {
      institution_id: institution.id,
      admission_no: 'GV-2026-004',
      first_name: 'Meher',
      last_name: 'Kaul',
      email: 'meher.kaul@student.test',
      phone: '9111111114',
      dob: '2012-11-04',
      gender: 'Female',
      class_name: '8',
      section: 'A',
      parent_name: 'Rohit Kaul',
      parent_phone: '9222222224',
      parent_email: 'rohit.kaul@example.test',
      address: 'Lal Chowk, Srinagar',
    },
  ]);

  const attendanceRows = [];
  for (let offset = -6; offset <= 0; offset += 1) {
    students.forEach((student, index) => {
      attendanceRows.push({
        institution_id: institution.id,
        student_id: student.id,
        class_name: student.class_name,
        date: isoDate(offset),
        status: offset === -1 && index === 1 ? 'absent' : index === 2 && offset === -3 ? 'late' : 'present',
        marked_by: schoolAdminProfile.id,
      });
    });
  }
  await insertRows('attendance', attendanceRows);

  await insertRows('fee_payments', students.map((student, index) => ({
    institution_id: institution.id,
    student_id: student.id,
    fee_type: 'Tuition Fee',
    total_amount: 28000,
    paid_amount: index < 2 ? 28000 : index === 2 ? 15000 : 0,
    due_date: isoDate(12 + index),
    payment_date: index < 2 ? isoDate(-3 - index) : null,
    status: index < 2 ? 'paid' : 'pending',
    receipt_no: index < 2 ? `RCPT-2026-00${index + 1}` : null,
  })));

  await insertRows('exams', [
    {
      institution_id: institution.id,
      title: 'Mid Term Mathematics',
      subject: 'Mathematics',
      class_name: '8',
      exam_date: isoDate(10),
      total_marks: 100,
      pass_marks: 33,
      status: 'upcoming',
    },
    {
      institution_id: institution.id,
      title: 'Science Practical Assessment',
      subject: 'Science',
      class_name: '10',
      exam_date: isoDate(-2),
      total_marks: 50,
      pass_marks: 20,
      status: 'active',
    },
  ]);

  await insertRows('admissions', [
    {
      institution_id: institution.id,
      applicant_name: 'Sara Qureshi',
      email: 'sara.qureshi@example.test',
      phone: '9333333331',
      dob: '2013-09-12',
      class_applying: '7',
      parent_name: 'Imran Qureshi',
      parent_phone: '9444444441',
      address: 'Nishat, Srinagar',
      status: 'pending',
      remarks: 'Entrance interaction scheduled.',
    },
    {
      institution_id: institution.id,
      applicant_name: 'Vihaan Kapoor',
      email: 'vihaan.kapoor@example.test',
      phone: '9333333332',
      dob: '2012-01-20',
      class_applying: '8',
      parent_name: 'Ritika Kapoor',
      parent_phone: '9444444442',
      address: 'Sanat Nagar, Srinagar',
      status: 'approved',
      remarks: 'Documents verified.',
    },
  ]);

  await insertRows('activity_log', [
    {
      institution_id: institution.id,
      user_id: schoolAdminProfile.user_id,
      action: 'create_student',
      description: 'Seeded 4 demo student profiles',
      entity_type: 'students',
    },
    {
      institution_id: institution.id,
      user_id: schoolAdminProfile.user_id,
      action: 'payment',
      description: 'Two tuition fee payments marked as paid',
      entity_type: 'fee_payments',
    },
    {
      institution_id: institution.id,
      user_id: schoolAdminProfile.user_id,
      action: 'update_attendance',
      description: 'Seven days of attendance data imported',
      entity_type: 'attendance',
    },
  ]);

  console.log('\nDemo data ready.');
  console.log(`Super admin: ${DEMO.superAdmin.email} / ${DEMO.superAdmin.password}`);
  console.log(`School admin: ${DEMO.institutionAdmin.email} / ${DEMO.institutionAdmin.password}`);
  console.log(`Institution: ${institution.name}`);
}

seed().catch((error) => {
  console.error('\nSeed failed:', error.message);
  process.exit(1);
});

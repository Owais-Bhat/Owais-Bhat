export const ROLE_PERMISSIONS = {
  super_admin: [
    '/admin',
    '/dashboard',
    '/settings',
    '/profile',
    '/performance-analysis',
  ],
  institution_admin: [
    '/dashboard',
    '/students',
    '/attendance',
    '/exams',
    '/lms',
    '/admissions',
    '/transport',
    '/communication',
    '/fees',
    '/ai-tutor',
    '/career-path',
    '/performance-analysis',
    '/fee-recovery',
    '/settings',
    '/profile',
  ],
  principal: [
    '/dashboard',
    '/students',
    '/attendance',
    '/exams',
    '/lms',
    '/admissions',
    '/transport',
    '/communication',
    '/fees',
    '/ai-tutor',
    '/career-path',
    '/performance-analysis',
    '/fee-recovery',
    '/settings',
    '/profile',
  ],
  teacher: [
    '/dashboard',
    '/students',
    '/attendance',
    '/exams',
    '/lms',
    '/communication',
    '/ai-tutor',
    '/performance-analysis',
    '/profile',
  ],
  student: [
    '/dashboard',
    '/attendance',
    '/exams',
    '/lms',
    '/communication',
    '/ai-tutor',
    '/career-path',
    '/profile',
  ],
  parent: [
    '/dashboard',
    '/attendance',
    '/exams',
    '/communication',
    '/fees',
    '/performance-analysis',
    '/profile',
  ],
  staff: [
    '/dashboard',
    '/students',
    '/admissions',
    '/transport',
    '/communication',
    '/fees',
    '/profile',
  ],
};

export function getRolePermissions(role = 'student') {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.student;
}

export function canAccessPath(role, pathname) {
  const permissions = getRolePermissions(role);
  return permissions.some(path => pathname === path || pathname.startsWith(`${path}/`));
}

export function canManageTenantUsers(role) {
  return ['super_admin', 'institution_admin', 'principal'].includes(role);
}

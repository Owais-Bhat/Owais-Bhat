import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import supabase from '../lib/supabase';
import { AuthContext } from './AuthContext';

export const AppDataContext = createContext();

export function AppDataProvider({ children }) {
  const { profile } = useContext(AuthContext);

  // ── Core entity state ──────────────────────────────────────
  const [institution, setInstitution]   = useState(null);
  const [students, setStudents]         = useState([]);
  const [teachers, setTeachers]         = useState([]);
  const [classes, setClasses]           = useState([]);

  // ── Extended entity state ──────────────────────────────────
  const [fees, setFees]                 = useState([]);
  const [exams, setExams]               = useState([]);
  const [admissions, setAdmissions]     = useState([]);
  const [attendance, setAttendance]     = useState([]);
  const [dashboardData, setDashboardData] = useState(null);

  // ── UI state ───────────────────────────────────────────────
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState(null);

  // ============================================================
  // Auto-load core data whenever the profile's institution changes
  // ============================================================
  useEffect(() => {
    const institutionId = profile?.institution_id;
    if (!institutionId) return;

    const bootstrap = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          _loadInstitution(institutionId),
          _loadStudents(institutionId),
          _loadTeachers(institutionId),
          _loadClasses(institutionId),
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.institution_id]);

  // ============================================================
  // Private loaders (used inside the provider only)
  // ============================================================

  const _loadInstitution = async (institutionId) => {
    const { data, error: err } = await supabase
      .from('institutions')
      .select('*')
      .eq('id', institutionId)
      .single();
    if (err) throw err;
    setInstitution(data);
  };

  const _loadStudents = async (institutionId) => {
    const { data, error: err } = await supabase
      .from('students')
      .select('*')
      .eq('institution_id', institutionId)
      .order('created_at', { ascending: false });
    if (err) throw err;
    setStudents(data || []);
  };

  const _loadTeachers = async (institutionId) => {
    const { data, error: err } = await supabase
      .from('teachers')
      .select('*')
      .eq('institution_id', institutionId)
      .order('created_at', { ascending: false });
    if (err) throw err;
    setTeachers(data || []);
  };

  const _loadClasses = async (institutionId) => {
    const { data, error: err } = await supabase
      .from('classes')
      .select('*')
      .eq('institution_id', institutionId)
      .order('name');
    if (err) throw err;
    setClasses(data || []);
  };

  // ============================================================
  // Public loaders (callable by consumers)
  // ============================================================

  const loadInstitution = useCallback(async () => {
    const institutionId = profile?.institution_id;
    if (!institutionId) return;
    try {
      setIsLoading(true);
      await _loadInstitution(institutionId);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [profile?.institution_id]);

  const loadStudents = useCallback(async () => {
    const institutionId = profile?.institution_id;
    if (!institutionId) return;
    try {
      setIsLoading(true);
      await _loadStudents(institutionId);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [profile?.institution_id]);

  const loadTeachers = useCallback(async () => {
    const institutionId = profile?.institution_id;
    if (!institutionId) return;
    try {
      setIsLoading(true);
      await _loadTeachers(institutionId);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [profile?.institution_id]);

  const loadClasses = useCallback(async () => {
    const institutionId = profile?.institution_id;
    if (!institutionId) return;
    try {
      setIsLoading(true);
      await _loadClasses(institutionId);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [profile?.institution_id]);

  // ── Dashboard ──────────────────────────────────────────────

  const loadDashboard = useCallback(async () => {
    const institutionId = profile?.institution_id;
    if (!institutionId) return;
    try {
      setIsLoading(true);

      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      const [studentsRes, attendanceRes, feesRes, examsRes] = await Promise.all([
        supabase
          .from('students')
          .select('id, status')
          .eq('institution_id', institutionId),
        supabase
          .from('attendance')
          .select('status')
          .eq('institution_id', institutionId)
          .eq('date', today),
        supabase
          .from('fee_payments')
          .select('paid_amount, total_amount, status')
          .eq('institution_id', institutionId),
        supabase
          .from('exams')
          .select('id')
          .eq('institution_id', institutionId)
          .eq('status', 'active'),
      ]);

      const totalStudents   = studentsRes.data?.length ?? 0;
      const presentToday    = attendanceRes.data?.filter(a => a.status === 'present').length ?? 0;
      const totalAttendance = attendanceRes.data?.length ?? 0;

      const totalFeesCollected = (feesRes.data ?? []).reduce(
        (sum, f) => sum + (Number(f.paid_amount) || 0),
        0
      );
      const totalFeesDue = (feesRes.data ?? [])
        .filter(f => f.status === 'pending')
        .reduce((sum, f) => sum + (Number(f.total_amount) - Number(f.paid_amount || 0)), 0);

      setDashboardData({
        totalStudents,
        presentToday,
        attendancePercentage: totalAttendance > 0
          ? Math.round((presentToday / totalAttendance) * 100)
          : 0,
        totalFeesCollected,
        totalFeesDue,
        activeExams: examsRes.data?.length ?? 0,
        todayDate: today,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [profile?.institution_id]);

  // ── Attendance ─────────────────────────────────────────────

  const loadAttendance = useCallback(async (date) => {
    const institutionId = profile?.institution_id;
    if (!institutionId || !date) return;
    try {
      setIsLoading(true);
      const { data, error: err } = await supabase
        .from('attendance')
        .select('*, students(first_name, last_name, admission_no)')
        .eq('institution_id', institutionId)
        .eq('date', date);
      if (err) throw err;
      setAttendance(data || []);
      return data || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [profile?.institution_id]);

  const markAttendance = useCallback(async (records) => {
    // records: Array<{ institution_id, student_id, class_name, date, status, marked_by }>
    try {
      setIsLoading(true);
      const { data, error: err } = await supabase
        .from('attendance')
        .upsert(records, { onConflict: 'institution_id,student_id,date' })
        .select();
      if (err) throw err;
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Students CRUD ──────────────────────────────────────────

  const addStudent = useCallback(async (studentData) => {
    try {
      setIsLoading(true);
      const payload = { ...studentData, institution_id: profile?.institution_id };
      const { data, error: err } = await supabase
        .from('students')
        .insert([payload])
        .select()
        .single();
      if (err) throw err;
      setStudents(prev => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [profile?.institution_id]);

  const updateStudent = useCallback(async (id, updates) => {
    try {
      setIsLoading(true);
      const { data, error: err } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (err) throw err;
      setStudents(prev => prev.map(s => s.id === id ? data : s));
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteStudent = useCallback(async (id) => {
    try {
      setIsLoading(true);
      const { error: err } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      if (err) throw err;
      setStudents(prev => prev.filter(s => s.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Teachers CRUD ──────────────────────────────────────────

  const addTeacher = useCallback(async (teacherData) => {
    try {
      setIsLoading(true);
      const payload = { ...teacherData, institution_id: profile?.institution_id };
      const { data, error: err } = await supabase
        .from('teachers')
        .insert([payload])
        .select()
        .single();
      if (err) throw err;
      setTeachers(prev => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [profile?.institution_id]);

  const deleteTeacher = useCallback(async (id) => {
    try {
      setIsLoading(true);
      const { error: err } = await supabase
        .from('teachers')
        .delete()
        .eq('id', id);
      if (err) throw err;
      setTeachers(prev => prev.filter(t => t.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Fees ───────────────────────────────────────────────────

  const loadFees = useCallback(async () => {
    const institutionId = profile?.institution_id;
    if (!institutionId) return;
    try {
      setIsLoading(true);
      const { data, error: err } = await supabase
        .from('fee_payments')
        .select('*, students(first_name, last_name, admission_no)')
        .eq('institution_id', institutionId)
        .order('created_at', { ascending: false });
      if (err) throw err;
      setFees(data || []);
      return data || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [profile?.institution_id]);

  const addFeePayment = useCallback(async (feeData) => {
    try {
      setIsLoading(true);
      const payload = { ...feeData, institution_id: profile?.institution_id };
      const { data, error: err } = await supabase
        .from('fee_payments')
        .insert([payload])
        .select('*, students(first_name, last_name, admission_no)')
        .single();
      if (err) throw err;
      setFees(prev => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [profile?.institution_id]);

  const updateFeePayment = useCallback(async (id, updates) => {
    try {
      setIsLoading(true);
      const { data, error: err } = await supabase
        .from('fee_payments')
        .update(updates)
        .eq('id', id)
        .select('*, students(first_name, last_name, admission_no)')
        .single();
      if (err) throw err;
      setFees(prev => prev.map(f => f.id === id ? data : f));
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Exams ──────────────────────────────────────────────────

  const loadExams = useCallback(async () => {
    const institutionId = profile?.institution_id;
    if (!institutionId) return;
    try {
      setIsLoading(true);
      const { data, error: err } = await supabase
        .from('exams')
        .select('*')
        .eq('institution_id', institutionId)
        .order('exam_date', { ascending: false });
      if (err) throw err;
      setExams(data || []);
      return data || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [profile?.institution_id]);

  const addExam = useCallback(async (examData) => {
    try {
      setIsLoading(true);
      const payload = { ...examData, institution_id: profile?.institution_id };
      const { data, error: err } = await supabase
        .from('exams')
        .insert([payload])
        .select()
        .single();
      if (err) throw err;
      setExams(prev => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [profile?.institution_id]);

  const updateExam = useCallback(async (id, updates) => {
    try {
      setIsLoading(true);
      const { data, error: err } = await supabase
        .from('exams')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (err) throw err;
      setExams(prev => prev.map(e => e.id === id ? data : e));
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Admissions ─────────────────────────────────────────────

  const loadAdmissions = useCallback(async () => {
    const institutionId = profile?.institution_id;
    if (!institutionId) return;
    try {
      setIsLoading(true);
      const { data, error: err } = await supabase
        .from('admissions')
        .select('*')
        .eq('institution_id', institutionId)
        .order('applied_at', { ascending: false });
      if (err) throw err;
      setAdmissions(data || []);
      return data || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [profile?.institution_id]);

  const addAdmission = useCallback(async (admissionData) => {
    try {
      setIsLoading(true);
      const payload = { ...admissionData, institution_id: profile?.institution_id };
      const { data, error: err } = await supabase
        .from('admissions')
        .insert([payload])
        .select()
        .single();
      if (err) throw err;
      setAdmissions(prev => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [profile?.institution_id]);

  const updateAdmission = useCallback(async (id, updates) => {
    try {
      setIsLoading(true);
      const { data, error: err } = await supabase
        .from('admissions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (err) throw err;
      setAdmissions(prev => prev.map(a => a.id === id ? data : a));
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Activity Log ───────────────────────────────────────────

  const logActivity = useCallback(async (action, description, entity_type = null, entity_id = null) => {
    const institutionId = profile?.institution_id;
    if (!institutionId) return;
    try {
      await supabase.from('activity_log').insert([{
        institution_id: institutionId,
        user_id: profile?.user_id,
        action,
        description,
        entity_type,
        entity_id,
      }]);
    } catch (err) {
      // Activity logging is non-critical — swallow the error silently
      console.warn('logActivity failed:', err.message);
    }
  }, [profile?.institution_id, profile?.user_id]);

  // ── Context value ──────────────────────────────────────────

  const value = {
    // State
    institution,
    students,
    teachers,
    classes,
    fees,
    exams,
    admissions,
    attendance,
    dashboardData,
    isLoading,
    error,

    // Loaders
    loadInstitution,
    loadStudents,
    loadTeachers,
    loadClasses,
    loadDashboard,
    loadAttendance,
    loadFees,
    loadExams,
    loadAdmissions,

    // Student CRUD
    addStudent,
    updateStudent,
    deleteStudent,

    // Teacher CRUD
    addTeacher,
    deleteTeacher,

    // Attendance
    markAttendance,

    // Fee CRUD
    addFeePayment,
    updateFeePayment,

    // Exam CRUD
    addExam,
    updateExam,

    // Admission CRUD
    addAdmission,
    updateAdmission,

    // Activity log
    logActivity,

    // Legacy setters (kept for backward compatibility)
    setStudents,
    setTeachers,
    setClasses,
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}

import { createContext, useState, useCallback } from 'react';
import supabase from '../lib/supabase';

export const AppDataContext = createContext();

export function AppDataProvider({ children }) {
  const [institution, setInstitution] = useState(null);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch institution data
  const loadInstitution = useCallback(async (institutionId) => {
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('institutions')
        .select('*')
        .eq('id', institutionId)
        .single();

      if (fetchError) throw fetchError;
      setInstitution(data);
      localStorage.setItem('institution', JSON.stringify(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch students
  const loadStudents = useCallback(async (institutionId) => {
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('students')
        .select('*')
        .eq('institution_id', institutionId);

      if (fetchError) throw fetchError;
      setStudents(data || []);
      localStorage.setItem('students', JSON.stringify(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch teachers
  const loadTeachers = useCallback(async (institutionId) => {
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('teachers')
        .select('*')
        .eq('institution_id', institutionId);

      if (fetchError) throw fetchError;
      setTeachers(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch classes
  const loadClasses = useCallback(async (institutionId) => {
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('classes')
        .select('*')
        .eq('institution_id', institutionId);

      if (fetchError) throw fetchError;
      setClasses(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load dashboard data
  const loadDashboard = useCallback(async (institutionId) => {
    try {
      setIsLoading(true);

      // Fetch all necessary data in parallel
      const [studentsData, attendanceData, feesData, examsData] = await Promise.all([
        supabase.from('students').select('id, status').eq('institution_id', institutionId),
        supabase.from('attendance').select('*').eq('institution_id', institutionId).gte('created_at', new Date(Date.now() - 86400000).toISOString()),
        supabase.from('fee_payments').select('*').eq('institution_id', institutionId).gte('created_at', new Date(Date.now() - 86400000).toISOString()),
        supabase.from('exams').select('*').eq('institution_id', institutionId).eq('status', 'active'),
      ]);

      const totalStudents = studentsData.data?.length || 0;
      const presentStudents = attendanceData.data?.filter(a => a.status === 'present').length || 0;
      const totalFeesCollected = feesData.data?.reduce((sum, f) => sum + (f.amount || 0), 0) || 0;
      const activeExams = examsData.data?.length || 0;

      setDashboardData({
        totalStudents,
        presentStudents,
        attendancePercentage: totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0,
        totalFeesCollected,
        activeExams,
        todayDate: new Date().toLocaleDateString(),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add student
  const addStudent = useCallback(async (studentData) => {
    try {
      setIsLoading(true);
      const { data, error: insertError } = await supabase
        .from('students')
        .insert([studentData])
        .select();

      if (insertError) throw insertError;
      setStudents([...students, data[0]]);
      return { success: true, data: data[0] };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [students]);

  // Update student
  const updateStudent = useCallback(async (studentId, updates) => {
    try {
      setIsLoading(true);
      const { data, error: updateError } = await supabase
        .from('students')
        .update(updates)
        .eq('id', studentId)
        .select();

      if (updateError) throw updateError;
      setStudents(students.map(s => s.id === studentId ? data[0] : s));
      return { success: true, data: data[0] };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [students]);

  const value = {
    institution,
    students,
    teachers,
    classes,
    dashboardData,
    isLoading,
    error,
    loadInstitution,
    loadStudents,
    loadTeachers,
    loadClasses,
    loadDashboard,
    addStudent,
    updateStudent,
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

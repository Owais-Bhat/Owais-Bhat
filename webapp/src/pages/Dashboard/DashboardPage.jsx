import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  MdPeople,
  MdSchool,
  MdAttachMoney,
  MdEventNote,
  MdRefresh,
  MdPersonAdd,
  MdChecklist,
  MdSummarize,
  MdMessage,
  MdCheckCircle,
  MdRadioButtonUnchecked,
} from 'react-icons/md';

import { useAppData } from '../../hooks/useAppData';
import { useAuth } from '../../hooks/useAuth';
import useCountUp from '../../hooks/useCountUp';
import supabase from '../../lib/supabase';
import MainLayout from '../../components/Layout/MainLayout';
import GlassCard from '../../components/Common/GlassCard';
import Button from '../../components/Common/Button';

// ── Skeleton card shown while loading ─────────────────────────
function SkeletonCard() {
  return (
    <GlassCard className="p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="h-3 bg-white/10 rounded w-24" />
          <div className="h-8 bg-white/10 rounded w-16" />
          <div className="h-2 bg-white/10 rounded w-20" />
        </div>
        <div className="w-12 h-12 bg-white/10 rounded-lg" />
      </div>
    </GlassCard>
  );
}

// ── Individual stat card ───────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  format = (v) => Math.round(v).toLocaleString('en-IN'),
  subtitle,
  accent = '#0E7C7B',
  color,
}) {
  const animated = useCountUp(value);
  return (
    <GlassCard
      className="p-6 border-l-4 hover:-translate-y-1 cursor-default"
      style={{ borderLeftColor: accent }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm font-semibold mb-2">{label}</p>
          <p className="text-3xl font-extrabold text-slate-950 tabular-nums">{format(animated)}</p>
          {subtitle && (
            <p className="text-xs mt-2 text-slate-500">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </GlassCard>
  );
}

// ── Custom recharts tooltip ────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/90 border border-white/10 rounded-lg px-3 py-2 text-xs text-white shadow-lg">
      <p className="text-white/60 mb-1">{label}</p>
      <p>
        <span className="text-cyan-400 font-semibold">{payload[0].value}</span>
        <span className="text-white/40 ml-1">present</span>
      </p>
    </div>
  );
}

// ── Activity type → colour dot ─────────────────────────────────
const ACTION_COLORS = {
  create: 'bg-emerald-400',
  update: 'bg-blue-400',
  delete: 'bg-red-400',
  login:  'bg-purple-400',
  payment:'bg-yellow-400',
};

function activityDotColor(action = '') {
  const lower = action.toLowerCase();
  for (const [key, cls] of Object.entries(ACTION_COLORS)) {
    if (lower.includes(key)) return cls;
  }
  return 'bg-white/40';
}

function formatTimeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate();
  const { dashboardData, loadDashboard, loadInstitution, institution, isLoading } = useAppData();
  const { profile } = useAuth();

  const [activityLog, setActivityLog]       = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [chartData, setChartData]           = useState([]);
  const [chartLoading, setChartLoading]     = useState(true);
  const [refreshing, setRefreshing]         = useState(false);
  const [checklistDismissed, setChecklistDismissed] = useState(false);
  const [hasAnnouncement, setHasAnnouncement] = useState(false);

  // ── Load dashboard stats ─────────────────────────────────
  useEffect(() => {
    loadDashboard();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Load recent activity log (direct Supabase call) ──────
  const fetchActivityLog = useCallback(async () => {
    if (!profile?.institution_id) return;
    setActivityLoading(true);
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .eq('institution_id', profile.institution_id)
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      setActivityLog(data || []);

      const { count, error: announcementError } = await supabase
        .from('announcements')
        .select('id', { count: 'exact', head: true })
        .eq('institution_id', profile.institution_id);
      if (announcementError) throw announcementError;
      setHasAnnouncement((count || 0) > 0);
    } catch (err) {
      console.error('activity_log fetch error:', err.message);
    } finally {
      setActivityLoading(false);
    }
  }, [profile?.institution_id]);

  // ── Load last-7-days attendance trend ────────────────────
  const fetchAttendanceTrend = useCallback(async () => {
    if (!profile?.institution_id) return;
    setChartLoading(true);
    try {
      // Build last 7 dates (most recent last, for natural x-axis order)
      const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
      });

      const sevenDaysAgo = dates[0];

      const { data, error } = await supabase
        .from('attendance')
        .select('date, status')
        .eq('institution_id', profile.institution_id)
        .eq('status', 'present')
        .gte('date', sevenDaysAgo);

      if (error) throw error;

      // Count present records per date
      const countByDate = (data || []).reduce((acc, row) => {
        acc[row.date] = (acc[row.date] || 0) + 1;
        return acc;
      }, {});

      const formatted = dates.map(date => ({
        date: date.slice(5), // MM-DD for display
        present: countByDate[date] || 0,
      }));

      setChartData(formatted);
    } catch (err) {
      console.error('attendance trend fetch error:', err.message);
    } finally {
      setChartLoading(false);
    }
  }, [profile?.institution_id]);

  useEffect(() => {
    fetchActivityLog();
    fetchAttendanceTrend();
  }, [fetchActivityLog, fetchAttendanceTrend]);

  // ── Refresh everything ───────────────────────────────────
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      loadDashboard(),
      fetchActivityLog(),
      fetchAttendanceTrend(),
    ]);
    setRefreshing(false);
  };

  // ── Quick-actions config ─────────────────────────────────
  const canManageOnboarding = ['institution_admin', 'principal'].includes(profile?.role);
  const onboardingDismissed = Boolean(institution?.settings?.onboarding?.checklist_dismissed_at) || checklistDismissed;
  const onboardingTasks = [
    {
      key: 'institution',
      label: 'Confirm institution profile',
      description: 'Add contact email and phone in settings.',
      done: Boolean(institution?.email && institution?.phone),
      path: '/settings',
    },
    {
      key: 'students',
      label: 'Add first students',
      description: 'Create student records for the tenant.',
      done: (dashboardData?.totalStudents || 0) > 0,
      path: '/students',
    },
    {
      key: 'attendance',
      label: 'Mark first attendance',
      description: 'Start daily attendance tracking.',
      done: (dashboardData?.presentToday || 0) > 0,
      path: '/attendance',
    },
    {
      key: 'fees',
      label: 'Record first payment',
      description: 'Validate fee collection workflow.',
      done: (dashboardData?.totalFeesCollected || 0) > 0,
      path: '/fees',
    },
    {
      key: 'communication',
      label: 'Send first announcement',
      description: 'Test communication with the school community.',
      done: hasAnnouncement,
      path: '/communication',
    },
  ];
  const completedOnboardingTasks = onboardingTasks.filter(task => task.done).length;
  const showOnboardingChecklist = canManageOnboarding && !onboardingDismissed && completedOnboardingTasks < onboardingTasks.length;

  const dismissOnboardingChecklist = async () => {
    if (!profile?.institution_id || !institution) return;
    setChecklistDismissed(true);
    const nextSettings = {
      ...(institution.settings || {}),
      onboarding: {
        ...(institution.settings?.onboarding || {}),
        checklist_dismissed_at: new Date().toISOString(),
      },
    };
    const { error } = await supabase
      .from('institutions')
      .update({ settings: nextSettings })
      .eq('id', profile.institution_id);
    if (!error) loadInstitution();
  };

  const quickActions = [
    {
      label: 'Add Student',
      icon: MdPersonAdd,
      path: '/students',
    },
    {
      label: 'View Attendance',
      icon: MdChecklist,
      path: '/attendance',
    },
    {
      label: 'Generate Report',
      icon: MdSummarize,
      path: '/performance-analysis',
    },
    {
      label: 'Message Parents',
      icon: MdMessage,
      path: '/communication',
    },
  ];

  const statsLoading = isLoading && !dashboardData;

  return (
    <MainLayout>
      <div className="p-5 sm:p-6 lg:p-8 space-y-6">

        {/* ── Header ──────────────────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[#0E7C7B] text-xs font-extrabold uppercase tracking-[0.18em] mb-2">
              Command Center
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-950 mb-2">
              {(() => {
                const hour = new Date().getHours();
                const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
                return `${greeting}, ${profile?.first_name || 'User'}!`;
              })()}
            </h1>
            <p className="text-slate-500 text-sm">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            loading={refreshing}
            className="flex items-center gap-2"
          >
            <MdRefresh className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* ── Stats Grid ──────────────────────────────────── */}
        {showOnboardingChecklist && (
          <GlassCard className="p-6 border border-[#0E7C7B]/20 bg-[#EEF7F6]/70">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-5">
              <div>
                <p className="text-[#0E7C7B] text-xs font-extrabold uppercase tracking-[0.18em] mb-2">
                  First Login Setup
                </p>
                <h2 className="text-xl font-bold text-slate-950 mb-1">Launch checklist</h2>
                <p className="text-sm text-slate-500 mb-0">
                  {completedOnboardingTasks} of {onboardingTasks.length} setup tasks completed.
                </p>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={dismissOnboardingChecklist}>
                Dismiss
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
              {onboardingTasks.map(task => {
                const Icon = task.done ? MdCheckCircle : MdRadioButtonUnchecked;
                return (
                  <button
                    key={task.key}
                    type="button"
                    onClick={() => navigate(task.path)}
                    className={`text-left rounded-xl border p-4 transition-all ${
                      task.done
                        ? 'border-emerald-200 bg-white/80'
                        : 'border-slate-200 bg-white hover:border-[#0E7C7B]/30'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-3 ${task.done ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <p className="font-bold text-slate-950 text-sm mb-1">{task.label}</p>
                    <p className="text-xs text-slate-500 mb-0">{task.description}</p>
                  </button>
                );
              })}
            </div>
          </GlassCard>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <StatCard
                icon={MdPeople}
                label="Total Students"
                value={dashboardData?.totalStudents ?? 0}
                subtitle="enrolled"
                accent="#4059AD"
                color="bg-[#EEF4FF] text-[#4059AD]"
              />
              <StatCard
                icon={MdSchool}
                label="Attendance Today"
                value={dashboardData?.attendancePercentage ?? 0}
                format={(v) => `${Math.round(v)}%`}
                subtitle={`${dashboardData?.presentToday ?? 0} present`}
                accent="#16845D"
                color="bg-emerald-50 text-emerald-700"
              />
              <StatCard
                icon={MdAttachMoney}
                label="Fees Collected"
                value={dashboardData?.totalFeesCollected ?? 0}
                format={(v) => `Rs ${Math.round(v).toLocaleString('en-IN')}`}
                subtitle={`Rs ${(dashboardData?.totalFeesDue ?? 0).toLocaleString('en-IN')} pending`}
                accent="#E0644A"
                color="bg-orange-50 text-[#E0644A]"
              />
              <StatCard
                icon={MdEventNote}
                label="Active Exams"
                value={dashboardData?.activeExams ?? 0}
                subtitle="currently running"
                accent="#6F5BD7"
                color="bg-violet-50 text-[#6F5BD7]"
              />
            </>
          )}
        </div>

        {/* ── Main content row ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Attendance trend chart (2/3 width) ────────── */}
          <GlassCard className="lg:col-span-2 p-6">
            <h2 className="text-xl font-bold text-slate-950 mb-4">
              Attendance — Last 7 Days
            </h2>
            {chartLoading ? (
              <div className="h-48 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-teal-700/20 border-t-teal-700 rounded-full animate-spin" />
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
                No attendance data available yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={chartData}
                  margin={{ top: 4, right: 0, left: -20, bottom: 0 }}
                >
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#6B7280', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#6B7280', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                  <Bar
                    dataKey="present"
                    fill="#0E7C7B"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </GlassCard>

          {/* ── Quick Actions (1/3 width) ─────────────────── */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-slate-950 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map(({ label, icon: Icon, path }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border border-slate-200
                             hover:bg-[#EEF7F6] hover:border-[#0E7C7B]/30 transition-all
                             text-slate-500 hover:text-[#0E7C7B] text-xs font-semibold"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-center leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* ── Recent Activity ──────────────────────────────── */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-slate-950 mb-4">Recent Activity</h2>

          {activityLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-white/10 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 bg-white/10 rounded w-3/4" />
                    <div className="h-2 bg-white/10 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : activityLog.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-4">
              No activity recorded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {activityLog.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-4 pb-3 border-b border-white/5 last:border-0"
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${activityDotColor(entry.action)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-sm truncate">
                      {entry.description || entry.action}
                    </p>
                    {entry.entity_type && (
                      <p className="text-white/30 text-xs capitalize">{entry.entity_type}</p>
                    )}
                  </div>
                  <span className="text-white/30 text-xs whitespace-nowrap flex-shrink-0">
                    {formatTimeAgo(entry.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

      </div>
    </MainLayout>
  );
}

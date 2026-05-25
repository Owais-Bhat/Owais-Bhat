import { useEffect, useState } from 'react';
import { useAppData } from '../../hooks/useAppData';
import { useAuth } from '../../hooks/useAuth';
import MainLayout from '../../components/Layout/MainLayout';
import GlassCard from '../../components/Common/GlassCard';
import { MdTrendingUp, MdPeople, MdSchool, MdAttachMoney } from 'react-icons/md';

export default function DashboardPage() {
  const { dashboard, loadDashboard } = useAppData();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await loadDashboard();
      setLoading(false);
    };

    fetchData();
  }, []);

  const StatCard = ({ icon: Icon, label, value, trend, color }) => (
    <GlassCard className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/60 text-sm mb-2">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </GlassCard>
  );

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {profile?.first_name || 'User'}!
          </h1>
          <p className="text-white/60">Here's what's happening at your institution today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={MdPeople}
            label="Total Students"
            value={dashboard?.studentCount || 0}
            trend={5}
            color="bg-blue-500/20 text-blue-400"
          />
          <StatCard
            icon={MdSchool}
            label="Classes"
            value={dashboard?.classCount || 0}
            trend={2}
            color="bg-purple-500/20 text-purple-400"
          />
          <StatCard
            icon={MdAttachMoney}
            label="Pending Fees"
            value={`₹${(dashboard?.pendingFees || 0).toLocaleString()}`}
            trend={-3}
            color="bg-orange-500/20 text-orange-400"
          />
          <StatCard
            icon={MdTrendingUp}
            label="Avg Attendance"
            value={`${dashboard?.avgAttendance || 0}%`}
            trend={1}
            color="bg-emerald-500/20 text-emerald-400"
          />
        </div>

        {/* Quick Actions */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Add Student', action: () => {} },
              { label: 'View Attendance', action: () => {} },
              { label: 'Generate Report', action: () => {} },
              { label: 'Message Parents', action: () => {} },
            ].map((action, idx) => (
              <button
                key={idx}
                onClick={action.action}
                className="p-4 rounded-lg border border-white/10 hover:bg-white/5 hover:border-neon-cyan/30 transition-all text-white/70 hover:text-neon-cyan text-sm font-medium"
              >
                {action.label}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { title: 'New student enrollment', time: '2 hours ago', type: 'info' },
              { title: 'Fee payment received', time: '4 hours ago', type: 'success' },
              { title: 'Exam marks uploaded', time: 'Yesterday', type: 'success' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center gap-4 pb-3 border-b border-white/5 last:border-0">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-emerald-400' : 'bg-blue-400'
                }`}></div>
                <div className="flex-1">
                  <p className="text-white/80 text-sm">{activity.title}</p>
                  <p className="text-white/40 text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  );
}

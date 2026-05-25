import { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import GlassCard from '../../components/Common/GlassCard';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import { useNotification } from '../../hooks/useNotification';
import { MdCheckCircle, MdCancel } from 'react-icons/md';

export default function AttendancePage() {
  const notification = useNotification();
  const [attendance, setAttendance] = useState([
    { id: 1, studentName: 'Rahul Kumar', class: '10A', present: 45, absent: 5, percentage: 90 },
    { id: 2, studentName: 'Priya Singh', class: '10B', present: 48, absent: 2, percentage: 96 },
    { id: 3, studentName: 'Amit Patel', class: '10A', present: 42, absent: 8, percentage: 84 },
  ]);

  const handleMarkAttendance = () => {
    notification.success('Attendance marked successfully');
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Attendance Management</h1>
          <Button variant="primary" onClick={handleMarkAttendance}>Mark Today's Attendance</Button>
        </div>

        {/* Filters */}
        <GlassCard className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Select Class" placeholder="Choose class" />
            <Input label="From Date" type="date" />
            <Input label="To Date" type="date" />
          </div>
        </GlassCard>

        {/* Attendance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6">
            <p className="text-white/60 text-sm mb-2">Total Present</p>
            <p className="text-3xl font-bold text-emerald-400">
              {attendance.reduce((sum, a) => sum + a.present, 0)}
            </p>
          </GlassCard>
          <GlassCard className="p-6">
            <p className="text-white/60 text-sm mb-2">Total Absent</p>
            <p className="text-3xl font-bold text-red-400">
              {attendance.reduce((sum, a) => sum + a.absent, 0)}
            </p>
          </GlassCard>
          <GlassCard className="p-6">
            <p className="text-white/60 text-sm mb-2">Average Attendance</p>
            <p className="text-3xl font-bold text-blue-400">
              {(attendance.reduce((sum, a) => sum + a.percentage, 0) / attendance.length).toFixed(1)}%
            </p>
          </GlassCard>
        </div>

        {/* Attendance Table */}
        <GlassCard className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/60">Student Name</th>
                  <th className="text-left py-3 px-4 text-white/60">Class</th>
                  <th className="text-center py-3 px-4 text-white/60">Present</th>
                  <th className="text-center py-3 px-4 text-white/60">Absent</th>
                  <th className="text-center py-3 px-4 text-white/60">Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map(att => (
                  <tr key={att.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3 px-4 text-white">{att.studentName}</td>
                    <td className="py-3 px-4 text-white/80">{att.class}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-emerald-400 flex items-center justify-center gap-1">
                        <MdCheckCircle /> {att.present}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-red-400 flex items-center justify-center gap-1">
                        <MdCancel /> {att.absent}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-white font-medium">{att.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  );
}

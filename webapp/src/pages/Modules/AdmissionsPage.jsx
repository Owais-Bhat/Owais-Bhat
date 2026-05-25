import { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import GlassCard from '../../components/Common/GlassCard';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import { useNotification } from '../../hooks/useNotification';
import { MdAdd, MdCheckCircle, MdEmail } from 'react-icons/md';

export default function AdmissionsPage() {
  const notification = useNotification();
  const [applications] = useState([
    { id: 1, name: 'Rohan Verma', class: '9th', appliedDate: '2024-06-15', status: 'pending', documents: true, email: 'rohan@email.com' },
    { id: 2, name: 'Isha Gupta', class: '10th', appliedDate: '2024-06-20', status: 'approved', documents: true, email: 'isha@email.com' },
    { id: 3, name: 'Nikhil Reddy', class: '8th', appliedDate: '2024-06-25', status: 'under_review', documents: false, email: 'nikhil@email.com' },
    { id: 4, name: 'Ananya Mishra', class: '11th', appliedDate: '2024-06-10', status: 'rejected', documents: true, email: 'ananya@email.com' },
  ]);

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    underReview: applications.filter(a => a.status === 'under_review').length,
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Admissions Management</h1>
          <Button variant="primary">
            <MdAdd className="mr-2 inline" /> View All Applications
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <GlassCard className="p-6">
            <p className="text-white/60 text-sm mb-2">Total Applications</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </GlassCard>
          <GlassCard className="p-6">
            <p className="text-white/60 text-sm mb-2">Pending Review</p>
            <p className="text-3xl font-bold text-amber-400">{stats.pending}</p>
          </GlassCard>
          <GlassCard className="p-6">
            <p className="text-white/60 text-sm mb-2">Approved</p>
            <p className="text-3xl font-bold text-emerald-400">{stats.approved}</p>
          </GlassCard>
          <GlassCard className="p-6">
            <p className="text-white/60 text-sm mb-2">Under Review</p>
            <p className="text-3xl font-bold text-blue-400">{stats.underReview}</p>
          </GlassCard>
        </div>

        {/* Applications Table */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Applications</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/60">Applicant Name</th>
                  <th className="text-left py-3 px-4 text-white/60">Class Applying</th>
                  <th className="text-left py-3 px-4 text-white/60">Applied Date</th>
                  <th className="text-left py-3 px-4 text-white/60">Documents</th>
                  <th className="text-left py-3 px-4 text-white/60">Status</th>
                  <th className="text-center py-3 px-4 text-white/60">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3 px-4 text-white">{app.name}</td>
                    <td className="py-3 px-4 text-white/80">{app.class}</td>
                    <td className="py-3 px-4 text-white/80">{new Date(app.appliedDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      {app.documents ? (
                        <span className="text-emerald-400 flex items-center gap-1"><MdCheckCircle /> Complete</span>
                      ) : (
                        <span className="text-amber-400">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4"><Badge status={app.status} /></td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-blue-400 hover:text-blue-300">
                        <MdEmail className="w-5 h-5 inline" />
                      </button>
                    </td>
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

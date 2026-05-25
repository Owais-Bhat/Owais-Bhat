import { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import GlassCard from '../../components/Common/GlassCard';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import { useNotification } from '../../hooks/useNotification';
import { MdAdd, MdDownload, MdCheckCircle } from 'react-icons/md';

export default function FeesPage() {
  const notification = useNotification();
  const [fees] = useState([
    { id: 1, studentName: 'Rahul Kumar', admissionNo: 'ADM001', feeType: 'Tuition', amount: 50000, dueDate: '2024-06-30', status: 'pending', paid: 0 },
    { id: 2, studentName: 'Priya Singh', admissionNo: 'ADM002', feeType: 'Tuition', amount: 50000, dueDate: '2024-06-30', status: 'paid', paid: 50000 },
    { id: 3, studentName: 'Amit Patel', admissionNo: 'ADM003', feeType: 'Transport', amount: 12000, dueDate: '2024-06-30', status: 'partial', paid: 6000 },
  ]);

  const totalPending = fees.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);
  const totalCollected = fees.reduce((sum, f) => sum + f.paid, 0);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Fees Management</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => notification.success('Report generated')}>
              <MdDownload className="mr-2 inline" /> Generate Report
            </Button>
            <Button variant="primary">
              <MdAdd className="mr-2 inline" /> Add Fee
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6">
            <p className="text-white/60 text-sm mb-2">Total Fees</p>
            <p className="text-3xl font-bold text-white">₹{fees.reduce((sum, f) => sum + f.amount, 0).toLocaleString()}</p>
          </GlassCard>
          <GlassCard className="p-6">
            <p className="text-white/60 text-sm mb-2">Collected</p>
            <p className="text-3xl font-bold text-emerald-400">₹{totalCollected.toLocaleString()}</p>
          </GlassCard>
          <GlassCard className="p-6">
            <p className="text-white/60 text-sm mb-2">Pending</p>
            <p className="text-3xl font-bold text-orange-400">₹{totalPending.toLocaleString()}</p>
          </GlassCard>
        </div>

        {/* Fees Table */}
        <GlassCard className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/60">Student Name</th>
                  <th className="text-left py-3 px-4 text-white/60">Admission #</th>
                  <th className="text-left py-3 px-4 text-white/60">Fee Type</th>
                  <th className="text-right py-3 px-4 text-white/60">Amount</th>
                  <th className="text-right py-3 px-4 text-white/60">Collected</th>
                  <th className="text-left py-3 px-4 text-white/60">Due Date</th>
                  <th className="text-left py-3 px-4 text-white/60">Status</th>
                </tr>
              </thead>
              <tbody>
                {fees.map(fee => (
                  <tr key={fee.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3 px-4 text-white">{fee.studentName}</td>
                    <td className="py-3 px-4 text-white/80">{fee.admissionNo}</td>
                    <td className="py-3 px-4 text-white/80">{fee.feeType}</td>
                    <td className="py-3 px-4 text-right text-white">₹{fee.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-emerald-400">₹{fee.paid.toLocaleString()}</td>
                    <td className="py-3 px-4 text-white/80">{new Date(fee.dueDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <Badge status={fee.status} />
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

import { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import GlassCard from '../../components/Common/GlassCard';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import { useNotification } from '../../hooks/useNotification';
import { MdAdd, MdDirectionsBus, MdPerson } from 'react-icons/md';

export default function TransportPage() {
  const notification = useNotification();
  const [routes] = useState([
    { id: 1, name: 'Route A - North', number: 'RT-A1', vehicle: 'KA-01-AB-1234', driver: 'Mr. Singh', capacity: 45, enrolled: 38, status: 'active' },
    { id: 2, name: 'Route B - South', number: 'RT-B1', vehicle: 'KA-02-CD-5678', driver: 'Mr. Sharma', capacity: 40, enrolled: 35, status: 'active' },
    { id: 3, name: 'Route C - East', number: 'RT-C1', vehicle: 'KA-03-EF-9012', driver: 'Mr. Kumar', capacity: 40, enrolled: 28, status: 'active' },
  ]);

  const [students] = useState([
    { id: 1, name: 'Rahul Kumar', route: 'Route A - North', admission: 'ADM001', status: 'active' },
    { id: 2, name: 'Priya Singh', route: 'Route B - South', admission: 'ADM002', status: 'active' },
    { id: 3, name: 'Amit Patel', route: 'Route C - East', admission: 'ADM003', status: 'suspended' },
  ]);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Transport Management</h1>
          <Button variant="primary">
            <MdAdd className="mr-2 inline" /> Create Route
          </Button>
        </div>

        {/* Routes */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <MdDirectionsBus /> Routes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map(route => (
              <GlassCard key={route.id} className="p-6">
                <h3 className="text-lg font-bold text-white mb-3">{route.name}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Route #</span>
                    <span className="text-white">{route.number}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Vehicle</span>
                    <span className="text-white">{route.vehicle}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Driver</span>
                    <span className="text-white">{route.driver}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Capacity</span>
                    <span className="text-white">{route.enrolled}/{route.capacity}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">Occupancy</span>
                    <span className="text-neon-cyan">{((route.enrolled / route.capacity) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-blue to-neon-cyan"
                      style={{width: `${(route.enrolled / route.capacity) * 100}%`}}
                    ></div>
                  </div>
                </div>

                <Badge status={route.status} />
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Students Enrolled */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <MdPerson /> Students Enrolled
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/60">Student Name</th>
                  <th className="text-left py-3 px-4 text-white/60">Route</th>
                  <th className="text-left py-3 px-4 text-white/60">Admission #</th>
                  <th className="text-left py-3 px-4 text-white/60">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3 px-4 text-white">{student.name}</td>
                    <td className="py-3 px-4 text-white/80">{student.route}</td>
                    <td className="py-3 px-4 text-white/80">{student.admission}</td>
                    <td className="py-3 px-4"><Badge status={student.status} /></td>
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

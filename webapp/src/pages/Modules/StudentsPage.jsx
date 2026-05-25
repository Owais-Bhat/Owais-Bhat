import { useState, useEffect } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import GlassCard from '../../components/Common/GlassCard';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import { useNotification } from '../../hooks/useNotification';
import { MdAdd, MdEdit, MdDelete, MdSearch } from 'react-icons/md';

export default function StudentsPage() {
  const notification = useNotification();
  const [students, setStudents] = useState([
    { id: 1, name: 'Rahul Kumar', email: 'rahul@school.com', class: '10A', admission: 'ADM001', status: 'active' },
    { id: 2, name: 'Priya Singh', email: 'priya@school.com', class: '10B', admission: 'ADM002', status: 'active' },
    { id: 3, name: 'Amit Patel', email: 'amit@school.com', class: '10A', admission: 'ADM003', status: 'active' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', class: '', admission: '' });

  const handleAddStudent = () => {
    if (formData.name && formData.email) {
      setStudents([...students, { id: Date.now(), ...formData, status: 'active' }]);
      notification.success('Student added successfully');
      setFormData({ name: '', email: '', class: '', admission: '' });
      setShowForm(false);
    }
  };

  const handleDelete = (id) => {
    setStudents(students.filter(s => s.id !== id));
    notification.success('Student deleted');
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admission.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Students Management</h1>
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            <MdAdd className="mr-2 inline" /> Add Student
          </Button>
        </div>

        {showForm && (
          <GlassCard className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Student name"
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Email"
              />
              <Input
                label="Class"
                value={formData.class}
                onChange={(e) => setFormData({...formData, class: e.target.value})}
                placeholder="Class"
              />
              <Input
                label="Admission Number"
                value={formData.admission}
                onChange={(e) => setFormData({...formData, admission: e.target.value})}
                placeholder="ADM001"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="primary" onClick={handleAddStudent}>Save</Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </GlassCard>
        )}

        <GlassCard className="p-6">
          <div className="mb-4 relative">
            <MdSearch className="absolute left-3 top-3 w-5 h-5 text-white/40" />
            <Input
              placeholder="Search by name or admission number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/60">Name</th>
                  <th className="text-left py-3 px-4 text-white/60">Admission #</th>
                  <th className="text-left py-3 px-4 text-white/60">Class</th>
                  <th className="text-left py-3 px-4 text-white/60">Email</th>
                  <th className="text-left py-3 px-4 text-white/60">Status</th>
                  <th className="text-center py-3 px-4 text-white/60">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(student => (
                  <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3 px-4 text-white">{student.name}</td>
                    <td className="py-3 px-4 text-white/80">{student.admission}</td>
                    <td className="py-3 px-4 text-white/80">{student.class}</td>
                    <td className="py-3 px-4 text-white/80">{student.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs">
                        {student.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-blue-400 hover:text-blue-300 mr-2"><MdEdit className="w-5 h-5" /></button>
                      <button onClick={() => handleDelete(student.id)} className="text-red-400 hover:text-red-300"><MdDelete className="w-5 h-5" /></button>
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

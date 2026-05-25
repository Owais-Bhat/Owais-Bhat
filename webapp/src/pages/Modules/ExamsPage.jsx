import { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import GlassCard from '../../components/Common/GlassCard';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import { useNotification } from '../../hooks/useNotification';
import { MdAdd, MdFileDownload } from 'react-icons/md';

export default function ExamsPage() {
  const notification = useNotification();
  const [exams] = useState([
    { id: 1, name: 'Unit Test 1', type: 'Unit Test', startDate: '2024-07-01', endDate: '2024-07-05', status: 'completed', totalStudents: 45 },
    { id: 2, name: 'Midterm Exam', type: 'Midterm', startDate: '2024-07-15', endDate: '2024-07-20', status: 'ongoing', totalStudents: 45 },
    { id: 3, name: 'Final Exam', type: 'Final', startDate: '2024-08-01', endDate: '2024-08-15', status: 'scheduled', totalStudents: 45 },
  ]);

  const [results] = useState([
    { id: 1, studentName: 'Rahul Kumar', exam: 'Unit Test 1', subject: 'Math', marks: 85, total: 100, grade: 'A', status: 'published' },
    { id: 2, studentName: 'Priya Singh', exam: 'Unit Test 1', subject: 'English', marks: 92, total: 100, grade: 'A+', status: 'published' },
    { id: 3, studentName: 'Amit Patel', exam: 'Unit Test 1', subject: 'Science', marks: 78, total: 100, grade: 'B+', status: 'published' },
  ]);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Exams & Results</h1>
          <Button variant="primary">
            <MdAdd className="mr-2 inline" /> Create Exam
          </Button>
        </div>

        {/* Exams Tab */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Exams</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/60">Exam Name</th>
                  <th className="text-left py-3 px-4 text-white/60">Type</th>
                  <th className="text-left py-3 px-4 text-white/60">Start Date</th>
                  <th className="text-left py-3 px-4 text-white/60">End Date</th>
                  <th className="text-center py-3 px-4 text-white/60">Students</th>
                  <th className="text-left py-3 px-4 text-white/60">Status</th>
                </tr>
              </thead>
              <tbody>
                {exams.map(exam => (
                  <tr key={exam.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3 px-4 text-white">{exam.name}</td>
                    <td className="py-3 px-4 text-white/80">{exam.type}</td>
                    <td className="py-3 px-4 text-white/80">{new Date(exam.startDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-white/80">{new Date(exam.endDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-center text-white">{exam.totalStudents}</td>
                    <td className="py-3 px-4"><Badge status={exam.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Results Tab */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Results</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/60">Student Name</th>
                  <th className="text-left py-3 px-4 text-white/60">Exam</th>
                  <th className="text-left py-3 px-4 text-white/60">Subject</th>
                  <th className="text-center py-3 px-4 text-white/60">Marks</th>
                  <th className="text-left py-3 px-4 text-white/60">Grade</th>
                  <th className="text-left py-3 px-4 text-white/60">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map(result => (
                  <tr key={result.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3 px-4 text-white">{result.studentName}</td>
                    <td className="py-3 px-4 text-white/80">{result.exam}</td>
                    <td className="py-3 px-4 text-white/80">{result.subject}</td>
                    <td className="py-3 px-4 text-center text-white">{result.marks}/{result.total}</td>
                    <td className="py-3 px-4 text-white font-bold">{result.grade}</td>
                    <td className="py-3 px-4"><Badge status={result.status} /></td>
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

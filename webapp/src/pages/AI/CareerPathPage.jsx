import { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import GlassCard from '../../components/Common/GlassCard';
import Button from '../../components/Common/Button';
import { useNotification } from '../../hooks/useNotification';
import { MdTrendingUp, MdAutoAwesome } from 'react-icons/md';

export default function CareerPathPage() {
  const notification = useNotification();
  const [selectedStudent, setSelectedStudent] = useState('rahul');
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const students = [
    { id: 'rahul', name: 'Rahul Kumar', class: '10A', scores: { math: 85, science: 90, english: 78 } },
    { id: 'priya', name: 'Priya Singh', class: '10B', scores: { math: 92, science: 88, english: 95 } },
  ];

  const handleGenerateRecommendation = async () => {
    setLoading(true);
    // Simulate AI analysis
    setTimeout(() => {
      setRecommendations({
        studentName: students.find(s => s.id === selectedStudent)?.name,
        topPaths: [
          {
            path: 'Engineering',
            probability: 92,
            reason: 'Strong performance in Math and Science'
          },
          {
            path: 'Medical',
            probability: 85,
            reason: 'Excellent Science scores with consistent performance'
          },
          {
            path: 'Commerce',
            probability: 78,
            reason: 'Good analytical skills and communication'
          },
        ],
        suggestions: [
          'Focus on competitive exam preparation',
          'Take up additional Science practicals',
          'Improve English for competitive exams'
        ]
      });
      setLoading(false);
      notification.success('Career path analysis completed!');
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <MdTrendingUp className="w-8 h-8 text-neon-cyan" />
          <h1 className="text-3xl font-bold text-white">AI Career Path Recommendation</h1>
        </div>

        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Select Student</h2>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="input-glass w-full md:w-64"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} - {s.class}
              </option>
            ))}
          </select>
        </GlassCard>

        {/* Student Info */}
        {selectedStudent && (
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">Student Performance</h2>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(students.find(s => s.id === selectedStudent)?.scores || {}).map(([subject, score]) => (
                <div key={subject} className="p-4 bg-white/5 rounded-lg">
                  <p className="text-white/60 text-sm capitalize">{subject}</p>
                  <p className="text-2xl font-bold text-neon-cyan">{score}</p>
                  <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-blue to-neon-cyan"
                      style={{width: `${score}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        <div className="flex justify-center">
          <Button
            variant="primary"
            loading={loading}
            onClick={handleGenerateRecommendation}
            className="flex items-center gap-2"
          >
            <MdAutoAwesome /> Generate AI Recommendation
          </Button>
        </div>

        {/* Recommendations */}
        {recommendations && (
          <>
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Career Path Recommendations for {recommendations.studentName}</h2>
              <div className="space-y-4">
                {recommendations.topPaths.map((path, idx) => (
                  <div key={idx} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-white font-bold text-lg">{path.path}</h3>
                      <span className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan rounded-full text-sm font-bold">
                        {path.probability}%
                      </span>
                    </div>
                    <p className="text-white/60">{path.reason}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Personalized Suggestions</h2>
              <ul className="space-y-3">
                {recommendations.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-neon-cyan mt-1">✓</span>
                    <span className="text-white/80">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </>
        )}
      </div>
    </MainLayout>
  );
}

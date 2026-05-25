import { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import GlassCard from '../../components/Common/GlassCard';
import Button from '../../components/Common/Button';
import { useNotification } from '../../hooks/useNotification';
import { MdAnalytics, MdAutoAwesome } from 'react-icons/md';

export default function PerformanceAnalysisPage() {
  const notification = useNotification();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setTimeout(() => {
      setAnalysis({
        studentName: 'Rahul Kumar',
        overallPerformance: 85,
        trends: [
          { subject: 'Math', trend: 'improving', change: '+5%' },
          { subject: 'Science', trend: 'stable', change: '0%' },
          { subject: 'English', trend: 'declining', change: '-3%' },
        ],
        strengths: ['Strong logical thinking', 'Quick problem solver', 'Good lab skills'],
        weaknesses: ['Grammar needs work', 'Slow in reading comprehension', 'Needs more practice'],
        predictions: 'Expected final score: 88% (Class position: Top 5)',
        interventions: [
          'Extra English classes recommended',
          'Focus on reading comprehension',
          'Continue current Math strategy'
        ]
      });
      setLoading(false);
      notification.success('Performance analysis completed!');
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <MdAnalytics className="w-8 h-8 text-neon-cyan" />
          <h1 className="text-3xl font-bold text-white">AI Performance Analysis</h1>
        </div>

        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Select Student</h2>
          <select className="input-glass w-full md:w-64">
            <option>Rahul Kumar - Class 10A</option>
            <option>Priya Singh - Class 10B</option>
            <option>Amit Patel - Class 10A</option>
          </select>
        </GlassCard>

        <div className="flex justify-center">
          <Button
            variant="primary"
            loading={loading}
            onClick={handleAnalyze}
            className="flex items-center gap-2"
          >
            <MdAutoAwesome /> Analyze Performance
          </Button>
        </div>

        {analysis && (
          <>
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">{analysis.studentName} - Overall Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-white/60 text-sm mb-2">Overall Performance</p>
                  <p className="text-4xl font-bold text-neon-cyan">{analysis.overallPerformance}%</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-white/60 text-sm mb-2">Prediction</p>
                  <p className="text-white text-sm">{analysis.predictions}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-white/60 text-sm mb-2">Status</p>
                  <p className="text-emerald-400 font-bold">On Track</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Subject Trends</h2>
              <div className="space-y-4">
                {analysis.trends.map((t, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{t.subject}</p>
                      <p className={`text-sm ${
                        t.trend === 'improving' ? 'text-emerald-400' :
                        t.trend === 'declining' ? 'text-red-400' :
                        'text-amber-400'
                      }`}>
                        {t.trend.charAt(0).toUpperCase() + t.trend.slice(1)} {t.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Strengths</h2>
                <ul className="space-y-2">
                  {analysis.strengths.map((s, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-white/80">
                      <span className="text-emerald-400">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Areas for Improvement</h2>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((w, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-white/80">
                      <span className="text-orange-400">!</span> {w}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>

            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recommended Interventions</h2>
              <ul className="space-y-3">
                {analysis.interventions.map((inter, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                    <span className="text-neon-cyan text-lg">→</span>
                    <span className="text-white">{inter}</span>
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

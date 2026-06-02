import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAppData } from '../../hooks/useAppData';
import GlassCard from './GlassCard';

export default function FeatureGate({ feature, children }) {
  const { profile } = useAuth();
  const { institution, hasFeature } = useAppData();

  if (profile?.role === 'super_admin') {
    return children;
  }

  if (!feature || hasFeature(feature)) {
    return children;
  }

  if (!institution) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F7F8FB] flex items-center justify-center p-6">
      <GlassCard className="max-w-lg p-8 text-center">
        <p className="text-[#0E7C7B] text-xs font-extrabold uppercase tracking-[0.18em] mb-3">
          Feature Locked
        </p>
        <h1 className="text-2xl font-bold text-slate-950 mb-3">This module is not enabled</h1>
        <p className="text-slate-500 mb-0">
          Ask your institution admin or CyberMilo Super Admin to enable this feature for your plan.
        </p>
      </GlassCard>
    </div>
  );
}

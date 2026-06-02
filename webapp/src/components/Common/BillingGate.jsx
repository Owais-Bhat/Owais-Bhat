import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAppData } from '../../hooks/useAppData';
import { getBillingState, isBillingBlocked } from '../../saas/features';
import GlassCard from './GlassCard';

export default function BillingGate({ children }) {
  const { profile } = useAuth();
  const { institution } = useAppData();

  if (profile?.role === 'super_admin') {
    return children;
  }

  if (!institution) {
    return children;
  }

  if (!isBillingBlocked(institution)) {
    return children;
  }

  const state = getBillingState(institution);

  return (
    <div className="min-h-screen bg-[#F7F8FB] flex items-center justify-center p-6">
      <GlassCard className="max-w-xl p-8 text-center">
        <p className="text-[#E0644A] text-xs font-extrabold uppercase tracking-[0.18em] mb-3">
          Account Access Paused
        </p>
        <h1 className="text-2xl font-bold text-slate-950 mb-3">
          Subscription status: {state.replace('_', ' ')}
        </h1>
        <p className="text-slate-500 mb-6">
          Your institution account needs Super Admin attention before modules can be used again.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-[#0E7C7B] px-5 py-3 text-sm font-bold text-white"
        >
          Refresh Status
        </button>
      </GlassCard>
    </div>
  );
}

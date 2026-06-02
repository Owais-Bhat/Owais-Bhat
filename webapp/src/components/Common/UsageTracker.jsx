import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getFeatureByRoute } from '../../saas/features';
import { trackFeatureUsage } from '../../lib/usageApi';

export default function UsageTracker() {
  const location = useLocation();
  const { profile } = useAuth();

  useEffect(() => {
    if (!profile?.institution_id || profile.role === 'super_admin') return;

    const feature = getFeatureByRoute(location.pathname);
    if (!feature) return;

    trackFeatureUsage(feature.key, 'view', {
      path: location.pathname,
      role: profile.role,
    });
  }, [location.pathname, profile?.institution_id, profile?.role]);

  return null;
}

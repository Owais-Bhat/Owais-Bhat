import { getStatusBadge } from '../../utils/helpers';

export default function Badge({ status, children, className = '' }) {
  const badge = getStatusBadge(status);
  return (
    <span className={`badge ${badge.color} ${className}`}>
      {children || badge.label}
    </span>
  );
}

export default function GlassCard({ children, className = '', light = false, ...props }) {
  const baseClass = light ? 'glass-card-light' : 'glass-card';
  return (
    <div className={`${baseClass} ${className}`} {...props}>
      {children}
    </div>
  );
}

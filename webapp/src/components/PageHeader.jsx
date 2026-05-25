export default function PageHeader({ title, subtitle }) {
  return (
    <header className="page-header">
      <h2>{title}</h2>
      {subtitle ? <p className="sub">{subtitle}</p> : null}
    </header>
  );
}

import PageHeader from "../components/PageHeader";
import { moduleCatalog } from "../lib/modules";

export default function ModulesPage() {
  return (
    <section>
      <PageHeader title="All Modules" subtitle="Complete product scope mapped and scaffold-ready." />
      <div className="list">
        {moduleCatalog.map((moduleName, idx) => (
          <div className="list-row" key={moduleName.slug}>
            <strong>{String(idx + 1).padStart(2, "0")}</strong>
            <span>{moduleName.name}</span>
            <span>{moduleName.status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

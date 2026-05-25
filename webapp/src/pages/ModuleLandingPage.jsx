import { useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { moduleCatalog } from "../lib/modules";

export default function ModuleLandingPage() {
  const { slug } = useParams();
  const moduleItem = moduleCatalog.find((item) => item.slug === slug);

  if (!moduleItem) {
    return <section><PageHeader title="Module Not Found" subtitle="This module route does not exist." /></section>;
  }

  return (
    <section>
      <PageHeader title={moduleItem.name} subtitle="Scaffolded for full implementation with Supabase backend." />
      <article className="form-card">
        <h3>Build Status: {moduleItem.status}</h3>
        <p>Core UI shell is ready. Next: add forms, filters, tables, and Supabase CRUD with tenant security.</p>
      </article>
    </section>
  );
}

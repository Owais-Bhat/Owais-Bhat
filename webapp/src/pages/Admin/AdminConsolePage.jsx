import { useEffect, useState } from 'react';
import {
  MdBusiness,
  MdCheckCircle,
  MdCreditCard,
  MdPeople,
  MdWarning,
} from 'react-icons/md';
import MainLayout from '../../components/Layout/MainLayout';
import GlassCard from '../../components/Common/GlassCard';
import Badge from '../../components/Common/Badge';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import { createAdminInstitution, fetchAdminInstitutions } from '../../lib/adminApi';

function Metric({ icon: Icon, label, value, tone = 'teal' }) {
  const tones = {
    teal: 'bg-[#EEF7F6] text-[#0E7C7B]',
    indigo: 'bg-[#EEF4FF] text-[#4059AD]',
    amber: 'bg-amber-50 text-amber-700',
    coral: 'bg-orange-50 text-[#E0644A]',
  };

  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500 mb-2">{label}</p>
          <p className="text-3xl font-extrabold text-slate-950 mb-0">{value}</p>
        </div>
        <div className={`rounded-lg p-3 ${tones[tone]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </GlassCard>
  );
}

export default function AdminConsolePage() {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    type: 'School',
    email: '',
    phone: '',
    subscription_plan: 'free',
    adminEmail: '',
    adminPassword: '',
    adminFirstName: '',
    adminLastName: '',
  });

  const loadInstitutions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminInstitutions();
      setInstitutions(data.institutions || []);
    } catch (err) {
      setError(err.message || 'Unable to load admin console');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstitutions();
  }, []);

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateInstitution = async (event) => {
    event.preventDefault();
    setCreating(true);
    setError('');
    try {
      await createAdminInstitution(form);
      setForm({
        name: '',
        type: 'School',
        email: '',
        phone: '',
        subscription_plan: 'free',
        adminEmail: '',
        adminPassword: '',
        adminFirstName: '',
        adminLastName: '',
      });
      await loadInstitutions();
    } catch (err) {
      setError(err.message || 'Unable to create institution');
    } finally {
      setCreating(false);
    }
  };

  const activeUsers = institutions.reduce((sum, institution) => sum + (institution.user_count || 0), 0);
  const freePlanCount = institutions.filter(inst => (inst.subscription_plan || 'free') === 'free').length;

  return (
    <MainLayout>
      <div className="p-5 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[#0E7C7B] text-xs font-extrabold uppercase tracking-[0.18em] mb-2">
              SaaS Control
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-950 mb-2">Admin Console</h1>
            <p className="text-slate-500 max-w-2xl">
              Manage school accounts, subscription readiness, and tenant health from one place.
            </p>
          </div>
          <Badge status="active">Super Admin</Badge>
        </div>

        {error && (
          <GlassCard className="p-4 border border-amber-300 bg-amber-50">
            <div className="flex items-start gap-3 text-amber-800">
              <MdWarning className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="text-sm mb-0">
                {error}
              </p>
            </div>
          </GlassCard>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <Metric icon={MdBusiness} label="Institutions" value={institutions.length} tone="teal" />
          <Metric icon={MdPeople} label="Active Users" value={activeUsers} tone="indigo" />
          <Metric icon={MdCreditCard} label="Free Plans" value={freePlanCount} tone="amber" />
          <Metric icon={MdCheckCircle} label="Paid Plans" value={Math.max(0, institutions.length - freePlanCount)} tone="coral" />
        </div>

        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-slate-950 mb-1">Create Institution Account</h2>
          <p className="text-sm text-slate-500 mb-5">
            Creates a tenant and the first institution admin through the secure backend API.
          </p>
          <form onSubmit={handleCreateInstitution} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input label="Institution Name" required value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="Green Valley School" />
              <Input label="Type" value={form.type} onChange={e => updateForm('type', e.target.value)} placeholder="School" />
              <Input label="Institution Email" required type="email" value={form.email} onChange={e => updateForm('email', e.target.value)} placeholder="school@example.com" />
              <Input label="Phone" value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="9999999999" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input label="Admin First Name" required value={form.adminFirstName} onChange={e => updateForm('adminFirstName', e.target.value)} />
              <Input label="Admin Last Name" value={form.adminLastName} onChange={e => updateForm('adminLastName', e.target.value)} />
              <Input label="Admin Email" required type="email" value={form.adminEmail} onChange={e => updateForm('adminEmail', e.target.value)} />
              <Input label="Temporary Password" required type="password" value={form.adminPassword} onChange={e => updateForm('adminPassword', e.target.value)} />
            </div>
            <div className="flex justify-end">
              <Button type="submit" loading={creating}>Create Account</Button>
            </div>
          </form>
        </GlassCard>

        <GlassCard className="p-0 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-950 mb-1">Institution Accounts</h2>
            <p className="text-sm text-slate-500 mb-0">Tenant-level overview for SaaS operations.</p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-500">Loading accounts...</div>
          ) : institutions.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-slate-950 font-semibold mb-1">No institutions visible yet</p>
              <p className="text-slate-500 text-sm mb-0">
                Register a school account or connect a backend admin endpoint with service-role access.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-3 text-slate-500 font-bold">Institution</th>
                    <th className="text-left px-5 py-3 text-slate-500 font-bold">Type</th>
                    <th className="text-left px-5 py-3 text-slate-500 font-bold">Plan</th>
                    <th className="text-left px-5 py-3 text-slate-500 font-bold">Users</th>
                    <th className="text-left px-5 py-3 text-slate-500 font-bold">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {institutions.map(inst => (
                    <tr key={inst.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-950 mb-0">{inst.name}</p>
                        <p className="text-xs text-slate-500 mb-0">{inst.email || 'No email'}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{inst.type || 'School'}</td>
                      <td className="px-5 py-4">
                        <Badge status={(inst.subscription_plan || 'free') === 'free' ? 'pending' : 'success'}>
                          {inst.subscription_plan || 'free'}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{inst.user_count || 0}</td>
                      <td className="px-5 py-4 text-slate-500">
                        {inst.created_at ? new Date(inst.created_at).toLocaleDateString('en-IN') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </div>
    </MainLayout>
  );
}

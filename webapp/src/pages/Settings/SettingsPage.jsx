import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import MainLayout from '../../components/Layout/MainLayout';
import GlassCard from '../../components/Common/GlassCard';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import supabase from '../../lib/supabase';
import { MdBusiness, MdPeople, MdSettings, MdAdd, MdDelete, MdEmail } from 'react-icons/md';

const TABS = [
  { key: 'institution', label: 'Institution', icon: MdBusiness },
  { key: 'users', label: 'Users & Roles', icon: MdPeople },
  { key: 'modules', label: 'Modules', icon: MdSettings },
];

const MODULES = [
  { key: 'lms', label: 'Learning Management (LMS)', description: 'Courses, lessons, content delivery' },
  { key: 'transport', label: 'Transport Management', description: 'Bus routes, driver tracking' },
  { key: 'fees', label: 'Fee Management', description: 'Fee collection, payments, receipts' },
  { key: 'exams', label: 'Exams & Results', description: 'Exam scheduling, result entry' },
  { key: 'ai', label: 'AI Features', description: 'AI tutor, career path, performance analysis' },
  { key: 'communication', label: 'Communication', description: 'Announcements, messaging' },
  { key: 'admissions', label: 'Admissions CRM', description: 'Application tracking, enrollment' },
];

export default function SettingsPage() {
  const { profile, user } = useAuth();
  const notification = useNotification();
  const [activeTab, setActiveTab] = useState('institution');
  const [saving, setSaving] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [institution, setInstitution] = useState({ name: '', type: '', address: '', phone: '', email: '' });
  const [users, setUsers] = useState([]);
  const [modules, setModules] = useState({});

  const [inviteForm, setInviteForm] = useState({ email: '', role: 'teacher', firstName: '', lastName: '' });
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    if (profile?.institution_id) {
      loadInstitution();
      if (activeTab === 'users') loadUsers();
    }
  }, [profile?.institution_id, activeTab]);

  const loadInstitution = async () => {
    const { data, error } = await supabase
      .from('institutions')
      .select('*')
      .eq('id', profile.institution_id)
      .single();
    if (data) {
      setInstitution({ name: data.name || '', type: data.type || '', address: data.address || '', phone: data.phone || '', email: data.email || '' });
      setModules(data.settings?.modules || {});
    }
    if (error) notification.error('Failed to load institution settings');
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('institution_id', profile.institution_id)
      .order('created_at', { ascending: false });
    if (data) setUsers(data);
    if (error) notification.error('Failed to load users');
    setLoadingUsers(false);
  };

  const saveInstitution = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('institutions')
      .update({ name: institution.name, type: institution.type, address: institution.address, phone: institution.phone, email: institution.email })
      .eq('id', profile.institution_id);
    setSaving(false);
    if (error) notification.error('Failed to save: ' + error.message);
    else notification.success('Institution settings saved');
  };

  const saveModules = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('institutions')
      .update({ settings: { modules } })
      .eq('id', profile.institution_id);
    setSaving(false);
    if (error) notification.error('Failed to save modules');
    else notification.success('Module settings saved');
  };

  const inviteUser = async () => {
    if (!inviteForm.email || !inviteForm.firstName) {
      notification.error('Email and first name are required');
      return;
    }
    setInviting(true);
    try {
      const { data: authData, error: authErr } = await supabase.auth.admin.inviteUserByEmail(inviteForm.email, {
        data: { first_name: inviteForm.firstName, last_name: inviteForm.lastName, role: inviteForm.role },
      });
      if (authErr) throw authErr;

      await supabase.from('user_profiles').insert([{
        user_id: authData.user.id,
        institution_id: profile.institution_id,
        role: inviteForm.role,
        first_name: inviteForm.firstName,
        last_name: inviteForm.lastName,
      }]);

      notification.success(`Invitation sent to ${inviteForm.email}`);
      setInviteForm({ email: '', role: 'teacher', firstName: '', lastName: '' });
      loadUsers();
    } catch (err) {
      notification.error('Invite failed: ' + err.message);
    } finally {
      setInviting(false);
    }
  };

  const deactivateUser = async (userId) => {
    const { error } = await supabase.from('user_profiles').update({ is_active: false }).eq('id', userId);
    if (error) notification.error('Failed to deactivate user');
    else { notification.success('User deactivated'); loadUsers(); }
  };

  const toggleModule = (key) => {
    setModules(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const ROLE_OPTIONS = ['institution_admin', 'principal', 'teacher', 'student', 'parent', 'staff'];

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-white">Settings</h1>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/10 pb-0">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all ${
                activeTab === tab.key
                  ? 'bg-white/10 text-neon-cyan border-b-2 border-neon-cyan'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Institution Settings */}
        {activeTab === 'institution' && (
          <GlassCard className="p-6 space-y-5">
            <h2 className="text-lg font-bold text-white">Institution Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Institution Name" value={institution.name} onChange={e => setInstitution(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Green Valley School" />
              <div>
                <label className="block text-white/60 text-sm mb-1">Institution Type</label>
                <select value={institution.type} onChange={e => setInstitution(p => ({ ...p, type: e.target.value }))}
                  className="w-full bg-white/5 border border-white/20 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-neon-cyan/50">
                  {['School', 'College', 'University', 'Coaching Center'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <Input label="Contact Email" type="email" value={institution.email} onChange={e => setInstitution(p => ({ ...p, email: e.target.value }))} />
              <Input label="Phone Number" value={institution.phone} onChange={e => setInstitution(p => ({ ...p, phone: e.target.value }))} />
              <div className="md:col-span-2">
                <label className="block text-white/60 text-sm mb-1">Address</label>
                <textarea value={institution.address} onChange={e => setInstitution(p => ({ ...p, address: e.target.value }))}
                  rows={3} placeholder="Full address"
                  className="w-full bg-white/5 border border-white/20 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-neon-cyan/50 resize-none" />
              </div>
            </div>
            <Button variant="primary" onClick={saveInstitution} loading={saving}>Save Changes</Button>
          </GlassCard>
        )}

        {/* Users & Roles */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Invite form */}
            <GlassCard className="p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><MdAdd /> Invite User</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Input placeholder="First Name" value={inviteForm.firstName} onChange={e => setInviteForm(p => ({ ...p, firstName: e.target.value }))} />
                <Input placeholder="Last Name" value={inviteForm.lastName} onChange={e => setInviteForm(p => ({ ...p, lastName: e.target.value }))} />
                <Input placeholder="Email address" type="email" value={inviteForm.email} onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))} />
                <div>
                  <select value={inviteForm.role} onChange={e => setInviteForm(p => ({ ...p, role: e.target.value }))}
                    className="w-full bg-white/5 border border-white/20 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-neon-cyan/50">
                    {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                  </select>
                </div>
              </div>
              <Button variant="primary" onClick={inviteUser} loading={inviting} className="mt-4">
                <MdEmail className="mr-2 inline" /> Send Invitation
              </Button>
            </GlassCard>

            {/* Users table */}
            <GlassCard className="p-6">
              <h2 className="text-lg font-bold text-white mb-4">All Users ({users.length})</h2>
              {loadingUsers ? (
                <div className="text-white/60 text-sm">Loading users...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-white/60">Name</th>
                        <th className="text-left py-3 px-4 text-white/60">Role</th>
                        <th className="text-left py-3 px-4 text-white/60">Status</th>
                        <th className="text-left py-3 px-4 text-white/60">Joined</th>
                        <th className="text-center py-3 px-4 text-white/60">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-3 px-4 text-white">{u.first_name} {u.last_name}</td>
                          <td className="py-3 px-4 text-white/70 capitalize">{u.role?.replace('_', ' ')}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${u.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                              {u.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-white/60">{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                          <td className="py-3 px-4 text-center">
                            {u.user_id !== user?.id && u.is_active && (
                              <button onClick={() => deactivateUser(u.id)} className="text-red-400 hover:text-red-300">
                                <MdDelete className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassCard>
          </div>
        )}

        {/* Modules */}
        {activeTab === 'modules' && (
          <GlassCard className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Enable / Disable Modules</h2>
            <p className="text-white/60 text-sm">Control which features are available in your institution's CyberMilo.</p>
            <div className="space-y-3">
              {MODULES.map(mod => {
                const enabled = modules[mod.key] !== false;
                return (
                <div key={mod.key} className="flex items-center justify-between gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="min-w-0">
                    <p className="text-white font-medium">{mod.label}</p>
                    <p className="text-white/50 text-sm">{mod.description}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={enabled}
                    aria-label={`${enabled ? 'Disable' : 'Enable'} ${mod.label}`}
                    onClick={() => toggleModule(mod.key)}
                    className={`relative inline-flex h-7 w-14 shrink-0 items-center rounded-full border transition-colors focus:outline-none focus:ring-4 focus:ring-[#0E7C7B]/15 ${
                      enabled
                        ? 'bg-[#0E7C7B] border-[#0E7C7B]'
                        : 'bg-slate-300 border-slate-300'
                    }`}
                  >
                    <span
                      className={`absolute left-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                        enabled ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                    <span className={`absolute text-[10px] font-bold ${enabled ? 'left-2 text-white' : 'right-2 text-slate-600'}`}>
                      {enabled ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>
              )})}
            </div>
            <Button variant="primary" onClick={saveModules} loading={saving}>Save Module Settings</Button>
          </GlassCard>
        )}
      </div>
    </MainLayout>
  );
}

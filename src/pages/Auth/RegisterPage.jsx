import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useNotification } from '../../hooks/useNotification';
import AuthLayout from '../../components/Layout/AuthLayout';
import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import supabase from '../../lib/supabase';
import { MdEmail, MdLock, MdPerson, MdBusiness, MdPhone, MdLocationOn } from 'react-icons/md';

const INSTITUTION_TYPES = ['School', 'College', 'University', 'Coaching Center'];
const STEPS = ['Institution', 'Admin Account'];

export default function RegisterPage() {
  const navigate = useNavigate();
  const notification = useNotification();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});

  const [institutionData, setInstitutionData] = useState({
    name: '',
    type: 'School',
    address: '',
    phone: '',
    email: '',
  });

  const [accountData, setAccountData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInstChange = (e) => {
    const { name, value } = e.target;
    setInstitutionData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleAcctChange = (e) => {
    const { name, value } = e.target;
    setAccountData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validateStep0 = () => {
    const e = {};
    if (!institutionData.name.trim()) e.name = 'Institution name is required';
    if (!institutionData.phone.trim()) e.phone = 'Phone number is required';
    if (!institutionData.email.trim()) e.email = 'Institution email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(institutionData.email)) e.email = 'Invalid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep1 = () => {
    const e = {};
    if (!accountData.firstName.trim()) e.firstName = 'First name is required';
    if (!accountData.lastName.trim()) e.lastName = 'Last name is required';
    if (!accountData.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountData.email)) e.email = 'Invalid email';
    if (!accountData.password) e.password = 'Password is required';
    else if (accountData.password.length < 8) e.password = 'Minimum 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(accountData.password)) e.password = 'Must include uppercase, lowercase, and number';
    if (accountData.password !== accountData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep0()) setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;

    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: accountData.email,
        password: accountData.password,
        options: {
          data: {
            first_name: accountData.firstName,
            last_name: accountData.lastName,
            role: 'institution_admin',
          },
        },
      });

      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error('User creation failed');

      const { data: inst, error: instError } = await supabase
        .from('institutions')
        .insert([{
          name: institutionData.name,
          type: institutionData.type,
          address: institutionData.address,
          phone: institutionData.phone,
          email: institutionData.email,
          subscription_plan: 'free',
        }])
        .select()
        .single();

      if (instError) throw instError;

      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          user_id: userId,
          institution_id: inst.id,
          role: 'institution_admin',
          first_name: accountData.firstName,
          last_name: accountData.lastName,
          is_active: true,
        }]);

      if (profileError) throw profileError;

      notification.success('Institution registered successfully! Welcome to CyberMilo.');
      navigate('/dashboard');
    } catch (err) {
      notification.error(err.message || 'Registration failed');
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 mb-1">Register Your Institution</h2>
          <p className="text-slate-500 text-sm">Set up CyberMilo for your school in 2 steps</p>
        </div>

        <div className="flex items-center gap-3">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i === step ? 'bg-[#0E7C7B] text-white' : i < step ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {i < step ? 'OK' : i + 1}
              </div>
              <span className={`text-sm ${i === step ? 'text-slate-950 font-semibold' : 'text-slate-400'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className="w-8 h-px bg-slate-200 mx-1" />}
            </div>
          ))}
        </div>

        {errors.form && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
            {errors.form}
          </div>
        )}

        {step === 0 && (
          <div className="space-y-4">
            <Input name="name" placeholder="Institution Name" value={institutionData.name} onChange={handleInstChange} error={errors.name} leftIcon={MdBusiness} />

            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-1.5">Institution Type</label>
              <select
                name="type"
                value={institutionData.type}
                onChange={handleInstChange}
                className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#0E7C7B] focus:shadow-[0_0_0_4px_rgba(14,124,123,0.12)]"
              >
                {INSTITUTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <Input name="email" type="email" placeholder="Institution email" value={institutionData.email} onChange={handleInstChange} error={errors.email} leftIcon={MdEmail} />

            <Input name="phone" placeholder="Contact number" value={institutionData.phone} onChange={handleInstChange} error={errors.phone} leftIcon={MdPhone} />

            <Input name="address" placeholder="Address (optional)" value={institutionData.address} onChange={handleInstChange} leftIcon={MdLocationOn} />

            <Button variant="primary" onClick={handleNext} className="w-full">
              Continue
            </Button>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input name="firstName" placeholder="First name" value={accountData.firstName} onChange={handleAcctChange} error={errors.firstName} leftIcon={MdPerson} />
              <Input name="lastName" placeholder="Last name" value={accountData.lastName} onChange={handleAcctChange} error={errors.lastName} leftIcon={MdPerson} />
            </div>

            <Input name="email" type="email" placeholder="Admin email" value={accountData.email} onChange={handleAcctChange} error={errors.email} leftIcon={MdEmail} />

            <Input name="password" type="password" placeholder="Password (min 8 chars)" value={accountData.password} onChange={handleAcctChange} error={errors.password} leftIcon={MdLock} />

            <Input name="confirmPassword" type="password" placeholder="Confirm password" value={accountData.confirmPassword} onChange={handleAcctChange} error={errors.confirmPassword} leftIcon={MdLock} />

            <div className="flex gap-3">
              <Button variant="secondary" type="button" onClick={() => setStep(0)} className="flex-1">
                Back
              </Button>
              <Button type="submit" variant="primary" loading={loading} disabled={loading} className="flex-1">
                Create Account
              </Button>
            </div>
          </form>
        )}

        <div className="text-center text-sm">
          <span className="text-slate-500">Already registered? </span>
          <Link to="/login" className="text-[#0E7C7B] hover:text-[#0A5F5E] font-semibold">Sign In</Link>
        </div>
      </div>
    </AuthLayout>
  );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import AuthLayout from '../../components/Layout/AuthLayout';
import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import { MdEmail, MdLock, MdLogin } from 'react-icons/md';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const notification = useNotification();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ email: '', password: '' });

  const validate = () => {
    const e = {};
    if (!formData.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Invalid email';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 6) e.password = 'Minimum 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result?.error || result?.success === false) {
        const msg = result?.error?.message || result?.error || 'Invalid credentials';
        notification.error(msg);
        setErrors({ form: msg });
      } else {
        notification.success('Welcome back!');
        navigate(result?.profile?.role === 'super_admin' ? '/admin' : '/dashboard');
      }
    } catch (err) {
      notification.error('Something went wrong');
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 font-display">Welcome back</h2>
          <p className="text-slate-500 text-sm mt-1">Sign in to your CyberMilo account</p>
        </div>

        {errors.form && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            <span className="font-bold">!</span> {errors.form}
          </div>
        )}

        <div className="space-y-4">
          <Input
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            leftIcon={MdEmail}
            wrapperClass="mb-0"
            autoComplete="email"
          />

          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            leftIcon={MdLock}
            wrapperClass="mb-0"
            autoComplete="current-password"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 bg-white accent-[#0E7C7B] cursor-pointer"
            />
            <span className="text-slate-500">Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => notification.info('Password reset is not enabled yet. Ask an admin to reset this account.')}
            className="text-[#0E7C7B] hover:text-[#0A5F5E] transition-colors text-sm font-semibold"
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" variant="primary" loading={loading} disabled={loading} className="w-full" size="lg">
          {!loading && <MdLogin className="w-4.5 h-4.5" />}
          Sign In
        </Button>

        <div className="relative flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-slate-400 text-xs">New to CyberMilo?</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <Link to="/register">
          <Button variant="secondary" className="w-full" type="button">
            Create an account
          </Button>
        </Link>
      </form>
    </AuthLayout>
  );
}

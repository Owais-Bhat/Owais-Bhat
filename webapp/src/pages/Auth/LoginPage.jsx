import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import AuthLayout from '../../components/Layout/AuthLayout';
import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import { MdEmail, MdLock } from 'react-icons/md';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const notification = useNotification();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await login(formData.email, formData.password);

      if (error) {
        notification.error(error.message || 'Invalid email or password');
        setErrors({ form: error.message });
      } else {
        notification.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (err) {
      notification.error('An error occurred during login');
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-white/60 text-sm">Sign in to your CyberMilo account</p>
        </div>

        {errors.form && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-3 rounded-lg text-sm">
            {errors.form}
          </div>
        )}

        <div className="relative">
          <MdEmail className="absolute left-3 top-3 w-5 h-5 text-white/40" />
          <Input
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            className="pl-10"
          />
        </div>

        <div className="relative">
          <MdLock className="absolute left-3 top-3 w-5 h-5 text-white/40" />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            className="pl-10"
          />
        </div>

        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-white/30 bg-white/5 cursor-pointer"
            />
            <span className="text-white/60">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-neon-cyan hover:text-neon-cyan/80">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
          className="w-full"
        >
          Sign In
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-glass-dark text-white/60">New to CyberMilo?</span>
          </div>
        </div>

        <Link to="/register">
          <Button variant="secondary" className="w-full">
            Create Account
          </Button>
        </Link>
      </form>
    </AuthLayout>
  );
}

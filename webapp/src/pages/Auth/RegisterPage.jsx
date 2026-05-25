import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import AuthLayout from '../../components/Layout/AuthLayout';
import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import { MdEmail, MdLock, MdPerson } from 'react-icons/md';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const notification = useNotification();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const { error } = await register(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
      });

      if (error) {
        notification.error(error.message || 'Registration failed');
        setErrors({ form: error.message });
      } else {
        notification.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      notification.error('An error occurred during registration');
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-white/60 text-sm">Join CyberMilo and transform education</p>
        </div>

        {errors.form && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-3 rounded-lg text-sm">
            {errors.form}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <MdPerson className="absolute left-3 top-3 w-5 h-5 text-white/40" />
            <Input
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <MdPerson className="absolute left-3 top-3 w-5 h-5 text-white/40" />
            <Input
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              className="pl-10"
            />
          </div>
        </div>

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
          {formData.password && !errors.password && (
            <p className="text-xs text-white/50 mt-1">✓ Password strength: Good</p>
          )}
        </div>

        <div className="relative">
          <MdLock className="absolute left-3 top-3 w-5 h-5 text-white/40" />
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            className="pl-10"
          />
        </div>

        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            required
            className="w-4 h-4 rounded border-white/30 bg-white/5 cursor-pointer mt-1"
          />
          <span className="text-white/60 text-sm">
            I agree to the <a href="#" className="text-neon-cyan hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-neon-cyan hover:underline">Privacy Policy</a>
          </span>
        </label>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
          className="w-full"
        >
          Create Account
        </Button>

        <div className="text-center text-sm">
          <span className="text-white/60">Already have an account? </span>
          <Link to="/login" className="text-neon-cyan hover:text-neon-cyan/80">
            Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

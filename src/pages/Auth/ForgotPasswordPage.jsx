import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdEmail, MdArrowBack, MdMarkEmailRead } from 'react-icons/md';
import supabase from '../../lib/supabase';
import AuthLayout from '../../components/Layout/AuthLayout';
import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import { useNotification } from '../../hooks/useNotification';

export default function ForgotPasswordPage() {
  const notification = useNotification();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    setError('');
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (resetError) {
      notification.error(resetError.message);
      setError(resetError.message);
    } else {
      setSent(true);
    }
  };

  return (
    <AuthLayout>
      {sent ? (
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <MdMarkEmailRead className="w-7 h-7 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-950 font-display mb-2">Check your inbox</h2>
          <p className="text-slate-500 text-sm mb-6">
            If an account exists for <span className="font-semibold text-slate-700">{email}</span>,
            we sent a link to reset your password. The link expires in 1 hour.
          </p>
          <Link to="/login">
            <Button variant="secondary" className="w-full" type="button" icon={MdArrowBack}>
              Back to sign in
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-950 font-display">Forgot password?</h2>
            <p className="text-slate-500 text-sm mt-1">
              Enter your account email and we&apos;ll send you a reset link.
            </p>
          </div>

          <Input
            name="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            error={error}
            leftIcon={MdEmail}
            wrapperClass="mb-0"
            autoComplete="email"
          />

          <Button type="submit" variant="primary" loading={loading} disabled={loading} className="w-full" size="lg">
            Send reset link
          </Button>

          <p className="text-center text-sm text-slate-500 mb-0">
            Remembered it?{' '}
            <Link to="/login" className="font-semibold text-[#0E7C7B] hover:text-[#0A5F5E]">
              Sign in
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}

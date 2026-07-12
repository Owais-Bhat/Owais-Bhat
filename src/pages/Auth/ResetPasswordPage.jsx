import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdLock, MdErrorOutline } from 'react-icons/md';
import supabase from '../../lib/supabase';
import AuthLayout from '../../components/Layout/AuthLayout';
import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import { useNotification } from '../../hooks/useNotification';

// Landed on from the Supabase recovery email. supabase-js exchanges the
// token in the URL for a session automatically; we wait for it, then let
// the user set a new password.
export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const notification = useNotification();
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') && session && !cancelled) {
        setHasSession(true);
        setChecking(false);
      }
    });

    // The token exchange may already be done by the time we mount
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      if (session) {
        setHasSession(true);
        setChecking(false);
      } else {
        // Give the URL token exchange a moment before declaring the link dead
        setTimeout(() => {
          if (!cancelled) setChecking(false);
        }, 2500);
      }
    })();

    return () => {
      cancelled = true;
      subscription?.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (form.password.length < 6) nextErrors.password = 'Minimum 6 characters';
    if (form.confirm !== form.password) nextErrors.confirm = 'Passwords do not match';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: form.password });
    setSaving(false);
    if (error) {
      notification.error(error.message);
      setErrors({ form: error.message });
    } else {
      notification.success('Password updated. You are signed in.');
      navigate('/dashboard');
    }
  };

  if (checking) {
    return (
      <AuthLayout>
        <div className="py-12 flex flex-col items-center gap-4">
          <div className="spinner" />
          <p className="text-sm text-slate-500 mb-0">Verifying your reset link...</p>
        </div>
      </AuthLayout>
    );
  }

  if (!hasSession) {
    return (
      <AuthLayout>
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <MdErrorOutline className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-950 font-display mb-2">Link expired</h2>
          <p className="text-slate-500 text-sm mb-6">
            This password reset link is invalid or has expired. Request a new one and try again.
          </p>
          <Link to="/forgot-password">
            <Button variant="primary" className="w-full" type="button">
              Request new link
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 font-display">Set a new password</h2>
          <p className="text-slate-500 text-sm mt-1">Choose a strong password for your account.</p>
        </div>

        {errors.form && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            <span className="font-bold">!</span> {errors.form}
          </div>
        )}

        <div className="space-y-4">
          <Input
            name="password"
            type="password"
            placeholder="New password"
            value={form.password}
            onChange={(e) => { setForm(f => ({ ...f, password: e.target.value })); setErrors({}); }}
            error={errors.password}
            leftIcon={MdLock}
            wrapperClass="mb-0"
            autoComplete="new-password"
          />
          <Input
            name="confirm"
            type="password"
            placeholder="Confirm new password"
            value={form.confirm}
            onChange={(e) => { setForm(f => ({ ...f, confirm: e.target.value })); setErrors({}); }}
            error={errors.confirm}
            leftIcon={MdLock}
            wrapperClass="mb-0"
            autoComplete="new-password"
          />
        </div>

        <Button type="submit" variant="primary" loading={saving} disabled={saving} className="w-full" size="lg">
          Update password
        </Button>
      </form>
    </AuthLayout>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getLoginUrl, getAppName } from '../lib/apps';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const appCode = searchParams.get('app');
  const returnUrl = searchParams.get('returnUrl');
  const appName = getAppName(appCode);
  const loginUrl = getLoginUrl(appCode, returnUrl);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const redirectingRef = useRef(false);
  const passwordUpdateInitiatedRef = useRef(false);

  // Listen for USER_UPDATED event during password reset
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (
        event === 'USER_UPDATED' &&
        passwordUpdateInitiatedRef.current &&
        !redirectingRef.current
      ) {
        redirectingRef.current = true;
        setSuccess(true);
        supabase.auth.signOut().finally(() => {
          setTimeout(() => {
            window.location.href = `${loginUrl}?reset=success`;
          }, 2000);
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [loginUrl]);

  // Verify recovery session on mount
  useEffect(() => {
    const verify = async () => {
      try {
        const hash = window.location.hash;
        if (hash) {
          const hashParams = new URLSearchParams(hash.substring(1));
          if (hashParams.get('type') === 'recovery') {
            await new Promise((r) => setTimeout(r, 150));
          }
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          setHasValidSession(false);
          setError('Invalid or expired password reset link.');
        } else {
          setHasValidSession(true);
        }
      } catch {
        setHasValidSession(false);
        setError('Failed to verify password reset link.');
      } finally {
        setIsVerifying(false);
      }
    };
    verify();
  }, []);

  const strength = {
    hasMinLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  };

  const isStrong =
    strength.hasMinLength &&
    strength.hasUpperCase &&
    strength.hasLowerCase &&
    strength.hasNumber;

  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!passwordsMatch) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }
    if (!isStrong) {
      setError('Password does not meet strength requirements.');
      setIsLoading(false);
      return;
    }

    try {
      passwordUpdateInitiatedRef.current = true;

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (redirectingRef.current) return;

      if (updateError) {
        passwordUpdateInitiatedRef.current = false;
        if (updateError.message?.includes('should be different')) {
          setError('New password must be different from your current password.');
        } else {
          setError(updateError.message || 'Failed to reset password.');
        }
        setIsLoading(false);
        return;
      }

      // If the auth event didn't fire yet, trigger redirect manually
      if (!redirectingRef.current) {
        await new Promise((r) => setTimeout(r, 500));
        if (!redirectingRef.current) {
          redirectingRef.current = true;
          setSuccess(true);
          await supabase.auth.signOut();
          setTimeout(() => {
            window.location.href = `${loginUrl}?reset=success`;
          }, 2000);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to reset password.',
      );
      setIsLoading(false);
      passwordUpdateInitiatedRef.current = false;
      redirectingRef.current = false;
    }
  };

  // Loading state
  if (isVerifying) {
    return (
      <Shell>
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="h-8 w-8 border-[3px] border-fcc-cyan/30 border-t-fcc-cyan rounded-full animate-spin" />
          <p className="text-sm text-text-secondary">
            Verifying password reset link...
          </p>
        </div>
      </Shell>
    );
  }

  // Invalid/expired link
  if (!hasValidSession) {
    return (
      <Shell>
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-500/10">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-text">
                Invalid Reset Link
              </h1>
              <p className="text-sm text-text-muted mt-0.5">
                This link is invalid or has expired.
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/10 text-sm text-red-300">
            {error || 'Please request a new password reset link from your app.'}
          </div>
          <button
            onClick={() => navigate('/invalid-link')}
            className="w-full py-2.5 px-4 bg-surface-elevated text-text-secondary border border-border rounded-lg text-sm font-medium hover:bg-border/50 transition-colors"
          >
            Back
          </button>
        </div>
      </Shell>
    );
  }

  // Success state
  if (success) {
    return (
      <Shell>
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-fcc-cyan/10">
              <CheckCircle className="h-5 w-5 text-fcc-cyan" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-text">
                Password Reset!
              </h1>
              <p className="text-sm text-text-muted mt-0.5">
                Your password has been updated successfully.
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-lg bg-fcc-cyan/5 border border-fcc-cyan/10 text-sm text-fcc-cyan-light">
            Redirecting you back to <strong>{appName}</strong> to log in with
            your new password...
          </div>
          <div className="flex justify-center">
            <div className="h-5 w-5 border-[3px] border-fcc-cyan/30 border-t-fcc-cyan rounded-full animate-spin" />
          </div>
        </div>
      </Shell>
    );
  }

  // Main reset form
  return (
    <Shell>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-fcc-cyan/10">
            <Lock className="h-5 w-5 text-fcc-cyan" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-text">
              Reset Your Password
            </h1>
            <p className="text-sm text-text-muted mt-0.5">
              Choose a new password for your {appName} account.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-sm text-red-300 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* New Password */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-text-secondary"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface-elevated border border-border rounded-lg text-[0.9375rem] text-text placeholder:text-text-muted focus:outline-none focus:border-fcc-cyan focus:ring-[3px] focus:ring-fcc-cyan/15 hover:border-border-strong transition-all duration-150 pr-10"
              placeholder="Enter new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-text-secondary"
          >
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-surface-elevated border border-border rounded-lg text-[0.9375rem] text-text placeholder:text-text-muted focus:outline-none focus:border-fcc-cyan focus:ring-[3px] focus:ring-fcc-cyan/15 hover:border-border-strong transition-all duration-150"
            placeholder="Confirm new password"
            required
          />
          {confirmPassword && !passwordsMatch && (
            <p className="text-xs text-red-400">Passwords do not match</p>
          )}
          {passwordsMatch && (
            <p className="text-xs text-fcc-cyan">Passwords match</p>
          )}
        </div>

        {/* Strength Requirements */}
        {password && (
          <div className="p-3 rounded-lg bg-bg-alt border border-border">
            <p className="text-xs font-medium text-text-muted mb-2">
              Password Requirements:
            </p>
            <ul className="space-y-1 text-xs">
              {[
                { ok: strength.hasMinLength, label: 'At least 8 characters' },
                { ok: strength.hasUpperCase, label: 'One uppercase letter' },
                { ok: strength.hasLowerCase, label: 'One lowercase letter' },
                { ok: strength.hasNumber, label: 'One number' },
              ].map(({ ok, label }) => (
                <li
                  key={label}
                  className={ok ? 'text-fcc-cyan' : 'text-text-muted'}
                >
                  {ok ? '\u2713' : '\u25CB'} {label}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !passwordsMatch || !isStrong}
          className="w-full py-2.5 px-4 bg-fcc-cyan text-white rounded-lg text-sm font-semibold hover:bg-fcc-cyan-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Resetting Password...
            </>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
    </Shell>
  );
}

/** Page wrapper with FCC branding */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg p-4">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <img src="/fcc-logo.png" alt="FCC" className="h-10 w-10" />
        <span className="text-lg font-semibold text-text tracking-tight">
          Freedom Code Compliance
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-surface border border-border rounded-xl overflow-hidden">
        {children}
      </div>

      {/* Footer */}
      <p className="mt-6 text-xs text-text-muted">
        <a
          href="https://freedomcodecompliance.com"
          className="hover:text-text-secondary transition-colors"
        >
          freedomcodecompliance.com
        </a>
      </p>
    </div>
  );
}

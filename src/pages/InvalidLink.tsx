import { AlertCircle } from 'lucide-react';

export default function InvalidLink() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg p-4">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-fcc-green flex items-center justify-center">
          <span className="text-white font-bold text-lg">F</span>
        </div>
        <span className="text-lg font-semibold text-text tracking-tight">
          Freedom Code Compliance
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-500/10">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-text">
                Invalid Link
              </h1>
              <p className="text-sm text-text-muted mt-0.5">
                This password reset link is invalid or has expired.
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/10 text-sm text-amber-300">
            <p className="font-medium">What to do:</p>
            <ol className="mt-2 list-decimal list-inside space-y-1">
              <li>Go back to your FCC application</li>
              <li>Click "Forgot Password?" on the login page</li>
              <li>Enter your email to receive a new reset link</li>
            </ol>
          </div>
          <p className="text-xs text-text-muted text-center">
            Password reset links expire after 60 minutes.
          </p>
        </div>
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

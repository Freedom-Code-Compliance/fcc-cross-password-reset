import { AlertCircle } from 'lucide-react';

export default function InvalidLink() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-50">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Invalid Link
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                This password reset link is invalid or has expired.
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-100 text-sm text-amber-700">
            <p className="font-medium">What to do:</p>
            <ol className="mt-2 list-decimal list-inside space-y-1">
              <li>Go back to your FCC application</li>
              <li>Click "Forgot Password?" on the login page</li>
              <li>Enter your email to receive a new reset link</li>
            </ol>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Password reset links expire after 60 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}

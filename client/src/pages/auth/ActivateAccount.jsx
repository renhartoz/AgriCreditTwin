import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { authService } from '@/services/authService';

export default function ActivateAccount() {
  const { uidb64, token } = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function activate() {
      try {
        const result = await authService.verifyEmail(uidb64, token);
        if (!cancelled) {
          setStatus('success');
          setMessage(result.message || 'Account activated successfully.');
        }
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setMessage(
            err.response?.data?.error || 'Activation failed. The link may be invalid or expired.'
          );
        }
      }
    }

    activate();
    return () => { cancelled = true; };
  }, [uidb64, token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-background">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold font-mono">
            <img className="w-13 h-13 flex rounded" src="/logo.png" alt="Logo" />
            <span className="text-[#78c2a4]">AgriCredit</span>
            <span className="text-primary">Twin</span>
          </Link>
        </div>

        <div className="auth-card rounded-2xl p-8 sm:p-10 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 mx-auto mb-6 text-primary animate-spin" />
              <h1 className="text-xl font-bold text-foreground mb-3">Activating Your Account...</h1>
              <p className="text-sm text-muted-foreground">Please wait while we verify your email.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle2 className="w-16 h-16 mx-auto mb-6 text-emerald-500" />
              <h1 className="text-xl font-bold text-foreground mb-3">Account Activated!</h1>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {message}
              </p>
              <Link
                to="/auth/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-[#7FFF00] text-black hover:opacity-90 transition-opacity"
              >
                Proceed to Login
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 mx-auto mb-6 text-red-500" />
              <h1 className="text-xl font-bold text-foreground mb-3">Activation Failed</h1>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {message}
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                &larr; Back to Home
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

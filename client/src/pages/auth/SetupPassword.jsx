import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, ShieldCheck } from 'lucide-react';
import AuthLogo from '@/components/auth/AuthLogo';
import PasswordInput from '@/components/auth/PasswordInput';

export default function SetupPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  
  const email = searchParams.get('email') || 'operator.lapangan@koperasi.co.id';
  const cooperativeName = searchParams.get('coop') || 'Koperasi Melati Jaya';
  const roleName = searchParams.get('role') || 'Operator Lapangan';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isValid =
    password.length >= 8 &&
    password === confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        
        <div className="flex justify-center mb-8" style={{ animation: 'auth-fade-up 0.3s ease-out' }}>
          <AuthLogo />
        </div>

        
        <div
          className="auth-card rounded-2xl p-6 sm:p-8"
          style={{ animation: 'auth-fade-up 0.4s ease-out 0.1s both' }}
        >
          
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-lg font-bold text-foreground mb-2">
              Aktivasi Akun
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Anda diundang untuk bergabung dengan{' '}
              <span className="font-semibold text-foreground">{cooperativeName}</span>{' '}
              sebagai{' '}
              <span className="font-semibold text-primary">{roleName}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1.5">
              <label htmlFor="setup-email" className="block text-sm font-medium text-foreground/80">
                Email
              </label>
              <input
                id="setup-email"
                type="email"
                value={email}
                disabled
                className="w-full h-11 px-4 rounded-xl border border-border bg-muted/50 text-sm
                  text-muted-foreground cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                Email ini telah ditentukan oleh admin koperasi
              </p>
            </div>

            
            <PasswordInput
              id="setup-password"
              label={<>Password Baru <span className="text-red-400">*</span></>}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showStrength
            />

            
            <PasswordInput
              id="setup-confirm-password"
              label={<>Konfirmasi Password <span className="text-red-400">*</span></>}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={
                confirmPassword && password !== confirmPassword
                  ? 'Password tidak cocok'
                  : ''
              }
            />

            
            <button
              type="submit"
              disabled={!isValid || submitting}
              className={`w-full h-12 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer
                flex items-center justify-center gap-2 mt-2
                ${isValid && !submitting
                  ? 'bg-primary text-primary-foreground hover:brightness-110 shadow-[0_4px_16px_rgba(127,255,0,0.25)]'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mengaktifkan akun...
                </>
              ) : (
                'Aktifkan Akun & Masuk'
              )}
            </button>
          </form>

          
          <div className="mt-6 p-3 rounded-xl bg-muted/40 border border-border/60">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              🔒 Tautan undangan ini bersifat satu kali pakai dan akan kedaluwarsa dalam 48 jam.
              Hubungi admin koperasi jika Anda mengalami kendala.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

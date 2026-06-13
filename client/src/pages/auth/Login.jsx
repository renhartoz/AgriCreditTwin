import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight } from 'lucide-react';
import AuthLogo from '@/components/auth/AuthLogo';
import PasswordInput from '@/components/auth/PasswordInput';
import { authService } from '@/services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isValid = email.trim().length > 0 && password.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    setError('');
    try {
      await authService.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.error || 'Login gagal. Periksa email dan password Anda.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] relative overflow-hidden">
        
        <img
          src="/auth-hero.png"
          alt="Indonesian agriculture landscape"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(13,39,28,0.85) 0%, rgba(45,106,79,0.7) 50%, rgba(13,39,28,0.8) 100%)',
          }}
        />
        
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
          
          <div>
            <div className="flex items-center gap-3">
              <img className="w-12 h-12 rounded-lg" src="/logo.png" alt="Logo" />
              <Link className="text-xl font-bold font-mono tracking-wider" to={"/"}>
                <span className="text-emerald-300">AgriCredit</span>
                <span className="text-[#7FFF00]">Twin</span>
              </Link>
            </div>
          </div>

          
          <div className="max-w-md">
            <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
              Digital Twin untuk{' '}
              <span className="text-[#7FFF00]">Koperasi Pertanian</span>{' '}
              Masa Depan
            </h1>
            <p className="text-base text-emerald-100/70 leading-relaxed">
              Platform simulasi kredit dan pemantauan risiko pertanian berbasis 
              kecerdasan buatan. Bantu koperasi Anda tumbuh dengan keputusan berbasis data.
            </p>
          </div>

          
          <div className="flex gap-8">
            <div>
              <p className="text-2xl font-bold text-[#7FFF00]">500+</p>
              <p className="text-xs text-emerald-200/50">Koperasi Terdaftar</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#7FFF00]">12.4K</p>
              <p className="text-xs text-emerald-200/50">Anggota Aktif</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#7FFF00]">98.5%</p>
              <p className="text-xs text-emerald-200/50">Akurasi Simulasi</p>
            </div>
          </div>
        </div>
      </div>

      
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-sm">
          
          <div className="flex justify-center mb-8 lg:hidden" style={{ animation: 'auth-fade-up 0.3s ease-out' }}>
            <AuthLogo />
          </div>

          
          <div className="mb-8" style={{ animation: 'auth-fade-up 0.3s ease-out' }}>
            <h1 className="text-2xl font-bold text-foreground mb-1">Selamat Datang</h1>
            <p className="text-sm text-muted-foreground">
              Masuk ke dashboard koperasi Anda
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" style={{ animation: 'auth-fade-up 0.4s ease-out 0.1s both' }}>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-sm font-medium text-foreground/80">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@koperasi.co.id"
                className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm
                  transition-all duration-200 hover:border-foreground/20
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
              />
            </div>

            
            <PasswordInput
              id="login-password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            
            <div className="flex items-center justify-between">
              <label htmlFor="login-remember" className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative">
                  <input
                    id="login-remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 rounded-md border-2 border-border bg-background
                    transition-all duration-200 group-hover:border-foreground/30
                    peer-checked:bg-primary peer-checked:border-primary
                    peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30
                    flex items-center justify-center"
                  >
                    {rememberMe && (
                      <svg className="w-3 h-3 text-primary-foreground" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  Ingat Saya
                </span>
              </label>

              <a href="#" className="text-sm text-primary font-medium hover:underline">
                Lupa Password?
              </a>
            </div>

            
            <button
              type="submit"
              disabled={!isValid || submitting}
              className={`w-full h-12 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer
                flex items-center justify-center gap-2
                ${isValid && !submitting
                  ? 'bg-primary text-primary-foreground hover:brightness-110 shadow-[0_4px_16px_rgba(127,255,0,0.25)]'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  Masuk
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          
          <div
            className="mt-8 text-center space-y-4"
            style={{ animation: 'auth-fade-up 0.4s ease-out 0.2s both' }}
          >
            <p className="text-sm text-muted-foreground">
              Koperasi belum terdaftar?{' '}
              <Link to="/auth/register-cooperative" className="text-primary font-semibold hover:underline">
                Daftar Koperasi Baru
              </Link>
            </p>
            <div className="h-px bg-border/60" />
            <p className="text-xs text-muted-foreground">
              Investor atau Auditor?{' '}
              <Link to="/auth/external/login" className="text-muted-foreground hover:text-foreground hover:underline font-medium transition-colors">
                Portal Investor →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

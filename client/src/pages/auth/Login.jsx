import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ArrowRight, Info } from 'lucide-react';
import AuthLogo from '@/components/auth/AuthLogo';
import PasswordInput from '@/components/auth/PasswordInput';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isValid = email.trim().length > 0 && password.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 2000);
  };

  return (
    <div className="min-h-screen flex">
      {/* ─── Left Panel: Hero Image ─── */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] relative overflow-hidden">
        {/* Background image */}
        <img
          src="/auth-hero.png"
          alt="Indonesian agriculture landscape"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(13,39,28,0.85) 0%, rgba(45,106,79,0.7) 50%, rgba(13,39,28,0.8) 100%)',
          }}
        />
        {/* Decorative mesh */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
          {/* Top: Logo */}
          <div>
            <div className="flex items-center gap-3">
              <img className="w-12 h-12 rounded-lg" src="/logo.png" alt="Logo" />
              <Link className="text-xl font-bold font-mono tracking-wider" to={"/"}>
                <span className="text-emerald-300">AgriCredit</span>
                <span className="text-[#7FFF00]">Twin</span>
              </Link>
            </div>
          </div>

          {/* Center: Brand copy */}
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

          {/* Bottom: Decorative stats */}
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

      {/* ─── Right Panel: Login Form ─── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-sm">
          {/* Mobile logo (hidden on desktop) */}
          <div className="flex justify-center mb-8 lg:hidden" style={{ animation: 'auth-fade-up 0.3s ease-out' }}>
            <AuthLogo />
          </div>

          {/* Form header */}
          <div className="mb-8" style={{ animation: 'auth-fade-up 0.3s ease-out' }}>
            <h1 className="text-2xl font-bold text-foreground mb-1">Selamat Datang</h1>
            <p className="text-sm text-muted-foreground">
              Masuk ke dashboard koperasi Anda
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" style={{ animation: 'auth-fade-up 0.4s ease-out 0.1s both' }}>
            {/* Email */}
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

            {/* Password */}
            <PasswordInput
              id="login-password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Remember me */}
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

            {/* Submit */}
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

          {/* Developer note badge */}
          <div
            className="mt-6 p-3 rounded-xl border border-dashed border-amber-300/40 bg-amber-50/50"
            style={{ animation: 'auth-fade-up 0.4s ease-out 0.2s both' }}
          >
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-700 leading-relaxed">
                <span className="font-bold">Adaptive Routing:</span> Frontend reads user token/role 
                on submission to dynamically route Admins/Operators to their respective{' '}
                <code className="px-1 py-0.5 bg-amber-100 rounded text-[10px] font-mono">/dashboard</code>{' '}
                transparently.
              </p>
            </div>
          </div>

          {/* Bottom links */}
          <div
            className="mt-6 text-center space-y-3"
            style={{ animation: 'auth-fade-up 0.4s ease-out 0.3s both' }}
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

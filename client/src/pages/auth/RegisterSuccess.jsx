import React from 'react';
import { Link } from 'react-router-dom';
import AuthLogo from '@/components/auth/AuthLogo';

// Animated checkmark SVG component
function SuccessCheckmark() {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className="relative">
        {/* Pulsing glow ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(127,255,0,0.15), transparent 70%)',
            animation: 'auth-pulse-dot 2.5s ease-in-out infinite',
            transform: 'scale(1.8)',
          }}
        />
        {/* SVG checkmark */}
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none" className="relative z-10">
          {/* Circle */}
          <circle
            cx="48"
            cy="48"
            r="44"
            stroke="#7FFF00"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: 283,
              strokeDashoffset: 283,
              animation: 'auth-check-circle 0.8s ease-out 0.2s forwards',
            }}
          />
          {/* Inner circle fill */}
          <circle
            cx="48"
            cy="48"
            r="44"
            fill="rgba(127,255,0,0.06)"
            style={{
              opacity: 0,
              animation: 'auth-fade-up 0.5s ease-out 0.6s forwards',
            }}
          />
          {/* Checkmark */}
          <polyline
            points="30,50 44,64 66,36"
            stroke="#7FFF00"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 50,
              strokeDashoffset: 50,
              animation: 'auth-check-mark 0.4s ease-out 0.9s forwards',
            }}
          />
        </svg>
      </div>
    </div>
  );
}

export default function RegisterSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8" style={{ animation: 'auth-fade-up 0.3s ease-out' }}>
          <AuthLogo />
        </div>

        {/* Card */}
        <div
          className="auth-card rounded-2xl p-8 sm:p-10 text-center"
          style={{ animation: 'auth-fade-up 0.4s ease-out 0.1s both' }}
        >
          <SuccessCheckmark />

          <h1 className="text-xl font-bold text-foreground mb-3">
            Pendaftaran Berhasil!
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
            Akun Koperasi Anda sedang dalam tahap verifikasi oleh{' '}
            <span className="font-semibold text-foreground/80">SuperAdmin Koperasi Viva</span>.
          </p>

          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Kami akan mengirimkan email konfirmasi dalam{' '}
            <span className="font-semibold text-primary">1×24 jam</span>.
          </p>

          {/* Status indicator */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200/60 mb-6">
            <span
              className="w-2 h-2 rounded-full bg-amber-400"
              style={{ animation: 'auth-pulse-dot 2s ease-in-out infinite' }}
            />
            <span className="text-xs font-semibold text-amber-700">Menunggu Verifikasi</span>
          </div>

          {/* Info card */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60 mb-6">
            <p className="text-xs text-muted-foreground leading-relaxed">
              📧 Pastikan Anda memeriksa folder <span className="font-medium">Inbox</span> dan{' '}
              <span className="font-medium">Spam</span> di email yang terdaftar. Email konfirmasi
              akan berisi tautan untuk mengaktifkan akun Anda.
            </p>
          </div>

          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            ← Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}

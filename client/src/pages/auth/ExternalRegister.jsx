import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Building, Loader2, Shield } from 'lucide-react';
import PasswordInput from '@/components/auth/PasswordInput';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ExternalRegister() {
  const [data, setData] = useState({
    institution: '',
    representative: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const isValid = useMemo(() =>
    data.institution.trim().length > 0 &&
    data.representative.trim().length > 0 &&
    validateEmail(data.email) &&
    data.password.length >= 8 &&
    data.password === data.confirmPassword,
    [data]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 2000);
  };

  return (
    <div className="corporate-theme min-h-screen flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)' }}
    >
      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{
            background: 'radial-gradient(circle, #6366F1, transparent 70%)',
            animation: 'auth-float 25s ease-in-out infinite',
          }}
        />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, #818CF8, transparent 70%)',
            animation: 'auth-float 30s ease-in-out infinite reverse',
          }}
        />
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #F8FAFC 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center mb-8" style={{ animation: 'auth-fade-up 0.3s ease-out' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide font-mono">
                <span className="text-indigo-400">AgriCredit</span>
                <span className="text-slate-300">Twin</span>
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">
            Investor & Auditor Portal
          </p>
        </div>

        {/* Card */}
        <div
          className="corp-card rounded-2xl p-6 sm:p-8"
          style={{ animation: 'auth-fade-up 0.4s ease-out 0.1s both' }}
        >
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-white">Daftar Akses Eksklusif</h1>
            <p className="text-sm text-slate-400 mt-1">
              Registrasi untuk investor dan auditor eksternal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Institution Name */}
            <div className="space-y-1.5">
              <label htmlFor="ext-institution" className="block text-sm font-medium text-slate-300">
                Nama Institusi
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="ext-institution"
                  type="text"
                  value={data.institution}
                  onChange={(e) => setData({ ...data, institution: e.target.value })}
                  placeholder="PT Venture Capital Indonesia"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-600/50 bg-slate-800/50 text-sm
                    text-white placeholder:text-slate-500
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50
                    hover:border-slate-500"
                />
              </div>
            </div>

            {/* Representative Name */}
            <div className="space-y-1.5">
              <label htmlFor="ext-rep" className="block text-sm font-medium text-slate-300">
                Nama Perwakilan
              </label>
              <input
                id="ext-rep"
                type="text"
                value={data.representative}
                onChange={(e) => setData({ ...data, representative: e.target.value })}
                placeholder="Nama lengkap perwakilan"
                className="w-full h-11 px-4 rounded-xl border border-slate-600/50 bg-slate-800/50 text-sm
                  text-white placeholder:text-slate-500
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50
                  hover:border-slate-500"
              />
            </div>

            {/* Work Email */}
            <div className="space-y-1.5">
              <label htmlFor="ext-email" className="block text-sm font-medium text-slate-300">
                Email Kantor
              </label>
              <input
                id="ext-email"
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="nama@perusahaan.co.id"
                className={`w-full h-11 px-4 rounded-xl border bg-slate-800/50 text-sm
                  text-white placeholder:text-slate-500
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50
                  ${data.email && !validateEmail(data.email) ? 'border-red-400/60' : 'border-slate-600/50 hover:border-slate-500'}`}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="[&_input]:bg-slate-800/50 [&_input]:border-slate-600/50 [&_input]:text-white [&_input]:placeholder-slate-500 [&_input:hover]:border-slate-500 [&_input:focus]:ring-indigo-500/30 [&_input:focus]:border-indigo-500/50 [&_label]:text-slate-300 [&_button]:text-slate-400 [&_button:hover]:text-slate-200">
                <PasswordInput
                  id="ext-password"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  showStrength
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">
                Konfirmasi Password
              </label>
              <div className="[&_input]:bg-slate-800/50 [&_input]:border-slate-600/50 [&_input]:text-white [&_input]:placeholder-slate-500 [&_input:hover]:border-slate-500 [&_input:focus]:ring-indigo-500/30 [&_input:focus]:border-indigo-500/50 [&_label]:text-slate-300 [&_button]:text-slate-400 [&_button:hover]:text-slate-200">
                <PasswordInput
                  id="ext-confirm-password"
                  value={data.confirmPassword}
                  onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                  error={
                    data.confirmPassword && data.password !== data.confirmPassword
                      ? 'Password tidak cocok'
                      : ''
                  }
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isValid || submitting}
              className={`w-full h-12 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer
                flex items-center justify-center gap-2 mt-2
                ${isValid && !submitting
                  ? 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-[0_4px_20px_rgba(99,102,241,0.35)]'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mendaftarkan...
                </>
              ) : (
                'Daftar sebagai Investor / Auditor'
              )}
            </button>
          </form>

          {/* Bottom links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-slate-400">
              Sudah punya akun?{' '}
              <Link to="/auth/external/login" className="text-indigo-400 font-semibold hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

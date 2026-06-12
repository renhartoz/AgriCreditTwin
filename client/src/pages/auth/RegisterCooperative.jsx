import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, UserPlus, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import AuthLogo from '@/components/auth/AuthLogo';
import StepIndicator from '@/components/auth/StepIndicator';
import PasswordInput from '@/components/auth/PasswordInput';
import FileUploader from '@/components/auth/FileUploader';

const STEPS = ['Identitas Koperasi', 'Akun Admin'];

// ─── Validation helpers ──────────────────────────
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateNIK(nik) {
  return /^\d{13,16}$/.test(nik);
}

function validateNIB(nib) {
  return /^\d{13}$/.test(nib);
}

function validateSK(sk) {
  return sk.trim().length >= 5;
}

// ─── Step 1: Cooperative Identity ────────────────
function StepCooperativeIdentity({ data, setData }) {
  return (
    <div
      className="space-y-5"
      style={{ animation: 'auth-fade-up 0.4s ease-out' }}
    >
      {/* Section header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Identitas Koperasi</h2>
          <p className="text-xs text-muted-foreground">Data resmi badan hukum koperasi Anda</p>
        </div>
      </div>

      {/* Cooperative Name */}
      <div className="space-y-1.5">
        <label htmlFor="coop-name" className="block text-sm font-medium text-foreground/80">
          Nama Koperasi <span className="text-red-400">*</span>
        </label>
        <input
          id="coop-name"
          type="text"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          placeholder="Koperasi Tani Sejahtera"
          className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm
            transition-all duration-200 hover:border-foreground/20
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
        />
      </div>

      {/* Cooperative NIK */}
      <div className="space-y-1.5">
        <label htmlFor="coop-nik" className="block text-sm font-medium text-foreground/80">
          NIK Koperasi <span className="text-red-400">*</span>
        </label>
        <input
          id="coop-nik"
          type="text"
          inputMode="numeric"
          value={data.nik}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '');
            setData({ ...data, nik: val });
          }}
          placeholder="Masukkan 13-16 digit NIK"
          maxLength={16}
          className={`w-full h-11 px-4 rounded-xl border bg-background text-sm
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
            ${data.nik && !validateNIK(data.nik) ? 'border-red-300' : 'border-border hover:border-foreground/20'}`}
        />
        {data.nik && !validateNIK(data.nik) && (
          <p className="text-xs text-red-500">NIK harus terdiri dari 13-16 digit angka</p>
        )}
      </div>

      {/* NIB */}
      <div className="space-y-1.5">
        <label htmlFor="coop-nib" className="block text-sm font-medium text-foreground/80">
          NIB (Nomor Induk Berusaha) <span className="text-red-400">*</span>
        </label>
        <input
          id="coop-nib"
          type="text"
          inputMode="numeric"
          value={data.nib}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '');
            setData({ ...data, nib: val });
          }}
          placeholder="Masukkan 13 digit NIB"
          maxLength={13}
          className={`w-full h-11 px-4 rounded-xl border bg-background text-sm
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
            ${data.nib && !validateNIB(data.nib) ? 'border-red-300' : 'border-border hover:border-foreground/20'}`}
        />
        {data.nib && !validateNIB(data.nib) && (
          <p className="text-xs text-red-500">NIB harus terdiri dari 13 digit angka</p>
        )}
      </div>

      {/* Kemenkumham SK Number */}
      <div className="space-y-1.5">
        <label htmlFor="coop-sk" className="block text-sm font-medium text-foreground/80">
          Nomor SK Kemenkumham <span className="text-red-400">*</span>
        </label>
        <input
          id="coop-sk"
          type="text"
          value={data.skNumber}
          onChange={(e) => setData({ ...data, skNumber: e.target.value })}
          placeholder="AHU-000000.AH.01.XX.Tahun"
          className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm
            transition-all duration-200 hover:border-foreground/20
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
        />
      </div>

      {/* Certificate Upload */}
      <FileUploader
        id="coop-certificate"
        label={<>Sertifikat Koperasi <span className="text-red-400">*</span></>}
        value={data.certificate}
        onChange={(file) => setData({ ...data, certificate: file })}
      />
    </div>
  );
}

// ─── Step 2: Admin Account ───────────────────────
function StepAdminAccount({ data, setData }) {
  return (
    <div
      className="space-y-5"
      style={{ animation: 'auth-slide-in-right 0.4s ease-out' }}
    >
      {/* Section header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Akun Admin</h2>
          <p className="text-xs text-muted-foreground">Akun pengurus utama koperasi</p>
        </div>
      </div>

      {/* Admin Full Name */}
      <div className="space-y-1.5">
        <label htmlFor="admin-name" className="block text-sm font-medium text-foreground/80">
          Nama Lengkap Admin <span className="text-red-400">*</span>
        </label>
        <input
          id="admin-name"
          type="text"
          value={data.adminName}
          onChange={(e) => setData({ ...data, adminName: e.target.value })}
          placeholder="Nama lengkap sesuai KTP"
          className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm
            transition-all duration-200 hover:border-foreground/20
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
        />
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="admin-email" className="block text-sm font-medium text-foreground/80">
          Email Resmi <span className="text-red-400">*</span>
        </label>
        <input
          id="admin-email"
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          placeholder="admin@koperasi.co.id"
          className={`w-full h-11 px-4 rounded-xl border bg-background text-sm
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
            ${data.email && !validateEmail(data.email) ? 'border-red-300' : 'border-border hover:border-foreground/20'}`}
        />
        {data.email && !validateEmail(data.email) && (
          <p className="text-xs text-red-500">Format email tidak valid</p>
        )}
      </div>

      {/* Password */}
      <PasswordInput
        id="admin-password"
        label={<>Password <span className="text-red-400">*</span></>}
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
        showStrength
      />

      {/* Confirm Password */}
      <PasswordInput
        id="admin-confirm-password"
        label={<>Konfirmasi Password <span className="text-red-400">*</span></>}
        value={data.confirmPassword}
        onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
        error={
          data.confirmPassword && data.password !== data.confirmPassword
            ? 'Password tidak cocok'
            : ''
        }
      />
    </div>
  );
}

// ─── Main Component ──────────────────────────────
export default function RegisterCooperative() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [data, setData] = useState({
    name: '',
    nik: '',
    nib: '',
    skNumber: '',
    certificate: null,
    adminName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const step1Valid = useMemo(
    () =>
      data.name.trim().length > 0 &&
      validateNIK(data.nik) &&
      validateNIB(data.nib) &&
      validateSK(data.skNumber) &&
      data.certificate !== null,
    [data.name, data.nik, data.nib, data.skNumber, data.certificate]
  );

  const step2Valid = useMemo(
    () =>
      data.adminName.trim().length > 0 &&
      validateEmail(data.email) &&
      data.password.length >= 8 &&
      data.password === data.confirmPassword,
    [data.adminName, data.email, data.password, data.confirmPassword]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!step2Valid) return;
    setSubmitting(true);
    setTimeout(() => {
      navigate('/auth/register-success');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8" style={{ animation: 'auth-fade-up 0.3s ease-out' }}>
          <AuthLogo />
        </div>

        {/* Card */}
        <div
          className="auth-card rounded-2xl p-6 sm:p-8"
          style={{ animation: 'auth-fade-up 0.4s ease-out 0.1s both' }}
        >
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-foreground">Daftar Koperasi Baru</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Lengkapi data berikut untuk mendaftarkan koperasi Anda
            </p>
          </div>

          {/* Step Indicator */}
          <div className="mb-8">
            <StepIndicator steps={STEPS} currentStep={step} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {step === 0 && <StepCooperativeIdentity data={data} setData={setData} />}
            {step === 1 && <StepAdminAccount data={data} setData={setData} />}

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3 mt-8">
              {step === 1 && (
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="flex-1 h-11 rounded-xl border border-border bg-background text-sm font-semibold
                    text-foreground/70 hover:bg-muted transition-all duration-200 cursor-pointer
                    flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali
                </button>
              )}

              {step === 0 ? (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={!step1Valid}
                  className={`flex-1 h-11 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer
                    flex items-center justify-center gap-2
                    ${step1Valid
                      ? 'bg-primary text-primary-foreground hover:brightness-110 shadow-[0_4px_16px_rgba(127,255,0,0.25)]'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                >
                  Selanjutnya
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!step2Valid || submitting}
                  className={`flex-1 h-11 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer
                    flex items-center justify-center gap-2
                    ${step2Valid && !submitting
                      ? 'bg-primary text-primary-foreground hover:brightness-110 shadow-[0_4px_16px_rgba(127,255,0,0.25)]'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mendaftarkan...
                    </>
                  ) : (
                    'Daftar Koperasi'
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Bottom link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Sudah punya akun?{' '}
            <Link to="/auth/login" className="text-primary font-semibold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

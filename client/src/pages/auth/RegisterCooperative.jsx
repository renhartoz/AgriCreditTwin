import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, UserPlus, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { authService } from '@/services/authService';
import AuthLogo from '@/components/auth/AuthLogo';
import StepIndicator from '@/components/auth/StepIndicator';
import PasswordInput from '@/components/auth/PasswordInput';
import FileUploader from '@/components/auth/FileUploader';

const STEPS = ['Identitas Koperasi', 'Akun Admin'];


function validateEmail(email) {
  return /^[^\s@]+@[^\s@x`]+\.[^\s@]+$/.test(email);
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


function StepCooperativeIdentity({ data, setData }) {
  const getBorderClass = (val, isValid) => {
    if (!val) return 'border-border hover:border-foreground/20 focus:ring-primary/30 focus:border-primary/50';
    return isValid 
      ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/30' 
      : 'border-red-400 focus:border-red-500 focus:ring-red-500/30';
  };

  return (
    <div
      className="space-y-5"
      style={{ animation: 'auth-fade-up 0.4s ease-out' }}
    >
      
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Identitas Koperasi</h2>
          <p className="text-xs text-muted-foreground">Data resmi badan hukum koperasi Anda</p>
        </div>
      </div>

      
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
          className={`w-full h-11 px-4 rounded-xl border bg-background text-sm transition-all duration-200 focus:outline-none focus:ring-2
            ${getBorderClass(data.name, data.name.trim().length > 0)}`}
        />
      </div>

      
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
          className={`w-full h-11 px-4 rounded-xl border bg-background text-sm transition-all duration-200 focus:outline-none focus:ring-2
            ${getBorderClass(data.nik, validateNIK(data.nik))}`}
        />
        {data.nik && !validateNIK(data.nik) && (
          <p className="text-xs text-red-500">NIK harus terdiri dari 13-16 digit angka</p>
        )}
      </div>

      
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
          className={`w-full h-11 px-4 rounded-xl border bg-background text-sm transition-all duration-200 focus:outline-none focus:ring-2
            ${getBorderClass(data.nib, validateNIB(data.nib))}`}
        />
        {data.nib && !validateNIB(data.nib) && (
          <p className="text-xs text-red-500">NIB harus terdiri dari 13 digit angka</p>
        )}
      </div>

      
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
          className={`w-full h-11 px-4 rounded-xl border bg-background text-sm transition-all duration-200 focus:outline-none focus:ring-2
            ${getBorderClass(data.skNumber, validateSK(data.skNumber))}`}
        />
        {data.skNumber && !validateSK(data.skNumber) && (
          <p className="text-xs text-red-500">Nomor SK minimal 5 karakter</p>
        )}
      </div>

      
      <FileUploader
        id="coop-certificate"
        label={<>Sertifikat Koperasi <span className="text-red-400">*</span></>}
        value={data.certificate}
        onChange={(file) => setData({ ...data, certificate: file })}
      />
    </div>
  );
}


function StepAdminAccount({ data, setData }) {
  return (
    <div
      className="space-y-5"
      style={{ animation: 'auth-slide-in-right 0.4s ease-out' }}
    >
      
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Akun Admin</h2>
          <p className="text-xs text-muted-foreground">Akun pengurus utama koperasi</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="admin-email" className="block text-sm font-medium text-foreground/80">
          Email Admin <span className="text-xs text-muted-foreground">(digunakan untuk login)</span> <span className="text-red-400">*</span>
        </label>
        <input
          id="admin-email"
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          placeholder="admin@gmail.com"
          className={`w-full h-11 px-4 rounded-xl border bg-background text-sm transition-all duration-200 focus:outline-none focus:ring-2
            ${!data.email 
              ? 'border-border hover:border-foreground/20 focus:ring-primary/30 focus:border-primary/50' 
              : validateEmail(data.email) 
                ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/30' 
                : 'border-red-400 focus:border-red-500 focus:ring-red-500/30'}`}
        />
        {data.email && !validateEmail(data.email) && (
          <p className="text-xs text-red-500">Format email tidak valid</p>
        )}
      </div>

      
      <PasswordInput
        id="admin-password"
        label={<>Password <span className="text-red-400">*</span></>}
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
        showStrength
        valid={data.password.length >= 8}
      />

      
      <PasswordInput
        id="admin-confirm-password"
        label={<>Konfirmasi Password <span className="text-red-400">*</span></>}
        value={data.confirmPassword}
        onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
        valid={data.confirmPassword.length >= 8 && data.password === data.confirmPassword}
        error={
          data.confirmPassword && data.password !== data.confirmPassword
            ? 'Password tidak cocok'
            : ''
        }
      />
    </div>
  );
}


export default function RegisterCooperative() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [data, setData] = useState({
    name: '',
    nik: '',
    nib: '',
    skNumber: '',
    certificate: null,
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
      validateEmail(data.email) &&
      data.password.length >= 8 &&
      data.password === data.confirmPassword,
    [data.email, data.password, data.confirmPassword]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!step2Valid) return;
    setSubmitting(true);
    setSubmitError('');

    try {
      const formData = new FormData();
      formData.append('coop_name', data.name);
      formData.append('nomor_induk_koperasi', data.nik);
      formData.append('sk_badan_hukum', data.skNumber);
      formData.append('nib', data.nib);
      formData.append('verification_document', data.certificate);
      formData.append('username', data.email.split('@')[0]);
      formData.append('email', data.email);
      formData.append('password', data.password);

      console.log('[Register] Submitting registration...');
      const result = await authService.registerTenant(formData);
      console.log('[Register] Success:', result);
      navigate('/auth/register-success');
    } catch (err) {
      console.error('[Register] Error:', err.response?.data || err.message);
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg">
        
        <div className="flex justify-center mb-8" style={{ animation: 'auth-fade-up 0.3s ease-out' }}>
          <AuthLogo />
        </div>

        
        <div
          className="auth-card rounded-2xl p-6 sm:p-8"
          style={{ animation: 'auth-fade-up 0.4s ease-out 0.1s both' }}
        >
          
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-foreground">Daftar Koperasi Baru</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Lengkapi data berikut untuk mendaftarkan koperasi Anda
            </p>
          </div>

          
          <div className="mb-8">
            <StepIndicator steps={STEPS} currentStep={step} />
          </div>

          
          <form onSubmit={handleSubmit}>
            {step === 0 && <StepCooperativeIdentity data={data} setData={setData} />}
            {step === 1 && <StepAdminAccount data={data} setData={setData} />}

            {submitError && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                {submitError}
              </div>
            )}

            
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

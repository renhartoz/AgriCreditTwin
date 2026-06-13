import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Shield, ArrowRight } from 'lucide-react';
import PasswordInput from '@/components/auth/PasswordInput';
import { useAuth } from '@/contexts/AuthContext';

export default function ExternalLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isValid = email.trim().length > 0 && password.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    setError('');
    try {
      const result = await login(email, password);
      const role = result?.user?.role;
      if (role === 'auditor') {
        navigate('/transactions');
      } else {
        navigate('/investor');
      }
    } catch (err) {
      const resData = err.response?.data;
      const msg = resData?.non_field_errors?.[0]
        || resData?.detail
        || resData?.error
        || 'Login gagal. Periksa email dan password Anda.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="corporate-theme min-h-screen flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)' }}
    >
      
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
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #F8FAFC 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        <div className="flex flex-col items-center mb-8" style={{ animation: 'auth-fade-up 0.3s ease-out' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <Link className="text-lg font-bold text-white tracking-wide font-mono" to={"/investor"}>
                <span className="text-indigo-400">AgriCredit</span>
                <span className="text-slate-300">Twin</span>
              </Link>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">
            Investor & Auditor Portal
          </p>
        </div>

        
        <div
          className="corp-card rounded-2xl p-6 sm:p-8"
          style={{ animation: 'auth-fade-up 0.4s ease-out 0.1s both' }}
        >
          <div className="text-center mb-7">
            <h1 className="text-xl font-bold text-white">Masuk ke Portal</h1>
            <p className="text-sm text-slate-400 mt-1">
              Akses data koperasi & laporan investasi
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label htmlFor="ext-login-email" className="block text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                id="ext-login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@perusahaan.co.id"
                className="w-full h-11 px-4 rounded-xl border border-slate-600/50 bg-slate-800/50 text-sm
                  text-white placeholder:text-slate-500
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50
                  hover:border-slate-500"
              />
            </div>

            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="[&_input]:bg-slate-800/50 [&_input]:border-slate-600/50 [&_input]:text-white [&_input]:placeholder-slate-500 [&_input:hover]:border-slate-500 [&_input:focus]:ring-indigo-500/30 [&_input:focus]:border-indigo-500/50 [&_button]:text-slate-400 [&_button:hover]:text-slate-200">
                <PasswordInput
                  id="ext-login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            
            <button
              type="submit"
              disabled={!isValid || submitting}
              className={`w-full h-12 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer
                flex items-center justify-center gap-2
                ${isValid && !submitting
                  ? 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-[0_4px_20px_rgba(99,102,241,0.35)]'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
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

          
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-slate-400">
              Belum punya akun?{' '}
              <Link to="/auth/external/register" className="text-indigo-400 font-semibold hover:underline">
                Daftar di sini
              </Link>
            </p>
            <div className="h-px bg-slate-700/50" />
            <p className="text-xs text-slate-500">
              Bukan Investor/Auditor?{' '}
              <Link to="/auth/login" className="text-slate-400 hover:text-slate-300 hover:underline transition-colors">
                Masuk sebagai Pengurus Koperasi di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react'
import {
  UserPlus,
  Mail,
  User,
  ShieldCheck,
  Copy,
  CheckCircle2,
  X,
  Send,
  Users,
  Clock,
  Link2
} from 'lucide-react'
import { useEffect } from 'react'
import { getOperators, inviteOperator } from '../services/loanService.js'

const ROLE_OPTIONS = [
  { value: 'operator', label: 'Operator Lapangan', desc: 'Petugas survei lahan & input data harian' }
]

function InviteOperator() {
  const cooperativeName = 'Koperasi Padiwangi Utama'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('operator')
  const [isSending, setIsSending] = useState(false)

  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')

  const [toast, setToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)

  const [invitedMembers, setInvitedMembers] = useState([])

  useEffect(() => {
    let cancelled = false
    async function loadOperators() {
      try {
        const data = await getOperators()
        if (!cancelled) {
          setInvitedMembers(data.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role === 'operator' ? 'Operator Lapangan' : 'Admin Koperasi',
            status: user.is_active ? 'active' : 'pending',
            invitedAt: user.joined_at
          })))
        }
      } catch (err) {
        console.error('Failed to load operators', err)
      }
    }
    loadOperators()
    return () => { cancelled = true }
  }, [])

  const validateEmail = (val) => {
    if (!val.trim()) return 'Email wajib diisi.'
    // Mendukung validasi domain secara umum (seperti .co.id, .ac.id, .id, .com, dll)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(val)) return 'Format email tidak valid.'
    return ''
  }

  const handleSendInvite = async () => {
    setNameError('')
    setEmailError('')
    let hasError = false

    if (!name.trim()) {
      setNameError('Nama lengkap wajib diisi.')
      hasError = true
    }

    const eErr = validateEmail(email)
    if (eErr) {
      setEmailError(eErr)
      hasError = true
    }

    if (hasError) return

    setIsSending(true)

    try {
      const response = await inviteOperator({
        name: name.trim(),
        email: email.trim(),
      })

      const selectedRole = ROLE_OPTIONS.find(r => r.value === role)
      const roleName = selectedRole ? selectedRole.label : 'Operator Lapangan'
      
      // Setup URL uses the returned default password logic implicitly if sent via email, 
      // but if we show it on screen, we can pass it (or not)
      const link = `${window.location.origin}/auth/setup-password?email=${encodeURIComponent(email.trim())}&coop=${encodeURIComponent(cooperativeName)}&role=${encodeURIComponent(roleName)}`
      setGeneratedLink(link)

      const newMember = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        role: roleName,
        status: 'pending',
        invitedAt: new Date().toISOString().split('T')[0]
      }
      setInvitedMembers(prev => [newMember, ...prev])

      setName('')
      setEmail('')
      setRole('operator')
      setToastMessage(`Undangan berhasil dikirim ke ${email.trim()}`)
      setToast(true)
      setTimeout(() => setToast(false), 4000)
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Gagal mengirim undangan'
      setToastMessage(errMsg)
      setToast(true)
      setTimeout(() => setToast(false), 4000)
    } finally {
      setIsSending(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
          <CheckCircle2 className="w-3 h-3" />
          Aktif
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
        <Clock className="w-3 h-3" />
        Menunggu
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
              <UserPlus className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              Kelola Tim & Undang Operator
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Undang operator lapangan baru untuk bergabung dengan <span className="font-semibold text-slate-700 dark:text-slate-300">{cooperativeName}</span>.
            </p>
          </div>
          <div className="shrink-0 md:self-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <ShieldCheck className="w-3.5 h-3.5" />
              Manajemen Akses
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left: Invite Form */}
          <div className="lg:col-span-7 space-y-6">

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <Send className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg">Formulir Undangan</h2>
              </div>

              <div className="space-y-5">

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Nama Lengkap <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-950/40 text-slate-950 dark:text-slate-100 font-semibold focus:outline-none text-sm rounded-xl border transition-all ${
                      nameError
                        ? 'border-rose-400 dark:border-rose-900/50 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500'
                        : 'border-slate-200 dark:border-slate-700/80 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500'
                    }`}
                    placeholder="Contoh: Ahmad Dahlan"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setNameError('') }}
                  />
                  {nameError && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1 mt-1">
                      <X className="w-3 h-3" /> {nameError}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Alamat Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    className={`w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-950/40 text-slate-950 dark:text-slate-100 font-semibold focus:outline-none text-sm rounded-xl border transition-all ${
                      emailError
                        ? 'border-rose-400 dark:border-rose-900/50 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500'
                        : 'border-slate-200 dark:border-slate-700/80 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500'
                    }`}
                    placeholder="operator.baru@koperasi.co.id"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
                  />
                  {emailError && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1 mt-1">
                      <X className="w-3 h-3" /> {emailError}
                    </p>
                  )}
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Peran / Role
                  </label>
                  <div className="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100 font-semibold text-sm rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Operator Lapangan</span>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                    Petugas survei lahan & input data harian (Hanya peran Operator yang dapat diundang saat ini)
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="button"
                  onClick={handleSendInvite}
                  disabled={isSending}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  {isSending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Mengirim Undangan...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Kirim Undangan
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated Link Panel */}
            {generatedLink && (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Link2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Tautan Undangan Terakhir</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                  Kirimkan tautan ini kepada operator. Tautan bersifat satu kali pakai dan akan kedaluwarsa dalam <span className="font-semibold text-slate-700 dark:text-slate-300">48 jam</span>.
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-3 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-mono text-slate-600 dark:text-slate-400 truncate select-all">
                    {generatedLink}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`shrink-0 px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                      linkCopied
                        ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {linkCopied ? (
                      <><CheckCircle2 className="w-4 h-4" /> Tersalin</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Salin</>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right: Invited Members List */}
          <div className="lg:col-span-5 space-y-6">

            {/* Team Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xs">
                <div className="flex items-center justify-between text-slate-450 dark:text-slate-500 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Total Anggota Tim</span>
                  <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {invitedMembers.length}
                </span>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  Terdaftar di koperasi
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xs">
                <div className="flex items-center justify-between text-slate-450 dark:text-slate-500 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Menunggu Aktivasi</span>
                  <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                </div>
                <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight">
                  {invitedMembers.filter(m => m.status === 'pending').length}
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1">
                  Belum setup password
                </p>
              </div>
            </div>

            {/* Members List */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">Daftar Anggota Tim</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {invitedMembers.length} orang
                </span>
              </div>

              <div className="space-y-3">
                {invitedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="group relative p-4 bg-slate-50/50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800/60 rounded-xl transition-colors"
                  >
                    <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${
                      member.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} />

                    <div className="pl-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {member.name}
                        </span>
                        {getStatusBadge(member.status)}
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <Mail className="w-3 h-3" />
                          <span className="font-medium">{member.email}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                        <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">
                          {member.role}
                        </span>
                        <span className="font-mono">Diundang: {member.invitedAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Panel */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 mb-1 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Informasi Keamanan
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Tautan undangan bersifat satu kali pakai dan kedaluwarsa dalam 48 jam. Operator yang diundang hanya dapat mengakses fitur sesuai peran yang ditentukan melalui arsitektur <span className="font-semibold text-slate-700 dark:text-slate-300">Role-Based Access Control (RBAC)</span>.
              </p>
              <div className="grid grid-cols-2 gap-3.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block tracking-wider">Kedaluwarsa</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">48 Jam</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block tracking-wider">Autentikasi</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">Sekali Pakai</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Success Toast */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        toast
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-600 text-white rounded-xl shadow-xl shadow-emerald-600/30 font-semibold text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          {toastMessage}
          <button
            onClick={() => setToast(false)}
            className="ml-2 p-0.5 rounded hover:bg-emerald-500 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default InviteOperator

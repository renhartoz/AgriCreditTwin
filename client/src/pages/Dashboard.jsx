import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TriangleAlert,
  Users,
  Coins,
  TrendingUp,
  Landmark,
  ShieldCheck,
  Database,
  Warehouse,
  FileText,
  ArrowRight,
  ClipboardList,
  PackagePlus,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react'
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
  LineChart,
  PieChart,
  Pie,
  Cell,
  BarChart
} from 'recharts'

function Dashboard() {
  // --- Tenant State (Multi-tenant schema alignment) ---
  const [tenantName, setTenantName] = useState('Koperasi Padiwangi Utama')
  const [isVerified, setIsVerified] = useState(true)

  // --- Summary Card Metrics ---
  const activeMembersCount = 1248
  const totalDefaultedAmount = 124500000
  const totalDefaultedCount = 12
  const totalOutstandingLoans = 1842500000
  const totalSavings = 420700000

  // --- Early Warning Table ---
  const [highRiskLoans, setHighRiskLoans] = useState([
    { id: 'LN-2026-004A', memberName: 'Slamet Rahardjo', pd: 78.4, status: 'approved', deficitMonth: 'Juli 2026' },
    { id: 'LN-2026-012B', memberName: 'Ni Made Astuti', pd: 64.1, status: 'restructured', deficitMonth: 'Juli 2026' },
    { id: 'LN-2025-089C', memberName: 'Kuswanto', pd: 59.2, status: 'approved', deficitMonth: 'Juli 2026' },
    { id: 'LN-2026-045X', memberName: 'Siti Aminah', pd: 51.5, status: 'pending', deficitMonth: 'Agustus 2026' },
    { id: 'LN-2025-112Y', memberName: 'Joko Susilo', pd: 92.0, status: 'defaulted', deficitMonth: 'Defisit Segera' }
  ])

  // Recharts Data
  const seasonalCashFlowData = [
    { name: 'Jan', HarvestCycle: 20, CashInflow: 45 },
    { name: 'Feb', HarvestCycle: 15, CashInflow: 50 },
    { name: 'Mar', HarvestCycle: 40, CashInflow: 55 },
    { name: 'Apr', HarvestCycle: 70, CashInflow: 30 },
    { name: 'May', HarvestCycle: 85, CashInflow: 25 },
    { name: 'Jun', HarvestCycle: 90, CashInflow: 15 },
    { name: 'Jul', HarvestCycle: 95, CashInflow: 10 },
    { name: 'Aug', HarvestCycle: 50, CashInflow: 65 },
    { name: 'Sep', HarvestCycle: 30, CashInflow: 75 },
    { name: 'Oct', HarvestCycle: 20, CashInflow: 80 },
    { name: 'Nov', HarvestCycle: 15, CashInflow: 60 },
    { name: 'Dec', HarvestCycle: 25, CashInflow: 50 }
  ]

  const nplReductionTrend = [
    { month: 'Jan', NPL: 22.0, Baseline: 22.0 },
    { month: 'Feb', NPL: 21.2, Baseline: 22.0 },
    { month: 'Mar', NPL: 19.8, Baseline: 22.0 },
    { month: 'Apr', NPL: 19.0, Baseline: 22.0 },
    { month: 'May', NPL: 18.5, Baseline: 22.0 },
    { month: 'Jun', NPL: 18.2, Baseline: 22.0 }
  ]

  const cropLandData = [
    { name: 'Wetland Rice (Padi Sawah)', value: 45, color: '#059669' },
    { name: 'Maize (Jagung)', value: 30, color: '#10b981' },
    { name: 'Cassava (Singkong)', value: 15, color: '#b45309' },
    { name: 'Soybeans (Kedelai)', value: 10, color: '#78716c' }
  ]

  const totalAssetValuation = 847250000
  const assetGrowth = '+12.4%'
  const topCommodities = [
    { name: 'Kayu Jati', volume: 450, unit: 'm³', value: 3825000000 },
    { name: 'Pupuk Urea', volume: 12, unit: 'Ton', value: 33600000 },
    { name: 'Gabah Kering Giling', volume: 4.5, unit: 'Ton', value: 2925000 },
    { name: 'Beras Premium', volume: 1.2, unit: 'Ton', value: 17400000 },
    { name: 'Jagung Pipilan', volume: 3.8, unit: 'Ton', value: 19000000 }
  ]
  const topCommoditiesChart = topCommodities.map(c => ({
    name: c.name,
    volume: c.volume
  }))

  const recentLogs = [
    { time: '14:32 Hari Ini', text: 'Petugas Ahmad mendaftarkan petani Slamet Rahardjo (Luas: 3.4 Ha, Komoditas: Padi)' },
    { time: '11:15 Hari Ini', text: 'Simulasi arus kas digital dijalankan untuk kontrak LN-2026-004A' },
    { time: 'Kemarin', text: 'Peringatan mitigasi defisit ditandai untuk siklus tanaman Juli (Blok Tani Makmur)' },
    { time: '2 hari lalu', text: 'Data satelit kesehatan vegetasi NDVI diperbarui untuk lahan Bumi Lestari' },
    { time: '3 hari lalu', text: 'Petugas Hendra memverifikasi batas lahan untuk 12 pemohon di Parung' }
  ]

  const formatNumberWithDots = (num) => {
    if (num === undefined || num === null || num === '') return '0'
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  // Render status badges in Indonesian
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 uppercase tracking-wider text-[10px]">
            Menunggu
          </span>
        )
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 uppercase tracking-wider text-[10px]">
            Disetujui
          </span>
        )
      case 'restructured':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 uppercase tracking-wider text-[10px]">
            Restrukturisasi
          </span>
        )
      case 'defaulted':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-450 border border-rose-200 dark:border-rose-800/40 uppercase tracking-wider text-[10px]">
            Gagal Bayar
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200 uppercase tracking-wider text-[10px]">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">

        {/* ── HEADER / Active Tenant Context ────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {tenantName}
              </h1>
              <button
                type="button"
                onClick={() => setIsVerified(!isVerified)}
                title="Klik untuk mengubah status verifikasi koperasi"
                className="cursor-pointer transition-all hover:scale-105"
              >
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Koperasi Terverifikasi
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    <XCircle className="w-3.5 h-3.5" />
                    Belum Terverifikasi
                  </span>
                )}
              </button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Dasbor Pembiayaan Pertanian untuk Manajemen Portofolio Kredit Koperasi.
            </p>
          </div>
          <div className="sm:self-center shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <ShieldCheck className="w-3.5 h-3.5" />
              Sistem Terintegrasi Koperasi
            </span>
          </div>
        </div>

        {/* ── SUMMARY CARDS: Strict Schema Metrics ───────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Card 1: Active Members */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-450 dark:text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Anggota Aktif</span>
                <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="mt-3">
                <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {formatNumberWithDots(activeMembersCount)}
                </span>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  Terdaftar dalam sistem koperasi
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Jumlah total anggota terdaftar
              </p>
            </div>
          </div>

          {/* Card 2: Total Defaulted Loans */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-450 dark:text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Kredit Gagal Bayar</span>
                <TriangleAlert className="w-4 h-4 text-rose-500 animate-pulse" />
              </div>
              <div className="mt-3">
                <span className="text-xl md:text-2xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight">
                  Rp {formatNumberWithDots(totalDefaultedAmount)}
                </span>
                <p className="text-[10px] text-rose-500 font-semibold mt-1">
                  Dari {totalDefaultedCount} kontrak berjalan
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Pinjaman dengan status Gagal Bayar
              </p>
            </div>
          </div>

          {/* Card 3: Total Outstanding Loans */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-450 dark:text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Total Kredit Berjalan</span>
                <Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="mt-3">
                <span className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  Rp {formatNumberWithDots(totalOutstandingLoans)}
                </span>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  Dana yang sedang disalurkan di lapangan
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Total pinjaman berstatus Disalurkan
              </p>
            </div>
          </div>

          {/* Card 4: Total Savings */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-450 dark:text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Total Simpanan Anggota</span>
                <Landmark className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="mt-3">
                <span className="text-xl md:text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 tracking-tight">
                  Rp {formatNumberWithDots(totalSavings)}
                </span>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  Dana cadangan anggota untuk musim tanam
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Total setoran simpanan masuk
              </p>
            </div>
          </div>

        </div>

        {/* ── MIDDLE SECTION: Recharts Visualizations ─────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Seasonal Cash Flow (spans 2 cols) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">Analisis Arus Kas Musiman</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Perbandingan indeks siklus tanam/panen dengan proyeksi pemasukan</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/45 animate-pulse whitespace-nowrap">
                Risiko Defisit Juli
              </span>
            </div>
            <div className="h-72 w-full text-xs font-sans">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={seasonalCashFlowData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800/40" />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
                  <ReferenceArea x1="Jul" x2="Jul" fill="#fee2e2" stroke="#ef4444" strokeDasharray="3 3" opacity={0.3} />
                  <Bar dataKey="HarvestCycle" name="Siklus Tanam/Panen" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Line type="monotone" dataKey="CashInflow" name="Proyeksi Pemasukan Kas" stroke="#0ea5e9" strokeWidth={3} dot={{ stroke: '#0ea5e9', strokeWidth: 2, r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* MoM NPL Reduction */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col">
            <div className="mb-4 border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Penurunan Kredit Bermasalah (NPL) Bulanan</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Dampak dari penerapan validasi profil risiko digital</p>
            </div>
            <div className="flex-1 w-full text-xs min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={nplReductionTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800/40" />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" domain={[15, 25]} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="Baseline" name="Rata-rata Pasar" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="NPL" name="NPL Koperasi" stroke="#10b981" strokeWidth={3} dot={{ stroke: '#10b981', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* ── ALERTS SECTION: High Default Probability Loans ─────── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/50 overflow-hidden shadow-xs">
          <div className="bg-rose-50/30 dark:bg-rose-950/10 border-b border-rose-100 dark:border-rose-900/40 p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center text-rose-600 dark:text-rose-450 shrink-0">
              <TriangleAlert className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Sistem Peringatan Dini Risiko Kredit
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pemantauan Risiko Gagal Bayar Berdasarkan Proyeksi Stokastik Lahan
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50/75 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800/80 text-slate-400 dark:text-slate-500 text-xs font-mono uppercase">
                <tr>
                  <th className="px-6 py-3.5">Nama Anggota (Petani)</th>
                  <th className="px-6 py-3.5">ID Pinjaman (Kontrak)</th>
                  <th className="px-6 py-3.5 text-center">Probabilitas Gagal Bayar (PD)</th>
                  <th className="px-6 py-3.5">Siklus Defisit</th>
                  <th className="px-6 py-3.5">Status Pinjaman</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {highRiskLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{loan.memberName}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{loan.id}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${loan.pd > 70 ? 'bg-red-500' : 'bg-amber-500'}`}
                            style={{ width: `${loan.pd}%` }}
                          />
                        </div>
                        <span className={`font-mono text-xs font-bold ${loan.pd > 70 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          {loan.pd}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-450">{loan.deficitMonth}</td>
                    <td className="px-6 py-4">{getStatusBadge(loan.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/simulation?loan_id=${loan.id}&amount=${loan.pd > 80 ? 100000000 : 150000000}`}>
                        <button className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-350 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                          Restrukturisasi
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── BOTTOM SECTION: Warehouse & Logs ──────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">

          {/* Warehouse Asset Valuation */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Warehouse className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100">Ikhtisar Inventaris Gudang</h3>
              </div>

              <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/40 dark:from-emerald-950/20 dark:to-emerald-900/10 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl mb-5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600/80 dark:text-emerald-400 block">Valuasi Aset Gudang Saat Ini</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl md:text-2xl font-extrabold text-emerald-800 dark:text-emerald-350 tracking-tight">
                    Rp {formatNumberWithDots(totalAssetValuation)}
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    {assetGrowth} kuartal ini
                  </span>
                </div>
                <p className="text-[10px] text-emerald-600/70 dark:text-emerald-550 mt-1 font-medium">Akumulasi Jumlah × Harga pasar komoditas yang disimpan</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Komoditas Teratas Berdasarkan Volume</h4>
                <div className="h-44 w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topCommoditiesChart} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800/30" horizontal={false} />
                      <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                      <YAxis type="category" dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} width={110} />
                      <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
                      <Bar dataKey="volume" name="Volume" fill="#10b981" radius={[0, 6, 6, 0]} maxBarSize={22} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 space-y-2">
                  {topCommodities.map((c, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs px-2">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">{c.name}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{c.volume} {c.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-5">
              <Link to="/data-entry">
                <button className="w-full flex items-center justify-center gap-1.5 py-3 border border-dashed border-emerald-600/30 hover:border-emerald-600 dark:border-emerald-800/30 dark:hover:border-emerald-400 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl transition-all cursor-pointer">
                  <PackagePlus className="w-4 h-4" />
                  Catat Transaksi Baru
                </button>
              </Link>
            </div>
          </div>

          {/* Recent Operations Log */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Aktivitas Lapangan Terbaru</h3>
            </div>
            <div className="relative border-l border-slate-200 dark:border-slate-800 pl-4 ml-2 space-y-6 py-2">
              {recentLogs.map((log, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[21px] mt-1.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-600 group-hover:scale-110 transition-transform shadow-xs" />
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block">{log.time}</span>
                  <p className="text-sm text-slate-650 dark:text-slate-405 mt-1 leading-relaxed">{log.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Dashboard
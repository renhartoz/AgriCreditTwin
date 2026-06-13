import { useState, useRef, useEffect, useMemo } from 'react'
import {
  Search,
  X,
  ChevronDown,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  AlertCircle,
  CheckCircle2,
  Activity,
  BarChart3,
  PieChart,
  Landmark,
  Sprout,
  Info,
  Building2,
  MapPin,
  BadgeCheck,
  Zap
} from 'lucide-react'
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import { getPortfolio } from '../services/analyticsService.js'


const COOPERATIVES_LIST = [
  {
    id: 'KOP-001',
    name: 'Koperasi Padiwangi',
    location: 'Kab. Subang, Jawa Barat',
    members: 342,
    verified: true,
    pd: 3.2,
    riskLevel: 'LOW',
    totalLoans: 4850000000,
    ldr: 72.4,
    npl: 1.8,
    avgYield: 6.2,
    commodity: 'Padi',
    defaultHistory: [
      { month: 'Jan', pd: 4.1, liquidity: 82 },
      { month: 'Feb', pd: 3.8, liquidity: 79 },
      { month: 'Mar', pd: 3.5, liquidity: 75 },
      { month: 'Apr', pd: 2.9, liquidity: 88 },
      { month: 'Mei', pd: 2.4, liquidity: 91 },
      { month: 'Jun', pd: 2.8, liquidity: 86 },
      { month: 'Jul', pd: 3.1, liquidity: 83 },
      { month: 'Ags', pd: 3.3, liquidity: 80 },
      { month: 'Sep', pd: 3.0, liquidity: 84 },
      { month: 'Okt', pd: 2.7, liquidity: 87 },
      { month: 'Nov', pd: 3.4, liquidity: 78 },
      { month: 'Des', pd: 3.2, liquidity: 81 }
    ],
    stressTest: [
      { scenario: 'Normal', cashflow: 120, stress: 100 },
      { scenario: 'Gagal Panen (-30%)', cashflow: 84, stress: 72 },
      { scenario: 'Harga Jatuh (-25%)', cashflow: 90, stress: 68 },
      { scenario: 'Bencana Alam', cashflow: 45, stress: 38 },
      { scenario: 'Kombinasi Risiko', cashflow: 32, stress: 25 }
    ],
    riskRadar: [
      { axis: 'Kredit', value: 85 },
      { axis: 'Likuiditas', value: 78 },
      { axis: 'Operasional', value: 90 },
      { axis: 'Pasar', value: 72 },
      { axis: 'Pertanian', value: 88 },
      { axis: 'Kepatuhan', value: 95 }
    ]
  },
  {
    id: 'KOP-002',
    name: 'Koperasi Tani Makmur',
    location: 'Kab. Indramayu, Jawa Barat',
    members: 518,
    verified: true,
    pd: 8.7,
    riskLevel: 'WARNING',
    totalLoans: 7200000000,
    ldr: 88.1,
    npl: 4.5,
    avgYield: 5.1,
    commodity: 'Padi & Jagung',
    defaultHistory: [
      { month: 'Jan', pd: 7.2, liquidity: 65 },
      { month: 'Feb', pd: 7.8, liquidity: 62 },
      { month: 'Mar', pd: 8.1, liquidity: 58 },
      { month: 'Apr', pd: 8.5, liquidity: 55 },
      { month: 'Mei', pd: 9.2, liquidity: 52 },
      { month: 'Jun', pd: 8.9, liquidity: 54 },
      { month: 'Jul', pd: 8.3, liquidity: 60 },
      { month: 'Ags', pd: 7.9, liquidity: 63 },
      { month: 'Sep', pd: 8.6, liquidity: 57 },
      { month: 'Okt', pd: 9.1, liquidity: 51 },
      { month: 'Nov', pd: 8.8, liquidity: 56 },
      { month: 'Des', pd: 8.7, liquidity: 58 }
    ],
    stressTest: [
      { scenario: 'Normal', cashflow: 100, stress: 88 },
      { scenario: 'Gagal Panen (-30%)', cashflow: 65, stress: 52 },
      { scenario: 'Harga Jatuh (-25%)', cashflow: 72, stress: 55 },
      { scenario: 'Bencana Alam', cashflow: 30, stress: 22 },
      { scenario: 'Kombinasi Risiko', cashflow: 18, stress: 12 }
    ],
    riskRadar: [
      { axis: 'Kredit', value: 62 },
      { axis: 'Likuiditas', value: 55 },
      { axis: 'Operasional', value: 70 },
      { axis: 'Pasar', value: 58 },
      { axis: 'Pertanian', value: 65 },
      { axis: 'Kepatuhan', value: 80 }
    ]
  },
  {
    id: 'KOP-003',
    name: 'Koperasi Agro Jaya',
    location: 'Kab. Karawang, Jawa Barat',
    members: 189,
    verified: false,
    pd: 18.4,
    riskLevel: 'HIGH_RISK',
    totalLoans: 2100000000,
    ldr: 95.6,
    npl: 9.2,
    avgYield: 3.8,
    commodity: 'Singkong',
    defaultHistory: [
      { month: 'Jan', pd: 15.2, liquidity: 42 },
      { month: 'Feb', pd: 16.1, liquidity: 38 },
      { month: 'Mar', pd: 17.5, liquidity: 35 },
      { month: 'Apr', pd: 18.2, liquidity: 32 },
      { month: 'Mei', pd: 19.8, liquidity: 28 },
      { month: 'Jun', pd: 20.1, liquidity: 25 },
      { month: 'Jul', pd: 19.5, liquidity: 30 },
      { month: 'Ags', pd: 18.9, liquidity: 33 },
      { month: 'Sep', pd: 18.0, liquidity: 36 },
      { month: 'Okt', pd: 17.6, liquidity: 38 },
      { month: 'Nov', pd: 18.8, liquidity: 34 },
      { month: 'Des', pd: 18.4, liquidity: 35 }
    ],
    stressTest: [
      { scenario: 'Normal', cashflow: 78, stress: 62 },
      { scenario: 'Gagal Panen (-30%)', cashflow: 42, stress: 28 },
      { scenario: 'Harga Jatuh (-25%)', cashflow: 50, stress: 35 },
      { scenario: 'Bencana Alam', cashflow: 15, stress: 8 },
      { scenario: 'Kombinasi Risiko', cashflow: 8, stress: 3 }
    ],
    riskRadar: [
      { axis: 'Kredit', value: 35 },
      { axis: 'Likuiditas', value: 28 },
      { axis: 'Operasional', value: 50 },
      { axis: 'Pasar', value: 42 },
      { axis: 'Pertanian', value: 38 },
      { axis: 'Kepatuhan', value: 55 }
    ]
  },
  {
    id: 'KOP-004',
    name: 'Koperasi Sumber Rejeki',
    location: 'Kab. Cirebon, Jawa Barat',
    members: 276,
    verified: true,
    pd: 5.1,
    riskLevel: 'LOW',
    totalLoans: 3400000000,
    ldr: 68.9,
    npl: 2.3,
    avgYield: 5.8,
    commodity: 'Padi',
    defaultHistory: [
      { month: 'Jan', pd: 5.8, liquidity: 76 },
      { month: 'Feb', pd: 5.5, liquidity: 74 },
      { month: 'Mar', pd: 5.2, liquidity: 78 },
      { month: 'Apr', pd: 4.8, liquidity: 82 },
      { month: 'Mei', pd: 4.5, liquidity: 85 },
      { month: 'Jun', pd: 4.9, liquidity: 80 },
      { month: 'Jul', pd: 5.3, liquidity: 77 },
      { month: 'Ags', pd: 5.6, liquidity: 73 },
      { month: 'Sep', pd: 5.0, liquidity: 79 },
      { month: 'Okt', pd: 4.7, liquidity: 83 },
      { month: 'Nov', pd: 5.4, liquidity: 75 },
      { month: 'Des', pd: 5.1, liquidity: 78 }
    ],
    stressTest: [
      { scenario: 'Normal', cashflow: 115, stress: 98 },
      { scenario: 'Gagal Panen (-30%)', cashflow: 78, stress: 65 },
      { scenario: 'Harga Jatuh (-25%)', cashflow: 85, stress: 72 },
      { scenario: 'Bencana Alam', cashflow: 40, stress: 32 },
      { scenario: 'Kombinasi Risiko', cashflow: 28, stress: 20 }
    ],
    riskRadar: [
      { axis: 'Kredit', value: 80 },
      { axis: 'Likuiditas', value: 75 },
      { axis: 'Operasional', value: 82 },
      { axis: 'Pasar', value: 68 },
      { axis: 'Pertanian', value: 85 },
      { axis: 'Kepatuhan', value: 90 }
    ]
  },
  {
    id: 'KOP-005',
    name: 'Koperasi Harapan Tani',
    location: 'Kab. Purwakarta, Jawa Barat',
    members: 412,
    verified: true,
    pd: 11.3,
    riskLevel: 'WARNING',
    totalLoans: 5600000000,
    ldr: 82.7,
    npl: 5.8,
    avgYield: 4.5,
    commodity: 'Kedelai & Jagung',
    defaultHistory: [
      { month: 'Jan', pd: 10.1, liquidity: 58 },
      { month: 'Feb', pd: 10.8, liquidity: 55 },
      { month: 'Mar', pd: 11.5, liquidity: 52 },
      { month: 'Apr', pd: 12.0, liquidity: 48 },
      { month: 'Mei', pd: 12.8, liquidity: 45 },
      { month: 'Jun', pd: 11.9, liquidity: 50 },
      { month: 'Jul', pd: 11.2, liquidity: 54 },
      { month: 'Ags', pd: 10.5, liquidity: 57 },
      { month: 'Sep', pd: 11.0, liquidity: 53 },
      { month: 'Okt', pd: 11.8, liquidity: 49 },
      { month: 'Nov', pd: 12.2, liquidity: 46 },
      { month: 'Des', pd: 11.3, liquidity: 52 }
    ],
    stressTest: [
      { scenario: 'Normal', cashflow: 92, stress: 78 },
      { scenario: 'Gagal Panen (-30%)', cashflow: 58, stress: 42 },
      { scenario: 'Harga Jatuh (-25%)', cashflow: 65, stress: 48 },
      { scenario: 'Bencana Alam', cashflow: 25, stress: 15 },
      { scenario: 'Kombinasi Risiko', cashflow: 12, stress: 8 }
    ],
    riskRadar: [
      { axis: 'Kredit', value: 55 },
      { axis: 'Likuiditas', value: 48 },
      { axis: 'Operasional', value: 65 },
      { axis: 'Pasar', value: 52 },
      { axis: 'Pertanian', value: 58 },
      { axis: 'Kepatuhan', value: 72 }
    ]
  }
]


const formatBillions = (val) => {
  if (val >= 1000000000) return `${(val / 1000000000).toFixed(1)} M`
  if (val >= 1000000) return `${(val / 1000000).toFixed(0)} Jt`
  return val.toLocaleString('id-ID')
}

const getRiskConfig = (level) => {
  switch (level) {
    case 'LOW':
      return {
        label: 'Risiko Rendah',
        color: 'text-emerald-700 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40',
        icon: <CheckCircle2 className="w-4 h-4" />,
        chartColor: '#10b981',
        barColor: '#10b981'
      }
    case 'WARNING':
      return {
        label: 'Risiko Sedang',
        color: 'text-amber-700 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40',
        icon: <TriangleAlert className="w-4 h-4" />,
        chartColor: '#f59e0b',
        barColor: '#f59e0b'
      }
    case 'HIGH_RISK':
      return {
        label: 'Risiko Tinggi',
        color: 'text-rose-700 dark:text-rose-400',
        bg: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/40',
        icon: <AlertCircle className="w-4 h-4" />,
        chartColor: '#ef4444',
        barColor: '#ef4444'
      }
    default:
      return {
        label: level,
        color: 'text-slate-600',
        bg: 'bg-slate-50 border-slate-200',
        icon: <Info className="w-4 h-4" />,
        chartColor: '#94a3b8',
        barColor: '#94a3b8'
      }
  }
}


const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl text-xs min-w-[180px]">
        <p className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-1.5">
          {label}
        </p>
        <div className="space-y-1">
          {payload.map((item, i) => (
            <div key={i} className="flex justify-between items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-500 dark:text-slate-400">{item.name}</span>
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {typeof item.value === 'number' ? item.value.toFixed(1) : item.value}
                {item.name?.includes('PD') || item.name?.includes('%') ? '%' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}




function RiskDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCooperative, setSelectedCooperative] = useState(COOPERATIVES_LIST[0])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [portfolioData, setPortfolioData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const inputRef = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    async function fetchPortfolio() {
      try {
        setLoading(true)
        const data = await getPortfolio()
        if (cancelled) return
        setPortfolioData(data)
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to fetch portfolio:', err)
          setFetchError('Gagal memuat data portofolio. Menggunakan data sementara.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchPortfolio()
    return () => { cancelled = true }
  }, [])

  const enrichedCooperative = useMemo(() => {
    if (!portfolioData) return selectedCooperative
    return {
      ...selectedCooperative,
      npl: portfolioData.npl_rate != null ? (portfolioData.npl_rate * 100) : selectedCooperative.npl,
      totalLoans: portfolioData.total_disbursed ? parseFloat(portfolioData.total_disbursed) : selectedCooperative.totalLoans,
    }
  }, [selectedCooperative, portfolioData])

  
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  
  const filteredCooperatives = useMemo(() => {
    if (!searchQuery.trim()) return COOPERATIVES_LIST
    return COOPERATIVES_LIST.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const handleSelect = (coop) => {
    setIsTransitioning(true)
    setSelectedCooperative(coop)
    setSearchQuery('')
    setDropdownOpen(false)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const handleClear = () => {
    setSearchQuery('')
    setDropdownOpen(false)
    inputRef.current?.focus()
  }

  const risk = getRiskConfig(enrichedCooperative.riskLevel)

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">

        {loading && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-400 text-xs font-semibold">
            <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
            Memuat data portofolio dari server...
          </div>
        )}
        {fetchError && !loading && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-400 text-xs font-semibold">
            <AlertCircle className="w-4 h-4" />
            {fetchError}
          </div>
        )}

        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
              <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              Dasbor Risiko Investor
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Pantau proyeksi risiko gagal bayar dan stress test likuiditas portofolio kredit koperasi desa.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <Zap className="w-3.5 h-3.5" />
              Analisis Real-time
            </span>
          </div>
        </div>

        
        <div className="relative" ref={wrapperRef}>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center gap-4">

              
              <div className="flex-1 relative">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Pilih Koperasi Desa
                </label>
                <div className="relative rounded-xl border border-slate-200 dark:border-slate-700/80 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all bg-slate-50/50 dark:bg-slate-950/40">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <input
                    ref={inputRef}
                    type="text"
                    className="w-full pl-11 pr-20 py-3.5 bg-transparent text-slate-950 dark:text-slate-100 font-semibold focus:outline-none text-sm placeholder:font-normal placeholder:text-slate-400"
                    placeholder="Cari dan pilih koperasi desa..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      if (!dropdownOpen) setDropdownOpen(true)
                    }}
                    onFocus={() => setDropdownOpen(true)}
                  />
                  
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {(searchQuery || selectedCooperative) && (
                      <button
                        type="button"
                        onClick={handleClear}
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(!dropdownOpen)
                        inputRef.current?.focus()
                      }}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                    >
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                
                {dropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl shadow-slate-200/50 dark:shadow-black/30 overflow-hidden max-h-80 overflow-y-auto">
                    {filteredCooperatives.length > 0 ? (
                      filteredCooperatives.map((coop) => {
                        const cr = getRiskConfig(coop.riskLevel)
                        const isSelected = selectedCooperative?.id === coop.id
                        return (
                          <button
                            key={coop.id}
                            type="button"
                            onClick={() => handleSelect(coop)}
                            className={`w-full text-left px-4 py-3.5 text-sm transition-colors cursor-pointer flex items-center gap-3 ${
                              isSelected
                                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-emerald-500'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-4 border-transparent'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                                  {coop.name}
                                </span>
                                {coop.verified && (
                                  <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {coop.location}
                                </span>
                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                                  {coop.id}
                                </span>
                              </div>
                            </div>
                            <div className="shrink-0 flex flex-col items-end gap-1">
                              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${cr.bg} ${cr.color}`}>
                                {cr.label}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                                PD: {coop.pd}%
                              </span>
                            </div>
                          </button>
                        )
                      })
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <Search className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                          Koperasi tidak ditemukan
                        </p>
                        <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">
                          Coba kata kunci lain atau periksa ejaan
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              
              <div className="md:w-auto shrink-0">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2 md:text-right">
                  Koperasi Aktif
                </label>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${
                  isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                } ${risk.bg}`}>
                  <div className={`${risk.color}`}>
                    {risk.icon}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${risk.color}`}>
                      {selectedCooperative.name}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      PD: {enrichedCooperative.pd}% • {risk.label}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-300 ${
          isTransitioning ? 'opacity-40 translate-y-1' : 'opacity-100 translate-y-0'
        }`}>
          
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Probabilitas Gagal Bayar
              </span>
              <TrendingDown className={`w-4 h-4 ${enrichedCooperative.pd < 5 ? 'text-emerald-500' : enrichedCooperative.pd < 15 ? 'text-amber-500' : 'text-rose-500'}`} />
            </div>
            <p className={`text-2xl font-extrabold ${risk.color}`}>
              {enrichedCooperative.pd}%
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Simulasi Monte Carlo 250 siklus</p>
          </div>

          
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Rasio Pinjaman (LDR)
              </span>
              <Activity className={`w-4 h-4 ${enrichedCooperative.ldr < 80 ? 'text-emerald-500' : enrichedCooperative.ldr < 90 ? 'text-amber-500' : 'text-rose-500'}`} />
            </div>
            <p className={`text-2xl font-extrabold ${
              enrichedCooperative.ldr < 80 ? 'text-emerald-600 dark:text-emerald-400' : enrichedCooperative.ldr < 90 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
            }`}>
              {enrichedCooperative.ldr}%
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Loan-to-Deposit Ratio</p>
          </div>

          
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Kredit Bermasalah (NPL)
              </span>
              <TriangleAlert className={`w-4 h-4 ${enrichedCooperative.npl < 3 ? 'text-emerald-500' : enrichedCooperative.npl < 7 ? 'text-amber-500' : 'text-rose-500'}`} />
            </div>
            <p className={`text-2xl font-extrabold ${
              enrichedCooperative.npl < 3 ? 'text-emerald-600 dark:text-emerald-400' : enrichedCooperative.npl < 7 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
            }`}>
              {enrichedCooperative.npl}%
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Non-Performing Loan Ratio</p>
          </div>

          
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Total Portofolio Kredit
              </span>
              <Landmark className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
              Rp {formatBillions(enrichedCooperative.totalLoans)}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{enrichedCooperative.members} anggota aktif</p>
          </div>
        </div>

        
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-300 ${
          isTransitioning ? 'opacity-40 translate-y-1' : 'opacity-100 translate-y-0'
        }`}>

          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                  <BarChart3 className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                  Tren Probabilitas Gagal Bayar
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  Proyeksi Monte Carlo 12 bulan terakhir
                </p>
              </div>
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg border ${risk.bg} ${risk.color}`}>
                {risk.label}
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={selectedCooperative.defaultHistory} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="pdGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={risk.chartColor} stopOpacity={0.15} />
                      <stop offset="100%" stopColor={risk.chartColor} stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 10, fontWeight: 500 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} width={45} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="pd" name="PD" stroke="none" fill="url(#pdGradient)" />
                  <Line
                    type="monotone"
                    dataKey="pd"
                    stroke={risk.chartColor}
                    strokeWidth={2.5}
                    dot={{ stroke: risk.chartColor, strokeWidth: 2, r: 3, fill: '#fff' }}
                    activeDot={{ r: 5, strokeWidth: 2 }}
                    name="Probabilitas Gagal Bayar (%)"
                  />
                  <ReferenceLine y={5} stroke="#10b981" strokeDasharray="3 3" strokeWidth={1.5}>
                  </ReferenceLine>
                  <ReferenceLine y={15} stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1.5}>
                  </ReferenceLine>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-emerald-500 rounded" />
                Batas Aman (5%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-rose-500 rounded" />
                Batas Bahaya (15%)
              </span>
            </div>
          </div>

          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                  <Activity className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                  Uji Tekanan Likuiditas
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  Skenario stres likuiditas portofolio
                </p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={selectedCooperative.stressTest} margin={{ top: 5, right: 10, left: -10, bottom: 5 }} barGap={4}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="scenario" stroke="#94a3b8" tick={{ fontSize: 9, fontWeight: 500 }} interval={0} angle={0} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} width={45} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="cashflow" name="Arus Kas" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="stress" name="Skor Ketahanan" fill="#0ea5e9" radius={[6, 6, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                Arus Kas (%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" />
                Skor Ketahanan (%)
              </span>
            </div>
          </div>

          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                  <TrendingUp className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                  Tren Likuiditas Bulanan
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  Indeks kesehatan likuiditas koperasi
                </p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={selectedCooperative.defaultHistory} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="liqGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 10, fontWeight: 500 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} width={45} domain={[0, 100]} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="liquidity"
                    stroke="#0ea5e9"
                    strokeWidth={2.5}
                    fill="url(#liqGradient)"
                    dot={{ stroke: '#0ea5e9', strokeWidth: 2, r: 3, fill: '#fff' }}
                    activeDot={{ r: 5, strokeWidth: 2 }}
                    name="Likuiditas (%)"
                  />
                  <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="3 3" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                Indeks Likuiditas
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-amber-500 rounded" />
                Batas Waspada (50%)
              </span>
            </div>
          </div>

          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                  <PieChart className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                  Profil Risiko Multi-Dimensi
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  Pemetaan risiko 6 dimensi koperasi
                </p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={selectedCooperative.riskRadar} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} stroke="#cbd5e1" />
                  <Radar
                    name="Skor Kesehatan"
                    dataKey="value"
                    stroke={risk.chartColor}
                    fill={risk.chartColor}
                    fillOpacity={0.15}
                    strokeWidth={2}
                    dot={{ r: 3, fill: risk.chartColor }}
                  />
                  <Tooltip content={<ChartTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: risk.chartColor }} />
                Skor per Dimensi (0-100)
              </span>
            </div>
          </div>

        </div>

        
        <div className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs transition-all duration-300 ${
          isTransitioning ? 'opacity-40' : 'opacity-100'
        }`}>
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Ringkasan Profil Koperasi
            </h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 rounded-xl">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
                Nama Koperasi
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block flex items-center gap-1.5">
                {selectedCooperative.name}
                {selectedCooperative.verified && <BadgeCheck className="w-4 h-4 text-emerald-500" />}
              </span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 rounded-xl">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
                Lokasi
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {selectedCooperative.location}
              </span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 rounded-xl">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
                Komoditas Utama
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-emerald-500" />
                {selectedCooperative.commodity}
              </span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 rounded-xl">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
                Hasil Panen Rata-rata
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                {selectedCooperative.avgYield} Ton/Ha
              </span>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl border bg-slate-50/50 dark:bg-slate-950/30 border-slate-200/50 dark:border-slate-800/60">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              <span className="font-bold text-slate-700 dark:text-slate-300">Catatan Analisis:</span> Data proyeksi risiko dihitung berdasarkan simulasi Monte Carlo 250 siklus tanam dengan variasi harga pasar komoditas dan volatilitas hasil panen historis. Uji tekanan likuiditas mencakup 5 skenario mulai dari kondisi normal hingga kombinasi risiko terburuk. Skor profil risiko multi-dimensi mengukur 6 aspek kritis kesehatan koperasi sebagai entitas debitur.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default RiskDashboard

import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Play,
  RotateCcw,
  ShieldCheck,
  Coins,
  Sprout,
  Landmark,
  TriangleAlert,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Info,
  Search
} from 'lucide-react'
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts'
import { getTrustScore } from '../services/simulationService.js'

const COMMODITY_PRICES = {
  'Rice': 6500000,
  'Maize': 4500000,
  'Cassava': 2000000,
  'Soybeans': 9000000
}

const MONTHS_LIST = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' }
]

const CustomLegend = (props) => {
  const { payload } = props
  if (!payload) return null
  
  const items = payload.filter(item => item.value !== 'range' && item.dataKey !== 'range' && item.payload?.dataKey !== 'range')
  
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-6 mt-1">
      {items.map((entry, index) => {
        const dataKey = entry.dataKey || entry.payload?.dataKey
        let colorClass = ''
        let bgClass = ''
        
        if (dataKey === 'p90') {
          colorClass = 'text-emerald-700 dark:text-emerald-400'
          bgClass = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40'
        } else if (dataKey === 'p10') {
          colorClass = 'text-rose-700 dark:text-rose-455'
          bgClass = 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40'
        } else if (dataKey === 'p50') {
          colorClass = 'text-sky-700 dark:text-sky-400'
          bgClass = 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/40'
        }
        
        return (
          <div
            key={`legend-${index}`}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${bgClass} ${colorClass} transition-colors`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.value}</span>
          </div>
        )
      })}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const items = payload.filter(item => item.name !== 'range' && item.dataKey !== 'range')
    
    const formatRupiah = (val) => {
      if (val === undefined || val === null) return 'Rp 0'
      const isNeg = val < 0
      const absVal = Math.abs(val)
      return `${isNeg ? '-' : ''}Rp ${absVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
    }

    return (
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-2.5 text-xs min-w-[240px]">
        <p className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1.5">
          {label}
        </p>
        <div className="space-y-1.5">
          {items.map((item, index) => {
            let colorClass = 'text-slate-600 dark:text-slate-400'
            if (item.dataKey === 'p90') colorClass = 'text-emerald-600 dark:text-emerald-400 font-semibold'
            if (item.dataKey === 'p10') colorClass = 'text-rose-600 dark:text-rose-400 font-semibold'
            if (item.dataKey === 'p50') colorClass = 'text-sky-600 dark:text-sky-400 font-semibold'
            
            return (
              <div key={index} className="flex justify-between items-center gap-4">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className={colorClass}>{item.name}</span>
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                  {formatRupiah(item.value)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  return null
}

const calculateSimulation = ({
  tenor,
  amount,
  declaredYield,
  livingCost,
  farmingCost,
  commodity,
  plantingMonth,
  harvestMonth
}) => {
  const numSimulations = 250
  const basePrice = COMMODITY_PRICES[commodity] || 6500000

  const monthlyInstallment = amount / tenor
  const monthlyInterestRate = 0.005

  const trajectories = []
  let accumulatedExpectedRevenue = 0
  let accumulatedExpectedOutflow = 0
  let defaultCount = 0

  for (let s = 0; s < numSimulations; s++) {
    let currentBalance = 0
    const path = [currentBalance]
    let pathRevenue = 0
    let pathOutflow = 0
    let hasPathDefaulted = false

    for (let t = 1; t <= tenor; t++) {
      const currentMonthNum = ((t - 1) % 12) + 1

      let inflow = 0
      if (t === 1) {
        inflow += amount
      }

      if (currentMonthNum === harvestMonth) {
        const yieldVariation = -0.18 + Math.random() * 0.28
        const simulatedYield = Math.max(0, declaredYield * (1 + yieldVariation))

        const priceVariation = -0.15 + Math.random() * 0.30
        const simulatedPrice = Math.max(0, basePrice * (1 + priceVariation))

        const harvestRevenue = simulatedYield * simulatedPrice
        inflow += harvestRevenue
        pathRevenue += harvestRevenue
      }

      const outstandingLoan = Math.max(0, amount - (t - 1) * monthlyInstallment)
      const interestPayment = outstandingLoan * monthlyInterestRate
      const debtService = monthlyInstallment + interestPayment

      const livingVariation = -0.08 + Math.random() * 0.18
      const simulatedLiving = livingCost * (1 + livingVariation)

      const farmingVariation = currentMonthNum === plantingMonth ? 0.30 : 0
      const simulatedFarming = farmingCost * (1 + farmingVariation + (-0.10 + Math.random() * 0.20))

      const monthlyOut = simulatedLiving + simulatedFarming + debtService
      pathOutflow += monthlyOut

      currentBalance = currentBalance + inflow - monthlyOut
      path.push(currentBalance)

      if (currentBalance < 0) {
        hasPathDefaulted = true
      }
    }

    trajectories.push(path)
    accumulatedExpectedRevenue += pathRevenue
    accumulatedExpectedOutflow += pathOutflow
    if (hasPathDefaulted) {
      defaultCount++
    }
  }

  const chartData = []
  for (let t = 0; t <= tenor; t++) {
    const balances = trajectories.map(path => path[t])
    balances.sort((a, b) => a - b)

    const p10Idx = Math.round(numSimulations * 0.10)
    const p50Idx = Math.round(numSimulations * 0.50)
    const p90Idx = Math.round(numSimulations * 0.90)

    const p10Val = Math.round(balances[p10Idx])
    const p90Val = Math.round(balances[p90Idx])

    chartData.push({
      name: t === 0 ? 'Mulai' : `Bln ${t}`,
      p10: p10Val,
      p50: Math.round(balances[p50Idx]),
      p90: p90Val,
      range: [p10Val, p90Val]
    })
  }

  const probabilityOfDefault = (defaultCount / numSimulations) * 100
  const expectedRevenue = accumulatedExpectedRevenue / numSimulations
  const expectedOutflow = accumulatedExpectedOutflow / numSimulations
  const expectedNetBalance = chartData[tenor].p50

  let riskLevel
  let recommendationText
  let recommendationColor

  if (probabilityOfDefault < 5) {
    riskLevel = 'LOW'
    recommendationText = 'PROPOSAL DISETUJUI: Rentang Prediksi arus kas sangat aman. Proyeksi stokastik menunjukkan kapasitas pembayaran kembali yang kuat (PD rendah).'
    recommendationColor = 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800/40 dark:text-emerald-300'
  } else if (probabilityOfDefault <= 15) {
    riskLevel = 'WARNING'
    recommendationText = 'HATI-HATI: Terdapat risiko defisit kas musiman. Disarankan untuk menambah tenor kredit atau menyesuaikan pencairan dana pasca-panen.'
    recommendationColor = 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-800/40 dark:text-emerald-300'
  } else {
    riskLevel = 'HIGH_RISK'
    recommendationText = 'RISIKO TINGGI: Kemungkinan besar terjadi defisit kas di tengah siklus. Direkomendasikan restrukturisasi parameter tenor atau penurunan plafon kredit.'
    recommendationColor = 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-800/40 dark:text-red-300'
  }

  return {
    chartData,
    pd: probabilityOfDefault.toFixed(1),
    riskLevel,
    recommendationText,
    recommendationColor,
    expectedRevenue: Math.round(expectedRevenue),
    expectedOutflow: Math.round(expectedOutflow),
    expectedNetBalance: Math.round(expectedNetBalance)
  }
}

function Simulation() {
  const [searchParams] = useSearchParams()

  const [loanAmount, setLoanAmount] = useState(() => {
    const amt = searchParams.get('amount')
    return amt ? parseInt(amt, 10) : 150000000
  })
  const [loanTenor, setLoanTenor] = useState(12)

  const [commodity, setCommodity] = useState('Rice')
  const [declaredYield, setDeclaredYield] = useState(18.5)
  const [plantingMonth, setPlantingMonth] = useState(12)
  const [harvestMonth, setHarvestMonth] = useState(4)

  const [livingCost, setLivingCost] = useState(2000000)
  const [farmingCost, setFarmingCost] = useState(500000)

  const [isSimulating, setIsSimulating] = useState(false)

  const [nikInput, setNikInput] = useState('')
  const [trustScoreData, setTrustScoreData] = useState(null)
  const [trustScoreLoading, setTrustScoreLoading] = useState(false)
  const [trustScoreError, setTrustScoreError] = useState('')

  const amtParam = searchParams.get('amount')
  const [prevAmtParam, setPrevAmtParam] = useState(amtParam)
  if (amtParam !== prevAmtParam) {
    setPrevAmtParam(amtParam)
    if (amtParam) {
      setLoanAmount(parseInt(amtParam, 10))
    }
  }

  const [simResults, setSimResults] = useState(() => calculateSimulation({
    tenor: 12,
    amount: loanAmount,
    declaredYield: 18.5,
    livingCost: 2000000,
    farmingCost: 500000,
    commodity: 'Rice',
    plantingMonth: 12,
    harvestMonth: 4
  }))
  const [hasRun, setHasRun] = useState(true)

  const formatNumberWithDots = (num) => {
    if (num === undefined || num === null || num === '') return ''
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const formatYAxis = (val) => {
    if (val === undefined || val === null) return ''
    const isNeg = val < 0
    const absVal = Math.abs(val)
    return `${isNeg ? '-' : ''}${(absVal / 1000000).toFixed(0)} Jt`
  }

  const handleCurrencyInput = (val, setter) => {
    const numeric = val.replace(/\D/g, '')
    if (numeric.length <= 15) {
      setter(numeric === '' ? '' : parseInt(numeric, 10))
    }
  }

  const handleReset = () => {
    setLoanAmount(150000000)
    setLoanTenor(12)
    setCommodity('Rice')
    setDeclaredYield(18.5)
    setPlantingMonth(12)
    setHarvestMonth(4)
    setLivingCost(2000000)
    setFarmingCost(500000)
    setHasRun(false)
    setSimResults(null)
  }

  const fetchTrustScore = async () => {
    if (!nikInput.trim()) {
      setTrustScoreError('NIK wajib diisi.')
      return
    }
    setTrustScoreLoading(true)
    setTrustScoreError('')
    setTrustScoreData(null)
    try {
      const result = await getTrustScore(nikInput.trim())
      setTrustScoreData(result)
    } catch (err) {
      console.error('Trust score fetch failed:', err)
      setTrustScoreError('Gagal memuat skor kepercayaan. Pastikan NIK terdaftar.')
    } finally {
      setTrustScoreLoading(false)
    }
  }

  const runStochasticSimulation = () => {
    setIsSimulating(true)

    setTimeout(() => {
      const results = calculateSimulation({
        tenor: Number(loanTenor) || 12,
        amount: Number(loanAmount) || 0,
        declaredYield: Number(declaredYield) || 0,
        livingCost: Number(livingCost) || 0,
        farmingCost: Number(farmingCost) || 0,
        commodity,
        plantingMonth,
        harvestMonth
      })

      setSimResults(results)
      setIsSimulating(false)
      setHasRun(true)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 dark:bg-slate-950 dark:text-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">

        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Sprout className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              Simulasi Kredit Pertanian Digital
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Input parameter kredit dan variabel stokastik untuk proyeksi arus kas.
            </p>
          </div>
          <div className="shrink-0 md:self-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <ShieldCheck className="w-3.5 h-3.5" />
              Analisis Risiko Kredit Terpadu
            </span>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          
          <div className="lg:col-span-7 space-y-6">

            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Coins className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                  Parameter Pengajuan Pinjaman
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Jumlah Pengajuan Pinjaman (Plafon Kredit)
                  </label>
                  <div className="relative rounded-xl border border-slate-200 dark:border-slate-700/80 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all bg-slate-50/50 dark:bg-slate-950/40">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm font-semibold pointer-events-none">
                      Rp
                    </span>
                    <input
                      type="text"
                      className="w-full pl-9 pr-4 py-3 bg-transparent text-slate-950 dark:text-slate-100 font-semibold focus:outline-none text-base"
                      placeholder="0"
                      value={formatNumberWithDots(loanAmount)}
                      onChange={(e) => handleCurrencyInput(e.target.value, setLoanAmount)}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Maksimal 15 digit</span>
                </div>

                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Tenor Pinjaman (Jangka Waktu)
                  </label>
                  <div className="relative rounded-xl border border-slate-200 dark:border-slate-700/80 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all bg-slate-50/50 dark:bg-slate-950/40">
                    <input
                      type="number"
                      className="w-full pl-4 pr-16 py-3 bg-transparent text-slate-950 dark:text-slate-100 font-semibold focus:outline-none text-base"
                      placeholder="12"
                      min="1"
                      max="60"
                      value={loanTenor}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '')
                        setLoanTenor(val === '' ? '' : Math.min(60, Math.max(1, parseInt(val, 10))))
                      }}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      Bulan
                    </span>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Sprout className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                  Variabel Produktivitas Lahan Pertanian
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Komoditas Pertanian
                  </label>
                  <div className="relative rounded-xl border border-slate-200 dark:border-slate-700/80 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all bg-slate-50/50 dark:bg-slate-950/40">
                    <select
                      value={commodity}
                      onChange={(e) => setCommodity(e.target.value)}
                      className="w-full px-4 py-3 bg-transparent text-slate-950 dark:text-slate-100 font-semibold focus:outline-none text-sm appearance-none cursor-pointer"
                    >
                      <option value="Rice">Padi (Rice)</option>
                      <option value="Maize">Jagung (Maize)</option>
                      <option value="Cassava">Singkong (Cassava)</option>
                      <option value="Soybeans">Kedelai (Soybeans)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Estimasi Hasil Panen
                  </label>
                  <div className="relative rounded-xl border border-slate-200 dark:border-slate-700/80 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all bg-slate-50/50 dark:bg-slate-950/40">
                    <input
                      type="number"
                      step="0.1"
                      className="w-full pl-4 pr-16 py-3 bg-transparent text-slate-950 dark:text-slate-100 font-semibold focus:outline-none text-base"
                      placeholder="0.0"
                      value={declaredYield}
                      onChange={(e) => setDeclaredYield(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded">
                      Ton
                    </span>
                  </div>
                </div>
              </div>

              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Bulan Penanaman
                  </label>
                  <div className="relative rounded-xl border border-slate-200 dark:border-slate-700/80 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all bg-slate-50/50 dark:bg-slate-950/40">
                    <select
                      value={plantingMonth}
                      onChange={(e) => setPlantingMonth(parseInt(e.target.value, 10))}
                      className="w-full px-4 py-3 bg-transparent text-slate-950 dark:text-slate-100 font-semibold focus:outline-none text-sm appearance-none cursor-pointer"
                    >
                      {MONTHS_LIST.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Bulan Pemanenan
                  </label>
                  <div className="relative rounded-xl border border-slate-200 dark:border-slate-700/80 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all bg-slate-50/50 dark:bg-slate-950/40">
                    <select
                      value={harvestMonth}
                      onChange={(e) => setHarvestMonth(parseInt(e.target.value, 10))}
                      className="w-full px-4 py-3 bg-transparent text-slate-950 dark:text-slate-100 font-semibold focus:outline-none text-sm appearance-none cursor-pointer"
                    >
                      {MONTHS_LIST.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Landmark className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                  Estimasi Pengeluaran Bulanan
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Biaya Hidup Bulanan
                  </label>
                  <div className="relative rounded-xl border border-slate-200 dark:border-slate-700/80 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all bg-slate-50/50 dark:bg-slate-950/40">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm font-semibold pointer-events-none">
                      Rp
                    </span>
                    <input
                      type="text"
                      className="w-full pl-9 pr-16 py-3 bg-transparent text-slate-950 dark:text-slate-100 font-semibold focus:outline-none text-base"
                      placeholder="2.000.000"
                      value={formatNumberWithDots(livingCost)}
                      onChange={(e) => handleCurrencyInput(e.target.value, setLivingCost)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-[10px] font-bold">
                      / Bulan
                  </span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Maksimal 15 digit</span>
                </div>

                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Biaya Operasional Tani Bulanan
                  </label>
                  <div className="relative rounded-xl border border-slate-200 dark:border-slate-700/80 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all bg-slate-50/50 dark:bg-slate-950/40">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm font-semibold pointer-events-none">
                      Rp
                    </span>
                    <input
                      type="text"
                      className="w-full pl-9 pr-16 py-3 bg-transparent text-slate-950 dark:text-slate-100 font-semibold focus:outline-none text-base"
                      placeholder="500.000"
                      value={formatNumberWithDots(farmingCost)}
                      onChange={(e) => handleCurrencyInput(e.target.value, setFarmingCost)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-[10px] font-bold">
                      / Bulan
                  </span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Maksimal 15 digit</span>
                </div>
              </div>
            </div>

            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                  Skor Kepercayaan Petani (Trust Score)
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Masukkan NIK petani untuk melihat riwayat kredit lintas koperasi.
              </p>
              <div className="flex gap-3">
                <div className="relative flex-1 rounded-xl border border-slate-200 dark:border-slate-700/80 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all bg-slate-50/50 dark:bg-slate-950/40">
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-transparent text-slate-950 dark:text-slate-100 font-semibold focus:outline-none text-sm"
                    placeholder="Masukkan NIK (contoh: 3201010101900001)"
                    value={nikInput}
                    onChange={(e) => setNikInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') fetchTrustScore() }}
                  />
                </div>
                <button
                  type="button"
                  onClick={fetchTrustScore}
                  disabled={trustScoreLoading}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 disabled:opacity-50 cursor-pointer transition-all text-sm"
                >
                  {trustScoreLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  Cek Skor
                </button>
              </div>
              {trustScoreError && (
                <div className="mt-3 flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {trustScoreError}
                </div>
              )}
              {trustScoreData && (
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/40 dark:from-emerald-950/20 dark:to-emerald-900/10 border border-emerald-200/60 dark:border-emerald-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600/80 dark:text-emerald-400">Trust Score</span>
                    <span className={`text-2xl font-extrabold ${
                      trustScoreData.trust_score >= 70 ? 'text-emerald-700 dark:text-emerald-400' :
                      trustScoreData.trust_score >= 40 ? 'text-amber-600 dark:text-amber-400' :
                      'text-rose-600 dark:text-rose-400'
                    }`}>
                      {trustScoreData.trust_score}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Bulan Tunggakan</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{trustScoreData.months_in_arrears ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Koperasi Terdaftar</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{trustScoreData.tenants_checked ?? 0}</span>
                  </div>
                </div>
              )}
            </div>

            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={runStochasticSimulation}
                disabled={isSimulating}
                className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer transition-all hover:scale-[1.01]"
              >
                {isSimulating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sedang Memproses Simulasi...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-white" />
                    <span>Jalankan Simulasi Kredit</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="py-4 px-6 border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Atur Ulang Parameter</span>
              </button>
            </div>

          </div>

          
          <div className="lg:col-span-5 space-y-6">

            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col min-h-[500px]">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                    Rentang Prediksi Proyeksi Arus Kas
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Simulasi Kemampuan Bayar Digital
                  </p>
                </div>
                {simResults && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold tracking-wider ${
                    simResults.riskLevel === 'LOW'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/40'
                      : simResults.riskLevel === 'WARNING'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/40'
                      : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800/40'
                  }`}>
                    PD: {simResults.pd}%
                  </span>
                )}
              </div>

              {!hasRun && !isSimulating ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4 my-auto">
                  <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 dark:text-slate-600">
                    <HelpCircle className="w-8 h-8" />
                  </div>
                  <div className="max-w-xs space-y-2">
                    <p className="font-bold text-slate-700 dark:text-slate-300">
                      Simulasi Siap Dijalankan
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Klik tombol "Jalankan Simulasi Kredit" untuk memproses 250 iterasi siklus tanam stokastik berdasarkan parameter yang Anda masukkan.
                    </p>
                  </div>
                </div>
              ) : isSimulating ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4 my-auto">
                  <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-600 rounded-full animate-spin" />
                    <Sprout className="w-6 h-6 text-emerald-600 absolute animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-700 dark:text-slate-300">
                      Menghitung Arus Kas
                    </p>
                    <p className="text-xs text-slate-400 animate-pulse">
                      Membuat proyeksi hasil panen dan volatilitas harga pasar...
                    </p>
                  </div>
                </div>
              ) : simResults ? (
                <div className="flex-1 flex flex-col justify-between space-y-5">
                  
                  <div className="h-68 w-full text-xs font-sans">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={simResults.chartData}
                        margin={{ top: 10, right: 5, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} className="dark:stroke-slate-800/50" />
                        <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10, fontWeight: 'medium' }} />
                        <YAxis
                          stroke="#94a3b8"
                          tick={{ fontSize: 10, fontWeight: 'medium' }}
                          tickFormatter={formatYAxis}
                          width={60}
                          label={{ value: 'Rupiah (Jt)', angle: -90, position: 'insideLeft', offset: 15, style: { fontSize: 11, fill: '#94a3b8', fontWeight: 600 } }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={<CustomLegend />} />

                        
                        <Area
                          type="monotone"
                          dataKey="range"
                          stroke="none"
                          fill="#10b981"
                          fillOpacity={0.08}
                          legendType="none"
                          tooltipType="none"
                        />

                        
                        <Line
                          type="monotone"
                          dataKey="p90"
                          stroke="#10b981"
                          strokeWidth={2}
                          strokeDasharray="4 4"
                          dot={false}
                          name="Rentang Prediksi Optimis (P90)"
                        />

                        
                        <Line
                          type="monotone"
                          dataKey="p10"
                          stroke="#ef4444"
                          strokeWidth={2}
                          strokeDasharray="4 4"
                          dot={false}
                          name="Rentang Prediksi Pesimis (P10)"
                        />

                        
                        <Line
                          type="monotone"
                          dataKey="p50"
                          stroke="#0ea5e9"
                          strokeWidth={3}
                          dot={{ stroke: '#0ea5e9', strokeWidth: 1.5, r: 3, fill: '#fff' }}
                          activeDot={{ r: 5, strokeWidth: 2 }}
                          name="Proyeksi Median (P50)"
                        />

                        
                        <ReferenceLine
                          y={0}
                          stroke="#f43f5e"
                          strokeWidth={1.5}
                          strokeDasharray="3 3"
                          label={{
                            value: 'Batas Saldo Nol (Rp 0)',
                            fill: '#f43f5e',
                            fontSize: 9,
                            fontWeight: 'bold',
                            position: 'insideBottomLeft',
                            offset: 10
                          }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>

                  
                  <div className={`p-4 rounded-xl border flex gap-3 ${simResults.recommendationColor} transition-all duration-300`}>
                    {simResults.riskLevel === 'LOW' && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {simResults.riskLevel === 'WARNING' && (
                      <TriangleAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    {simResults.riskLevel === 'HIGH_RISK' && (
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold text-xs uppercase tracking-wide block">
                        Keputusan Komite Kredit Koperasi
                      </span>
                      <p className="text-xs mt-1 leading-relaxed">
                        {simResults.recommendationText}
                      </p>
                    </div>
                  </div>

                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 rounded-xl">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
                        Estimasi Pemasukan Panen
                      </span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                        Rp {formatNumberWithDots(simResults.expectedRevenue)}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 rounded-xl">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
                        Estimasi Pengeluaran (Biaya + Utang)
                      </span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                        Rp {formatNumberWithDots(simResults.expectedOutflow)}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 rounded-xl col-span-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
                            Estimasi Saldo Bersih Akhir (Median)
                          </span>
                          <span className={`text-base font-extrabold mt-1 block ${
                            simResults.expectedNetBalance >= 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}>
                            Rp {formatNumberWithDots(simResults.expectedNetBalance)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
                            Kemungkinan Gagal Bayar (PD)
                          </span>
                          <span className={`text-base font-extrabold mt-1 block ${
                            simResults.pd < 5
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : simResults.pd <= 15
                              ? 'text-amber-500'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}>
                            {simResults.pd}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              ) : null}
            </div>

            
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Metodologi Proyeksi Digital (Detail Perhitungan)
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Proyeksi arus kas ini disimulasikan secara dinamis sebanyak 250 kali. Pada bulan panen yang dipilih, kas disuntikkan berdasarkan estimasi hasil panen dengan variasi harga komoditas pasar. Setiap bulan, biaya hidup dan biaya tani dikurangi bersama angsuran pinjaman pokok beserta bunga flat 0,5%.
              </p>
              <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 space-y-1 bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800/80">
                <div>• Pemasukan Panen = Estimasi Hasil Panen (Ton) × Harga Pasar</div>
                <div>• Pengeluaran Bulanan = Biaya Hidup + Biaya Tani + Angsuran Pinjaman</div>
                <div>• Angsuran Bulanan = (Plafon Pinjaman / Tenor) + (Sisa Pinjaman × 0,5%)</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default Simulation

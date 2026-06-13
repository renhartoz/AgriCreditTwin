import { useState, useRef, useEffect } from 'react'
import {
  Save,
  Search,
  ChevronDown,
  CalendarDays,
  FileText,
  Coins,
  ArrowDownUp,
  CheckCircle2,
  X,
  ShieldCheck,
  Users,
  TriangleAlert,
  Landmark,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  Warehouse,
  Plus,
  Scale
} from 'lucide-react'
import { applyLoan, getMembers } from '../services/loanService.js'


const MOCK_MEMBERS = []

const MOCK_LOAN_CONTRACTS = {
  'M-10023': [
    { id: 'LN-2026-001A', amount: 15000000, desc: 'Saprodi Padi Gogo' },
    { id: 'LN-2026-002B', amount: 5000000, desc: 'Pemeliharaan Kolam Nila' }
  ],
  'M-10045': [
    { id: 'LN-2026-004A', amount: 25000000, desc: 'Kredit Pembelian Hand-Traktor' }
  ],
  'M-20108': [
    { id: 'LN-2025-089C', amount: 10000000, desc: 'Pembangunan Rak Pengering Jagung' }
  ],
  'M-20119': [],
  'M-30064': [
    { id: 'LN-2026-045X', amount: 35000000, desc: 'Kredit Pembelian Pompa & Pipa Air' }
  ],
  'M-30112': [
    { id: 'LN-2025-112Y', amount: 8000000, desc: 'Kredit Budidaya Cabai Keriting' }
  ],
  'M-40089': []
}

const TRANSACTION_TYPES = [
  { value: 'savings_deposit', label: 'Simpanan (Setoran)' },
  { value: 'savings_withdrawal', label: 'Penarikan Simpanan' },
  { value: 'loan_disbursement', label: 'Penyaluran Pinjaman' },
  { value: 'loan_repayment', label: 'Pembayaran Cicilan Pinjaman' },
  { value: 'rice_sale', label: 'Penjualan Beras (Komoditas Keluar)' },
  { value: 'rice_purchase', label: 'Pembelian Beras (Komoditas Masuk)' }
]

const MOCK_COMMODITIES = [
  'Beras Premium',
  'Beras Medium',
  'Gabah Kering Panen (GKP)',
  'Gabah Kering Giling (GKG)',
  'Jagung Pipil',
  'Kedelai Lokal',
  'Pupuk Urea',
  'Pupuk NPK',
  'Pestisida Cair',
  'Benih Padi Ciherang'
]

const UNIT_OPTIONS = [
  { value: 'kg', label: 'Kilogram (Kg)' },
  { value: 'ton', label: 'Ton' },
  { value: 'm3', label: 'Meter Kubik (m³)' },
  { value: 'pcs', label: 'Pcs / Batang' },
  { value: 'liter', label: 'Liter' }
]


const formatNumberWithDots = (num) => {
  if (num === undefined || num === null || num === '') return ''
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const todayISO = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}




function MemberSmartCombobox({ value, onChange, members, error }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value ? `${value.name} (${value.id})` : '')
  const [prevValue, setPrevValue] = useState(value)
  const inputRef = useRef(null)
  const wrapperRef = useRef(null)

  if (value !== prevValue) {
    setPrevValue(value)
    setQuery(value ? `${value.name} (${value.id})` : '')
  }

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.id.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (member) => {
    onChange(member)
    setQuery(`${member.name} (${member.id})`)
    setOpen(false)
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <div className={`relative rounded-xl border focus-within:ring-2 transition-all bg-slate-50/50 dark:bg-slate-950/40 ${
        error
          ? 'border-rose-400 dark:border-rose-900/50 focus-within:ring-rose-500/20 focus-within:border-rose-500'
          : 'border-slate-200 dark:border-slate-700/80 focus-within:ring-emerald-500/20 focus-within:border-emerald-500'
      }`}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          className="w-full pl-10 pr-10 py-3 bg-transparent text-slate-950 dark:text-slate-100 font-semibold focus:outline-none text-sm placeholder:font-normal"
          placeholder="Cari Nama atau ID Anggota..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (!e.target.value) {
              onChange(null)
            }
            if (!open) setOpen(true)
          }}
          onFocus={() => setOpen(true)}
        />
        {value && (
          <button
            type="button"
            className="absolute right-8 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-400"
            onClick={() => {
              onChange(null)
              setQuery('')
              inputRef.current?.focus()
            }}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          onClick={() => {
            setOpen(!open)
            inputRef.current?.focus()
          }}
        >
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-black/30 overflow-hidden max-h-60 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => handleSelect(member)}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer flex flex-col"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold">{member.name}</span>
                  <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400">
                    {member.id}
                  </span>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {member.group}
                </span>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-slate-400 dark:text-slate-500 text-center">
              Anggota tidak ditemukan
            </div>
          )}
        </div>
      )}
    </div>
  )
}




function CommoditySmartCombobox({ value, onChange, commodities, error }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value || '')
  const [prevValue, setPrevValue] = useState(value)
  const inputRef = useRef(null)
  const wrapperRef = useRef(null)

  if (value !== prevValue) {
    setPrevValue(value)
    setQuery(value || '')
  }

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = commodities.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase())
  )

  const exactMatch = commodities.some(c => c.toLowerCase() === query.toLowerCase())

  const handleSelect = (item) => {
    onChange(item)
    setQuery(item)
    setOpen(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim() && !exactMatch) {
      e.preventDefault()
      onChange(query.trim())
      setOpen(false)
    }
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <div className={`relative rounded-xl border focus-within:ring-2 transition-all bg-slate-50/50 dark:bg-slate-950/40 ${
        error
          ? 'border-rose-400 dark:border-rose-900/50 focus-within:ring-rose-500/20 focus-within:border-rose-500'
          : 'border-slate-200 dark:border-slate-700/80 focus-within:ring-emerald-500/20 focus-within:border-emerald-500'
      }`}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          className="w-full pl-10 pr-10 py-3 bg-transparent text-slate-950 dark:text-slate-100 font-semibold focus:outline-none text-sm placeholder:font-normal"
          placeholder="Ketik untuk mencari atau tambah komoditas baru..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (!e.target.value) {
              onChange('')
            }
            if (!open) setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {value && (
          <button
            type="button"
            className="absolute right-8 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-400"
            onClick={() => {
              onChange('')
              setQuery('')
              inputRef.current?.focus()
            }}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          onClick={() => {
            setOpen(!open)
            inputRef.current?.focus()
          }}
        >
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-black/30 overflow-hidden max-h-60 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer font-semibold"
              >
                {item}
              </button>
            ))
          ) : null}

          
          {query.trim() && !exactMatch && (
            <button
              type="button"
              onClick={() => {
                onChange(query.trim())
                setOpen(false)
              }}
              className="w-full text-left px-4 py-3 text-sm border-t border-slate-100 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-slate-600 dark:text-slate-400">Tekan Enter untuk membuat</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md text-xs border border-emerald-200 dark:border-emerald-800/40">
                "{query.trim()}"
              </span>
            </button>
          )}

          {filtered.length === 0 && (!query.trim() || exactMatch) && (
            <div className="px-4 py-3 text-sm text-slate-400 dark:text-slate-500 text-center">
              Komoditas tidak ditemukan
            </div>
          )}
        </div>
      )}
    </div>
  )
}




function DataEntry() {

  const [members, setMembers] = useState([])
  const [membersLoading, setMembersLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchMembers() {
      try {
        const data = await getMembers()
        if (!cancelled) {
          setMembers(data.map(m => ({
            id: m.id,
            name: m.name,
            phone: m.phone || '',
            group: m.commodity || ''
          })))
        }
      } catch {
        if (!cancelled) setMembers([])
      } finally {
        if (!cancelled) setMembersLoading(false)
      }
    }
    fetchMembers()
    return () => { cancelled = true }
  }, [])

  const [activeTab, setActiveTab] = useState('inventory')

  
  const [commodityName, setCommodityName] = useState('')
  const [unitOfMeasurement, setUnitOfMeasurement] = useState('kg')
  const [mutationType, setMutationType] = useState('masuk')
  const [quantity, setQuantity] = useState('')
  const [inventoryDate, setInventoryDate] = useState(todayISO())
  const [inventoryDescription, setInventoryDescription] = useState('')
  const [commodityError, setCommodityError] = useState('')
  const [quantityError, setQuantityError] = useState('')

  
  const [recentInventory, setRecentInventory] = useState([
    { id: 1, commodity: 'Beras Premium', type: 'masuk', qty: 2500, unit: 'kg', date: '2026-06-12', desc: 'Penerimaan dari pabrik Subang' },
    { id: 2, commodity: 'Pupuk Urea', type: 'keluar', qty: 150, unit: 'kg', date: '2026-06-11', desc: 'Distribusi ke kelompok tani Blok A' },
    { id: 3, commodity: 'Gabah Kering Panen (GKP)', type: 'masuk', qty: 5, unit: 'ton', date: '2026-06-10', desc: 'Setoran panen musim II anggota' },
    { id: 4, commodity: 'Pestisida Cair', type: 'keluar', qty: 20, unit: 'liter', date: '2026-06-09', desc: 'Pemakaian sawah kelompok 3' }
  ])

  const [isSavingInventory, setIsSavingInventory] = useState(false)

  
  const [selectedMember, setSelectedMember] = useState(null)
  const [transactionType, setTransactionType] = useState('')
  const [selectedLoan, setSelectedLoan] = useState('')
  const [rawAmount, setRawAmount] = useState('')
  const [description, setDescription] = useState('')
  const [transactionDate, setTransactionDate] = useState(todayISO())

  
  const [memberError, setMemberError] = useState('')
  const [typeError, setTypeError] = useState('')
  const [loanError, setLoanError] = useState('')
  const [amountError, setAmountError] = useState('')

  
  const [isSaving, setIsSaving] = useState(false)
  const [savedToast, setSavedToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  
  const [recentTransactions, setRecentTransactions] = useState([
    { id: 1, member: { id: 'M-10023', name: 'Ahmad Dahlan' }, type: 'loan_disbursement', amount: 15000000, loanId: 'LN-2026-001A', date: '2026-06-12', description: 'Penyaluran dana saprodi panen' },
    { id: 2, member: { id: 'M-10045', name: 'Dewi Sri Wahyuni' }, type: 'savings_deposit', amount: 4500000, loanId: null, date: '2026-06-11', description: 'Tabungan hasil panen kuartal II' },
    { id: 3, member: { id: 'M-20108', name: 'Bambang Triyono' }, type: 'loan_repayment', amount: 1250000, loanId: 'LN-2025-089C', date: '2026-06-10', description: 'Pembayaran cicilan traktor bulan ke-4' },
    { id: 4, member: { id: 'M-20119', name: 'Siti Aminah' }, type: 'rice_sale', amount: 7800000, loanId: null, date: '2026-06-09', description: 'Penjualan Gabah Kering 1.2 Ton' }
  ])

  const isLoanRelated = transactionType === 'loan_disbursement' || transactionType === 'loan_repayment'
  const activeContracts = selectedMember ? (MOCK_LOAN_CONTRACTS[selectedMember.id] || []) : []

  
  const handleSaveInventory = () => {
    setCommodityError('')
    setQuantityError('')
    let hasError = false

    if (!commodityName.trim()) {
      setCommodityError('Nama komoditas wajib diisi.')
      hasError = true
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      setQuantityError('Jumlah barang harus lebih besar dari 0.')
      hasError = true
    }

    if (hasError) return

    setIsSavingInventory(true)

    setTimeout(() => {
      const newItem = {
        id: Date.now(),
        commodity: commodityName.trim(),
        type: mutationType,
        qty: parseFloat(quantity),
        unit: unitOfMeasurement,
        date: inventoryDate,
        desc: inventoryDescription.trim() || 'Dicatat via formulir mutasi barang'
      }

      setRecentInventory(prev => [newItem, ...prev].slice(0, 8))

      setCommodityName('')
      setQuantity('')
      setInventoryDescription('')
      setInventoryDate(todayISO())
      setMutationType('masuk')
      setUnitOfMeasurement('kg')

      setIsSavingInventory(false)
      setToastMessage('Mutasi barang berhasil dicatat ke dalam buku gudang koperasi!')
      setSavedToast(true)
      setTimeout(() => setSavedToast(false), 3000)
    }, 600)
  }

  
  const handleTypeChange = (e) => {
    const val = e.target.value
    setTransactionType(val)
    setTypeError('')
    setSelectedLoan('')
    setLoanError('')
  }

  const validateAmount = (val) => {
    if (!val) {
      return 'Nominal transaksi wajib diisi.'
    }
    if (/[a-zA-Z]/.test(val)) {
      return 'Nominal hanya boleh berisi angka (tidak boleh mengandung huruf).'
    }
    if (/[^0-9-]/.test(val)) {
      return 'Nominal harus berupa angka saja.'
    }
    const cleanDigits = val.replace(/\D/g, '')
    if (cleanDigits.length > 15) {
      return 'Nominal melebihi batas maksimum 15 digit.'
    }
    const num = parseInt(cleanDigits, 10)
    if (isNaN(num)) {
      return 'Format nominal tidak valid.'
    }
    if (num < 0) {
      return 'Nominal transaksi tidak boleh bernilai negatif.'
    }
    if (num === 0) {
      return 'Nominal transaksi harus lebih besar dari Rp 0.'
    }
    return ''
  }

  const handleAmountChange = (e) => {
    const val = e.target.value
    const numeric = val.replace(/\D/g, '')
    if (numeric.length <= 15 || val.length < rawAmount.length) {
      setRawAmount(val)
      const err = validateAmount(val)
      setAmountError(err)
    }
  }

  const handleSaveTransaction = async () => {
    setMemberError('')
    setTypeError('')
    setLoanError('')
    setAmountError('')

    let hasError = false

    if (!selectedMember) {
      setMemberError('Silakan cari dan pilih anggota koperasi.')
      hasError = true
    }

    if (!transactionType) {
      setTypeError('Tipe transaksi wajib dipilih.')
      hasError = true
    }

    if (isLoanRelated && !selectedLoan) {
      setLoanError('Field ini wajib diisi untuk transaksi pinjaman.')
      hasError = true
    }

    const amtErr = validateAmount(rawAmount)
    if (amtErr) {
      setAmountError(amtErr)
      hasError = true
    }

    if (hasError) return

    setIsSaving(true)

    const cleanAmount = parseInt(rawAmount.replace(/\D/g, ''), 10)

    if (transactionType === 'loan_disbursement' && selectedMember) {
      try {
        const loanPayload = {
          member_id: selectedMember.id,
          amount: cleanAmount,
          tenor_months: 12,
          declared_yield_tons: 5.0,
          commodity: 'rice',
          land_area_ha: 1.0,
          estimated_grain_price: 6500,
          planting_month: new Date().getMonth() + 1,
          harvest_month: ((new Date().getMonth() + 4) % 12) + 1,
          monthly_living_cost: 2000000,
          monthly_farming_cost: 500000
        }
        const result = await applyLoan(loanPayload)

        const newTransaction = {
          id: result.loan_id || Date.now(),
          member: { id: selectedMember.id, name: selectedMember.name },
          type: transactionType,
          amount: cleanAmount,
          loanId: result.loan_id || null,
          date: transactionDate,
          description: `Status: ${result.status} | AVS: ${result.avs?.passed ? 'Lolos' : 'Gagal'}`
        }

        setRecentTransactions((prev) => [newTransaction, ...prev].slice(0, 8))
        setSelectedMember(null)
        setTransactionType('')
        setSelectedLoan('')
        setRawAmount('')
        setDescription('')
        setTransactionDate(todayISO())

        setIsSaving(false)
        setToastMessage(`Pinjaman ${result.status === 'approved' ? 'disetujui' : 'diproses'}! ID: ${result.loan_id}`)
        setSavedToast(true)
        setTimeout(() => setSavedToast(false), 4000)
        return
      } catch (err) {
        console.error('Loan application failed:', err)
        setIsSaving(false)
        setToastMessage('Gagal mengirim ke server. Data disimpan secara lokal.')
        setSavedToast(true)
        setTimeout(() => setSavedToast(false), 3000)
      }
    }

    setTimeout(() => {
      const newTransaction = {
        id: Date.now(),
        member: { id: selectedMember.id, name: selectedMember.name },
        type: transactionType,
        amount: cleanAmount,
        loanId: isLoanRelated ? selectedLoan : null,
        date: transactionDate,
        description: description.trim() || 'Dicatat via formulir transaksi'
      }

      setRecentTransactions((prev) => [newTransaction, ...prev].slice(0, 8))

      setSelectedMember(null)
      setTransactionType('')
      setSelectedLoan('')
      setRawAmount('')
      setDescription('')
      setTransactionDate(todayISO())

      setIsSaving(false)
      setToastMessage('Transaksi berhasil disimpan ke dalam buku kas koperasi!')
      setSavedToast(true)
      setTimeout(() => setSavedToast(false), 3000)
    }, 600)
  }

  const getTxTypeStyles = (type) => {
    switch (type) {
      case 'savings_deposit':
        return { label: 'Simpanan Masuk', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 border', dot: 'bg-emerald-500' }
      case 'savings_withdrawal':
        return { label: 'Penarikan Simpanan', color: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 border', dot: 'bg-slate-400' }
      case 'loan_disbursement':
        return { label: 'Penyaluran Pinjaman', color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 border', dot: 'bg-blue-500' }
      case 'loan_repayment':
        return { label: 'Pembayaran Cicilan', color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 border', dot: 'bg-amber-500' }
      case 'rice_sale':
        return { label: 'Penjualan Beras', color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 border', dot: 'bg-rose-500' }
      case 'rice_purchase':
        return { label: 'Pembelian Beras', color: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 border', dot: 'bg-emerald-600' }
      default:
        return { label: type, color: 'bg-slate-50 text-slate-600 border border-slate-100', dot: 'bg-slate-400' }
    }
  }

  const getUnitLabel = (val) => {
    const found = UNIT_OPTIONS.find(u => u.value === val)
    return found ? found.label : val
  }

  
  const tabs = [
    {
      id: 'inventory',
      label: 'Mutasi Barang Gudang',
      icon: <Warehouse className="w-4 h-4" />,
      headerTitle: 'Pencatatan Mutasi Barang Gudang',
      headerSubtitle: 'Catat mutasi barang masuk dan keluar untuk gudang koperasi.',
      headerBadge: 'Logistik & Inventaris'
    },
    {
      id: 'transaction',
      label: 'Transaksi Keuangan',
      icon: <Coins className="w-4 h-4" />,
      headerTitle: 'Catatan Transaksi Keuangan',
      headerSubtitle: 'Catat transaksi simpan pinjam anggota dengan validasi data terstruktur.',
      headerBadge: 'Simpan Pinjam'
    }
  ]

  const activeTabConfig = tabs.find(t => t.id === activeTab)

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">

        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
              {activeTab === 'inventory'
                ? <Package className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                : <Coins className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              }
              {activeTabConfig.headerTitle}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {activeTabConfig.headerSubtitle}
            </p>
          </div>
          <div className="shrink-0 md:self-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <ShieldCheck className="w-3.5 h-3.5" />
              {activeTabConfig.headerBadge}
            </span>
          </div>
        </div>

        
        <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs flex gap-1.5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          
          {activeTab === 'inventory' && (
            <>
              
              <div className="lg:col-span-7">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs overflow-hidden">
                  <div className="h-1.5 w-full bg-emerald-600" />

                  <div className="p-6 space-y-6">

                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                          <Package className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          Nama Komoditas <span className="text-rose-500">*</span>
                        </label>
                        <CommoditySmartCombobox
                          value={commodityName}
                          onChange={(val) => {
                            setCommodityName(val)
                            setCommodityError('')
                          }}
                          commodities={MOCK_COMMODITIES}
                          error={!!commodityError}
                        />
                        {commodityError && (
                          <p className="text-xs font-semibold text-rose-500 mt-1 flex items-center gap-1">
                            <TriangleAlert className="w-3.5 h-3.5 shrink-0" />
                            {commodityError}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                          <Scale className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          Satuan Ukuran
                        </label>
                        <div className="relative rounded-xl border border-slate-200 dark:border-slate-700/80 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all bg-slate-50/50 dark:bg-slate-950/40">
                          <select
                            value={unitOfMeasurement}
                            onChange={(e) => setUnitOfMeasurement(e.target.value)}
                            className="w-full px-4 py-3 bg-transparent text-slate-950 dark:text-slate-100 font-semibold focus:outline-none text-sm appearance-none cursor-pointer"
                          >
                            {UNIT_OPTIONS.map((u) => (
                              <option key={u.value} value={u.value}>{u.label}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <ArrowDownUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        Jenis Mutasi <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setMutationType('masuk')}
                          className={`py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 cursor-pointer transition-all border-2 ${
                            mutationType === 'masuk'
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-700 dark:text-emerald-400 shadow-sm shadow-emerald-500/10'
                              : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <ArrowDownToLine className="w-4.5 h-4.5" />
                          <span>Barang Masuk</span>
                          {mutationType === 'masuk' && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setMutationType('keluar')}
                          className={`py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 cursor-pointer transition-all border-2 ${
                            mutationType === 'keluar'
                              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-500 text-rose-700 dark:text-rose-400 shadow-sm shadow-rose-500/10'
                              : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <ArrowUpFromLine className="w-4.5 h-4.5" />
                          <span>Barang Keluar</span>
                          {mutationType === 'keluar' && (
                            <CheckCircle2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                          Jumlah Barang <span className="text-rose-500">*</span>
                        </label>
                        <div className={`relative rounded-xl border transition-all bg-slate-50/50 dark:bg-slate-950/40 ${
                          quantityError
                            ? 'border-rose-400 dark:border-rose-900/50 focus-within:ring-rose-500/20 focus-within:border-rose-500'
                            : 'border-slate-200 dark:border-slate-700/80 focus-within:ring-emerald-500/20 focus-within:border-emerald-500'
                        }`}>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            className="w-full pl-4 pr-16 py-3 bg-transparent text-slate-950 dark:text-slate-100 font-semibold focus:outline-none text-base"
                            placeholder="0"
                            value={quantity}
                            onChange={(e) => {
                              setQuantity(e.target.value)
                              setQuantityError('')
                            }}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                            {getUnitLabel(unitOfMeasurement).split(' ')[0]}
                          </span>
                        </div>
                        {quantityError && (
                          <p className="text-xs font-semibold text-rose-500 mt-1 flex items-center gap-1">
                            <TriangleAlert className="w-3.5 h-3.5 shrink-0" />
                            {quantityError}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 block">
                          <CalendarDays className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          Tanggal Mutasi
                        </label>
                        <div className="relative rounded-xl border border-slate-200 dark:border-slate-700/80 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all bg-slate-50/50 dark:bg-slate-950/40">
                          <input
                            type="date"
                            className="w-full px-4 py-3 bg-transparent text-slate-950 dark:text-slate-100 font-semibold focus:outline-none text-sm cursor-pointer"
                            value={inventoryDate}
                            onChange={(e) => setInventoryDate(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 block">
                        <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        Keterangan / Catatan
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-950/40 text-slate-950 dark:text-slate-100 font-medium focus:outline-none text-sm rounded-xl border border-slate-200 dark:border-slate-700/80 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                        placeholder='Contoh: "Penerimaan gabah dari kelompok tani Desa Sukatani", "Distribusi pupuk ke anggota"'
                        value={inventoryDescription}
                        onChange={(e) => setInventoryDescription(e.target.value)}
                      />
                    </div>

                    
                    <button
                      type="button"
                      onClick={handleSaveInventory}
                      disabled={isSavingInventory}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                      {isSavingInventory ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sedang Menyimpan Data...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Simpan Mutasi Barang
                        </>
                      )}
                    </button>

                  </div>
                </div>
              </div>

              
              <div className="lg:col-span-5 space-y-6">

                
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Warehouse className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">Riwayat Mutasi Gudang</h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {recentInventory.length} catatan
                    </span>
                  </div>

                  <div className="space-y-3">
                    {recentInventory.map((item) => (
                      <div
                        key={item.id}
                        className="group relative p-4 bg-slate-50/50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800/60 rounded-xl transition-colors"
                      >
                        <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${
                          item.type === 'masuk' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`} />

                        <div className="pl-3 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                              {item.commodity}
                            </span>
                            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider border ${
                              item.type === 'masuk'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400'
                                : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400'
                            }`}>
                              {item.type === 'masuk' ? 'Masuk' : 'Keluar'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">
                              {item.qty} {item.unit.toUpperCase()}
                            </span>
                            <span className={`font-extrabold text-sm ${
                              item.type === 'masuk' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                            }`}>
                              {item.type === 'masuk' ? '+' : '-'}{item.qty} {item.unit.toUpperCase()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                            <span className="font-medium italic truncate max-w-[200px]">
                              "{item.desc}"
                            </span>
                            <span className="font-mono">{item.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 mb-1 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      Petunjuk Pencatatan Gudang
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Formulir ini mencatat setiap pergerakan barang masuk dan keluar dari gudang koperasi. Gunakan fitur pencarian komoditas untuk memilih barang yang sudah terdaftar, atau ketik nama baru dan tekan Enter untuk menambahkan komoditas baru ke dalam daftar.
                  </p>
                  <div className="grid grid-cols-2 gap-3.5 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block tracking-wider">Jenis Mutasi</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">Masuk / Keluar</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block tracking-wider">Satuan Tersedia</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">5 Satuan</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          
          {activeTab === 'transaction' && (
            <>
              
              <div className="lg:col-span-7">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs overflow-hidden">
                  <div className="h-1.5 w-full bg-emerald-600" />

                  <div className="p-6 space-y-6">

                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                        <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        Pilih Anggota Koperasi <span className="text-rose-500">*</span>
                      </label>
                      <MemberSmartCombobox
                        value={selectedMember}
                        onChange={(m) => {
                          setSelectedMember(m)
                          setMemberError('')
                          setSelectedLoan('')
                          setLoanError('')
                        }}
                        members={members}
                        error={!!memberError}
                      />
                      {memberError && (
                        <p className="text-xs font-semibold text-rose-500 mt-1 flex items-center gap-1">
                          <TriangleAlert className="w-3.5 h-3.5 shrink-0" />
                          {memberError}
                        </p>
                      )}
                    </div>

                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      
                      <div className={isLoanRelated ? "col-span-1 space-y-1.5" : "col-span-2 space-y-1.5"}>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                          <ArrowDownUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          Tipe Transaksi <span className="text-rose-500">*</span>
                        </label>
                        <div className={`relative rounded-xl border transition-all bg-slate-50/50 dark:bg-slate-950/40 ${
                          typeError
                            ? 'border-rose-400 dark:border-rose-900/50 focus-within:ring-rose-500/20 focus-within:border-rose-500'
                            : 'border-slate-200 dark:border-slate-700/80 focus-within:ring-emerald-500/20 focus-within:border-emerald-500'
                        }`}>
                          <select
                            value={transactionType}
                            onChange={handleTypeChange}
                            className="w-full px-4 py-3 bg-transparent text-slate-950 dark:text-slate-100 font-semibold focus:outline-none text-sm appearance-none cursor-pointer"
                          >
                            <option value="" disabled>Pilih Tipe Transaksi...</option>
                            {TRANSACTION_TYPES.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                        {typeError && (
                          <p className="text-xs font-semibold text-rose-500 mt-1 flex items-center gap-1">
                            <TriangleAlert className="w-3.5 h-3.5 shrink-0" />
                            {typeError}
                          </p>
                        )}
                      </div>

                      
                      {isLoanRelated && (
                        <div className="col-span-1 space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                            <Landmark className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            Pilih Kontrak Pinjaman <span className="text-rose-500">*</span>
                          </label>
                          <div className={`relative rounded-xl border transition-all bg-slate-50/50 dark:bg-slate-950/40 ${
                            loanError
                              ? 'border-rose-400 dark:border-rose-900/50 focus-within:ring-rose-500/20 focus-within:border-rose-500'
                              : 'border-slate-200 dark:border-slate-700/80 focus-within:ring-emerald-500/20 focus-within:border-emerald-500'
                          }`}>
                            <select
                              value={selectedLoan}
                              onChange={(e) => {
                                setSelectedLoan(e.target.value)
                                setLoanError('')
                              }}
                              className="w-full px-4 py-3 bg-transparent text-slate-950 dark:text-slate-100 font-semibold focus:outline-none text-sm appearance-none cursor-pointer"
                            >
                              <option value="" disabled>Pilih Kontrak Pinjaman Aktif...</option>
                              {activeContracts.length > 0 ? (
                                activeContracts.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.id} - {c.desc} (Rp {formatNumberWithDots(c.amount)})
                                  </option>
                                ))
                              ) : (
                                <>
                                  <option value="" disabled className="text-slate-400 italic">-- Tidak ada kontrak aktif --</option>
                                  <option value="LN-EMERGENCY-TEMP" className="text-emerald-600 font-semibold">LN-EMERGENCY-TEMP (Kontrak Darurat)</option>
                                </>
                              )}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                          {loanError && (
                            <p className="text-xs font-semibold text-rose-500 mt-1 flex items-center gap-1">
                              <TriangleAlert className="w-3.5 h-3.5 shrink-0" />
                              {loanError}
                            </p>
                          )}
                        </div>
                      )}

                    </div>

                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                          Nominal Transaksi (Rupiah) <span className="text-rose-500">*</span>
                        </label>
                        <div className={`relative rounded-xl border transition-all bg-slate-50/50 dark:bg-slate-950/40 ${
                          amountError
                            ? 'border-rose-400 dark:border-rose-900/50 focus-within:ring-rose-500/20 focus-within:border-rose-500'
                            : 'border-slate-200 dark:border-slate-700/80 focus-within:ring-emerald-500/20 focus-within:border-emerald-500'
                        }`}>
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm font-semibold pointer-events-none">
                            Rp
                          </span>
                          <input
                            type="text"
                            className="w-full pl-10 pr-4 py-3 bg-transparent text-slate-950 dark:text-slate-100 font-semibold focus:outline-none text-base placeholder:font-normal"
                            placeholder="0"
                            value={rawAmount}
                            onChange={handleAmountChange}
                          />
                        </div>
                        {rawAmount && !amountError && (
                          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 pl-1 flex items-center gap-1">
                            Format: <span className="text-emerald-600 dark:text-emerald-400 font-bold">Rp {formatNumberWithDots(rawAmount.replace(/\D/g, ''))}</span>
                          </p>
                        )}
                        {amountError && (
                          <p className="text-xs font-semibold text-rose-500 mt-1 flex items-center gap-1">
                            <TriangleAlert className="w-3.5 h-3.5 shrink-0" />
                            {amountError}
                          </p>
                        )}
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">Maksimal 15 digit</span>
                      </div>

                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 block">
                          <CalendarDays className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          Tanggal Transaksi
                        </label>
                        <div className="relative rounded-xl border border-slate-200 dark:border-slate-700/80 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all bg-slate-50/50 dark:bg-slate-950/40">
                          <input
                            type="date"
                            className="w-full px-4 py-3 bg-transparent text-slate-950 dark:text-slate-100 font-semibold focus:outline-none text-sm cursor-pointer"
                            value={transactionDate}
                            onChange={(e) => setTransactionDate(e.target.value)}
                          />
                        </div>
                      </div>

                    </div>

                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 block">
                        <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        Keterangan / Catatan
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-50/50 dark:bg-slate-950/40 text-slate-950 dark:text-slate-100 font-medium focus:outline-none text-sm rounded-xl border border-slate-200 dark:border-slate-700/80 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                        placeholder='Contoh: "Pembayaran cicilan rapelan", "Pembelian beras pecah kulit dari gudang 3"'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    
                    <button
                      type="button"
                      onClick={handleSaveTransaction}
                      disabled={isSaving}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sedang Menyimpan Transaksi...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Simpan Transaksi
                        </>
                      )}
                    </button>

                  </div>
                </div>
              </div>

              
              <div className="lg:col-span-5 space-y-6">

                
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">Buku Catatan Transaksi</h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {recentTransactions.length} rekaman
                    </span>
                  </div>

                  <div className="space-y-3">
                    {recentTransactions.map((tx) => {
                      const ui = getTxTypeStyles(tx.type)
                      const isNegativeImpact = tx.type === 'loan_disbursement' || tx.type === 'savings_withdrawal' || tx.type === 'rice_purchase'

                      return (
                        <div
                          key={tx.id}
                          className="group relative p-4 bg-slate-50/50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800/60 rounded-xl transition-colors"
                        >
                          <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${
                            isNegativeImpact ? 'bg-rose-500' : 'bg-emerald-500'
                          }`} />

                          <div className="pl-3 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                                {tx.member.name}
                              </span>
                              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider ${ui.color}`}>
                                {ui.label}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                <span className="font-semibold">{tx.member.id}</span>
                                {tx.loanId && (
                                  <>
                                    <span className="text-slate-300 dark:text-slate-700">•</span>
                                    <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-600 dark:text-slate-400">
                                      {tx.loanId}
                                    </span>
                                  </>
                                )}
                              </div>
                              <span className={`font-extrabold text-sm ${
                                isNegativeImpact ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                              }`}>
                                {isNegativeImpact ? '-' : '+'} Rp {formatNumberWithDots(tx.amount)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                              <span className="font-medium italic truncate max-w-[200px]">
                                "{tx.description}"
                              </span>
                              <span className="font-mono">{tx.date}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 mb-1 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <Landmark className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      Ikhtisar Catatan Transaksi
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Formulir ini mencatat transaksi simpan pinjam anggota koperasi secara terstruktur. Seluruh data diverifikasi secara instan untuk memastikan validitas pencatatan keuangan.
                  </p>
                  <div className="grid grid-cols-2 gap-3.5 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block tracking-wider">Tipe Transaksi</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">Standar Koperasi</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block tracking-wider">Relasi Pinjaman</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">Opsional</span>
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}

        </div>

      </div>

      
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        savedToast
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-600 text-white rounded-xl shadow-xl shadow-emerald-600/30 font-semibold text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          {toastMessage}
          <button
            onClick={() => setSavedToast(false)}
            className="ml-2 p-0.5 rounded hover:bg-emerald-500 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataEntry

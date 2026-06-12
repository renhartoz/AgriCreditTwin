import React, { useState, useMemo } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Layers,
  ShieldCheck,
  Warehouse,
  Coins,
  Users,
  Award,
  Info,
  ChevronDown,
  Check,
  Lock,
  RefreshCw,
  FileSpreadsheet,
  Activity,
  ArrowUpRight,
  PieChart as PieChartIcon
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'

// ─── MOCK DATA PER COOPERATIVE AND AGGREGATE ───────────────────
const COOPERATIVES_DATA = {
  ALL: {
    id: 'AGG-000',
    name: 'Semua Koperasi (Agregat Jaringan) / All Cooperatives',
    location: 'Seluruh Jaringan Mitra AgriCredit Twin',
    totalDisbursed: 23150000000,
    avgTicketSize: 14200000,
    repaymentRate: 94.2,
    restructuringEffectiveness: 82.5,
    inventoryTurnover: 5.4,
    inventoryList: [
      { commodity: 'Kayu Log / Timber', qtyTons: 380, marketPriceKg: 45000 },
      { commodity: 'Gabah Kering / Rice', qtyTons: 1200, marketPriceKg: 12000 },
      { commodity: 'Jagung Pipil / Corn', qtyTons: 850, marketPriceKg: 6500 },
      { commodity: 'Kedelai Lokal / Soybeans', qtyTons: 420, marketPriceKg: 14000 }
    ],
    disbursementVelocity: [
      { month: 'Jan', velocity: 68, amount: 1200000000 },
      { month: 'Feb', velocity: 72, amount: 1450000000 },
      { month: 'Mar', velocity: 70, amount: 1350000000 },
      { month: 'Apr', velocity: 78, amount: 1800000000 },
      { month: 'Mei', velocity: 85, amount: 2100000000 },
      { month: 'Jun', velocity: 82, amount: 1950000000 },
      { month: 'Jul', velocity: 88, amount: 2400000000 },
      { month: 'Ags', velocity: 91, amount: 2650000000 },
      { month: 'Sep', velocity: 89, amount: 2300000000 },
      { month: 'Okt', velocity: 93, amount: 2800000000 },
      { month: 'Nov', velocity: 95, amount: 3100000000 },
      { month: 'Des', velocity: 96, amount: 3300000000 }
    ],
    netRevenue: [
      { month: 'Jan', interest: 110, logistics: 45 },
      { month: 'Feb', interest: 125, logistics: 52 },
      { month: 'Mar', interest: 120, logistics: 49 },
      { month: 'Apr', interest: 145, logistics: 60 },
      { month: 'Mei', interest: 160, logistics: 75 },
      { month: 'Jun', interest: 155, logistics: 68 },
      { month: 'Jul', interest: 180, logistics: 82 },
      { month: 'Ags', interest: 195, logistics: 90 },
      { month: 'Sep', interest: 185, logistics: 88 },
      { month: 'Okt', interest: 210, logistics: 105 },
      { month: 'Nov', interest: 230, logistics: 115 },
      { month: 'Des', interest: 245, logistics: 120 }
    ],
    memberAcquisition: [
      { month: 'Jan', activeMembers: 1200 },
      { month: 'Feb', activeMembers: 1280 },
      { month: 'Mar', activeMembers: 1350 },
      { month: 'Apr', activeMembers: 1440 },
      { month: 'Mei', activeMembers: 1560 },
      { month: 'Jun', activeMembers: 1670 },
      { month: 'Jul', activeMembers: 1780 },
      { month: 'Ags', activeMembers: 1910 },
      { month: 'Sep', activeMembers: 2040 },
      { month: 'Okt', activeMembers: 2180 },
      { month: 'Nov', activeMembers: 2310 },
      { month: 'Des', activeMembers: 2450 }
    ],
    dataCompleteness: [
      { month: 'Jan', clean: 40, defective: 60 },
      { month: 'Feb', clean: 45, defective: 55 },
      { month: 'Mar', clean: 52, defective: 48 },
      { month: 'Apr', clean: 60, defective: 40 },
      { month: 'Mei', clean: 68, defective: 32 },
      { month: 'Jun', clean: 74, defective: 26 },
      { month: 'Jul', clean: 80, defective: 20 },
      { month: 'Ags', clean: 85, defective: 15 },
      { month: 'Sep', clean: 90, defective: 10 },
      { month: 'Okt', clean: 93, defective: 7 },
      { month: 'Nov', clean: 96, defective: 4 },
      { month: 'Des', clean: 98, defective: 2 }
    ]
  },
  KOP_PADIWANGI: {
    id: 'KOP-001',
    name: 'Koperasi Padiwangi',
    location: 'Kab. Subang, Jawa Barat',
    totalDisbursed: 4850000000,
    avgTicketSize: 12500000,
    repaymentRate: 96.8,
    restructuringEffectiveness: 88.0,
    inventoryTurnover: 4.8,
    inventoryList: [
      { commodity: 'Gabah Kering / Rice', qtyTons: 480, marketPriceKg: 12000 },
      { commodity: 'Jagung Pipil / Corn', qtyTons: 120, marketPriceKg: 6500 }
    ],
    disbursementVelocity: [
      { month: 'Jan', velocity: 65, amount: 220000000 },
      { month: 'Feb', velocity: 70, amount: 280000000 },
      { month: 'Mar', velocity: 68, amount: 250000000 },
      { month: 'Apr', velocity: 74, amount: 310000000 },
      { month: 'Mei', velocity: 82, amount: 390000000 },
      { month: 'Jun', velocity: 80, amount: 370000000 },
      { month: 'Jul', velocity: 84, amount: 420000000 },
      { month: 'Ags', velocity: 89, amount: 480000000 },
      { month: 'Sep', velocity: 86, amount: 450000000 },
      { month: 'Okt', velocity: 90, amount: 510000000 },
      { month: 'Nov', velocity: 93, amount: 560000000 },
      { month: 'Des', velocity: 95, amount: 600000000 }
    ],
    netRevenue: [
      { month: 'Jan', interest: 25, logistics: 10 },
      { month: 'Feb', interest: 29, logistics: 12 },
      { month: 'Mar', interest: 27, logistics: 11 },
      { month: 'Apr', interest: 32, logistics: 14 },
      { month: 'Mei', interest: 38, logistics: 18 },
      { month: 'Jun', interest: 36, logistics: 17 },
      { month: 'Jul', interest: 42, logistics: 21 },
      { month: 'Ags', interest: 46, logistics: 24 },
      { month: 'Sep', interest: 44, logistics: 22 },
      { month: 'Okt', interest: 50, logistics: 27 },
      { month: 'Nov', interest: 54, logistics: 30 },
      { month: 'Des', interest: 58, logistics: 32 }
    ],
    memberAcquisition: [
      { month: 'Jan', activeMembers: 210 },
      { month: 'Feb', activeMembers: 220 },
      { month: 'Mar', activeMembers: 232 },
      { month: 'Apr', activeMembers: 245 },
      { month: 'Mei', activeMembers: 260 },
      { month: 'Jun', activeMembers: 275 },
      { month: 'Jul', activeMembers: 288 },
      { month: 'Ags', activeMembers: 302 },
      { month: 'Sep', activeMembers: 315 },
      { month: 'Okt', activeMembers: 325 },
      { month: 'Nov', activeMembers: 335 },
      { month: 'Des', activeMembers: 342 }
    ],
    dataCompleteness: [
      { month: 'Jan', clean: 50, defective: 50 },
      { month: 'Feb', clean: 54, defective: 46 },
      { month: 'Mar', clean: 60, defective: 40 },
      { month: 'Apr', clean: 68, defective: 32 },
      { month: 'Mei', clean: 75, defective: 25 },
      { month: 'Jun', clean: 81, defective: 19 },
      { month: 'Jul', clean: 86, defective: 14 },
      { month: 'Ags', clean: 90, defective: 10 },
      { month: 'Sep', clean: 94, defective: 6 },
      { month: 'Okt', clean: 97, defective: 3 },
      { month: 'Nov', clean: 99, defective: 1 },
      { month: 'Des', clean: 100, defective: 0 }
    ]
  },
  KOP_TANIMAKMUR: {
    id: 'KOP-002',
    name: 'Koperasi Tani Makmur',
    location: 'Kab. Indramayu, Jawa Barat',
    totalDisbursed: 7200000000,
    avgTicketSize: 13900000,
    repaymentRate: 91.5,
    restructuringEffectiveness: 76.2,
    inventoryTurnover: 5.9,
    inventoryList: [
      { commodity: 'Gabah Kering / Rice', qtyTons: 580, marketPriceKg: 12000 },
      { commodity: 'Jagung Pipil / Corn', qtyTons: 430, marketPriceKg: 6500 }
    ],
    disbursementVelocity: [
      { month: 'Jan', velocity: 60, amount: 350000000 },
      { month: 'Feb', velocity: 65, amount: 410000000 },
      { month: 'Mar', velocity: 63, amount: 390000000 },
      { month: 'Apr', velocity: 70, amount: 480000000 },
      { month: 'Mei', velocity: 76, amount: 550000000 },
      { month: 'Jun', velocity: 74, amount: 530000000 },
      { month: 'Jul', velocity: 81, amount: 620000000 },
      { month: 'Ags', velocity: 85, amount: 690000000 },
      { month: 'Sep', velocity: 83, amount: 660000000 },
      { month: 'Okt', velocity: 88, amount: 750000000 },
      { month: 'Nov', velocity: 90, amount: 800000000 },
      { month: 'Des', velocity: 92, amount: 850000000 }
    ],
    netRevenue: [
      { month: 'Jan', interest: 32, logistics: 15 },
      { month: 'Feb', interest: 37, logistics: 18 },
      { month: 'Mar', interest: 35, logistics: 17 },
      { month: 'Apr', interest: 43, logistics: 21 },
      { month: 'Mei', interest: 49, logistics: 26 },
      { month: 'Jun', interest: 47, logistics: 24 },
      { month: 'Jul', interest: 55, logistics: 30 },
      { month: 'Ags', interest: 61, logistics: 34 },
      { month: 'Sep', interest: 58, logistics: 32 },
      { month: 'Okt', interest: 66, logistics: 38 },
      { month: 'Nov', interest: 71, logistics: 41 },
      { month: 'Des', interest: 75, logistics: 44 }
    ],
    memberAcquisition: [
      { month: 'Jan', activeMembers: 380 },
      { month: 'Feb', activeMembers: 395 },
      { month: 'Mar', activeMembers: 410 },
      { month: 'Apr', activeMembers: 428 },
      { month: 'Mei', activeMembers: 442 },
      { month: 'Jun', activeMembers: 458 },
      { month: 'Jul', activeMembers: 472 },
      { month: 'Ags', activeMembers: 485 },
      { month: 'Sep', activeMembers: 494 },
      { month: 'Okt', activeMembers: 504 },
      { month: 'Nov', activeMembers: 512 },
      { month: 'Des', activeMembers: 518 }
    ],
    dataCompleteness: [
      { month: 'Jan', clean: 35, defective: 65 },
      { month: 'Feb', clean: 39, defective: 61 },
      { month: 'Mar', clean: 45, defective: 55 },
      { month: 'Apr', clean: 52, defective: 48 },
      { month: 'Mei', clean: 60, defective: 40 },
      { month: 'Jun', clean: 67, defective: 33 },
      { month: 'Jul', clean: 73, defective: 27 },
      { month: 'Ags', clean: 79, defective: 21 },
      { month: 'Sep', clean: 84, defective: 16 },
      { month: 'Okt', clean: 89, defective: 11 },
      { month: 'Nov', clean: 93, defective: 7 },
      { month: 'Des', clean: 96, defective: 4 }
    ]
  },
  KOP_AGROJAYA: {
    id: 'KOP-003',
    name: 'Koperasi Agro Jaya',
    location: 'Kab. Karawang, Jawa Barat',
    totalDisbursed: 2100000000,
    avgTicketSize: 11100000,
    repaymentRate: 85.3,
    restructuringEffectiveness: 65.8,
    inventoryTurnover: 4.1,
    inventoryList: [
      { commodity: 'Kayu Log / Timber', qtyTons: 150, marketPriceKg: 45000 },
      { commodity: 'Kedelai Lokal / Soybeans', qtyTons: 80, marketPriceKg: 14000 }
    ],
    disbursementVelocity: [
      { month: 'Jan', velocity: 50, amount: 90000000 },
      { month: 'Feb', velocity: 52, amount: 110000000 },
      { month: 'Mar', velocity: 55, amount: 105000000 },
      { month: 'Apr', velocity: 60, amount: 140000000 },
      { month: 'Mei', velocity: 68, amount: 180000000 },
      { month: 'Jun', velocity: 65, amount: 170000000 },
      { month: 'Jul', velocity: 70, amount: 200000000 },
      { month: 'Ags', velocity: 74, amount: 230000000 },
      { month: 'Sep', velocity: 72, amount: 215000000 },
      { month: 'Okt', velocity: 78, amount: 250000000 },
      { month: 'Nov', velocity: 80, amount: 270000000 },
      { month: 'Des', velocity: 82, amount: 285000000 }
    ],
    netRevenue: [
      { month: 'Jan', interest: 10, logistics: 4 },
      { month: 'Feb', interest: 12, logistics: 5 },
      { month: 'Mar', interest: 11, logistics: 5 },
      { month: 'Apr', interest: 15, logistics: 7 },
      { month: 'Mei', interest: 19, logistics: 9 },
      { month: 'Jun', interest: 18, logistics: 8 },
      { month: 'Jul', interest: 21, logistics: 10 },
      { month: 'Ags', interest: 24, logistics: 12 },
      { month: 'Sep', interest: 22, logistics: 11 },
      { month: 'Okt', interest: 26, logistics: 14 },
      { month: 'Nov', interest: 28, logistics: 15 },
      { month: 'Des', interest: 30, logistics: 16 }
    ],
    memberAcquisition: [
      { month: 'Jan', activeMembers: 115 },
      { month: 'Feb', activeMembers: 122 },
      { month: 'Mar', activeMembers: 128 },
      { month: 'Apr', activeMembers: 135 },
      { month: 'Mei', activeMembers: 142 },
      { month: 'Jun', activeMembers: 148 },
      { month: 'Jul', activeMembers: 155 },
      { month: 'Ags', activeMembers: 162 },
      { month: 'Sep', activeMembers: 168 },
      { month: 'Okt', activeMembers: 175 },
      { month: 'Nov', activeMembers: 182 },
      { month: 'Des', activeMembers: 189 }
    ],
    dataCompleteness: [
      { month: 'Jan', clean: 25, defective: 75 },
      { month: 'Feb', clean: 30, defective: 70 },
      { month: 'Mar', clean: 36, defective: 64 },
      { month: 'Apr', clean: 42, defective: 58 },
      { month: 'Mei', clean: 50, defective: 50 },
      { month: 'Jun', clean: 56, defective: 44 },
      { month: 'Jul', clean: 62, defective: 38 },
      { month: 'Ags', clean: 68, defective: 32 },
      { month: 'Sep', clean: 74, defective: 26 },
      { month: 'Okt', clean: 80, defective: 20 },
      { month: 'Nov', clean: 85, defective: 15 },
      { month: 'Des', clean: 90, defective: 10 }
    ]
  },
  KOP_SUMBERREJEKI: {
    id: 'KOP-004',
    name: 'Koperasi Sumber Rejeki',
    location: 'Kab. Cirebon, Jawa Barat',
    totalDisbursed: 3400000000,
    avgTicketSize: 12300000,
    repaymentRate: 94.7,
    restructuringEffectiveness: 80.5,
    inventoryTurnover: 5.1,
    inventoryList: [
      { commodity: 'Gabah Kering / Rice', qtyTons: 140, marketPriceKg: 12000 },
      { commodity: 'Kedelai Lokal / Soybeans', qtyTons: 190, marketPriceKg: 14000 }
    ],
    disbursementVelocity: [
      { month: 'Jan', velocity: 68, amount: 180000000 },
      { month: 'Feb', velocity: 72, amount: 210000000 },
      { month: 'Mar', velocity: 70, amount: 200000000 },
      { month: 'Apr', velocity: 76, amount: 260000000 },
      { month: 'Mei', velocity: 83, amount: 310000000 },
      { month: 'Jun', velocity: 80, amount: 290000000 },
      { month: 'Jul', velocity: 86, amount: 350000000 },
      { month: 'Ags', velocity: 88, amount: 375000000 },
      { month: 'Sep', velocity: 85, amount: 340000000 },
      { month: 'Okt', velocity: 90, amount: 410000000 },
      { month: 'Nov', velocity: 92, amount: 440000000 },
      { month: 'Des', velocity: 94, amount: 465000000 }
    ],
    netRevenue: [
      { month: 'Jan', interest: 18, logistics: 8 },
      { month: 'Feb', interest: 21, logistics: 9 },
      { month: 'Mar', interest: 20, logistics: 9 },
      { month: 'Apr', interest: 25, logistics: 12 },
      { month: 'Mei', interest: 29, logistics: 15 },
      { month: 'Jun', interest: 27, logistics: 14 },
      { month: 'Jul', interest: 33, logistics: 17 },
      { month: 'Ags', interest: 35, logistics: 19 },
      { month: 'Sep', interest: 33, logistics: 18 },
      { month: 'Okt', interest: 39, logistics: 21 },
      { month: 'Nov', interest: 42, logistics: 23 },
      { month: 'Des', interest: 45, logistics: 25 }
    ],
    memberAcquisition: [
      { month: 'Jan', activeMembers: 190 },
      { month: 'Feb', activeMembers: 198 },
      { month: 'Mar', activeMembers: 206 },
      { month: 'Apr', activeMembers: 215 },
      { month: 'Mei', activeMembers: 224 },
      { month: 'Jun', activeMembers: 233 },
      { month: 'Jul', activeMembers: 242 },
      { month: 'Ags', activeMembers: 251 },
      { month: 'Sep', activeMembers: 259 },
      { month: 'Okt', activeMembers: 266 },
      { month: 'Nov', activeMembers: 272 },
      { month: 'Des', activeMembers: 276 }
    ],
    dataCompleteness: [
      { month: 'Jan', clean: 42, defective: 58 },
      { month: 'Feb', clean: 48, defective: 52 },
      { month: 'Mar', clean: 55, defective: 45 },
      { month: 'Apr', clean: 62, defective: 38 },
      { month: 'Mei', clean: 70, defective: 30 },
      { month: 'Jun', clean: 76, defective: 24 },
      { month: 'Jul', clean: 82, defective: 18 },
      { month: 'Ags', clean: 87, defective: 13 },
      { month: 'Sep', clean: 91, defective: 9 },
      { month: 'Okt', clean: 94, defective: 6 },
      { month: 'Nov', clean: 97, defective: 3 },
      { month: 'Des', clean: 99, defective: 1 }
    ]
  },
  KOP_HARAPANTANI: {
    id: 'KOP-005',
    name: 'Koperasi Harapan Tani',
    location: 'Kab. Purwakarta, Jawa Barat',
    totalDisbursed: 5600000000,
    avgTicketSize: 13500000,
    repaymentRate: 92.8,
    restructuringEffectiveness: 79.4,
    inventoryTurnover: 5.6,
    inventoryList: [
      { commodity: 'Kayu Log / Timber', qtyTons: 230, marketPriceKg: 45000 },
      { commodity: 'Jagung Pipil / Corn', qtyTons: 300, marketPriceKg: 6500 },
      { commodity: 'Kedelai Lokal / Soybeans', qtyTons: 150, marketPriceKg: 14000 }
    ],
    disbursementVelocity: [
      { month: 'Jan', velocity: 62, amount: 260000000 },
      { month: 'Feb', velocity: 68, amount: 310000000 },
      { month: 'Mar', velocity: 66, amount: 295000000 },
      { month: 'Apr', velocity: 72, amount: 370000000 },
      { month: 'Mei', velocity: 80, amount: 440000000 },
      { month: 'Jun', velocity: 78, amount: 420000000 },
      { month: 'Jul', velocity: 84, amount: 500000000 },
      { month: 'Ags', velocity: 87, amount: 540000000 },
      { month: 'Sep', velocity: 85, amount: 510000000 },
      { month: 'Okt', velocity: 89, amount: 590000000 },
      { month: 'Nov', velocity: 92, amount: 630000000 },
      { month: 'Des', velocity: 94, amount: 660000000 }
    ],
    netRevenue: [
      { month: 'Jan', interest: 24, logistics: 9 },
      { month: 'Feb', interest: 28, logistics: 10 },
      { month: 'Mar', interest: 26, logistics: 10 },
      { month: 'Apr', interest: 32, logistics: 13 },
      { month: 'Mei', interest: 39, logistics: 17 },
      { month: 'Jun', interest: 37, logistics: 16 },
      { month: 'Jul', interest: 44, logistics: 20 },
      { month: 'Ags', interest: 48, logistics: 22 },
      { month: 'Sep', interest: 45, logistics: 21 },
      { month: 'Okt', interest: 52, logistics: 25 },
      { month: 'Nov', interest: 56, logistics: 28 },
      { month: 'Des', interest: 59, logistics: 30 }
    ],
    memberAcquisition: [
      { month: 'Jan', activeMembers: 300 },
      { month: 'Feb', activeMembers: 312 },
      { month: 'Mar', activeMembers: 324 },
      { month: 'Apr', activeMembers: 338 },
      { month: 'Mei', activeMembers: 352 },
      { month: 'Jun', activeMembers: 366 },
      { month: 'Jul', activeMembers: 379 },
      { month: 'Ags', activeMembers: 391 },
      { month: 'Sep', activeMembers: 400 },
      { month: 'Okt', activeMembers: 406 },
      { month: 'Nov', activeMembers: 410 },
      { month: 'Des', activeMembers: 412 }
    ],
    dataCompleteness: [
      { month: 'Jan', clean: 38, defective: 62 },
      { month: 'Feb', clean: 44, defective: 56 },
      { month: 'Mar', clean: 50, defective: 50 },
      { month: 'Apr', clean: 58, defective: 42 },
      { month: 'Mei', clean: 66, defective: 34 },
      { month: 'Jun', clean: 72, defective: 28 },
      { month: 'Jul', clean: 78, text: 'Clean data', defective: 22 },
      { month: 'Ags', clean: 83, defective: 17 },
      { month: 'Sep', clean: 88, defective: 12 },
      { month: 'Okt', clean: 92, defective: 8 },
      { month: 'Nov', clean: 95, defective: 5 },
      { month: 'Des', clean: 98, defective: 2 }
    ]
  }
}

// Helper function for formatted currency
const formatCurrencyPremium = (value) => {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(2) + ' Milyar'
  }
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + ' Juta'
  }
  return value.toLocaleString('id-ID')
}

// Helper component to display currency beautifully aligned and centered
const CurrencyDisplay = ({ value }) => {
  const parts = useMemo(() => {
    if (value >= 1000000000) {
      return { num: (value / 1000000000).toFixed(2), suffix: 'Milyar' }
    }
    if (value >= 1000000) {
      return { num: (value / 1000000).toFixed(1), suffix: 'Juta' }
    }
    return { num: value.toLocaleString('id-ID'), suffix: '' }
  }, [value])

  return (
    <div className="flex items-center gap-2 mt-2.5">
      {/* Redesigned clean text instead of squeezed badge */}
      <span className="text-base font-semibold text-muted-foreground mr-0.5">
        Rp
      </span>
      {/* Value and Suffix aligned cleanly */}
      <div className="flex items-center gap-1.5">
        <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
          {parts.num}
        </span>
        {parts.suffix && (
          <span className="text-sm font-semibold text-muted-foreground">
            {parts.suffix}
          </span>
        )}
      </div>
    </div>
  )
}

function Analytics() {
  const [selectedKey, setSelectedKey] = useState('ALL')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const activeData = useMemo(() => {
    return COOPERATIVES_DATA[selectedKey]
  }, [selectedKey])

  // Calculate dynamic warehouse valuation: sum(Quantity Tons * 1000 * marketPriceKg)
  const calculatedInventoryValuation = useMemo(() => {
    return activeData.inventoryList.reduce((acc, curr) => {
      const itemValue = curr.qtyTons * 1000 * curr.marketPriceKg
      return acc + itemValue
    }, 0)
  }, [activeData])

  // Top Commodities Donut Chart Data preparation
  const commoditiesDonutData = useMemo(() => {
    const total = activeData.inventoryList.reduce((acc, curr) => {
      return acc + (curr.qtyTons * 1000 * curr.marketPriceKg)
    }, 0)

    const colors = ['#0ea5e9', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6']
    return activeData.inventoryList.map((item, index) => {
      const value = item.qtyTons * 1000 * item.marketPriceKg
      const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
      return {
        name: item.commodity.split('/')[0].trim(),
        value: value,
        percentage: `${percentage}%`,
        color: colors[index % colors.length]
      }
    })
  }, [activeData])

  // Custom tooltips styled to match standard page fonts
  const FinancialTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 border border-border p-3.5 rounded-xl shadow-lg text-xs text-card-foreground backdrop-blur-xs">
          <p className="font-bold border-b border-border/50 pb-1.5 mb-1.5">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, idx) => (
              <div key={idx} className="flex justify-between items-center gap-4">
                <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {entry.name?.includes('Rate') || entry.name?.includes('%') || entry.name?.includes('Velocity')
                    ? `${entry.value.toFixed(1)}%`
                    : entry.value >= 1000000
                    ? `Rp ${entry.value.toLocaleString('id-ID')}`
                    : entry.value.toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">

        {/* ── HEADER & THEME-COMPLIANT CONTROL BAR ─────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                Dasbor Analisis Portofolio Investor
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Proyeksi makro kinerja portofolio kredit, utilisasi kapital, likuiditas inventori komoditas, dan tingkat integritas audit data.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Anonymity Compliant Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-450 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Agregat Anonim (Tanpa NIK/KTP)</span>
            </div>

            {/* Cooperative Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full sm:w-72 flex items-center justify-between gap-2.5 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-250 transition-all cursor-pointer shadow-2xs"
              >
                <span className="truncate">
                  {activeData.name}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-full sm:w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden text-xs">
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-extrabold bg-slate-50/50 dark:bg-slate-950/20">
                      Pilih Lingkup Analisis
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedKey('ALL')
                          setDropdownOpen(false)
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between transition-colors cursor-pointer ${
                          selectedKey === 'ALL' ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/15 font-bold' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>Semua Koperasi (Agregat Jaringan)</span>
                        {selectedKey === 'ALL' && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
                      </button>

                      {Object.keys(COOPERATIVES_DATA).filter(k => k !== 'ALL').map((key) => {
                        const item = COOPERATIVES_DATA[key]
                        return (
                          <button
                            type="button"
                            key={key}
                            onClick={() => {
                              setSelectedKey(key)
                              setDropdownOpen(false)
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between transition-colors border-t border-slate-100 dark:border-slate-800/50 cursor-pointer ${
                              selectedKey === key ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/15 font-bold' : 'text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className="truncate">
                              <p className="truncate font-semibold">{item.name}</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{item.location}</p>
                            </div>
                            {selectedKey === key && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── SECTION 1: Capital Utilization & Returns (Financial Grid) ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-2">
            <Coins className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Bagian I: Utilisasi Kapital & Tingkat Pengembalian
            </h2>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Total Disbursed */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all duration-200 group">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Penyaluran Kredit (Disbursed Capital)
                </span>
                <CurrencyDisplay value={activeData.totalDisbursed} />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 pt-3 text-[10px] text-slate-500 dark:text-slate-400">
                <span>Eksposur Lapangan Aktif</span>
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 font-semibold">
                  Live <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>

            {/* Card 2: Average Ticket Size */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all duration-200">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Rata-rata Pinjaman (Ticket Size)
                </span>
                <CurrencyDisplay value={activeData.avgTicketSize} />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 pt-3 text-[10px] text-slate-500 dark:text-slate-400">
                <span>Per Anggota Terverifikasi</span>
                <span className="text-slate-450 dark:text-slate-500 font-semibold">Agregat</span>
              </div>
            </div>

            {/* Card 3: On-Time Repayment Rate */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all duration-200">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Tingkat Pengembalian Tepat Waktu
                </span>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-3xl md:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                    {activeData.repaymentRate}%
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-450 border border-emerald-200 dark:border-emerald-900/40">
                    Premium
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 pt-3 text-[10px] text-slate-500 dark:text-slate-400">
                <span>Rasio Kredit Lancar</span>
                <span className="text-emerald-600 dark:text-emerald-450 font-semibold">Sangat Stabil</span>
              </div>
            </div>

            {/* Card 4: Restructuring Effectiveness */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all duration-200">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Efektivitas Restrukturisasi Tenor
                </span>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-3xl md:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                    {activeData.restructuringEffectiveness}%
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-450 border border-emerald-200 dark:border-emerald-900/40">
                    Recovery
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 pt-3 text-[10px] text-slate-500 dark:text-slate-400">
                <span>Penyelesaian Potensi Default</span>
                <span className="text-slate-450 dark:text-slate-500 font-semibold">Tenor Adjusted</span>
              </div>
            </div>
          </div>

          {/* Section 1 Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Line/Area Chart: Disbursement Velocity */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 gap-2">
                <div>
                  <h3 className="font-bold text-slate-950 dark:text-slate-100 text-sm flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Tren Kecepatan Penyaluran Kredit
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-0.5">
                    Rasio penyerapan modal investor menjadi pinjaman lapangan aktif bulanan
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 text-[10px] font-semibold">
                    Velocity Maks: 96%
                  </span>
                </div>
              </div>

              <div className="h-72 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activeData.disbursementVelocity} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.15} vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10, fontWeight: 500 }} />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v) => `${v}%`}
                      width={40}
                      label={{ value: 'Tingkat Penyaluran (%)', angle: -90, position: 'insideLeft', offset: -5, style: { fontSize: 10, fill: '#64748b', fontWeight: 500 } }}
                    />
                    <Tooltip content={<FinancialTooltip />} />
                    <Area type="monotone" dataKey="velocity" name="Kecepatan Penyaluran" stroke="none" fill="url(#velocityGrad)" />
                    <Line
                      type="monotone"
                      dataKey="velocity"
                      name="Velocity (%)"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={{ fill: '#ffffff', stroke: '#10b981', strokeWidth: 2, r: 3.5 }}
                      activeDot={{ r: 5, strokeWidth: 1 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart: Net Revenue Trend */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 gap-2">
                <div>
                  <h3 className="font-bold text-slate-950 dark:text-slate-100 text-sm flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Pendapatan Bersih Koperasi (Net Revenue)
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-0.5">
                    Pembagian hasil margin bunga pinjaman dan margin distribusi komoditas logistik
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
                    Bunga (Jt)
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                    <span className="w-2.5 h-2.5 bg-sky-500 rounded-sm" />
                    Logistik (Jt)
                  </span>
                </div>
              </div>

              <div className="h-72 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activeData.netRevenue} margin={{ top: 10, right: 10, left: 10, bottom: 5 }} barSize={14}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.15} vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10, fontWeight: 500 }} />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v) => `${v} Jt`}
                      width={50}
                      label={{ value: 'Nominal (Juta Rupiah)', angle: -90, position: 'insideLeft', offset: -10, style: { fontSize: 10, fill: '#64748b', fontWeight: 500 } }}
                    />
                    <Tooltip content={<FinancialTooltip />} />
                    <Bar dataKey="interest" name="Interest Revenue" fill="#10b981" stackId="a" />
                    <Bar dataKey="logistics" name="Logistics Margin" fill="#0ea5e9" stackId="a" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: General Asset & Inventory Analytics ─────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-2">
            <Warehouse className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
              Bagian II: Analisis Jaminan Fisik & Inventori Gudang (Commodity-Agnostic)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Metric Cards + Valuation Spreadsheet */}
            <div className="lg:col-span-2 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Total Inventory Valuation Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all duration-200">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      Valuasi Total Inventori Gudang
                    </span>
                    <CurrencyDisplay value={calculatedInventoryValuation} />
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 pt-3 text-[10px] text-slate-500 dark:text-slate-400">
                    <span>Valuasi Berjalan (Volume × Indeks Pasar)</span>
                    <span className="text-sky-600 dark:text-sky-450 font-bold">Kalkulasi Otomatis</span>
                  </div>
                </div>

                {/* Inventory Turnover Rate Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all duration-200">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      Rasio Perputaran Inventori (Turnover)
                    </span>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-3xl md:text-4xl font-extrabold text-sky-600 dark:text-sky-400 tracking-tight">
                        {activeData.inventoryTurnover}x
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-900/40">
                        Likuiditas Tinggi
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 pt-3 text-[10px] text-slate-500 dark:text-slate-400">
                    <span>Frekuensi Siklus Keluar Masuk Barang</span>
                    <span className="text-slate-450 dark:text-slate-500 font-semibold">Per Musim Tanam</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Spreadsheet Table */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    Lembar Kalkulasi Valuasi Agunan Fisik Gudang
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Live Market Index</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/50 text-slate-550 dark:text-slate-400 uppercase">
                        <th className="p-3 font-bold tracking-wider text-[10px]">Nama Komoditas / Commodity</th>
                        <th className="p-3 font-bold tracking-wider text-[10px] text-right">Volume (Ton)</th>
                        <th className="p-3 font-bold tracking-wider text-[10px] text-right text-right">Harga Indeks Pasar</th>
                        <th className="p-3 font-bold tracking-wider text-[10px] text-right text-right">Subtotal Valuasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {activeData.inventoryList.map((item, index) => {
                        const totalKg = item.qtyTons * 1000
                        const itemValuation = totalKg * item.marketPriceKg
                        return (
                          <tr key={index} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/30 transition-colors">
                            <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{item.commodity}</td>
                            <td className="p-3 text-right text-slate-700 dark:text-slate-300 font-bold">{item.qtyTons.toLocaleString('id-ID')} Ton</td>
                            <td className="p-3 text-right text-slate-550 dark:text-slate-400 font-medium">
                              <div className="flex items-center justify-end gap-1.5">
                                <span className="text-muted-foreground font-semibold">Rp</span>
                                <span>{item.marketPriceKg.toLocaleString('id-ID')}/Kg</span>
                              </div>
                            </td>
                            <td className="p-3 text-right text-emerald-600 dark:text-emerald-400 font-extrabold">
                              <div className="flex items-center justify-end gap-1.5">
                                <span className="text-emerald-600/70 dark:text-emerald-400/70 font-semibold">Rp</span>
                                <span>{formatCurrencyPremium(itemValuation)}</span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                      <tr className="bg-slate-50/50 dark:bg-slate-950/40 font-bold">
                        <td className="p-3 text-slate-500 dark:text-slate-400 text-right uppercase" colSpan={3}>
                          Total Nilai Agunan Gudang Terproteksi:
                        </td>
                        <td className="p-3 text-right text-emerald-600 dark:text-emerald-400 text-sm border-t border-slate-200 dark:border-slate-800 font-black">
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="text-emerald-600/70 dark:text-emerald-400/70 font-bold">Rp</span>
                            <span>{formatCurrencyPremium(calculatedInventoryValuation)}</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Donut Chart: Top Commodities by Value */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <h3 className="font-bold text-slate-950 dark:text-slate-100 text-sm flex items-center gap-1.5">
                  <PieChartIcon className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  Distribusi Nilai Komoditas Gudang
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-0.5">
                  Proporsi nilai jaminan fisik terhadap total inventori gudang berjalan
                </p>
              </div>

              <div className="h-48 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={commoditiesDonutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {commoditiesDonutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `Rp ${formatCurrencyPremium(value)}`}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc', fontSize: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Central Info Badge */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                  <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold">Aset Fisik</span>
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400">{activeData.inventoryList.length} Barang</span>
                </div>
              </div>

              {/* Legends with detailed subtext */}
              <div className="mt-4 space-y-2.5 border-t border-slate-100 dark:border-slate-800/80 pt-3.5">
                {commoditiesDonutData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 dark:text-slate-400 font-semibold">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-450 dark:text-slate-500">Rp {formatCurrencyPremium(item.value)}</span>
                      <span className="text-sky-600 dark:text-sky-400 font-bold">({item.percentage})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 3: Ecosystem Growth & Health ──────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-850 pb-2">
            <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Bagian III: Pertumbuhan Jaringan & Integritas Data Audit
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Member Acquisition Trend */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 gap-2">
                <div>
                  <h3 className="font-bold text-slate-950 dark:text-slate-100 text-sm flex items-center gap-1.5">
                    <Users className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                    Akuisisi Anggota Tani Aktif (MoM)
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-0.5">
                    Pertumbuhan jumlah produsen aktif yang terintegrasi di dalam sistem kemitraan koperasi
                  </p>
                </div>
                <div className="shrink-0">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 text-[10px] font-semibold">
                    Target: +15% YoY
                  </span>
                </div>
              </div>

              <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activeData.memberAcquisition} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.15} vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10, fontWeight: 500 }} />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fontSize: 10 }}
                      width={40}
                      label={{ value: 'Petani Aktif (Orang)', angle: -90, position: 'insideLeft', offset: -5, style: { fontSize: 10, fill: '#64748b', fontWeight: 500 } }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc', fontSize: '10px' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="activeMembers"
                      name="Produsen Aktif"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={{ fill: '#ffffff', stroke: '#10b981', strokeWidth: 2, r: 3.5 }}
                      activeDot={{ r: 5, strokeWidth: 1 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Data Completeness Growth */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 gap-2">
                <div>
                  <h3 className="font-bold text-slate-950 dark:text-slate-100 text-sm flex items-center gap-1.5">
                    <Award className="w-4.5 h-4.5 text-sky-600 dark:text-sky-400" />
                    Tingkat Integritas & Kelengkapan Data Audit
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-0.5">
                    Rasio data legacy cacat/tidak lengkap versus data bersih tervalidasi schema-compliant
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
                    Clean (%)
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                    <span className="w-2.5 h-2.5 bg-rose-500 rounded-sm" />
                    Defective (%)
                  </span>
                </div>
              </div>

              <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activeData.dataCompleteness} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.15} vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10, fontWeight: 500 }} />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v) => `${v}%`}
                      width={40}
                      label={{ value: 'Rasio Data (%)', angle: -90, position: 'insideLeft', offset: -5, style: { fontSize: 10, fill: '#64748b', fontWeight: 500 } }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc', fontSize: '10px' }}
                    />
                    <Area type="monotone" dataKey="clean" name="Data Bersih Terverifikasi" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="defective" name="Data Cacat/Kotor" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER AUDIT TRUST MARK ──────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-200 dark:border-slate-900/60 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Sistem Verifikasi AgriCredit Twin. Keamanan Agunan Fisik & Portofolio Kredit Tervalidasi.</span>
          </div>
          <div>
            <span>Terakhir Diperbarui: {new Date().toLocaleDateString('id-ID')}</span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Analytics

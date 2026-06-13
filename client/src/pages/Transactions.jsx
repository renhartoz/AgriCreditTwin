import { useState, useMemo } from 'react';
import {
  Search,
  X,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  Activity,
  FileText,
  Undo2
} from 'lucide-react'


const INITIAL_TRANSACTIONS = [
  {
    loanId: "LOAN-7F4B3C8A",
    createdAt: "2026-06-11T08:00:00Z",
    changedAt: "2026-06-13T01:30:00Z",
    disbursedAt: "2026-06-13T03:00:00Z",
    transactionCreatedAt: "2026-06-13T03:05:00Z",
    transactionType: "loan_disbursement",
    avsFlag: false,
    fieldName: "amount",
    oldValue: "Rp 10.000.000",
    newValue: "Rp 45.000.000",
    officerId: "104",
    status: "disbursed"
  },
  {
    loanId: "LOAN-3A8D2F5B",
    createdAt: "2026-06-10T09:30:00Z",
    changedAt: "2026-06-12T14:15:00Z",
    disbursedAt: "2026-06-12T15:00:00Z",
    transactionCreatedAt: "2026-06-12T15:10:00Z",
    transactionType: "loan_disbursement",
    avsFlag: true,
    fieldName: "interestRate",
    oldValue: "12%",
    newValue: "2.5%",
    officerId: "203",
    status: "disbursed"
  },
  {
    loanId: "LOAN-9C1E8A7F",
    createdAt: "2026-06-08T11:00:00Z",
    changedAt: "2026-06-11T16:00:00Z",
    disbursedAt: "2026-06-13T09:00:00Z",
    transactionCreatedAt: "2026-06-13T09:15:00Z",
    transactionType: "loan_disbursement",
    avsFlag: false,
    fieldName: "collateralValue",
    oldValue: "Rp 50.000.000",
    newValue: "Rp 150.000.000",
    officerId: "307",
    status: "disbursed"
  },
  {
    loanId: "LOAN-4B2C9D1E",
    createdAt: "2026-06-05T14:00:00Z",
    changedAt: "2026-06-07T08:30:00Z",
    disbursedAt: "2026-06-12T10:00:00Z",
    transactionCreatedAt: "2026-06-12T10:15:00Z",
    transactionType: "loan_disbursement",
    avsFlag: false,
    fieldName: "tenor",
    oldValue: "24 Bulan",
    newValue: "6 Bulan",
    officerId: "104",
    status: "disbursed"
  },
  {
    loanId: "LOAN-6E7F8G9H",
    createdAt: "2026-06-12T10:00:00Z",
    changedAt: "2026-06-13T06:00:00Z",
    disbursedAt: null,
    transactionCreatedAt: null,
    transactionType: null,
    avsFlag: false,
    fieldName: "amount",
    oldValue: "Rp 5.000.000",
    newValue: "Rp 25.000.000",
    officerId: "411",
    status: "pending"
  },
  {
    loanId: "LOAN-2D3C4B5A",
    createdAt: "2026-06-09T07:15:00Z",
    changedAt: "2026-06-12T23:50:00Z",
    disbursedAt: "2026-06-13T00:10:00Z",
    transactionCreatedAt: "2026-06-13T00:20:00Z",
    transactionType: "loan_disbursement",
    avsFlag: false,
    fieldName: "tenor",
    oldValue: "12 Bulan",
    newValue: "36 Bulan",
    officerId: "203",
    status: "disbursed"
  }
];


const getFieldLabel = (fieldName) => {
  const mapping = {
    amount: "Nominal Pinjaman",
    interestRate: "Suku Bunga",
    tenor: "Jangka Waktu (Tenor)",
    collateralValue: "Aset Jaminan",
  };
  return mapping[fieldName] || fieldName;
};


const getTimeDifference = (t1, t2) => {
  if (!t1 || !t2) return null;
  const d1 = new Date(t1);
  const d2 = new Date(t2);
  const diffMs = Math.abs(d2 - d1);
  const diffHours = diffMs / (1000 * 60 * 60);
  return { hours: diffHours, ms: diffMs };
};


const formatTimeGap = (gapObj) => {
  if (!gapObj) return "N/A (Belum Cair)";
  const totalMinutes = Math.floor(gapObj.ms / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `${mins} Menit`;
  return `${hours} Jam ${mins} Menit`;
};


const formatTimestamp = (isoString) => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZoneName: 'short'
  });
};

function Transactions() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [avsFilter, setAvsFilter] = useState("all");
  const [proximityFilter, setProximityFilter] = useState("all");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isSlideOpen, setIsSlideOpen] = useState(false);

  
  const computedTransactions = useMemo(() => {
    return transactions.map(item => {
      const timeGap = getTimeDifference(item.changedAt, item.disbursedAt);
      const isUnder24h = timeGap ? timeGap.hours < 24 : false;
      return { ...item, timeGap, isUnder24h };
    });
  }, [transactions]);

  
  const filteredTransactions = useMemo(() => {
    return computedTransactions.filter(item => {
      const matchesSearch = item.loanId.toLowerCase().includes(searchQuery.toLowerCase());
      let matchesAvs = true;
      if (avsFilter === "flagged") matchesAvs = item.avsFlag === true;
      if (avsFilter === "clean") matchesAvs = item.avsFlag === false;
      let matchesProximity = true;
      if (proximityFilter === "critical") {
        matchesProximity = item.status === "disbursed" && item.isUnder24h;
      } else if (proximityFilter === "warning") {
        matchesProximity = item.status === "disbursed" && item.timeGap && item.timeGap.hours >= 24 && item.timeGap.hours < 72;
      } else if (proximityFilter === "safe") {
        matchesProximity = item.status === "disbursed" && item.timeGap && item.timeGap.hours >= 72;
      } else if (proximityFilter === "pending") {
        matchesProximity = item.status === "pending";
      }
      return matchesSearch && matchesAvs && matchesProximity;
    });
  }, [computedTransactions, searchQuery, avsFilter, proximityFilter]);

  
  const metrics = useMemo(() => {
    const total = computedTransactions.length;
    const flagged = computedTransactions.filter(t => t.avsFlag).length;
    const critical = computedTransactions.filter(t => t.status === "disbursed" && t.isUnder24h).length;
    const pending = computedTransactions.filter(t => t.status === "pending").length;
    return { total, flagged, critical, pending };
  }, [computedTransactions]);

  const handleRowClick = (item) => {
    const fullItem = computedTransactions.find(t => t.loanId === item.loanId);
    setSelectedLoan(fullItem);
    setIsSlideOpen(true);
  };

  const handleToggleFlag = (loanId, newFlagValue) => {
    setTransactions(prev => prev.map(t => {
      if (t.loanId === loanId) return { ...t, avsFlag: newFlagValue };
      return t;
    }));
    if (selectedLoan && selectedLoan.loanId === loanId) {
      setSelectedLoan(prev => ({ ...prev, avsFlag: newFlagValue }));
    }
    setIsSlideOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">

        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-7 h-7 text-rose-600 dark:text-rose-400" />
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                Auditor Verification Dashboard
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Audit trail & pendeteksi anomali pencairan kredit desa. Data PII disembunyikan untuk kepatuhan privasi (Zero PII).
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest font-mono bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 uppercase">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Mode Investigasi
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <Lock className="w-3.5 h-3.5" />
              Zero PII
            </span>
          </div>
        </div>

        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all duration-200">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Log Audit</span>
              <FileText className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">{metrics.total}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Seluruh siklus hidup pengajuan</p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all duration-200">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Bendera Anomali</span>
              <ShieldAlert className="w-4 h-4 text-rose-500 dark:text-rose-400" />
            </div>
            <p className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight">{metrics.flagged}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Diberi tanda investigasi lanjut</p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all duration-200">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Modifikasi &lt; 24 Jam</span>
              <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            </div>
            <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight">{metrics.critical}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Selisih waktu sangat dekat pencairan</p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 shadow-xs transition-all duration-200">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Belum Dicairkan</span>
              <Activity className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">{metrics.pending}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Status pencairan dana: Tertunda</p>
          </div>
        </div>

        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-xs">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan ID Pinjaman (cth: LOAN-7F4B)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-50/50 dark:bg-slate-950/40 px-3 py-1.5 border border-slate-200 dark:border-slate-700/80 rounded-xl">
                <span className="text-xs text-slate-500 font-mono">AVS Flag:</span>
                <select value={avsFilter} onChange={(e) => setAvsFilter(e.target.value)} className="bg-transparent text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer font-semibold">
                  <option value="all">Semua</option>
                  <option value="flagged">Flagged</option>
                  <option value="clean">Unflagged</option>
                </select>
              </div>
              <div className="flex items-center gap-2 bg-slate-50/50 dark:bg-slate-950/40 px-3 py-1.5 border border-slate-200 dark:border-slate-700/80 rounded-xl">
                <span className="text-xs text-slate-500 font-mono">Selisih:</span>
                <select value={proximityFilter} onChange={(e) => setProximityFilter(e.target.value)} className="bg-transparent text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer font-semibold">
                  <option value="all">Semua Waktu</option>
                  <option value="critical">Sangat Dekat (&lt; 24 Jam)</option>
                  <option value="warning">Dekat (24 - 72 Jam)</option>
                  <option value="safe">Aman (&gt; 72 Jam)</option>
                  <option value="pending">Belum Dicairkan</option>
                </select>
              </div>
              {(searchQuery || avsFilter !== "all" || proximityFilter !== "all") && (
                <button
                  onClick={() => { setSearchQuery(""); setAvsFilter("all"); setProximityFilter("all"); }}
                  className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-500 font-semibold px-2 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  Reset Filter
                </button>
              )}
            </div>
          </div>
        </div>

        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase bg-slate-50/80 dark:bg-slate-950/40 font-mono">
                  <th className="py-4 px-6">ID Pinjaman</th>
                  <th className="py-4 px-6">Waktu Modifikasi</th>
                  <th className="py-4 px-6">Bidang Data</th>
                  <th className="py-4 px-6">Rentang Waktu Ke Pencairan</th>
                  <th className="py-4 px-6 text-center">Bendera AVS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((item) => {
                    const truncatedLoanId = item.loanId.length > 9
                      ? `${item.loanId.substring(0, 5)}...${item.loanId.substring(item.loanId.length - 4)}`
                      : item.loanId;
                    return (
                      <tr
                        key={item.loanId}
                        onClick={() => handleRowClick(item)}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
                      >
                        <td className="py-4 px-6 font-mono text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          <div className="flex items-center gap-2">
                            <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
                            <span>{truncatedLoanId}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-500 dark:text-slate-400">{formatTimestamp(item.changedAt)}</td>
                        <td className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">{getFieldLabel(item.fieldName)}</td>
                        <td className="py-4 px-6">
                          {item.status === "disbursed" ? (
                            item.isUnder24h ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40">
                                <Clock className="w-3 h-3 animate-pulse" />
                                {formatTimeGap(item.timeGap)}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
                                <Clock className="w-3 h-3" />
                                {formatTimeGap(item.timeGap)}
                              </span>
                            )
                          ) : (
                            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded">
                              Belum Dicairkan
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {item.avsFlag ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/40 shadow-xs animate-pulse">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              AVS RED FLAG
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-mono tracking-wider bg-slate-100 dark:bg-slate-800/80 text-slate-500 border border-slate-200 dark:border-slate-700/50">
                              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
                              UNFLAGGED
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 px-6 text-center">
                      <div className="max-w-md mx-auto space-y-2">
                        <AlertCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                        <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">Tidak ada log kecocokan</h3>
                        <p className="text-xs text-slate-500">
                          Sesuaikan filter pencarian atau parameter selisih pencairan dana untuk menemukan audit trail.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      
      {isSlideOpen && selectedLoan && (
        <>
          <div onClick={() => setIsSlideOpen(false)} className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 transition-opacity duration-300" />
          <div className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-6 flex flex-col justify-between transition-transform duration-300 transform translate-x-0">

            
            <div className="overflow-y-auto pr-1 flex-1 space-y-6">

              
              <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
                    <ShieldAlert className="w-4 h-4" />
                    Audit Trail Detail
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white font-mono">
                    {selectedLoan.loanId.length > 9
                      ? `${selectedLoan.loanId.substring(0, 5)}...${selectedLoan.loanId.substring(selectedLoan.loanId.length - 4)}`
                      : selectedLoan.loanId}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Operator ID: #{selectedLoan.officerId}
                  </p>
                </div>
                <button onClick={() => setIsSlideOpen(false)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Perbandingan Nilai (Delta)
                </h3>
                <div className="bg-slate-50/80 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono block mb-1">Field Modifikasi</label>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{getFieldLabel(selectedLoan.fieldName)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono block mb-1">Nilai Lama</label>
                      <span className="text-sm text-rose-600 dark:text-rose-400 line-through font-mono">{selectedLoan.oldValue}</span>
                    </div>
                    <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
                      <label className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500/80 uppercase tracking-widest font-mono block mb-1">Nilai Baru</label>
                      <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 font-mono">{selectedLoan.newValue}</span>
                    </div>
                  </div>
                </div>
              </div>

              
              {selectedLoan.status === "disbursed" && selectedLoan.isUnder24h && (
                <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/40 p-4 rounded-xl text-rose-800 dark:text-rose-200 text-xs flex gap-3 items-start shadow-xs animate-pulse">
                  <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-extrabold tracking-wide uppercase text-rose-700 dark:text-rose-400 font-mono">Peringatan Proksimitas Kritis</p>
                    <p className="leading-relaxed">
                      ⚠️ Perubahan data terjadi kurang dari 24 jam sebelum pencairan dana! Selisih waktu: <strong>{formatTimeGap(selectedLoan.timeGap)}</strong>.
                    </p>
                  </div>
                </div>
              )}

              
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Kronologi Siklus Pinjaman
                </h3>
                <div className="bg-slate-50/80 dark:bg-slate-950/40 p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 relative">
                  <div className="absolute left-[29px] top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-800" />
                  <div className="space-y-6 relative">
                    
                    <div className="flex gap-4">
                      <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0 relative z-10">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Pengajuan Awal Diajukan</p>
                        <p className="text-[10px] text-slate-500 font-mono">{formatTimestamp(selectedLoan.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      {selectedLoan.isUnder24h ? (
                        <div className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/60 border border-rose-400 dark:border-rose-500 flex items-center justify-center shrink-0 relative z-10 animate-pulse">
                          <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-400 dark:border-amber-500 flex items-center justify-center shrink-0 relative z-10">
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        </div>
                      )}
                      <div className="space-y-0.5">
                        <p className={`text-xs font-bold ${selectedLoan.isUnder24h ? 'text-rose-700 dark:text-rose-400' : 'text-amber-700 dark:text-amber-400'}`}>
                          Modifikasi Data ({getFieldLabel(selectedLoan.fieldName)})
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{formatTimestamp(selectedLoan.changedAt)}</p>
                        <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded">
                          Modifikasi oleh Officer ID: #{selectedLoan.officerId}
                        </span>
                      </div>
                    </div>
                    
                    {selectedLoan.status === "disbursed" ? (
                      <div className="flex gap-4">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-slate-800 border border-emerald-300 dark:border-slate-700 flex items-center justify-center shrink-0 relative z-10">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Dana Dicairkan (Disbursed)</p>
                          <div className="space-y-0.5">
                            <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                              <span className="text-slate-400 dark:text-slate-600">Disbursed At:</span>
                              {formatTimestamp(selectedLoan.disbursedAt)}
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                              <span className="text-slate-400 dark:text-slate-600">Tx Created:</span>
                              {formatTimestamp(selectedLoan.transactionCreatedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0 relative z-10">
                          <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-800" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-500">Pencairan Dana Ditangguhkan</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-600 italic">Verifikasi auditor diperlukan sebelum dana dilepas</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-6 flex justify-between items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSlideOpen(false)}
                className="w-1/3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-3 px-4 rounded-xl text-xs text-center border border-slate-200 dark:border-slate-700/60 cursor-pointer transition-all"
              >
                Kembali
              </button>
              {selectedLoan.avsFlag ? (
                <button
                  type="button"
                  onClick={() => handleToggleFlag(selectedLoan.loanId, false)}
                  className="w-2/3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 active:bg-slate-400 dark:active:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-600/60 shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all uppercase tracking-wider"
                >
                  <Undo2 className="w-4 h-4" />
                  Lepas Tanda Anomali
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleToggleFlag(selectedLoan.loanId, true)}
                  className="w-2/3 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-lg shadow-rose-200 dark:shadow-rose-950/40 flex items-center justify-center gap-2 cursor-pointer transition-all uppercase tracking-wider"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Tandai sebagai Anomali
                </button>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  )
}

export default Transactions

import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { Check, ArrowRight, ShieldCheck, Cpu } from "lucide-react";

function Hero({ mode }) {
  const isInvestor = mode === 'investor'
  const user = true

  return (
    <section className="overflow-hidden bg-radial from-background via-background to-muted/20 border-b border-border">
      <div className="overflow-hidden h-full mx-auto w-full max-w-screen-xl px-4 md:px-20 pb-16 pt-10 lg:pt-16 lg:grid lg:grid-cols-12 lg:gap-8 lg:pb-24 relative">
        
        
        <div className="lg:col-span-7 px-4 lg:px-0 z-10 flex flex-col justify-center">
          
          <div className="relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start animate-fade-in">
            
            
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-6 border ${
              isInvestor 
                ? 'bg-[#1ecfc1]/10 text-[#169d92] border-[#1ecfc1]/30' 
                : 'bg-primary/10 text-primary-foreground border-primary/30'
            }`}>
              {isInvestor ? (
                <>
                  <Cpu className="w-3.5 h-3.5" />
                  Stokastik Finansial Digital Pertanian untuk Investor
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Sistem Pengaman Likuiditas Koperasi Pertanian
                </>
              )}
            </div>

            
            <div className="relative w-fit tracking-tight text-balance font-extrabold text-4xl sm:text-5xl lg:text-6xl flex gap-2 items-center flex-wrap justify-center lg:justify-start text-foreground leading-tight">
              {isInvestor ? (
                <>
                  <span>Investasi Tani dengan</span>
                  <span className="bg-[#1ecfc1]/10 text-[#169d92] border border-[#1ecfc1]/30 px-3 py-0.5 rounded-lg">
                    Presisi Tinggi.
                  </span>
                </>
              ) : (
                <>
                  <span>Salurkan Kredit dengan</span>
                  <span className="bg-primary px-3 text-gray-800 rounded-lg">
                    Keyakinan Penuh.
                  </span>
                </>
              )}
            </div>

            
            <div className="mt-6 text-base sm:text-lg lg:pr-6 max-w-prose text-center lg:text-left text-balance md:text-wrap text-muted-foreground leading-relaxed">
              {isInvestor ? (
                <p className="text-lg">
                  Akses portofolio pembiayaan pertanian yang telah terverifikasi secara ketat. Mitigasi risiko gagal bayar menggunakan model simulasi digital canggih kami yang menguji fluktuasi harga komoditas, hasil panen, dan ketahanan likuiditas sebelum modal Anda disalurkan.
                </p>
              ) : (
                <p className="text-lg">
                  Jangan biarkan ketidakpastian panen mengancam stabilitas keuangan koperasi Anda. Gunakan simulasi arus kas digital untuk menganalisis kelayakan kredit petani secara akurat, memproyeksikan kemampuan bayar, dan menekan rasio kredit bermasalah (NPL) sebelum dana dicairkan.
                </p>
              )}
            </div>

            
            <ul className="mt-8 space-y-3 text-left w-full max-w-md">
              {isInvestor ? (
                <>
                  <li className="flex gap-3 items-center text-sm sm:text-base font-medium">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1ecfc1]/10 text-[#1ecfc1] shrink-0">
                      <Check className="h-4 w-4" />
                    </div>
                    <span>Portofolio Kredit Koperasi Terverifikasi Aman</span>
                  </li>
                  <li className="flex gap-3 items-center text-sm sm:text-base font-medium">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1ecfc1]/10 text-[#1ecfc1] shrink-0">
                      <Check className="h-4 w-4" />
                    </div>
                    <span>Pemodelan Probabilitas Gagal Bayar (PD) Berbasis Data</span>
                  </li>
                  <li className="flex gap-3 items-center text-sm sm:text-base font-medium">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1ecfc1]/10 text-[#1ecfc1] shrink-0">
                      <Check className="h-4 w-4" />
                    </div>
                    <span>Integrasi Sinyal Satelit Cuaca & Lahan Terkini</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex gap-3 items-center text-sm sm:text-base font-medium">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                      <Check className="h-4 w-4" />
                    </div>
                    <span>Penurunan Rasio Kredit Bermasalah (NPL) & Jaga Likuiditas</span>
                  </li>
                  <li className="flex gap-3 items-center text-sm sm:text-base font-medium">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                      <Check className="h-4 w-4" />
                    </div>
                    <span>Perlindungan Privasi Petani & Vetting Aman</span>
                  </li>
                  <li className="flex gap-3 items-center text-sm sm:text-base font-medium">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                      <Check className="h-4 w-4" />
                    </div>
                    <span>Simulasi Arus Kas Stokastik Otomatis & Akurat</span>
                  </li>
                </>
              )}
            </ul>

            
            <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start items-center w-full gap-4">
              {isInvestor ? (
                <>
                  <Link to="/dashboard">
                    <Button className="bg-[#1ecfc1] hover:bg-[#169d92] text-white cursor-pointer transition-all px-8 py-6 rounded-xl font-bold text-base shadow-lg shadow-[#1ecfc1]/20 flex items-center gap-2">
                      Buka Dasbor Investasi
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <a href="#functions">
                    <Button variant="outline" className="border-border hover:bg-muted text-foreground cursor-pointer transition-all px-6 py-6 rounded-xl font-semibold text-base">
                      Cara Kerja
                    </Button>
                  </a>
                </>
              ) : (
                <>
                  <Link to={user ? "/simulation" : "/login"}>
                    <Button className="bg-primary hover:opacity-90 text-gray-900 cursor-pointer transition-all px-8 py-6 rounded-xl font-bold text-base shadow-lg shadow-primary/20 flex items-center gap-2">
                      Jalankan Simulasi Kredit
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/investor">
                    <Button variant="outline" className="border-border hover:bg-muted text-foreground cursor-pointer transition-all px-6 py-6 rounded-xl font-semibold text-base">
                      Lihat Platform Investor
                    </Button>
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>

        
        <div className="lg:col-span-5 hidden lg:flex items-center justify-center relative min-h-[450px]">
          
          <div className={`absolute -top-10 -right-10 w-72 h-72 rounded-full filter blur-3xl opacity-20 transition-all duration-700 ${
            isInvestor ? 'bg-[#1ecfc1]' : 'bg-[#7FFF00]'
          }`} />
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl opacity-10" />

          
          <div className="relative w-full max-w-md bg-card/65 backdrop-blur-md rounded-2xl border border-border shadow-2xl p-6 overflow-hidden transition-all duration-500 hover:shadow-3xl hover:-translate-y-1">
            
            
            <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400 block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400 block" />
                  <span className="w-3 h-3 rounded-full bg-green-400 block" />
                </div>
                <span className="text-xs font-mono text-muted-foreground ml-2">AgriTwin Simulasi v2.1</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider ${
                isInvestor ? 'bg-[#1ecfc1]/20 text-[#169d92]' : 'bg-primary/20 text-primary-foreground'
              }`}>
                {isInvestor ? 'DASBOR_INVESTASI' : 'SIMULASI_RISIKO'}
              </span>
            </div>

            {isInvestor ? (
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/40 rounded-xl border border-border">
                    <span className="text-xs text-muted-foreground block">Nilai Aset Bersih</span>
                    <span className="text-xl font-bold text-foreground block mt-1">Rp 19,2 Miliar</span>
                    <span className="text-[10px] text-green-500 font-semibold flex items-center gap-0.5 mt-0.5">
                      ↑ 8.4% musim ini
                    </span>
                  </div>
                  <div className="p-3 bg-muted/40 rounded-xl border border-border">
                    <span className="text-xs text-muted-foreground block">Rasio NPL Sistem</span>
                    <span className="text-xl font-bold text-foreground block mt-1">0.45%</span>
                    <span className="text-[10px] text-[#1ecfc1] font-semibold flex items-center gap-0.5 mt-0.5">
                      ↓ 72% di bawah pasar
                    </span>
                  </div>
                </div>

                
                <div className="p-4 bg-muted/30 rounded-xl border border-border relative">
                  <span className="text-xs font-semibold block mb-2 text-foreground">Proyeksi Risiko Stokastik</span>
                  <div className="h-32 w-full relative overflow-hidden flex items-end">
                    
                    <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-20">
                      <div className="border-b border-muted-foreground w-full" />
                      <div className="border-b border-muted-foreground w-full" />
                      <div className="border-b border-muted-foreground w-full" />
                    </div>
                    
                    <svg className="w-full h-full absolute inset-0 overflow-visible" viewBox="0 0 300 120">
                      
                      <path d="M 0 100 Q 75 90, 150 50 T 300 20" fill="none" stroke="#1ecfc1" strokeWidth="2.5" strokeDasharray="1" opacity="0.6" />
                      
                      <path d="M 0 100 Q 75 95, 150 70 T 300 45" fill="none" stroke="#1ecfc1" strokeWidth="3" />
                      
                      <path d="M 0 100 Q 75 105, 150 90 T 300 85" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3" opacity="0.8" />
                      
                      <path d="M 0 100 Q 75 90, 150 50 T 300 20 L 300 120 L 0 120 Z" fill="url(#investor-gradient)" opacity="0.08" />
                      
                      <defs>
                        <linearGradient id="investor-gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1ecfc1" />
                          <stop offset="100%" stopColor="#1ecfc1" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="flex justify-between w-full text-[9px] text-muted-foreground px-1 z-10">
                      <span>Pencairan</span>
                      <span>Tengah Siklus</span>
                      <span>Masa Panen</span>
                    </div>
                  </div>
                </div>

                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs p-2 bg-muted/20 rounded-lg border border-border/50">
                    <span className="font-semibold text-foreground">Koperasi Bumi Lestari</span>
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-500 font-mono font-bold rounded">Risiko Rendah</span>
                  </div>
                  <div className="flex justify-between items-center text-xs p-2 bg-muted/20 rounded-lg border border-border/50">
                    <span className="font-semibold text-foreground">Koperasi Tani Makmur</span>
                    <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 font-mono font-bold rounded">Risiko Sedang</span>
                  </div>
                </div>
              </div>
            ) : (
              
              <div className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Simulasi Plafon Pinjaman</label>
                    <div className="flex items-center justify-between p-2 bg-muted/40 rounded-lg border border-border text-sm font-semibold">
                      <span>Rp 150.000.000</span>
                      <span className="text-xs font-mono text-muted-foreground">IDR</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Jenis Komoditas</label>
                      <span className="block p-2 bg-muted/40 rounded-lg border border-border text-xs font-semibold">
                        Padi Sawah
                      </span>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Luas Lahan</label>
                      <span className="block p-2 bg-muted/40 rounded-lg border border-border text-xs font-semibold">
                        3.4 Hektar
                      </span>
                    </div>
                  </div>
                </div>

                
                <div className="p-3 bg-muted/30 rounded-xl border border-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-foreground block">Koridor Arus Kas</span>
                    <span className="text-[10px] font-mono bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded font-bold">
                      twin sehat
                    </span>
                  </div>
                  <div className="h-24 w-full relative overflow-hidden flex items-end">
                    <svg className="w-full h-full absolute inset-0 overflow-visible" viewBox="0 0 300 100">
                      
                      <path d="M 0 80 Q 75 40, 150 35 T 300 15 L 300 85 T 150 90 Q 75 95, 0 80 Z" fill="url(#coop-corridor)" opacity="0.12" />
                      
                      <path d="M 0 80 Q 75 60, 150 50 T 300 30" fill="none" stroke="#7FFF00" strokeWidth="3" />
                      
                      <line x1="0" y1="75" x2="300" y2="75" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3" opacity="0.6" />
                      
                      <defs>
                        <linearGradient id="coop-corridor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#7FFF00" />
                          <stop offset="100%" stopColor="#7FFF00" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1 px-1">
                    <span>Batas Minimum Pembayaran</span>
                    <span className="text-red-400 font-semibold">Koridor Kritis</span>
                  </div>
                </div>

                <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-green-600 dark:text-green-400 block">Validasi Digital Lolos</span>
                    <span className="text-[10px] text-muted-foreground block">Probabilitas Gagal Bayar (PD) &lt; 1.2%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}

export default Hero

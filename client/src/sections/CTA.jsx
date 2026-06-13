import { Link } from 'react-router-dom'
import { Check, ArrowRight } from 'lucide-react'

function CTA({ mode }) {
  const isInvestor = mode === 'investor'
  
  
  const themeTeal = '#169d92'
  const themeNeon = 'var(--primary-foreground)'
  const activeColor = isInvestor ? themeTeal : themeNeon
  const activeBgClass = isInvestor ? 'bg-[#1ecfc1] text-white hover:bg-[#169d92]' : 'bg-primary text-gray-900 hover:opacity-90'
  
  const investorBullets = [
    "Skor Risiko Portofolio instan berdasarkan data historis tata kelola koperasi yang valid",
    "Analisis simulasi digital canggih untuk menguji ketahanan hasil panen dan indeks harga komoditas",
    "Transparansi modal penuh untuk memantau portofolio pinjaman berjalan tanpa proses verifikasi manual"
  ]

  const cooperativeBullets = [
    "Analisis kelayakan kredit instan berbasis skenario pasar dan proyeksi panen petani",
    "Teknologi simulasi digital canggih untuk mendeteksi anomali kredit dan mencegah gagal bayar",
    "Transparansi data institusional melalui gerbang RBAC yang menjaga privasi petani sepenuhnya"
  ]

  const bullets = isInvestor ? investorBullets : cooperativeBullets

  return (
    <section className="bg-muted/30 text-foreground py-24 border-t border-border relative overflow-hidden">
      
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full filter blur-[150px] opacity-10 pointer-events-none ${
        isInvestor ? 'bg-[#1ecfc1]' : 'bg-[#7FFF00]'
      }`} />
      
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10 flex flex-col items-center">
        
        
        <div className={`inline-block border rounded-2xl md:rounded-3xl px-8 py-4 sm:px-12 sm:py-5 shadow-sm transition-all duration-500 ${
          isInvestor 
            ? 'bg-[#1ecfc1]/10 border-[#1ecfc1]/30 text-[#169d92]' 
            : 'bg-primary/15 border-primary/30 text-gray-800'
        }`}>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight select-none">
            {isInvestor ? "Mulai Berinvestasi" : "Mulai Amankan Kredit"}
          </h2>
        </div>

        
        <div className="mt-4 text-5xl sm:text-7xl font-extrabold text-foreground tracking-wide select-none">
          Sekarang Juga!
        </div>

        
        <ul className="mt-12 mb-10 space-y-4 text-left max-w-xl sm:max-w-2xl mx-auto px-2">
          {bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-3 text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed group">
              <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full shrink-0" style={{ color: activeColor }}>
                <Check className="h-5 w-5 stroke-[2.5]" />
              </span>
              <span className="group-hover:text-foreground transition-colors duration-200">
                {bullet}
              </span>
            </li>
          ))}
        </ul>

        
        <div className="mt-4">
          <Link to={!isInvestor ? "/auth/login" : "/auth/external/register"}>
            <button 
              className={`flex items-center gap-2 font-bold px-8 py-4 text-sm sm:text-base rounded-xl transition-all shadow-md hover:scale-105 cursor-pointer ${activeBgClass}`}
            >
              {isInvestor ? "Masuk ke Akun Investor" : "Masuk ke Akun Koperasi"}
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </Link>
        </div>

      </div>
    </section>
  )
}

export default CTA

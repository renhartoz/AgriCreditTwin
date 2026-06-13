import { LineChart, Shield, Sprout, Layers, Coins, Calendar, Database, Eye, Book } from 'lucide-react'

function Functions({ mode }) {
  const isInvestor = mode === 'investor'
  
 const investorFeatures = [
    {
      icon: <LineChart className="w-8 h-8 text-[#1ecfc1]" />,
      title: "Proyeksi Likuiditas & Arus Kas",
      description: "Akses matriks prediksi arus kas masuk kolektif yang disandingkan dengan musim panen untuk melihat ketahanan likuiditas pada bulan-bulan kritis secara transparan."
    },
    {
      icon: <Shield className="w-8 h-8 text-[#1ecfc1]" />,
      title: "Akses Portofolio Tersanitasi",
      description: "Akselerasi uji tuntas (due diligence) hingga 50% lebih cepat melalui gerbang Role-Based Access Control (RBAC) yang menyajikan metrik agregat portofolio tanpa membocorkan privasi personal petani."
    },
    {
      icon: <Sprout className="w-8 h-8 text-[#1ecfc1]" />,
      title: "Analitik Valuasi Aset Fisik",
      description: "Pantau total valuasi aset gudang secara real-time dari seluruh komoditas logistik hasil bumi yang bertindak sebagai jaminan likuiditas fisik koperasi."
    },
    {
      icon: <Layers className="w-8 h-8 text-[#1ecfc1]" />,
      title: "Eksplorasi Multi-Koperasi",
      description: "Bermanuver dan bandingkan performa risiko dari berbagai entitas koperasi desa dalam satu jaringan ekosistem untuk diversifikasi alokasi pendanaan institusional yang lebih terukur."
    }
  ];

  const cooperativeFeatures = [
    {
      icon: <Coins className="w-8 h-8 text-primary-foreground" />,
      title: "Simulasi Kelayakan Kredit Proaktif",
      description: "Tinggalkan penilaian spekulatif. Sistem mengeksekusi komputasi algoritma stokastik untuk memproyeksikan arus kas petani di masa depan berdasarkan luas lahan, harga gabah, dan siklus musim tanam sebelum pinjaman disetujui."
    },
    {
      icon: <Calendar className="w-8 h-8 text-primary-foreground" />,
      title: "Deteksi Defisit & Restrukturisasi",
      description: "Lindungi likuiditas koperasi dari skema tagihan bulanan yang kaku. Jika algoritma memprediksi defisit arus kas pada bulan non-panen, sistem otomatis memberikan peringatan NPL dan merekomendasikan penyesuaian tenor."
    },
    {
      icon: <Book className="w-8 h-8 text-primary-foreground" />,
      title: "Validasi Pembukuan Terstruktur",
      description: "Selamat tinggal pembukuan manual Excel yang rentan hilang. Antarmuka entri data relasional kami memiliki validasi parameter ketat untuk setiap transaksi finansial dan logistik, memastikan integritas data mencapai 100%."
    },
    {
      icon: <Database className="w-8 h-8 text-primary-foreground" />,
      title: "Arsitektur Multi-Tenant Terisolasi",
      description: "Kelola berbagai cabang koperasi desa dalam satu peladen tanpa tumpang tindih. Melalui partisi skema basis data independen, pengurus hanya dapat memproses dan melihat laporan dari koperasi mereka sendiri dengan aman."
    }
  ];

  const features = isInvestor ? investorFeatures : cooperativeFeatures
  const accentBg = isInvestor ? 'bg-[#1ecfc1]/10' : 'bg-primary/10'
  const accentBorder = isInvestor ? 'hover:border-[#1ecfc1]/40' : 'hover:border-primary/40'

  return (
    <section id="functions" className="py-20 bg-background relative overflow-hidden border-b border-border">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-20 relative z-10">
        
        
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <span className={`text-xs font-mono uppercase tracking-widest block mb-2 font-bold ${
            isInvestor ? 'text-[#169d92]' : 'text-primary-foreground'
          }`}>
            Keunggulan Platform
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            {isInvestor 
              ? "Keamanan Finansial untuk Investasi Pertanian Berkelanjutan"
              : "Teknologi Terdepan untuk Amankan Likuiditas Koperasi Anda"
            }
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground">
            {isInvestor
              ? "AgriCreditTwin menerjemahkan data lapangan pertanian menjadi analisis risiko finansial yang andal guna melindungi modal Anda dari volatilitas pasar."
              : "Gunakan pemodelan digital siklus tanam untuk memitigasi risiko gagal bayar akibat gagal panen, hama, dan jatuhnya harga pasar secara real-time."
            }
          </p>
        </div>

        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div 
              key={idx}
              className={`p-6 rounded-2xl bg-card border border-border/80 transition-all duration-300 group flex flex-col items-start ${accentBorder} hover:shadow-xl hover:-translate-y-1`}
            >
              <div className={`p-3 rounded-xl ${accentBg} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {feat.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 leading-snug">
                {feat.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Functions
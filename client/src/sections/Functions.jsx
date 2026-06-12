import React from 'react'
import { LineChart, Shield, Sprout, Layers, Coins, Calendar, Database, Eye } from 'lucide-react'

function Functions({ mode }) {
  const isInvestor = mode === 'investor'
  
  const investorFeatures = [
    {
      icon: <LineChart className="w-8 h-8 text-[#1ecfc1]" />,
      title: "Simulasi Risiko Stokastik",
      description: "Uji ketahanan portofolio terhadap hasil panen, perubahan harga pasar, dan cuaca ekstrem menggunakan skenario simulasi otomatis untuk menghasilkan skor risiko kredit yang akurat."
    },
    {
      icon: <Shield className="w-8 h-8 text-[#1ecfc1]" />,
      title: "Audit Kesehatan Koperasi",
      description: "Akses riwayat penyaluran kredit koperasi, rasio kredit bermasalah (NPL) historis, kecukupan cadangan likuiditas, dan indikator tata kelola keuangan secara aman."
    },
    {
      icon: <Sprout className="w-8 h-8 text-[#1ecfc1]" />,
      title: "Pemantauan Lahan via Satelit",
      description: "Pantau indeks kesehatan vegetasi (NDVI) tanaman, tingkat kelembapan tanah, dan histori produktivitas lahan petani secara langsung melalui data penginderaan jauh."
    },
    {
      icon: <Layers className="w-8 h-8 text-[#1ecfc1]" />,
      title: "Manajemen Risiko Portofolio",
      description: "Diversifikasikan alokasi modal investasi Anda berdasarkan tingkat kelayakan kredit, mikroklimat wilayah, siklus panen, dan jenis komoditas pertanian."
    }
  ]

  const cooperativeFeatures = [
    {
      icon: <Coins className="w-8 h-8 text-primary-foreground" />,
      title: "Proyeksi Arus Kas Petani",
      description: "Simulasikan dan proyeksikan koridor arus kas bulanan setiap petani untuk mengukur rasio kemampuan membayar cicilan (DSCR) secara akurat sebelum kredit disetujui."
    },
    {
      icon: <Calendar className="w-8 h-8 text-primary-foreground" />,
      title: "Penyelarasan Siklus Panen",
      description: "Sesuaikan jadwal pembayaran cicilan dan tenor kredit secara dinamis mengikuti kalender tanam, pemeliharaan, dan masa panen guna mencegah kemacetan kas musiman."
    },
    {
      icon: <Eye className="w-8 h-8 text-primary-foreground" />,
      title: "Audit Batas Lahan Satelit",
      description: "Verifikasi batas lahan garapan petani, riwayat kesuburan tanah, serta kepastian luas area budidaya secara jarak jauh dengan citra satelit GIS terintegrasi."
    },
    {
      icon: <Database className="w-8 h-8 text-primary-foreground" />,
      title: "Kubah Dokumen Terenkripsi",
      description: "Kumpulkan identitas pemohon dan sertifikat lahan dalam media penyimpanan yang aman dan terenkripsi, mematuhi regulasi perlindungan privasi data sepenuhnya."
    }
  ]

  const features = isInvestor ? investorFeatures : cooperativeFeatures
  const accentBg = isInvestor ? 'bg-[#1ecfc1]/10' : 'bg-primary/10'
  const accentBorder = isInvestor ? 'hover:border-[#1ecfc1]/40' : 'hover:border-primary/40'

  return (
    <section id="functions" className="py-20 bg-background relative overflow-hidden border-b border-border">
      {/* Subtle background grid pattern matching modern design system */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-20 relative z-10">
        
        {/* Section Header */}
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

        {/* Features Grid */}
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
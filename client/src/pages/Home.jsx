import Hero from '@/sections/Hero'
import Functions from '@/sections/Functions'
import CTA from '@/sections/CTA'

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Hero mode="cooperative" />
      <Functions mode="cooperative" />
      <CTA mode="cooperative" />
    </div>
  )
}

export default Home
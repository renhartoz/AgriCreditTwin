import React from 'react'
import Hero from '@/sections/Hero'
import Functions from '@/sections/Functions'
import CTA from '@/sections/CTA'

function InvestorHome() {
  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Hero mode="investor" />
      <Functions mode="investor" />
      <CTA mode="investor" />
    </div>
  )
}

export default InvestorHome

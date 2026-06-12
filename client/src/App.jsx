import React from 'react'
import { Button } from './components/ui/button'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import InvestorHome from './pages/InvestorHome'
import Dashboard from './pages/Dashboard'
import Simulation from './pages/Simulation'
import DataEntry from './pages/DataEntry'
import RiskDashboard from './pages/RiskDashboard'
import Analytics from './pages/Analytics'

function App() {
  return (
    <div className="overflow-hidden font-sans bg-background">
      <Navbar/>
      <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/investor" element={<InvestorHome />} />
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/simulation" element={<Simulation />} />
         <Route path="/data-entry" element={<DataEntry />} />
         <Route path="/risk" element={<RiskDashboard />} />
         <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </div>
  )
}

export default App
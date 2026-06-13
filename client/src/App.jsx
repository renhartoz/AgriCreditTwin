import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import InvestorHome from './pages/InvestorHome'
import Dashboard from './pages/Dashboard'
import Simulation from './pages/Simulation'
import DataEntry from './pages/DataEntry'
import RiskDashboard from './pages/RiskDashboard'
import Analytics from './pages/Analytics'
import Transactions from './pages/Transactions'
import InviteOperator from './pages/InviteOperator'


import AuthLayout from './layouts/AuthLayout'
import Login from './pages/auth/Login'
import RegisterCooperative from './pages/auth/RegisterCooperative'
import RegisterSuccess from './pages/auth/RegisterSuccess'
import SetupPassword from './pages/auth/SetupPassword'
import ExternalRegister from './pages/auth/ExternalRegister'
import ExternalLogin from './pages/auth/ExternalLogin'

function App() {
  return (
    <div className="overflow-hidden font-sans bg-background">
      <Routes>
        
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register-cooperative" element={<RegisterCooperative />} />
          <Route path="/auth/register-success" element={<RegisterSuccess />} />
          <Route path="/auth/setup-password" element={<SetupPassword />} />
        </Route>

        
        <Route path="/auth/external/register" element={<ExternalRegister />} />
        <Route path="/auth/external/login" element={<ExternalLogin />} />

        
        <Route path="/*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/investor" element={<InvestorHome />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/simulation" element={<Simulation />} />
              <Route path="/data-entry" element={<DataEntry />} />
              <Route path="/risk" element={<RiskDashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/invite-operator" element={<InviteOperator />} />
            </Routes>
          </>
        } />
      </Routes>
    </div>
  )
}

export default App
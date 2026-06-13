import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
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
import ActivateAccount from './pages/auth/ActivateAccount'

function App() {
  return (
    <AuthProvider>
      <div className="overflow-hidden font-sans bg-background">
        <Routes>

          {/* Auth routes (no Navbar, no auth required) */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register-cooperative" element={<RegisterCooperative />} />
            <Route path="/auth/register-success" element={<RegisterSuccess />} />
            <Route path="/auth/setup-password" element={<SetupPassword />} />
            <Route path="/auth/activate/:uidb64/:token" element={<ActivateAccount />} />
          </Route>

          {/* External auth routes */}
          <Route path="/auth/external/register" element={<ExternalRegister />} />
          <Route path="/auth/external/login" element={<ExternalLogin />} />

          {/* Public + Protected app routes (with Navbar) */}
          <Route path="/*" element={
            <>
              <Navbar />
              <Routes>
                {/* Public landing page */}
                <Route path="/" element={<Home />} />

                {/* Investor portal — requires investor or admin role */}
                <Route path="/investor" element={
                  <ProtectedRoute roles={['investor', 'admin']}>
                    <InvestorHome />
                  </ProtectedRoute>
                } />

                {/* Cooperative dashboard — requires cooperative or admin role */}
                <Route path="/dashboard" element={
                  <ProtectedRoute roles={['cooperative', 'admin']}>
                    <Dashboard />
                  </ProtectedRoute>
                } />

                {/* Simulation — requires cooperative or admin role */}
                <Route path="/simulation" element={
                  <ProtectedRoute roles={['cooperative', 'admin']}>
                    <Simulation />
                  </ProtectedRoute>
                } />

                {/* Data entry — requires cooperative or admin role */}
                <Route path="/data-entry" element={
                  <ProtectedRoute roles={['cooperative', 'admin']}>
                    <DataEntry />
                  </ProtectedRoute>
                } />

                {/* Risk dashboard — requires investor or admin role */}
                <Route path="/risk" element={
                  <ProtectedRoute roles={['investor', 'admin']}>
                    <RiskDashboard />
                  </ProtectedRoute>
                } />

                {/* Analytics — requires investor or admin role */}
                <Route path="/analytics" element={
                  <ProtectedRoute roles={['investor', 'admin']}>
                    <Analytics />
                  </ProtectedRoute>
                } />

                {/* Transactions (audit trail) — requires auditor role */}
                <Route path="/transactions" element={
                  <ProtectedRoute roles={['auditor']}>
                    <Transactions />
                  </ProtectedRoute>
                } />

                {/* Invite Operator — requires cooperative or admin role */}
                <Route path="/invite-operator" element={
                  <ProtectedRoute roles={['cooperative', 'admin']}>
                    <InviteOperator />
                  </ProtectedRoute>
                } />
              </Routes>
            </>
          } />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App

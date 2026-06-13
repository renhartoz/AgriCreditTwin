import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChartNoAxesCombined,
  FastForward,
  HardDriveDownload,
  LayoutDashboard,
  SearchAlert,
  TriangleAlert,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileNavbar from "./MobileNavbar";
import { useAuth } from "@/contexts/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const role = user?.role || null;

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl text-primary font-bold font-mono tracking-wider flex items-center gap-2"
            >
              <img className="w-13 h-13 flex rounded" src="/logo.png" alt="Logo" />
              <span className="text-[#78c2a4]">AgriCredit</span>
              <span className="text-primary">Twin</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4 items-center">
            {isAuthenticated ? (
              <>
                <NavLinks role={role} currentPath={location.pathname} />
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                    <User className="w-3 h-3" />
                    {user?.name || user?.username || 'User'}
                  </span>
                  {role && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {role}
                    </span>
                  )}
                </div>
                <Button
                  className="cursor-pointer px-4 hover:opacity-90 bg-[#7FFF00] text-black"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                  asChild
                >
                  <Link to="/auth/login">
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden lg:inline">Dashboard</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                  asChild
                >
                  <Link to="/auth/login">
                    <FastForward className="w-4 h-4" />
                    <span className="hidden lg:inline">Simulation</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                  asChild
                >
                  <Link to="/auth/login">
                    <HardDriveDownload className="w-4 h-4" />
                    <span className="hidden lg:inline">Data Entry</span>
                  </Link>
                </Button>
                <Button
                  className="cursor-pointer px-4 hover:opacity-90 bg-[#7FFF00] text-black"
                  asChild
                >
                  <Link to="/auth/login">Login</Link>
                </Button>
              </>
            )}
          </div>
          <MobileNavbar
            user={isAuthenticated ? user : null}
            role={role}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </nav>
  );
}


const navLinkClass = (path, currentPath) => {
  const isActive = currentPath === path;
  return isActive
    ? "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-semibold text-sm border border-primary/20"
    : "flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium text-sm transition-colors";
};


const NavLinks = ({ role, currentPath }) => {
  return (
    <>
      {(role === "cooperative" || role === "admin") && (
        <Link to="/dashboard" className={navLinkClass('/dashboard', currentPath)}>
          <LayoutDashboard className="w-4 h-4" />
          <span className="hidden lg:inline">Dashboard</span>
        </Link>
      )}
      {role === "cooperative" || role === "admin" ? (
        <Link to="/simulation" className={navLinkClass('/simulation', currentPath)}>
          <FastForward className="w-4 h-4" />
          <span className="hidden lg:inline">Simulation</span>
        </Link>
      ) : (
        <Link to="/risk" className={navLinkClass('/risk', currentPath)}>
          <TriangleAlert className="w-4 h-4" />
          <span className="hidden lg:inline">Risk Projection</span>
        </Link>
      )}
      {role === "cooperative" || role === "admin" ? (
        <Link to="/data-entry" className={navLinkClass('/data-entry', currentPath)}>
          <HardDriveDownload className="w-4 h-4" />
          <span className="hidden lg:inline">Data Entry</span>
        </Link>
      ) : (
        <Link to="/analytics" className={navLinkClass('/analytics', currentPath)}>
          <ChartNoAxesCombined className="w-4 h-4" />
          <span className="hidden lg:inline">Analytics</span>
        </Link>
      )}
      {role === "auditor" && (
        <Link to="/transactions" className={navLinkClass('/transactions', currentPath)}>
          <SearchAlert className="w-4 h-4" />
          <span className="hidden lg:inline">Transactions</span>
        </Link>
      )}
    </>
  );
};

export default Navbar;

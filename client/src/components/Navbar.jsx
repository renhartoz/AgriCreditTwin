import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Briefcase,
  ChartNoAxesCombined,
  FastForward,
  HardDriveDownload,
  LayoutDashboard,
  SearchAlert,
  TriangleAlert,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileNavbar from "./MobileNavbar";

function Navbar() {
  const user = true;
  const role = "auditor";
  // cooperative
  // investor
  // auditor
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl text-primary font-bold font-mono tracking-wider flex items-center gap-2"
            >

                <img className="w-13 h-13 flex rounded" src="/logo.png"/>
             
              <span className="text-[#78c2a4]">AgriCredit</span>
              <span className="text-primary">Twin</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4 items-center">
            {user ? (
              <>
                <NavLinks role={role} currentPath={location.pathname}/>
                <span className="text-sm text-muted-foreground">
                  {user.username}
                </span>
                <Button className="cursor-pointer px-4 hover:opacity-90 bg-[#7FFF00]">
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
                  <Link to="/login">
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden lg:inline">Dashboard</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                  asChild
                >
                  <Link to="/login">
                    <FastForward className="w-4 h-4" />
                    <span className="hidden lg:inline">Simulation</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                  asChild
                >
                  <Link to="/login">
                    <HardDriveDownload className="w-4 h-4" />
                    <span className="hidden lg:inline">Data Entry</span>
                  </Link>
                </Button>
                <Button
                  className="cursor-pointer px-4 hover:opacity-90 bg-[#7FFF00]"
                  asChild
                >
                  <Link to="/login">Login</Link>
                </Button>
              </>
            )}
          </div>
          <MobileNavbar user={user} role={role} />
        </div>
      </div>
    </nav>
  );
}

// Helper to compute link class based on active state
const navLinkClass = (path, currentPath) => {
  const isActive = currentPath === path;
  return isActive
    ? "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-semibold text-sm border border-primary/20"
    : "flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium text-sm transition-colors";
};

// Create a helper component for the authenticated links
const NavLinks = ({ role, currentPath }) => {
  return (
    <>
      {role == "cooperative" && (
        <Link to="/dashboard" className={navLinkClass('/dashboard', currentPath)}>
          <LayoutDashboard className="w-4 h-4" />
          <span className="hidden lg:inline">Dashboard</span>
        </Link>
      )}
      {role == "cooperative" ? (
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
      {role == "cooperative" ? (
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
      {role == "auditor" && (
        <Link to="/transactions" className={navLinkClass('/transactions', currentPath)}>
          <SearchAlert className="w-4 h-4" />
          <span className="hidden lg:inline">Transactions</span>
        </Link>
      )}
    </>
  );
};

export default Navbar;

import {
  MenuIcon,
  LayoutDashboard,
  FastForward,
  TriangleAlert,
  HardDriveDownload,
  ChartNoAxesCombined,
  SearchAlert,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Link } from "react-router-dom";

function MobileNavbar({ role, user, isAuthenticated, onLogout ,isAdmin}) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="flex md:hidden items-center space-x-2">
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col space-y-4 mt-6">
            {isAuthenticated ? (
              <>
                {user?.name && (
                  <div className="px-2 py-3 border-b border-border mb-2">
                    <p className="text-sm font-semibold text-foreground">{user.name}</p>
                    {role && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {role}
                      </span>
                    )}
                  </div>
                )}

                {(role === "cooperative" || role === "admin") && (
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 justify-start w-full text-muted-foreground hover:text-foreground hover:bg-muted font-medium text-sm transition-colors"
                    asChild
                  >
                    <Link to="/dashboard" onClick={() => setShowMobileMenu(false)}>
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </Button>
                )}

                {role === "cooperative" || role === "admin" ? (
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 justify-start w-full text-muted-foreground hover:text-foreground hover:bg-muted font-medium text-sm transition-colors"
                    asChild
                  >
                    <Link to="/simulation" onClick={() => setShowMobileMenu(false)}>
                      <FastForward className="w-4 h-4" />
                      Simulation
                    </Link>
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 justify-start w-full text-muted-foreground hover:text-foreground hover:bg-muted font-medium text-sm transition-colors"
                    asChild
                  >
                    <Link to="/risk" onClick={() => setShowMobileMenu(false)}>
                      <TriangleAlert className="w-4 h-4" />
                      Risk Projection
                    </Link>
                  </Button>
                )}

                {role === "cooperative" || role === "admin" ? (
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 justify-start w-full text-muted-foreground hover:text-foreground hover:bg-muted font-medium text-sm transition-colors"
                    asChild
                  >
                    <Link to="/data-entry" onClick={() => setShowMobileMenu(false)}>
                      <HardDriveDownload className="w-4 h-4" />
                      Data Entry
                    </Link>
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 justify-start w-full text-muted-foreground hover:text-foreground hover:bg-muted font-medium text-sm transition-colors"
                    asChild
                  >
                    <Link to="/analytics" onClick={() => setShowMobileMenu(false)}>
                      <ChartNoAxesCombined className="w-4 h-4" />
                      Analytics
                    </Link>
                  </Button>
                )}

                {(role === "cooperative" && isAdmin) && (
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 justify-start w-full text-muted-foreground hover:text-foreground hover:bg-muted font-medium text-sm transition-colors"
                    asChild
                  >
                    <Link to="/invite-operator" onClick={() => setShowMobileMenu(false)}>
                      <UserPlus className="w-4 h-4" />
                      Kelola Tim
                    </Link>
                  </Button>
                )}

                {role === "auditor" && (
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 justify-start w-full text-muted-foreground hover:text-foreground hover:bg-muted font-medium text-sm transition-colors"
                    asChild
                  >
                    <Link to="/transactions" onClick={() => setShowMobileMenu(false)}>
                      <SearchAlert className="w-4 h-4" />
                      Transactions
                    </Link>
                  </Button>
                )}

                <div className="flex items-center justify-center pt-4">
                  <Button
                    className="min-w-[100px] cursor-pointer hover:opacity-90 bg-[#7FFF00] text-black font-semibold"
                    onClick={() => {
                      setShowMobileMenu(false);
                      onLogout();
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-1.5" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 justify-start w-full text-muted-foreground hover:text-foreground hover:bg-muted font-medium text-sm transition-colors"
                  asChild
                >
                  <Link to="/auth/login" onClick={() => setShowMobileMenu(false)}>
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 justify-start w-full text-muted-foreground hover:text-foreground hover:bg-muted font-medium text-sm transition-colors"
                  asChild
                >
                  <Link to="/auth/login" onClick={() => setShowMobileMenu(false)}>
                    <FastForward className="w-4 h-4" />
                    Simulation
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 justify-start w-full text-muted-foreground hover:text-foreground hover:bg-muted font-medium text-sm transition-colors"
                  asChild
                >
                  <Link to="/auth/login" onClick={() => setShowMobileMenu(false)}>
                    <HardDriveDownload className="w-4 h-4" />
                    Data Entry
                  </Link>
                </Button>
                <div className="flex items-center justify-center pt-4">
                  <Button className="min-w-[100px] cursor-pointer hover:opacity-90 bg-[#7FFF00] text-black font-semibold" asChild>
                    <Link to="/auth/login" onClick={() => setShowMobileMenu(false)}>
                      Login
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavbar;

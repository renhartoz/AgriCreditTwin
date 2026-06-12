import { Briefcase, MenuIcon, SearchAlert, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function MobileNavbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const user = true
  const loading = false
  const navigate = useNavigate();


  if (loading) return null;

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
            <Button
              variant="ghost"
              className="flex items-center gap-3 justify-start"
              asChild
            >
              <Link to="/jobs" onClick={() => setShowMobileMenu(false)}>
                <Briefcase className="w-4 h-4" />
                Jobs
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-3 justify-start"
              asChild
            >
              <Link to="/community" onClick={() => setShowMobileMenu(false)}>
                <Users className="w-4 h-4" />
                Community
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-3 justify-start"
              asChild
            >
              <Link to="/jobs" onClick={() => setShowMobileMenu(false)}>
                <Briefcase className="w-4 h-4" />
                Jobs
              </Link>
            </Button>
            {user ? (
              <>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 justify-start"
                  asChild
                >
                  <Link to="/test" onClick={() => setShowMobileMenu(false)}>
                    <SearchAlert className="w-4 h-4" />
                    Test
                  </Link>
                </Button>

                <div className="flex items-center justify-center">
                  <Button
                    className="min-w-[100px] cursor-pointer"
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center">
                <Button className="min-w-[100px] cursor-pointer" asChild>
                  <Link to="/login" onClick={() => setShowMobileMenu(false)}>
                    Login
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavbar;

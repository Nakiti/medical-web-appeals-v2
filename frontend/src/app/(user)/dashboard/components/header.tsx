"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface HeaderProps {
   isSidebarOpen: boolean;
   onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, onToggleSidebar }) => {
   return (
      <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
         <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
            <div className="flex items-center gap-3">
               <Button
                  variant="ghost"
                  size="icon"
                  aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                  onClick={onToggleSidebar}
               >
                  {isSidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
               </Button>
               <span className="text-slate-900 font-semibold">Dashboard</span>
            </div>

            <div className="flex items-center gap-2">
               {/* Reserved for actions like profile, notifications, etc. */}
            </div>
         </div>
      </header>
   );
};

export default Header;




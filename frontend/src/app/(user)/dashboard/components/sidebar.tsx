"use client"
import React, { forwardRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, FileText, ClipboardList, Settings, FolderOpen } from "lucide-react";

interface SidebarProps {
   isOpen: boolean;
}

const navItems = [
   { label: "Home", href: "/dashboard/home", icon: Home },
   { label: "Appeals", href: "/dashboard/appeals", icon: FolderOpen },
   { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(function Sidebar(
   { isOpen },
   ref
) {
   const pathname = usePathname();

   return (
      <aside
         ref={ref}
         className={cn(
            "h-[calc(100vh-56px)] sm:h-[calc(100vh-56px)] sticky top-14 border-r border-slate-200 bg-white transition-all duration-300 overflow-y-auto",
            isOpen ? "w-64" : "w-0 sm:w-16"
         )}
         aria-hidden={!isOpen}
      >
         <nav className={cn("py-4", !isOpen && "sm:px-0")}> 
            <ul className="space-y-1 px-2">
               {navItems.map(({ label, href, icon: Icon }) => {
                  const isActive = pathname?.startsWith(href);
                  return (
                     <li key={href}>
                        <Link
                           href={href}
                           className={cn(
                              "group flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors",
                              isActive && "bg-slate-100 text-slate-900"
                           )}
                        >
                           <Icon className="size-4 text-slate-500 group-hover:text-slate-700" />
                           <span className={cn("truncate", !isOpen && "hidden sm:inline")}>{label}</span>
                        </Link>
                     </li>
                  );
               })}
            </ul>
         </nav>
      </aside>
   );
});

export default Sidebar;



"use client"
import React, { useState, useRef } from "react";
import Header from "./components/header";
import Sidebar from "./components/sidebar.tsx";

const DashboardLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
   const sidebarRef = useRef<HTMLDivElement | null>(null);
   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

   return (
      <div className="flex flex-col w-full">
         <Header 
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
         />

         <div className="flex">
            <Sidebar isOpen={isSidebarOpen} ref={sidebarRef} />
            <div className={`flex-1 bg-slate-100 overflow-x-hidden min-h-screen transition-all duration-300 ${isSidebarOpen ? 'sm:opacity-50 md:opacity-100' : 'sm:opacity-100'}`}>
               {children}
            </div>
         </div>
      </div>
   );
};

export default DashboardLayout;
import React from 'react';
import Link from 'next/link';
import { useContext } from 'react';
import { HeartPulse } from 'lucide-react';

const Header = () => {
   // const {currentUser} = useContext(AuthContext)

   return (
      <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <HeartPulse className="w-7 h-7 text-indigo-600" />
              <span>AppealMed</span>
            </Link>
            </div>
         </nav>
      </header>
   );
};

export default Header;
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLink {
  title: string;
  pathName: string;
}

interface NavbarTabsProps {
  links: NavLink[];
}

const NavbarTabs: React.FC<NavbarTabsProps> = ({ links }) => {
  const pathname = usePathname();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      <div className="flex items-center gap-4 -mb-px overflow-x-auto">
        {links.map((item) => {
          const isActive = pathname === item.pathName;
          return (
            <Link
              key={item.title}
              href={item.pathName}
              className={`py-3 px-2 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${
                isActive
                  ? "text-white border-indigo-500"
                  : "text-slate-400 border-transparent hover:text-white hover:border-slate-400"
              }`}
            >
              {item.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default NavbarTabs;

import React from 'react';
import Link from 'next/link';

interface LinkTextProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const LinkText: React.FC<LinkTextProps> = ({
  href,
  children,
  className = 'text-blue-600 hover:underline',
}) => {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};

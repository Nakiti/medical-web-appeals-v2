"use client";

import React from 'react';
import { Navbar } from '@/components/navbar';

interface NavLink {
  title: string;
  pathName: string;
}

interface NavbarProps {
  appealId?: string;
  links?: NavLink[];
  back?: string;
  status?: string;
}

const AppealsNavbar: React.FC<NavbarProps> = ({ 
  appealId = "123", 
  links = [], 
  back = "/",
  status = "draft"
}) => {
  return (
    <Navbar 
      appealId={appealId}
      links={links}
      back={back}
      status={status}
    />
  );
};

export default AppealsNavbar;
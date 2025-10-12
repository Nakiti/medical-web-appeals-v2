"use client";

import React from "react";
import { Input } from "@/components/ui/input";

export type SearchBarProps = {
   value: string;
   onChange: (value: string) => void;
   placeholder?: string;
   className?: string;
   autoFocus?: boolean;
};

export default function SearchBar({ value, onChange, placeholder = "Search...", className, autoFocus }: SearchBarProps) {
   return (
      <div className={className}>
         <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
         />
      </div>
   );
}




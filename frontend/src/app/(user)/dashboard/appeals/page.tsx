"use client";

import { useMemo, useState } from "react";
import { Table, type TableColumn, SearchBar } from "@/components/shared";

type Appeal = {
   id: number;
   claim_number: string;
   status: "Approved" | "Submitted" | "Under Review" | "Denied";
   date_filed: string;
};

const ALL_APPEALS: Appeal[] = [
   { id: 1, claim_number: "CL-1001", status: "Submitted", date_filed: "2025-09-02" },
   { id: 2, claim_number: "CL-1002", status: "Approved", date_filed: "2025-08-28" },
   { id: 3, claim_number: "CL-1003", status: "Under Review", date_filed: "2025-09-10" },
   { id: 4, claim_number: "CL-1004", status: "Denied", date_filed: "2025-09-12" },
   { id: 5, claim_number: "CL-1005", status: "Submitted", date_filed: "2025-09-15" },
];

const columns: TableColumn<Appeal>[] = [
   { header: "ID", accessorKey: "id", className: "text-center" },
   { header: "Claim Number", accessorKey: "claim_number", className: "text-center" },
   {
      header: "Status",
      accessorKey: "status",
      cell: (value) => {
         const v = String(value);
         const cls =
            v === "Approved"
               ? "bg-green-100 text-green-700"
               : v === "Submitted"
               ? "bg-blue-100 text-blue-600"
               : v === "Under Review"
               ? "bg-yellow-100 text-yellow-700"
               : "bg-red-100 text-red-700";
         return <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${cls}`}>{v}</span>;
      },
   },
   {
      header: "Date Filed",
      accessor: (row) => new Date(row.date_filed).toLocaleDateString("en-US"),
      className: "text-center",
   },
];

export default function Appeals() {
   const [query, setQuery] = useState("");

   const filtered = useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return ALL_APPEALS;
      return ALL_APPEALS.filter(a =>
         String(a.id).includes(q) ||
         a.claim_number.toLowerCase().includes(q) ||
         a.status.toLowerCase().includes(q)
      );
   }, [query]);

   return (
      <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50 to-slate-100 p-4 md:p-8 space-y-4">
         <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Appeals</h2>
         </div>
         <div>
            <div className="mb-2">
               <SearchBar value={query} onChange={setQuery} placeholder="Search appeals..." />
            </div>
            <Table
               columns={columns}
               data={filtered}
               getRowKey={(r) => r.id}
               onRowClick={(row) => console.log("row clicked", row)}
            />
         </div>
      </div>
   );
}
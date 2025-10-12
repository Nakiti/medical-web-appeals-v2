"use client";

import React from "react";
import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";
import SummaryBar from "@/components/dashboard/SummaryBar";
import Deadlines, { DeadlineItem } from "@/components/dashboard/Deadlines";
import Updates, { UpdateItem } from "@/components/dashboard/Updates";
import { Table } from "@/components/shared";
import type { TableColumn } from "@/components/shared";
import { useGetAppeals } from "@/hooks/useAppeals";
import { useGetUserProfile } from "@/hooks/useUser";

type User = { first_name: string; last_name: string };


const appealColumns: TableColumn<any>[] = [
   { header: "Id", accessorKey: "id", className: "text-center" },
   { header: "Claim Number", accessorKey: "claim_number", className: "text-center" },
   { header: "Date Created", accessorKey: "created_at", className: "text-center" },
   { header: "Status", accessorKey: "status", className: "text-center" },
];

const draftColumns: TableColumn<any>[] = [
   { header: "Id", accessorKey: "id" },
   { header: "Claim Number", accessorKey: "claim_number" },
   { header: "Date Created", accessorKey: "created_at" },
   { header: "Appeal Deadline", accessorKey: "appeal_deadline" },
];

// Appeals are now fetched via useGetAppeals in the component

const drafts: DeadlineItem[] = [
   { id: 201, claim_number: "DR-101", appeal_deadline: "2025-10-20" },
   { id: 202, claim_number: "DR-102", appeal_deadline: "2025-10-10" },
   { id: 203, claim_number: "DR-103", appeal_deadline: "2025-10-05" },
   { id: 204, claim_number: "DR-104", appeal_deadline: "2025-11-01" },
];

const updates: UpdateItem[] = [
   { id: 1, appeal_id: 101, title: "Response Received", internal_name: "Payer", text: "Payer responded to your submission." },
   { id: 2, appeal_id: 102, title: "Additional Info Requested", internal_name: "Nurse Review", text: "Provide additional clinical details." },
];

// Summary data will be computed after fetching appeals

const Home: React.FC = () => {
   const { appeals, isLoading, isError } = useGetAppeals();
   const {user} = useGetUserProfile()

   const appealsRows = React.useMemo(() => {
      const list = Array.isArray(appeals) ? appeals : [];
      return list.map((a: any) => ({
         id: a.id,
         claim_number: a?.parsedData?.claimNumber ?? "-",
         created_at: a?.createdAt ? new Date(a.createdAt).toISOString().slice(0, 10) : "-",
         status: a?.status ? String(a.status).charAt(0).toUpperCase() + String(a.status).slice(1) : "-",
      }));
   }, [appeals]);

   const summaryData = React.useMemo(() => {
      const list = Array.isArray(appeals) ? appeals : [];
      return {
         submittedCount: list.filter((a: any) => String(a.status).toLowerCase() === "submitted").length,
         draftCount: drafts.length,
         dueSoonCount: drafts.filter(d => {
            const deadline = new Date(d.appeal_deadline).getTime();
            const now = Date.now();
            const inTwoWeeks = now + 14 * 24 * 60 * 60 * 1000;
            return deadline > now && deadline <= inTwoWeeks;
         }).length,
         approvedCount: list.filter((a: any) => String(a.status).toLowerCase() === "approved").length,
      };
   }, [appeals]);

   return (
      <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50 to-slate-100 p-4 md:p-8 space-y-8">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
               <p className="text-sm text-gray-500">Welcome back,</p>
               <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {user?.name}
               </h1>
            </div>
            <Link
               href="/appeal/new/claim-number"
               className="mt-4 md:mt-0 bg-gradient-to-r from-indigo-500 to-blue-500 hover:opacity-90 text-white font-semibold px-6 py-3 rounded-full shadow-md flex items-center gap-2 transition"
            >
               <Plus size={16} />
               Create New Appeal
            </Link>
         </div>

         <SummaryBar data={summaryData} />

         <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex flex-col space-y-8 w-full lg:w-3/4">
               <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                     <Link
                        href="/user/dashboard/appeals"
                        className="text-lg font-semibold text-gray-800 hover:text-indigo-600 flex items-center gap-2"
                     >
                        Recent Appeals <ArrowRight size={14} />
                     </Link>
                  </div>
                  <Table
                     columns={appealColumns}
                     data={appealsRows}
                     emptyMessage={isLoading ? "Loading appeals..." : isError ? "Failed to load appeals" : "No appeals"}
                     getRowKey={(r) => (r as any).id}
                     onRowClick={(r) => {
                        // navigate or do nothing for presentational
                        console.log("row clicked", r);
                     }}
                  />
               </div>
            </div>

            <div className="w-full lg:w-1/4 flex flex-col space-y-8">
               {/* If you want to show updates, uncomment below */}
               {/* <Updates data={updates} /> */}
               <Deadlines data={drafts} />
            </div>
         </div>
      </div>
   );
};

export default Home;
"use client";

import React from "react";

export type TableColumn<T> = {
   header: string;
   accessorKey?: keyof T | string;
   accessor?: (row: T) => unknown;
   cell?: (value: unknown, row: T) => React.ReactNode;
   className?: string;
};

export type TableProps<T> = {
   columns: TableColumn<T>[];
   data: T[];
   getRowKey?: (row: T, index: number) => string | number;
   onRowClick?: (row: T) => void;
   maxRows?: number;
   emptyMessage?: string;
};

export default function Table<T>({
   columns,
   data,
   getRowKey,
   onRowClick,
   maxRows = 10,
   emptyMessage = "No data",
}: TableProps<T>) {
   const limitedData = Array.isArray(data) ? data.slice(0, maxRows) : [];

   const resolveValue = (col: TableColumn<T>, row: T): unknown => {
      if (typeof col.accessor === "function") return col.accessor(row);
      if (col.accessorKey) return (row as unknown as Record<string, unknown>)[col.accessorKey as string];
      return undefined;
   };

   return (
      <div className="overflow-x-auto">
         <table className="min-w-full rounded-md">
            <thead className="border-b">
               <tr>
                  {columns.map((column, idx) => (
                     <th
                        key={idx}
                        className="text-center px-6 py-2 text-sm font-semibold text-gray-700"
                     >
                        {column.header}
                     </th>
                  ))}
               </tr>
            </thead>
            <tbody>
               {limitedData.length > 0 ? (
                  limitedData.map((row, rowIndex) => {
                     const key = getRowKey?.(row, rowIndex) ?? String(rowIndex);
                     return (
                        <tr
                           key={key}
                           className={`hover:bg-gray-50 ${onRowClick ? "cursor-pointer" : ""}`}
                           onClick={onRowClick ? () => onRowClick(row) : undefined}
                        >
                           {columns.map((column, colIndex) => {
                              const value = resolveValue(column, row);
                              return (
                                 <td
                                    key={colIndex}
                                    className={`px-6 py-2 text-sm text-gray-600 ${column.className ?? ""}`}
                                 >
                                    {column.cell ? column.cell(value, row) : String(value ?? "-")}
                                 </td>
                              );
                           })}
                        </tr>
                     );
                  })
               ) : (
                  <tr>
                     <td colSpan={columns.length} className="px-6 py-24 text-center text-sm text-gray-500">
                        {emptyMessage}
                     </td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>
   );
}



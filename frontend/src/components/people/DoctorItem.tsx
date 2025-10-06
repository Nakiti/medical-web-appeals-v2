"use client";

import { Doctor } from "@/lib/services/people.service";
import DocumentList from "./DocumentList";

interface DoctorItemProps {
  doctor: Doctor;
}

const DoctorItem: React.FC<DoctorItemProps> = ({ doctor }) => {
  return (
    <div className="p-5 border border-slate-200 bg-slate-50 rounded-md">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-base font-semibold text-gray-900">{doctor.name}</p>
          <p className="text-sm text-slate-600">{doctor.specialty || "No specialty listed"}</p>
          <p className="text-sm text-slate-500">{doctor.email}</p>
        </div>
      </div>

      <DocumentList documents={doctor.documents || []} />
    </div>
  );
};

export default DoctorItem;


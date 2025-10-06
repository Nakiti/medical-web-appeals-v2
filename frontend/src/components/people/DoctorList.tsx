"use client";

import { Doctor } from "@/lib/services/people.service";
import DoctorItem from "./DoctorItem";

interface DoctorListProps {
  doctors: Doctor[];
}

const DoctorList: React.FC<DoctorListProps> = ({ doctors }) => {
  if (doctors.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-800">Existing References</h2>
        <p className="text-sm text-slate-500 italic">No references added yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Existing References</h2>
      <div className="space-y-4">
        {doctors.map((doctor) => (
          <DoctorItem key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
};

export default DoctorList;


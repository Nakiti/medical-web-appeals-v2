"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface DoctorFormData {
  name: string;
  email: string;
  specialty: string;
}

interface DoctorFormProps {
  onSubmit: (doctor: DoctorFormData) => void;
  isDraft: boolean;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ onSubmit, isDraft }) => {
  const [form, setForm] = useState<DoctorFormData>({
    name: "",
    email: "",
    specialty: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email) {
      onSubmit(form);
      setForm({ name: "", email: "", specialty: "" });
    }
  };

  if (!isDraft) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Add New Reference</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Doctor's Name"
            className="w-full border-b border-slate-400 bg-transparent focus:outline-none focus:border-indigo-500 text-sm px-1 py-2"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border-b border-slate-400 bg-transparent focus:outline-none focus:border-indigo-500 text-sm px-1 py-2"
            required
          />
          <input
            name="specialty"
            value={form.specialty}
            onChange={handleChange}
            placeholder="Specialty"
            className="w-full border-b border-slate-400 bg-transparent focus:outline-none focus:border-indigo-500 text-sm px-1 py-2"
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-md border border-indigo-400 text-indigo-700 hover:bg-indigo-50 transition"
        >
          <Plus size={16} />
          Add Doctor
        </button>
      </form>
    </div>
  );
};

export default DoctorForm;


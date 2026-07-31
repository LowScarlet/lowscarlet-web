/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import DocImageManager from "./DocImageManager";

interface EducationsTabProps {
  educationsList: any[];
  onRefresh: () => void;
  setParentSuccess: (msg: string) => void;
  setParentError: (msg: string) => void;
}

export default function EducationsTab({
  educationsList,
  onRefresh,
  setParentSuccess,
  setParentError,
}: EducationsTabProps) {
  const [editingEdu, setEditingEdu] = useState<any | null>(null);
  const [eduInstitution, setEduInstitution] = useState("");
  const [eduLocation, setEduLocation] = useState("");
  const [eduDegree, setEduDegree] = useState("");
  const [eduGpa, setEduGpa] = useState("");
  const [eduStartDate, setEduStartDate] = useState("");
  const [eduEndDate, setEduEndDate] = useState("");
  const [eduThesis, setEduThesis] = useState("");
  const [eduCourseworkText, setEduCourseworkText] = useState("");
  const [eduImagesList, setEduImagesList] = useState<{ no: number; src: string }[]>([]);

  const [saving, setSaving] = useState(false);

  const resetEduForm = () => {
    setEditingEdu(null);
    setEduInstitution("");
    setEduLocation("");
    setEduDegree("");
    setEduGpa("");
    setEduStartDate("");
    setEduEndDate("");
    setEduThesis("");
    setEduCourseworkText("");
    setEduImagesList([]);
  };

  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setParentError("");

    const courseworkArray = eduCourseworkText
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const payload = {
      institution: eduInstitution,
      location: eduLocation || null,
      degree: eduDegree,
      gpa: eduGpa || null,
      startDate: eduStartDate || null,
      endDate: eduEndDate || null,
      thesis: eduThesis || null,
      relevantCoursework: courseworkArray,
      images: eduImagesList,
    };

    try {
      const url = editingEdu ? `/api/educations/${editingEdu.id}` : "/api/educations";
      const method = editingEdu ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setParentSuccess(editingEdu ? "Education updated!" : "Education added!");
        resetEduForm();
        onRefresh();
      } else {
        throw new Error("Failed to save education");
      }
    } catch (err: any) {
      console.error(err);
      setParentError(err.message || "Failed to save education");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;
    try {
      const res = await fetch(`/api/educations/${id}`, { method: "DELETE" });
      if (res.ok) {
        setParentSuccess("Education deleted!");
        onRefresh();
      }
    } catch (err: any) {
      console.error(err);
      setParentError("Failed to delete education");
    }
  };

  return (
    <div className="space-y-4">
      {/* List Educations */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
            Daftar Pendidikan ({educationsList.length})
          </span>
          {editingEdu && (
            <button
              type="button"
              onClick={resetEduForm}
              className="text-[10px] text-cyan-400 hover:underline"
            >
              + Tambah Baru
            </button>
          )}
        </div>
        {educationsList.map((item) => (
          <div key={item.id} className="p-3 bg-neutral-950 border border-neutral-850 rounded-lg flex justify-between items-start text-xs">
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span>{item.institution} ({item.location})</span>
                {item.images && item.images.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 text-cyan-400 text-[9px] font-mono rounded">
                    📷 {item.images.length} Foto
                  </span>
                )}
              </div>
              <div className="text-gray-400">{item.degree} {item.gpa ? `• GPA: ${item.gpa}` : ""}</div>
              <div className="text-[10px] text-gray-500">{item.dateRange}</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setEditingEdu(item);
                  setEduInstitution(item.institution || "");
                  setEduLocation(item.location || "");
                  setEduDegree(item.degree || "");
                  setEduGpa(item.gpa || "");
                  setEduStartDate(item.startDate ? new Date(item.startDate).toISOString().split("T")[0] : "");
                  setEduEndDate(item.endDate ? new Date(item.endDate).toISOString().split("T")[0] : "");
                  setEduThesis(item.thesis || "");
                  setEduCourseworkText((item.relevantCoursework || []).join(", "));
                  setEduImagesList(item.images || []);
                }}
                className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-cyan-400 rounded cursor-pointer"
              >
                <FaEdit size={12} />
              </button>
              <button
                type="button"
                onClick={() => handleDeleteEducation(item.id)}
                className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-red-400 rounded cursor-pointer"
              >
                <FaTrash size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Add/Edit Education */}
      <form onSubmit={handleSaveEducation} className="p-3 bg-neutral-950/60 border border-neutral-850 rounded-xl space-y-3 pt-3">
        <div className="text-xs font-bold text-cyan-400 border-b border-neutral-800 pb-1">
          {editingEdu ? "Edit Data Pendidikan" : "+ Tambah Pendidikan Baru"}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Institusi *</label>
            <input type="text" value={eduInstitution} onChange={(e) => setEduInstitution(e.target.value)} required placeholder="Universitas ..." className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Lokasi</label>
            <input type="text" value={eduLocation} onChange={(e) => setEduLocation(e.target.value)} placeholder="Pekanbaru, Indonesia" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Gelar / Degree *</label>
            <input type="text" value={eduDegree} onChange={(e) => setEduDegree(e.target.value)} required placeholder="Bachelor of Informatics Engineering" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">IPK / GPA</label>
            <input type="text" value={eduGpa} onChange={(e) => setEduGpa(e.target.value)} placeholder="3.73/4.00" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Tanggal Mulai</label>
            <input type="date" value={eduStartDate} onChange={(e) => setEduStartDate(e.target.value)} className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Tanggal Selesai</label>
            <input type="date" value={eduEndDate} onChange={(e) => setEduEndDate(e.target.value)} className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
        </div>
        <div>
          <label className="text-[10px] text-gray-400 font-semibold block uppercase">Judul Skripsi / Thesis</label>
          <input type="text" value={eduThesis} onChange={(e) => setEduThesis(e.target.value)} placeholder="Thesis: Cloud-Native..." className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
        </div>
        <div>
          <label className="text-[10px] text-gray-400 font-semibold block uppercase">Coursework (Pisahkan Koma)</label>
          <input type="text" value={eduCourseworkText} onChange={(e) => setEduCourseworkText(e.target.value)} placeholder="Software Engineering, Cloud Computing, Web Development" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
        </div>
        <DocImageManager
          images={eduImagesList}
          onImagesChange={setEduImagesList}
          label="Foto Dokumentasi Pendidikan"
        />
        <button type="submit" disabled={saving} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-1.5 rounded text-xs transition cursor-pointer">
          {saving ? "Simpan..." : editingEdu ? "Update Pendidikan" : "Simpan Pendidikan"}
        </button>
      </form>
    </div>
  );
}

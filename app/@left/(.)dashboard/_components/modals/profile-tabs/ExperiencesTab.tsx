/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import DocImageManager from "./DocImageManager";

interface ExperiencesTabProps {
  experiencesList: any[];
  onRefresh: () => void;
  setParentSuccess: (msg: string) => void;
  setParentError: (msg: string) => void;
}

export default function ExperiencesTab({
  experiencesList,
  onRefresh,
  setParentSuccess,
  setParentError,
}: ExperiencesTabProps) {
  const [editingExp, setEditingExp] = useState<any | null>(null);
  const [expCompany, setExpCompany] = useState("");
  const [expLocation, setExpLocation] = useState("");
  const [expRole, setExpRole] = useState("");
  const [expStartDate, setExpStartDate] = useState("");
  const [expEndDate, setExpEndDate] = useState("");
  const [expIsCurrent, setExpIsCurrent] = useState(false);
  const [expHighlightsText, setExpHighlightsText] = useState("");
  const [expImagesList, setExpImagesList] = useState<{ no: number; src: string }[]>([]);

  const [saving, setSaving] = useState(false);

  const resetExpForm = () => {
    setEditingExp(null);
    setExpCompany("");
    setExpLocation("");
    setExpRole("");
    setExpStartDate("");
    setExpEndDate("");
    setExpIsCurrent(false);
    setExpHighlightsText("");
    setExpImagesList([]);
  };

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setParentError("");

    const highlightsArray = expHighlightsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const payload = {
      company: expCompany,
      location: expLocation || null,
      role: expRole,
      startDate: expStartDate || null,
      endDate: expIsCurrent ? null : (expEndDate || null),
      isCurrent: expIsCurrent,
      highlights: highlightsArray,
      images: expImagesList,
    };

    try {
      const url = editingExp ? `/api/experiences/${editingExp.id}` : "/api/experiences";
      const method = editingExp ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setParentSuccess(editingExp ? "Experience updated!" : "Experience added!");
        resetExpForm();
        onRefresh();
      } else {
        throw new Error("Failed to save experience");
      }
    } catch (err: any) {
      console.error(err);
      setParentError(err.message || "Failed to save experience");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;
    try {
      const res = await fetch(`/api/experiences/${id}`, { method: "DELETE" });
      if (res.ok) {
        setParentSuccess("Experience deleted!");
        onRefresh();
      }
    } catch (err: any) {
      console.error(err);
      setParentError("Failed to delete experience");
    }
  };

  return (
    <div className="space-y-4">
      {/* List Experiences */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
            Daftar Pengalaman Kerja ({experiencesList.length})
          </span>
          {editingExp && (
            <button
              type="button"
              onClick={resetExpForm}
              className="text-[10px] text-cyan-400 hover:underline"
            >
              + Tambah Baru
            </button>
          )}
        </div>
        {experiencesList.map((item) => (
          <div key={item.id} className="p-3 bg-neutral-950 border border-neutral-850 rounded-lg flex justify-between items-start text-xs">
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span>{item.company} ({item.location})</span>
                {item.images && item.images.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 text-cyan-400 text-[9px] font-mono rounded">
                    📷 {item.images.length} Foto
                  </span>
                )}
              </div>
              <div className="text-gray-400 font-semibold">{item.role}</div>
              <div className="text-[10px] text-gray-500">{item.dateRange}</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setEditingExp(item);
                  setExpCompany(item.company || "");
                  setExpLocation(item.location || "");
                  setExpRole(item.role || "");
                  setExpStartDate(item.startDate ? new Date(item.startDate).toISOString().split("T")[0] : "");
                  setExpEndDate(item.endDate ? new Date(item.endDate).toISOString().split("T")[0] : "");
                  setExpIsCurrent(Boolean(item.isCurrent));
                  setExpHighlightsText((item.highlights || []).join("\n"));
                  setExpImagesList(item.images || []);
                }}
                className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-cyan-400 rounded cursor-pointer"
              >
                <FaEdit size={12} />
              </button>
              <button
                type="button"
                onClick={() => handleDeleteExperience(item.id)}
                className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-red-400 rounded cursor-pointer"
              >
                <FaTrash size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Add/Edit Experience */}
      <form onSubmit={handleSaveExperience} className="p-3 bg-neutral-950/60 border border-neutral-850 rounded-xl space-y-3 pt-3">
        <div className="text-xs font-bold text-cyan-400 border-b border-neutral-800 pb-1">
          {editingExp ? "Edit Pengalaman Kerja" : "+ Tambah Pengalaman Kerja Baru"}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Perusahaan / Instansi *</label>
            <input type="text" value={expCompany} onChange={(e) => setExpCompany(e.target.value)} required placeholder="Company Name" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Lokasi</label>
            <input type="text" value={expLocation} onChange={(e) => setExpLocation(e.target.value)} placeholder="Pekanbaru, Indonesia" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Posisi / Role *</label>
            <input type="text" value={expRole} onChange={(e) => setExpRole(e.target.value)} required placeholder="Web Design Instructor" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
          <div className="flex items-center gap-2 pt-4">
            <input type="checkbox" id="expIsCurrent" checked={expIsCurrent} onChange={(e) => setExpIsCurrent(e.target.checked)} className="rounded bg-neutral-950 border-neutral-855 cursor-pointer" />
            <label htmlFor="expIsCurrent" className="text-xs text-gray-300 cursor-pointer">Masih Bekerja Saat Ini (Present)</label>
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Tanggal Mulai</label>
            <input type="date" value={expStartDate} onChange={(e) => setExpStartDate(e.target.value)} className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
          {!expIsCurrent && (
            <div>
              <label className="text-[10px] text-gray-400 font-semibold block uppercase">Tanggal Selesai</label>
              <input type="date" value={expEndDate} onChange={(e) => setExpEndDate(e.target.value)} className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
            </div>
          )}
        </div>
        <div>
          <label className="text-[10px] text-gray-400 font-semibold block uppercase">Bullet Points / Achievements (1 poin per baris)</label>
          <textarea value={expHighlightsText} onChange={(e) => setExpHighlightsText(e.target.value)} rows={3} placeholder={`Mentored 20+ students...\nGuided beginner students...`} className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
        </div>
        <DocImageManager
          images={expImagesList}
          onImagesChange={setExpImagesList}
          label="Foto Dokumentasi Pengalaman Kerja"
        />
        <button type="submit" disabled={saving} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-1.5 rounded text-xs transition cursor-pointer">
          {saving ? "Simpan..." : editingExp ? "Update Pengalaman" : "Simpan Pengalaman"}
        </button>
      </form>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import DocImageManager from "./DocImageManager";

interface VolunteersTabProps {
  volunteersList: any[];
  onRefresh: () => void;
  setParentSuccess: (msg: string) => void;
  setParentError: (msg: string) => void;
}

export default function VolunteersTab({
  volunteersList,
  onRefresh,
  setParentSuccess,
  setParentError,
}: VolunteersTabProps) {
  const [editingVol, setEditingVol] = useState<any | null>(null);
  const [volOrganization, setVolOrganization] = useState("");
  const [volRole, setVolRole] = useState("");
  const [volLocation, setVolLocation] = useState("");
  const [volStartDate, setVolStartDate] = useState("");
  const [volEndDate, setVolEndDate] = useState("");
  const [volIsCurrent, setVolIsCurrent] = useState(false);
  const [volHighlightsText, setVolHighlightsText] = useState("");
  const [volDisplayOrder, setVolDisplayOrder] = useState<number>(0);
  const [volImagesList, setVolImagesList] = useState<{ no: number; src: string }[]>([]);

  const [saving, setSaving] = useState(false);

  const resetVolForm = () => {
    setEditingVol(null);
    setVolOrganization("");
    setVolRole("");
    setVolLocation("");
    setVolStartDate("");
    setVolEndDate("");
    setVolIsCurrent(false);
    setVolHighlightsText("");
    setVolDisplayOrder(0);
    setVolImagesList([]);
  };

  const handleSaveVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setParentError("");

    const highlightsArray = volHighlightsText
      .split("\n")
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    const payload = {
      organization: volOrganization,
      role: volRole,
      location: volLocation || null,
      startDate: volStartDate ? new Date(volStartDate).toISOString() : null,
      endDate: volIsCurrent || !volEndDate ? null : new Date(volEndDate).toISOString(),
      isCurrent: volIsCurrent,
      highlights: highlightsArray,
      images: volImagesList,
      displayOrder: Number(volDisplayOrder || 0),
    };

    try {
      const url = editingVol ? `/api/volunteers/${editingVol.id}` : "/api/volunteers";
      const method = editingVol ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setParentSuccess(editingVol ? "Volunteer entry updated!" : "Volunteer entry added!");
        resetVolForm();
        onRefresh();
      } else {
        throw new Error("Failed to save volunteer entry");
      }
    } catch (err: any) {
      console.error(err);
      setParentError(err.message || "Failed to save volunteer entry");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVolunteer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this volunteer entry?")) return;
    try {
      const res = await fetch(`/api/volunteers/${id}`, { method: "DELETE" });
      if (res.ok) {
        setParentSuccess("Volunteer entry deleted!");
        onRefresh();
      }
    } catch (err: any) {
      console.error(err);
      setParentError("Failed to delete volunteer entry");
    }
  };

  return (
    <div className="space-y-4">
      {/* List Volunteers */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
            Daftar Volunteer ({volunteersList.length})
          </span>
          {editingVol && (
            <button type="button" onClick={resetVolForm} className="text-[10px] text-cyan-400 hover:underline">
              + Tambah Baru
            </button>
          )}
        </div>
        {volunteersList.map((item) => (
          <div key={item.id} className="p-3 bg-neutral-950 border border-neutral-850 rounded-lg flex justify-between items-start text-xs">
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span>{item.role} @ {item.organization}</span>
                {item.images && item.images.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 text-cyan-400 text-[9px] font-mono rounded">
                    📷 {item.images.length} Foto
                  </span>
                )}
              </div>
              <div className="text-gray-400">{item.location} • {item.dateRange}</div>
              {item.highlights && item.highlights.length > 0 && (
                <ul className="list-disc list-inside text-[11px] text-gray-400 mt-1 space-y-0.5">
                  {item.highlights.map((h: string, idx: number) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setEditingVol(item);
                  setVolOrganization(item.organization || "");
                  setVolRole(item.role || "");
                  setVolLocation(item.location || "");
                  setVolStartDate(item.startDate ? new Date(item.startDate).toISOString().split("T")[0] : "");
                  setVolEndDate(item.endDate ? new Date(item.endDate).toISOString().split("T")[0] : "");
                  setVolIsCurrent(Boolean(item.isCurrent));
                  setVolHighlightsText((item.highlights || []).join("\n"));
                  setVolDisplayOrder(Number(item.displayOrder) || 0);
                  setVolImagesList(item.images || []);
                }}
                className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-cyan-400 rounded cursor-pointer"
              >
                <FaEdit size={12} />
              </button>
              <button
                type="button"
                onClick={() => handleDeleteVolunteer(item.id)}
                className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-red-400 rounded cursor-pointer"
              >
                <FaTrash size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Add/Edit Volunteer */}
      <form onSubmit={handleSaveVolunteer} className="p-3 bg-neutral-950/60 border border-neutral-850 rounded-xl space-y-3 pt-3">
        <div className="text-xs font-bold text-cyan-400 border-b border-neutral-800 pb-1">
          {editingVol ? "Edit Pengalaman Volunteer" : "+ Tambah Volunteer Baru"}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Nama Organisasi / Komunitas *</label>
            <input type="text" value={volOrganization} onChange={(e) => setVolOrganization(e.target.value)} required placeholder="Google Developer Student Clubs..." className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Peran / Role *</label>
            <input type="text" value={volRole} onChange={(e) => setVolRole(e.target.value)} required placeholder="Lead / Core Team / Event Coordinator..." className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Lokasi</label>
            <input type="text" value={volLocation} onChange={(e) => setVolLocation(e.target.value)} placeholder="Pekanbaru, Indonesia" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Urutan Tampilan (Order)</label>
            <input type="number" value={volDisplayOrder} onChange={(e) => setVolDisplayOrder(Number(e.target.value))} min={0} placeholder="0" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Tanggal Mulai</label>
            <input type="date" value={volStartDate} onChange={(e) => setVolStartDate(e.target.value)} className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Tanggal Selesai</label>
            <input type="date" value={volEndDate} onChange={(e) => setVolEndDate(e.target.value)} disabled={volIsCurrent} className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs disabled:opacity-40" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="volIsCurrent" checked={volIsCurrent} onChange={(e) => setVolIsCurrent(e.target.checked)} className="rounded text-cyan-500 focus:ring-0 cursor-pointer" />
          <label htmlFor="volIsCurrent" className="text-xs text-gray-300 font-medium cursor-pointer">Masih Aktif Sampai Sekarang</label>
        </div>
        <div>
          <label className="text-[10px] text-gray-400 font-semibold block uppercase">Bullet Points / Highlights (1 poin per baris)</label>
          <textarea value={volHighlightsText} onChange={(e) => setVolHighlightsText(e.target.value)} rows={3} placeholder={`Organized tech workshops for 100+ attendees...`} className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
        </div>
        <DocImageManager
          images={volImagesList}
          onImagesChange={setVolImagesList}
          label="Foto Dokumentasi Volunteer"
        />
        <button type="submit" disabled={saving} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-1.5 rounded text-xs transition cursor-pointer">
          {saving ? "Simpan..." : editingVol ? "Update Volunteer" : "Simpan Volunteer"}
        </button>
      </form>
    </div>
  );
}

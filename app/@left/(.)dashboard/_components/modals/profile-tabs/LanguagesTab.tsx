/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface LanguagesTabProps {
  languagesList: any[];
  onRefresh: () => void;
  setParentSuccess: (msg: string) => void;
  setParentError: (msg: string) => void;
}

export default function LanguagesTab({
  languagesList,
  onRefresh,
  setParentSuccess,
  setParentError,
}: LanguagesTabProps) {
  const [editingLang, setEditingLang] = useState<any | null>(null);
  const [langName, setLangName] = useState("");
  const [langProficiency, setLangProficiency] = useState("");
  const [langDisplayOrder, setLangDisplayOrder] = useState<number>(0);

  const [saving, setSaving] = useState(false);

  const resetLangForm = () => {
    setEditingLang(null);
    setLangName("");
    setLangProficiency("");
    setLangDisplayOrder(0);
  };

  const handleSaveLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setParentError("");

    const payload = {
      name: langName,
      proficiency: langProficiency,
      displayOrder: Number(langDisplayOrder || 0),
    };

    try {
      const url = editingLang ? `/api/languages/${editingLang.id}` : "/api/languages";
      const method = editingLang ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setParentSuccess(editingLang ? "Language updated!" : "Language added!");
        resetLangForm();
        onRefresh();
      } else {
        throw new Error("Failed to save language");
      }
    } catch (err: any) {
      console.error(err);
      setParentError(err.message || "Failed to save language");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLanguage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this language entry?")) return;
    try {
      const res = await fetch(`/api/languages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setParentSuccess("Language deleted!");
        onRefresh();
      }
    } catch (err: any) {
      console.error(err);
      setParentError("Failed to delete language");
    }
  };

  return (
    <div className="space-y-4">
      {/* List Languages */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
            Daftar Bahasa ({languagesList.length})
          </span>
          {editingLang && (
            <button type="button" onClick={resetLangForm} className="text-[10px] text-cyan-400 hover:underline">
              + Tambah Baru
            </button>
          )}
        </div>
        {[...languagesList]
          .sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0))
          .map((item) => (
            <div key={item.id} className="p-3 bg-neutral-950 border border-neutral-850 rounded-lg flex justify-between items-start text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{item.name}</span>
                  <span className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 text-cyan-400 text-[9px] font-mono rounded">
                    Urutan #{item.displayOrder ?? 0}
                  </span>
                </div>
                <div className="text-gray-400 mt-0.5">{item.proficiency}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditingLang(item);
                    setLangName(item.name || "");
                    setLangProficiency(item.proficiency || "");
                    setLangDisplayOrder(Number(item.displayOrder) || 0);
                  }}
                  className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-cyan-400 rounded cursor-pointer"
                >
                  <FaEdit size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteLanguage(item.id)}
                  className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-red-400 rounded cursor-pointer"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Form Add/Edit Language */}
      <form onSubmit={handleSaveLanguage} className="p-3 bg-neutral-950/60 border border-neutral-850 rounded-xl space-y-3 pt-3">
        <div className="text-xs font-bold text-cyan-400 border-b border-neutral-800 pb-1">
          {editingLang ? "Edit Bahasa" : "+ Tambah Bahasa Baru"}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Nama Bahasa *</label>
            <input type="text" value={langName} onChange={(e) => setLangName(e.target.value)} required placeholder="Indonesian / English / Japanese" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Tingkat Kemahiran *</label>
            <input type="text" value={langProficiency} onChange={(e) => setLangProficiency(e.target.value)} required placeholder="Native / Professional Working / Conversational" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Urutan Tampilan (Order)</label>
            <input type="number" value={langDisplayOrder} onChange={(e) => setLangDisplayOrder(Number(e.target.value))} min={0} placeholder="0" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
        </div>
        <button type="submit" disabled={saving} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-1.5 rounded text-xs transition cursor-pointer">
          {saving ? "Simpan..." : editingLang ? "Update Bahasa" : "Simpan Bahasa"}
        </button>
      </form>
    </div>
  );
}

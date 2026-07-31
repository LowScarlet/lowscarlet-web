/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface SkillsTabProps {
  skillsList: any[];
  onRefresh: () => void;
  setParentSuccess: (msg: string) => void;
  setParentError: (msg: string) => void;
}

export default function SkillsTab({
  skillsList,
  onRefresh,
  setParentSuccess,
  setParentError,
}: SkillsTabProps) {
  const [editingSkill, setEditingSkill] = useState<any | null>(null);
  const [skillCategory, setSkillCategory] = useState("");
  const [skillItemsText, setSkillItemsText] = useState("");
  const [skillDisplayOrder, setSkillDisplayOrder] = useState<number>(0);

  const [saving, setSaving] = useState(false);

  const resetSkillForm = () => {
    setEditingSkill(null);
    setSkillCategory("");
    setSkillItemsText("");
    setSkillDisplayOrder(0);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setParentError("");

    const itemsArray = skillItemsText
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const payload = {
      category: skillCategory,
      items: itemsArray,
      displayOrder: Number(skillDisplayOrder || 0),
    };

    try {
      const url = editingSkill ? `/api/skills/${editingSkill.id}` : "/api/skills";
      const method = editingSkill ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setParentSuccess(editingSkill ? "Skill category updated!" : "Skill category added!");
        resetSkillForm();
        onRefresh();
      } else {
        throw new Error("Failed to save skill category");
      }
    } catch (err: any) {
      console.error(err);
      setParentError(err.message || "Failed to save skill category");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill category?")) return;
    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (res.ok) {
        setParentSuccess("Skill category deleted!");
        onRefresh();
      }
    } catch (err: any) {
      console.error(err);
      setParentError("Failed to delete skill category");
    }
  };

  return (
    <div className="space-y-4">
      {/* List Skills */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
            Kategori Skill ({skillsList.length})
          </span>
          {editingSkill && (
            <button type="button" onClick={resetSkillForm} className="text-[10px] text-cyan-400 hover:underline">
              + Tambah Baru
            </button>
          )}
        </div>
        {[...skillsList]
          .sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0))
          .map((item) => (
            <div key={item.id} className="p-3 bg-neutral-950 border border-neutral-850 rounded-lg flex justify-between items-start text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{item.category}</span>
                  <span className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 text-cyan-400 text-[9px] font-mono rounded">
                    Urutan #{item.displayOrder ?? 0}
                  </span>
                </div>
                <div className="text-gray-400 mt-0.5">{(item.items || []).join(", ")}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditingSkill(item);
                    setSkillCategory(item.category || "");
                    setSkillItemsText((item.items || []).join(", "));
                    setSkillDisplayOrder(Number(item.displayOrder) || 0);
                  }}
                  className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-cyan-400 rounded cursor-pointer"
                >
                  <FaEdit size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSkill(item.id)}
                  className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-red-400 rounded cursor-pointer"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Form Add/Edit Skill */}
      <form onSubmit={handleSaveSkill} className="p-3 bg-neutral-950/60 border border-neutral-850 rounded-xl space-y-3 pt-3">
        <div className="text-xs font-bold text-cyan-400 border-b border-neutral-800 pb-1">
          {editingSkill ? "Edit Kategori Skill" : "+ Tambah Kategori Skill Baru"}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="md:col-span-2">
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Nama Kategori *</label>
            <input type="text" value={skillCategory} onChange={(e) => setSkillCategory(e.target.value)} required placeholder="Technical / Tools / Concepts / Soft Skills" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Urutan Tampilan (Order)</label>
            <input type="number" value={skillDisplayOrder} onChange={(e) => setSkillDisplayOrder(Number(e.target.value))} min={0} placeholder="0" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
        </div>
        <div>
          <label className="text-[10px] text-gray-400 font-semibold block uppercase">Daftar Skill (Pisahkan Koma) *</label>
          <textarea value={skillItemsText} onChange={(e) => setSkillItemsText(e.target.value)} required rows={3} placeholder="JavaScript, TypeScript, Next.js, React.js, PostgreSQL" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
        </div>
        <button type="submit" disabled={saving} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-1.5 rounded text-xs transition cursor-pointer">
          {saving ? "Simpan..." : editingSkill ? "Update Kategori Skill" : "Simpan Kategori Skill"}
        </button>
      </form>
    </div>
  );
}

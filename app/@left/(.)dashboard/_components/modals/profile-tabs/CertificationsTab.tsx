/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import DocImageManager from "./DocImageManager";

interface CertificationsTabProps {
  certificationsList: any[];
  onRefresh: () => void;
  setParentSuccess: (msg: string) => void;
  setParentError: (msg: string) => void;
}

export default function CertificationsTab({
  certificationsList,
  onRefresh,
  setParentSuccess,
  setParentError,
}: CertificationsTabProps) {
  const [editingCert, setEditingCert] = useState<any | null>(null);
  const [certTitle, setCertTitle] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certLocation, setCertLocation] = useState("");
  const [certIssueDate, setCertIssueDate] = useState("");
  const [certCredentialUrl, setCertCredentialUrl] = useState("");
  const [certHighlightsText, setCertHighlightsText] = useState("");
  const [certDisplayOrder, setCertDisplayOrder] = useState<number>(0);
  const [certImagesList, setCertImagesList] = useState<{ no: number; src: string }[]>([]);

  const [saving, setSaving] = useState(false);

  const resetCertForm = () => {
    setEditingCert(null);
    setCertTitle("");
    setCertIssuer("");
    setCertLocation("");
    setCertIssueDate("");
    setCertCredentialUrl("");
    setCertHighlightsText("");
    setCertDisplayOrder(0);
    setCertImagesList([]);
  };

  const handleSaveCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setParentError("");

    const highlightsArray = certHighlightsText
      .split("\n")
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    const payload = {
      title: certTitle,
      issuer: certIssuer,
      location: certLocation || null,
      issueDate: certIssueDate || null,
      credentialUrl: certCredentialUrl || null,
      highlights: highlightsArray,
      images: certImagesList,
      displayOrder: Number(certDisplayOrder || 0),
    };

    try {
      const url = editingCert ? `/api/certifications/${editingCert.id}` : "/api/certifications";
      const method = editingCert ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setParentSuccess(editingCert ? "Certification updated!" : "Certification added!");
        resetCertForm();
        onRefresh();
      } else {
        throw new Error("Failed to save certification");
      }
    } catch (err: any) {
      console.error(err);
      setParentError(err.message || "Failed to save certification");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCertification = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;
    try {
      const res = await fetch(`/api/certifications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setParentSuccess("Certification deleted!");
        onRefresh();
      }
    } catch (err: any) {
      console.error(err);
      setParentError("Failed to delete certification");
    }
  };

  return (
    <div className="space-y-4">
      {/* List Certifications */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
            Daftar Sertifikasi ({certificationsList.length})
          </span>
          {editingCert && (
            <button type="button" onClick={resetCertForm} className="text-[10px] text-cyan-400 hover:underline">
              + Tambah Baru
            </button>
          )}
        </div>
        {certificationsList.map((item) => (
          <div key={item.id} className="p-3 bg-neutral-950 border border-neutral-850 rounded-lg flex justify-between items-start text-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{item.title}</span>
                <span className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 text-cyan-400 text-[9px] font-mono rounded">
                  Urutan #{item.displayOrder ?? 0}
                </span>
                {item.images && item.images.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 text-cyan-400 text-[9px] font-mono rounded">
                    📷 {item.images.length} Foto
                  </span>
                )}
              </div>
              <div className="text-gray-400">{item.issuer} {item.location ? `• ${item.location}` : ""}</div>
              <div className="text-[10px] text-gray-500">{item.issueDateFormatted}</div>
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
                  setEditingCert(item);
                  setCertTitle(item.title || "");
                  setCertIssuer(item.issuer || "");
                  setCertLocation(item.location || "");
                  setCertIssueDate(item.issueDate ? new Date(item.issueDate).toISOString().split("T")[0] : "");
                  setCertCredentialUrl(item.credentialUrl || "");
                  setCertHighlightsText((item.highlights || []).join("\n"));
                  setCertDisplayOrder(Number(item.displayOrder) || 0);
                  setCertImagesList(item.images || []);
                }}
                className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-cyan-400 rounded cursor-pointer"
              >
                <FaEdit size={12} />
              </button>
              <button
                type="button"
                onClick={() => handleDeleteCertification(item.id)}
                className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-red-400 rounded cursor-pointer"
              >
                <FaTrash size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Add/Edit Certification */}
      <form onSubmit={handleSaveCertification} className="p-3 bg-neutral-950/60 border border-neutral-850 rounded-xl space-y-3 pt-3">
        <div className="text-xs font-bold text-cyan-400 border-b border-neutral-800 pb-1">
          {editingCert ? "Edit Sertifikasi" : "+ Tambah Sertifikasi Baru"}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="md:col-span-2">
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Nama Sertifikasi / Course *</label>
            <input type="text" value={certTitle} onChange={(e) => setCertTitle(e.target.value)} required placeholder="AWS DevOps Engineer..." className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Penyelenggara / Issuer *</label>
            <input type="text" value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} required placeholder="AWS Training & Certification" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Lokasi / Mode</label>
            <input type="text" value={certLocation} onChange={(e) => setCertLocation(e.target.value)} placeholder="Online" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Tanggal Terbit</label>
            <input type="date" value={certIssueDate} onChange={(e) => setCertIssueDate(e.target.value)} className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-semibold block uppercase">Urutan Tampilan (Order)</label>
            <input type="number" value={certDisplayOrder} onChange={(e) => setCertDisplayOrder(Number(e.target.value))} min={0} placeholder="0" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
          </div>
        </div>
        <div>
          <label className="text-[10px] text-gray-400 font-semibold block uppercase">Credential / Certificate URL</label>
          <input type="url" value={certCredentialUrl} onChange={(e) => setCertCredentialUrl(e.target.value)} placeholder="https://..." className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
        </div>
        <div>
          <label className="text-[10px] text-gray-400 font-semibold block uppercase">Bullet Points / Highlights (1 poin per baris)</label>
          <textarea value={certHighlightsText} onChange={(e) => setCertHighlightsText(e.target.value)} rows={3} placeholder={`Completed 40+ hours of hands-on cloud architecture labs...`} className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
        </div>
        <DocImageManager
          images={certImagesList}
          onImagesChange={setCertImagesList}
          label="Foto Dokumentasi Sertifikat / Pelatihan"
        />
        <button type="submit" disabled={saving} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-1.5 rounded text-xs transition cursor-pointer">
          {saving ? "Simpan..." : editingCert ? "Update Sertifikasi" : "Simpan Sertifikasi"}
        </button>
      </form>
    </div>
  );
}

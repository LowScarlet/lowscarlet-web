/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaCamera, FaSpinner } from "react-icons/fa";
import { compressImage } from "@/libs/imageCompressor";

interface ProfileTabProps {
  profile: any;
  onRefresh: () => void;
  setParentSuccess: (msg: string) => void;
  setParentError: (msg: string) => void;
}

export default function ProfileTab({
  profile,
  onRefresh,
  setParentSuccess,
  setParentError,
}: ProfileTabProps) {
  const [fullName, setFullName] = useState(profile?.fullName || "");
  const [location, setLocation] = useState(profile?.location || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [website, setWebsite] = useState(profile?.website || "");
  const [github, setGithub] = useState(profile?.github || "");
  const [linkedin, setLinkedin] = useState(profile?.linkedin || "");
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp || "");
  const [photoPro, setPhotoPro] = useState(profile?.photoPro || "");
  const [photoPas, setPhotoPas] = useState(profile?.photoPas || "");
  const [summary, setSummary] = useState(profile?.summary || "");

  const [uploadingPro, setUploadingPro] = useState(false);
  const [uploadingPas, setUploadingPas] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setLocation(profile.location || "");
      setPhone(profile.phone || "");
      setEmail(profile.email || "");
      setWebsite(profile.website || "");
      setGithub(profile.github || "");
      setLinkedin(profile.linkedin || "");
      setWhatsapp(profile.whatsapp || "");
      setPhotoPro(profile.photoPro || "");
      setPhotoPas(profile.photoPas || "");
      setSummary(profile.summary || "");
    }
  }, [profile]);

  const handlePhotoUpload = async (file: File, type: "pro" | "pas") => {
    const setUploading = type === "pro" ? setUploadingPro : setUploadingPas;
    const setPhoto = type === "pro" ? setPhotoPro : setPhotoPas;

    setUploading(true);
    setParentError("");

    try {
      const compressedBlob = await compressImage(file, 1000, 0.85);
      const webpFilename = `${type}_${Date.now()}.webp`;

      const res = await fetch(`/api/upload?filename=${encodeURIComponent(webpFilename)}`, {
        method: "POST",
        body: compressedBlob,
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || "Failed to upload photo");
      }

      const blob = await res.json();
      setPhoto(blob.url);
      setParentSuccess(`Foto ${type === "pro" ? "Profesional" : "Pas Foto"} berhasil diupload! Klik 'Simpan Data Profil' untuk menyimpan.`);
    } catch (err: any) {
      console.error(err);
      setParentError(err.message || "Upload photo error");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setParentError("");

    try {
      const updates = [
        { key: "PROFILE_FULL_NAME", value: fullName },
        { key: "PROFILE_LOCATION", value: location },
        { key: "PROFILE_PHONE", value: phone },
        { key: "SOCIAL_EMAIL", value: email },
        { key: "PROFILE_WEBSITE", value: website },
        { key: "SOCIAL_GITHUB", value: github },
        { key: "SOCIAL_LINKEDIN", value: linkedin },
        { key: "SOCIAL_WHATSAPP", value: whatsapp },
        { key: "PROFILE_PHOTO_PRO", value: photoPro },
        { key: "PROFILE_PHOTO_PAS", value: photoPas },
        { key: "PROFILE_SUMMARY", value: summary },
      ];

      for (const item of updates) {
        await fetch(`/api/config/${item.key}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: item.value }),
        });
      }

      setParentSuccess("Profile information saved successfully!");
      onRefresh();
    } catch (err: any) {
      console.error(err);
      setParentError("Failed to save profile information");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSaveProfile} className="space-y-4">
      {/* Photos Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-neutral-950/70 border border-neutral-850 rounded-xl">
        {/* Professional Photo */}
        <div className="space-y-2">
          <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider">
            1. Foto Profesional (Background/Profil)
          </label>
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0">
              {photoPro ? (
                <Image
                  src={photoPro}
                  alt="Professional Photo"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-600">
                  <FaCamera size={18} />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-1">
              <label className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-cyan-400 text-xs px-3 py-1.5 rounded-lg cursor-pointer transition">
                {uploadingPro ? <FaSpinner className="animate-spin text-xs" /> : <FaCamera className="text-xs" />}
                <span>{uploadingPro ? "Uploading..." : "Upload File"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handlePhotoUpload(f, "pro");
                  }}
                  disabled={uploadingPro}
                  className="hidden"
                />
              </label>
              <input
                type="url"
                value={photoPro}
                onChange={(e) => setPhotoPro(e.target.value)}
                placeholder="https://... (URL Gambar)"
                className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1 text-white text-[11px] placeholder-gray-650"
              />
            </div>
          </div>
        </div>

        {/* Pas Foto 3x4 */}
        <div className="space-y-2">
          <label className="block text-gray-300 text-xs font-bold uppercase tracking-wider">
            2. Pas Foto Formal 3x4 (Sidebar Creative CV)
          </label>
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0">
              {photoPas ? (
                <Image
                  src={photoPas}
                  alt="Pas Foto Formal"
                  width={80}
                  height={100}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-600">
                  <FaCamera size={18} />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-1">
              <label className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-cyan-400 text-xs px-3 py-1.5 rounded-lg cursor-pointer transition">
                {uploadingPas ? <FaSpinner className="animate-spin text-xs" /> : <FaCamera className="text-xs" />}
                <span>{uploadingPas ? "Uploading..." : "Upload File"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handlePhotoUpload(f, "pas");
                  }}
                  disabled={uploadingPas}
                  className="hidden"
                />
              </label>
              <input
                type="url"
                value={photoPas}
                onChange={(e) => setPhotoPas(e.target.value)}
                placeholder="https://... (URL Gambar)"
                className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1 text-white text-[11px] placeholder-gray-650"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Nama Lengkap *</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white text-xs"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Lokasi</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Pekanbaru, Riau, Indonesia"
            className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white text-xs"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Nomor Telepon</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+62 812 7063 4992"
            className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white text-xs"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white text-xs"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Website URL</label>
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="lowscarlet.my.id"
            className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white text-xs"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">GitHub URL</label>
          <input
            type="text"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            placeholder="https://github.com/LowScarlet"
            className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white text-xs"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">LinkedIn URL</label>
          <input
            type="text"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="https://www.linkedin.com/in/..."
            className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white text-xs"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">WhatsApp URL / Number</label>
          <input
            type="text"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="https://wa.me/6281270634992"
            className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white text-xs"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">
          Professional Summary (CV Header Summary)
        </label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
          placeholder="Passionate Full Stack Web Developer & Cloud Engineer..."
          className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-650 resize-y"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-linear-to-r from-cyan-600 to-blue-600 hover:opacity-90 text-white font-bold py-2 rounded-lg text-xs transition cursor-pointer shadow-md disabled:opacity-50"
        >
          {saving ? "Simpan..." : "Simpan Data Profil"}
        </button>
      </div>
    </form>
  );
}

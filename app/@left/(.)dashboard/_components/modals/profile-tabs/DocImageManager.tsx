/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from "react";
import Image from "next/image";
import { FaPlus, FaTrash, FaUpload, FaSpinner } from "react-icons/fa";
import { compressImage } from "@/libs/imageCompressor";

interface DocImageManagerProps {
  images: { no: number; src: string }[];
  onImagesChange: (newImages: { no: number; src: string }[]) => void;
  label?: string;
}

export default function DocImageManager({
  images,
  onImagesChange,
  label = "Foto Dokumentasi",
}: DocImageManagerProps) {
  const [manualUrl, setManualUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError("");

    try {
      const fileList = Array.from(files);
      const newUploaded: { no: number; src: string }[] = [];
      let currentMaxNo = images.length > 0 ? Math.max(...images.map((i) => i.no || 0)) : 0;

      for (const file of fileList) {
        const compressedBlob = await compressImage(file, 1000, 0.2);
        const webpFilename = file.name.replace(/\.[^/.]+$/, "") + ".webp";

        const res = await fetch(`/api/upload?filename=${encodeURIComponent(webpFilename)}`, {
          method: "POST",
          body: compressedBlob,
        });

        if (!res.ok) {
          const errJson = await res.json();
          throw new Error(errJson.message || `Failed to upload ${file.name}`);
        }

        const newBlob = await res.json();
        currentMaxNo += 1;
        newUploaded.push({ no: currentMaxNo, src: newBlob.url });
      }

      onImagesChange([...images, ...newUploaded]);
      e.target.value = "";
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Upload image error");
    } finally {
      setUploading(false);
    }
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;
    const nextNo = images.length > 0 ? Math.max(...images.map((i) => i.no || 0)) + 1 : 1;
    onImagesChange([...images, { no: nextNo, src: manualUrl.trim() }]);
    setManualUrl("");
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, idx) => idx !== index);
    onImagesChange(updated);
  };

  return (
    <div className="space-y-2 pt-2 border-t border-neutral-850">
      <label className="text-[10px] text-gray-400 font-semibold block uppercase">
        {label} ({images.length})
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-cyan-400 text-xs px-3 py-1.5 rounded-lg cursor-pointer transition">
            {uploading ? <FaSpinner className="animate-spin text-xs" /> : <FaUpload className="text-xs" />}
            <span>{uploading ? "Compressing & Uploading..." : "Upload Foto (Multiple)"}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex gap-1">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="Atau tempel Link Foto (https://...)"
            className="flex-1 bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1 text-white text-xs placeholder-gray-600"
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            className="bg-neutral-800 hover:bg-neutral-700 text-cyan-400 px-2.5 py-1 rounded text-xs transition cursor-pointer"
          >
            <FaPlus size={10} />
          </button>
        </div>
      </div>

      {uploadError && <div className="text-[10px] text-red-400">{uploadError}</div>}

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {images.map((img, idx) => (
            <div key={idx} className="relative group w-14 h-14 rounded-lg overflow-hidden border border-neutral-800 bg-black shrink-0">
              <Image
                src={img.src}
                alt={`Doc ${idx + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 transition cursor-pointer"
              >
                <FaTrash size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

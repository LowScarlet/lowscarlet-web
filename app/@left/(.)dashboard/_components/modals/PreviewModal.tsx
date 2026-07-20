'use client'

import { IoWarningOutline } from "react-icons/io5";
import Modal from "@/components/utils/Modal";
import { SiReaddotcv } from "react-icons/si";
import { cn } from "@/libs/utils";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  pdfTitle: string;
}

export default function PreviewModal({
  isOpen,
  onClose,
  pdfUrl,
  pdfTitle,
}: PreviewModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center space-x-2">
          <SiReaddotcv className="text-pink-500 text-lg" />
          <span className="font-bold text-white text-base">Preview: {pdfTitle}</span>
        </div>
      }
    >
      <div className="space-y-4 flex flex-col h-[70vh]">
        {pdfUrl === "/cv-creative.pdf" ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-6 bg-neutral-950/60 border border-neutral-855 rounded-lg space-y-3">
            <IoWarningOutline className="text-amber-500 text-3xl animate-pulse" />
            <h3 className="text-white font-semibold text-sm">File CV Creative Belum Di-upload</h3>
            <p className="text-gray-400 text-[11px] max-w-xs leading-relaxed">
              Anda belum mengunggah file CV kustom untuk versi Creative. Silakan gunakan tombol <strong>Edit</strong> (pensil) di menu Curriculum Vitae untuk mengunggah file PDF Anda terlebih dahulu.
            </p>
          </div>
        ) : pdfUrl ? (
          <>
            <iframe
              src={`/api/proxy-pdf?url=${encodeURIComponent(pdfUrl)}`}
              className="w-full flex-1 rounded-lg border border-neutral-805 bg-neutral-900"
              title="PDF Preview"
            />
            <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-2.5 rounded-lg text-[10px] leading-relaxed font-medium shrink-0">
              💡 <strong>Tips IDM:</strong> Jika pratinjau tidak muncul dan langsung mengunduh otomatis, hal ini disebabkan oleh software IDM (Internet Download Manager) Anda yang mencegat file PDF. Anda dapat menonaktifkan penanganan file PDF otomatis di pengaturan integrasi IDM Anda untuk melihat pratinjau langsung.
            </div>
          </>
        ) : (
          <div className="flex-1 flex justify-center items-center text-xs text-gray-505">
            No PDF URL selected
          </div>
        )}

        <div className="flex gap-3 pt-2 shrink-0">
          {pdfUrl !== "/cv-creative.pdf" && pdfUrl && (
            <a
              href={pdfUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-linear-to-r from-pink-500 to-violet-500 text-white text-center font-bold py-2 rounded-lg hover:opacity-90 active:scale-98 transition text-xs flex justify-center items-center gap-1.5"
            >
              <span>Download PDF</span>
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-gray-400 font-bold py-2 px-5 rounded-lg hover:text-white active:scale-98 transition text-xs cursor-pointer",
              pdfUrl === "/cv-creative.pdf" && "flex-1"
            )}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

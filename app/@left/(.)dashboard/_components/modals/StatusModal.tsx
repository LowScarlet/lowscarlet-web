/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import Modal from "@/components/utils/Modal";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStatus: string;
  initialStatusNote: string;
  onSave: (status: string, note: string) => Promise<void>;
}

export default function StatusModal({
  isOpen,
  onClose,
  initialStatus,
  initialStatusNote,
  onSave,
}: StatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [statusNote, setStatusNote] = useState(initialStatusNote);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(initialStatus);
      setStatusNote(initialStatusNote);
      setStatusError("");
    }
  }, [isOpen, initialStatus, initialStatusNote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusError("");
    setIsSubmitting(true);
    try {
      await onSave(selectedStatus, statusNote);
      onClose();
    } catch (err: any) {
      console.error(err);
      setStatusError(err.message || "Failed to update status");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <FaEdit className="text-pink-500" />
          <span>Update My Status</span>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">
            Select Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm cursor-pointer"
          >
            <option value="AVAILABLE">AVAILABLE (Green)</option>
            <option value="NOT_AVAILABLE">NOT AVAILABLE (Red)</option>
            <option value="AVAILABLE_FOR_WORK">AVAILABLE FOR WORK (Purple)</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">
            Status Note
          </label>
          <textarea
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            placeholder="Enter status note..."
            required
            rows={3}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm placeholder-gray-600 resize-none"
          />
        </div>

        {statusError && (
          <p className="text-red-500 text-xs font-medium bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
            {statusError}
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-2 rounded-lg transition text-sm cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 relative bg-linear-to-r from-pink-500 to-violet-500 text-white font-medium py-2 rounded-lg hover:opacity-90 active:scale-98 transition disabled:opacity-50 text-sm flex justify-center items-center cursor-pointer font-bold"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

'use client';

import Image from "next/image";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { FiUser } from "react-icons/fi";

interface SocialFooterProps {
  customName: string;
  mounted: boolean;
  onOpenNameModal: () => void;
  likesCount: number;
  hasLiked: boolean;
  isLiking: boolean;
  commentMessageInput: string;
  isCommenting: boolean;
  commentError: string;
  onLike: () => void;
  onCommentChange: (value: string) => void;
  onCommentSubmit: () => void;
}

export default function SocialFooter({
  customName,
  mounted,
  onOpenNameModal,
  likesCount,
  hasLiked,
  isLiking,
  commentMessageInput,
  isCommenting,
  commentError,
  onLike,
  onCommentChange,
  onCommentSubmit,
}: SocialFooterProps) {
  return (
    <div className="border-t border-neutral-900 p-4 bg-[#0a0a0a] space-y-2.5 shrink-0 relative">
      {/* Name display & Cute Cat animation row */}
      <div className="flex items-center justify-between px-1 text-xs relative">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-neutral-500 font-medium">Commenting as:</span>
          {mounted && (
            <button
              type="button"
              onClick={onOpenNameModal}
              title="Click to change name"
              className="text-[10px] text-neutral-300 hover:text-white bg-neutral-950 px-2 py-0.5 rounded-md border border-neutral-900 font-medium select-none truncate max-w-[150px] flex items-center gap-1 cursor-pointer transition"
            >
              <FiUser className="text-xs text-pink-400" />
              <span>{customName || "Guest"}</span>
            </button>
          )}
        </div>

        {/* CUTE CAT GIF - Positioned on right side above Send button */}
        <div className="absolute -top-8 -right-2 pointer-events-none select-none z-10">
          <Image
            src="/cute-cat-sleep.gif"
            alt="Sleeping cat"
            width={88}
            height={77}
            className="w-[62px] sm:w-[72px] h-auto object-contain"
            unoptimized
          />
        </div>
      </div>

      {commentError && (
        <span className="text-red-500 text-[11px] px-1 font-medium block">{commentError}</span>
      )}

      {/* Actions row: [Like] [Comment Input] [Send] */}
      <div className="flex items-center gap-2">
        {/* Like Button with Count */}
        <button
          type="button"
          onClick={onLike}
          disabled={hasLiked || isLiking}
          title={hasLiked ? "You already liked this page!" : "Like this page"}
          className={`px-3 py-1.5 rounded-lg border transition duration-300 flex items-center justify-center gap-1.5 shrink-0 h-[32px] font-bold text-xs ${hasLiked
            ? "bg-pink-500/10 border-pink-500/25 text-pink-500 cursor-not-allowed"
            : "bg-neutral-950 border-neutral-900 text-neutral-400 hover:text-pink-500 hover:border-pink-500/50 cursor-pointer"
            }`}
        >
          {isLiking ? (
            <span className="w-3.5 h-3.5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
          ) : hasLiked ? (
            <>
              <GoHeartFill className="text-sm text-pink-500" />
              <span>{likesCount}</span>
            </>
          ) : (
            <>
              <GoHeart className="text-sm" />
              <span>{likesCount}</span>
            </>
          )}
        </button>

        {/* Comment input */}
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentMessageInput}
          onChange={(e) => onCommentChange(e.target.value)}
          maxLength={500}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onCommentSubmit();
            }
          }}
          className="flex-1 bg-neutral-950 hover:bg-neutral-950/80 focus:bg-neutral-950 border border-neutral-900 focus:border-violet-500 rounded-lg px-3 py-1.5 text-xs placeholder-neutral-500 focus:outline-hidden transition duration-200 h-[32px]"
        />

        {/* Submit button */}
        <button
          type="button"
          onClick={onCommentSubmit}
          disabled={isCommenting || !commentMessageInput.trim()}
          className="bg-linear-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 disabled:from-neutral-750 disabled:to-neutral-800 text-white font-semibold text-xs px-3.5 h-[32px] rounded-lg cursor-pointer transition duration-300 shadow-md shadow-violet-500/10 flex items-center justify-center"
        >
          {isCommenting ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

'use client';

import { RefObject } from "react";
import { FiUser } from "react-icons/fi";
import { GoHeartFill } from "react-icons/go";
import { FeedItem } from "./types";

interface SocialFeedProps {
  chatContainerRef: RefObject<HTMLDivElement | null>;
  feedEndRef: RefObject<HTMLDivElement | null>;
  feedItems: FeedItem[];
  isLoadingMore: boolean;
  hasMoreComments: boolean;
  isAdmin: boolean;
  deletingCommentId: string;
  onDeleteComment: (commentId: string) => void;
  onSetDeletingCommentId: (commentId: string) => void;
  onScroll: () => void;
  formatDate: (dateString: string) => string;
}

export default function SocialFeed({
  chatContainerRef,
  feedEndRef,
  feedItems,
  isLoadingMore,
  hasMoreComments,
  isAdmin,
  deletingCommentId,
  onDeleteComment,
  onSetDeletingCommentId,
  onScroll,
  formatDate,
}: SocialFeedProps) {
  return (
    <div
      ref={chatContainerRef}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto bg-[#070707] scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent p-5 space-y-4 min-h-0"
    >
      {isLoadingMore && (
        <div className="text-center py-2">
          <span className="text-[10px] text-neutral-500 bg-neutral-900/30 px-2 py-0.5 rounded-sm">
            Loading older messages...
          </span>
        </div>
      )}

      {!hasMoreComments && feedItems.length > 0 && (
        <div className="text-center py-2">
          <span className="text-[10px] text-neutral-600 bg-neutral-900/10 px-2 py-0.5 rounded-sm">
            Beginning of the conversation
          </span>
        </div>
      )}

      {feedItems.length === 0 ? (
        <div className="text-center text-neutral-500 py-10 text-xs">
          No activity yet. Be the first to say hi! 👋
        </div>
      ) : (
        feedItems.map((item) => {
          if (item.type === "comment") {
            return (
              <div
                key={item.id}
                className="flex gap-2.5 text-xs bg-neutral-900/30 border border-neutral-900/60 p-3 rounded-xl hover:border-neutral-800/50 transition duration-300 max-w-[85%] w-fit mr-auto"
              >
                <div className="w-7 h-7 rounded-full bg-linear-to-tr from-pink-500/20 to-violet-500/20 border border-pink-500/25 flex items-center justify-center shrink-0">
                  <FiUser className="text-pink-400 text-xs" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="font-semibold text-neutral-200 text-[11px]">{item.name}</span>
                    <span className="text-neutral-500 text-[9px]">{formatDate(item.createdAt)}</span>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          if (deletingCommentId === item.id) {
                            onDeleteComment(item.id);
                          } else {
                            onSetDeletingCommentId(item.id);
                          }
                        }}
                        className={`ml-2 text-[9px] font-bold px-1.5 py-0.5 rounded-sm transition cursor-pointer select-none ${
                          deletingCommentId === item.id
                            ? "bg-red-500/20 border border-red-500/40 text-red-400"
                            : "text-neutral-500 hover:text-red-400"
                        }`}
                      >
                        {deletingCommentId === item.id ? "Confirm?" : "Delete"}
                      </button>
                    )}
                  </div>
                  <p className="text-neutral-300 leading-relaxed break-words">{item.message}</p>
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={item.id}
                className="flex items-center justify-center gap-2 py-1 text-center text-[11px] text-neutral-450 border border-transparent mx-auto"
              >
                <GoHeartFill className="text-pink-505 text-[11px] animate-pulse shrink-0" />
                <span className="font-medium text-neutral-350">{item.name}</span>
                <span>liked this page</span>
                <span className="text-neutral-600 text-[9px] ml-1">({formatDate(item.createdAt)})</span>
              </div>
            );
          }
        })
      )}
      <div ref={feedEndRef} />
    </div>
  );
}

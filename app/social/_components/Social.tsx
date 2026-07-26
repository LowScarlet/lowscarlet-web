'use client';

import { useEffect, useState, useRef } from "react";
import { Comment, LikeHistory, FeedItem } from "./types";
import SocialHeader from "./SocialHeader";
import SocialFeed from "./SocialFeed";
import SocialFooter from "./SocialFooter";
import NameModal from "./NameModal";

export default function Social() {
  const [mounted, setMounted] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const feedEndRef = useRef<HTMLDivElement>(null);

  // Consolidated Name State
  const [customName, setCustomName] = useState<string>("");
  const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(false);
  const [tempNameInput, setTempNameInput] = useState<string>("");

  // Likes states
  const [likesCount, setLikesCount] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [likesHistory, setLikesHistory] = useState<LikeHistory[]>([]);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  // Comments states
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [commentMessageInput, setCommentMessageInput] = useState<string>("");
  const [isCommenting, setIsCommenting] = useState<boolean>(false);
  const [commentError, setCommentError] = useState<string>("");

  // Pagination states
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  // Admin states
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    fetchSocialData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (isInitialLoading && (commentsList.length > 0 || likesHistory.length > 0)) {
      const container = chatContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;

        const t1 = setTimeout(() => {
          if (container) container.scrollTop = container.scrollHeight;
        }, 50);

        const t2 = setTimeout(() => {
          if (container) container.scrollTop = container.scrollHeight;
          setIsInitialLoading(false);
        }, 200);

        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
        };
      }
    }
  }, [isInitialLoading, commentsList.length, likesHistory.length]);

  const handleNameModalSubmit = async (isGuest: boolean) => {
    const finalName = isGuest ? "" : tempNameInput.trim();
    setCustomName(finalName);

    if (typeof window !== "undefined") {
      localStorage.setItem("visitor_custom_name", finalName);
      localStorage.setItem("visitor_name_set", "true");
    }

    if (hasLiked) {
      try {
        await fetch("/api/likes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: finalName }),
        });
      } catch (err) {
        console.error("Error syncing name to likes:", err);
      }
    }

    await fetchSocialData(false);
    setIsNameModalOpen(false);
  };

  // Check admin session on mount
  useEffect(() => {
    if (mounted) {
      checkAdminSession();
    }
  }, [mounted]);

  const checkAdminSession = async () => {
    try {
      const res = await fetch(`/api/auth/session?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setIsAdmin(data.authenticated);
      }
    } catch (err) {
      console.error("Error checking admin session:", err);
    }
  };

  // Auto reset confirming delete comment id
  useEffect(() => {
    if (deletingCommentId) {
      const timer = setTimeout(() => {
        setDeletingCommentId("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [deletingCommentId]);

  const handleAdminLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    }
    setIsAdmin(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetch(`/api/comments?id=${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeletingCommentId("");
        await fetchSocialData(false);
      } else if (res.status === 401) {
        handleAdminLogout();
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const fetchSocialData = async (shouldScrollToBottom = false) => {
    try {
      const resLikes = await fetch("/api/likes");
      let dbName = null;
      if (resLikes.ok) {
        const dataLikes = await resLikes.json();
        setLikesCount(dataLikes.totalLikes);
        setHasLiked(dataLikes.hasLiked);
        if (dataLikes.userLikeName) {
          dbName = dataLikes.userLikeName;
        }
        setLikesHistory(dataLikes.history);
      }

      const resComments = await fetch("/api/comments?limit=5&offset=0");
      if (resComments.ok) {
        const dataComments = await resComments.json();
        setCommentsList(dataComments);
        if (dataComments.length < 5) {
          setHasMoreComments(false);
        } else {
          setHasMoreComments(true);
        }
      }

      if (isInitialLoading) {
        const localNameSet = typeof window !== "undefined" ? localStorage.getItem("visitor_name_set") : null;
        const localCustomName = typeof window !== "undefined" ? localStorage.getItem("visitor_custom_name") : null;

        if (localNameSet === "true") {
          setCustomName(localCustomName || "");
        } else if (dbName) {
          setCustomName(dbName);
          if (typeof window !== "undefined") {
            localStorage.setItem("visitor_custom_name", dbName);
            localStorage.setItem("visitor_name_set", "true");
          }
        } else {
          setIsNameModalOpen(true);
        }
      }

      if (!shouldScrollToBottom) {
        setIsInitialLoading(false);
      }
    } catch (err) {
      console.error("Error fetching social data:", err);
      setIsInitialLoading(false);
    }
  };

  const loadMoreComments = async () => {
    if (isLoadingMore || !hasMoreComments) return;
    setIsLoadingMore(true);

    try {
      const currentOffset = commentsList.length;
      const res = await fetch(`/api/comments?limit=5&offset=${currentOffset}`);
      if (res.ok) {
        const newComments = await res.json();
        if (newComments.length < 5) {
          setHasMoreComments(false);
        }
        if (newComments.length > 0) {
          const chatContainer = chatContainerRef.current;
          const prevScrollHeight = chatContainer?.scrollHeight ?? 0;
          const prevScrollTop = chatContainer?.scrollTop ?? 0;

          setCommentsList((prev) => [...prev, ...newComments]);

          setTimeout(() => {
            if (chatContainer) {
              const newScrollHeight = chatContainer.scrollHeight;
              chatContainer.scrollTop = prevScrollTop + (newScrollHeight - prevScrollHeight);
            }
          }, 0);
        } else {
          setHasMoreComments(false);
        }
      }
    } catch (err) {
      console.error("Error loading more comments:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleScroll = () => {
    if (isInitialLoading) return;
    const container = chatContainerRef.current;
    if (!container) return;

    if (container.scrollTop < 10 && hasMoreComments && !isLoadingMore) {
      loadMoreComments();
    }
  };

  const handleLike = async () => {
    if (hasLiked) return;
    setIsLiking(true);
    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: customName }),
      });
      if (res.ok) {
        await fetchSocialData(true);
        setTimeout(() => {
          scrollToBottom("smooth");
        }, 50);
      }
    } catch (err) {
      console.error("Error sending like:", err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentMessageInput.trim()) {
      setCommentError("Message cannot be empty!");
      return;
    }
    setCommentError("");
    setIsCommenting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customName,
          message: commentMessageInput,
        }),
      });
      if (res.ok) {
        setCommentMessageInput("");
        await fetchSocialData(true);
        setTimeout(() => {
          scrollToBottom("smooth");
        }, 50);
      } else {
        const errData = await res.json();
        setCommentError(errData.error || "Failed to post comment");
      }
    } catch (err) {
      console.error("Error sending comment:", err);
      setCommentError("Something went wrong. Please try again.");
    } finally {
      setIsCommenting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!mounted) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const scrollToBottom = (behavior: "auto" | "smooth" = "auto") => {
    const container = chatContainerRef.current;
    if (container) {
      if (behavior === "auto") {
        container.scrollTop = container.scrollHeight;
      } else {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  };

  const feedItems: FeedItem[] = [
    ...commentsList.map((c) => ({
      id: c.id,
      type: "comment" as const,
      name: c.name,
      message: c.message,
      createdAt: c.createdAt,
    })),
    ...likesHistory.map((l) => ({
      id: l.id,
      type: "like" as const,
      name: l.name,
      createdAt: l.createdAt,
    })),
  ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  // Sync like count to home layout
  useEffect(() => {
    if (mounted) {
      window.dispatchEvent(new CustomEvent("social-likes-updated", { detail: likesCount }));
    }
  }, [likesCount, mounted]);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden text-neutral-100 relative">
      <SocialHeader />

      <SocialFeed
        chatContainerRef={chatContainerRef}
        feedEndRef={feedEndRef}
        feedItems={feedItems}
        isLoadingMore={isLoadingMore}
        hasMoreComments={hasMoreComments}
        isAdmin={isAdmin}
        deletingCommentId={deletingCommentId}
        onDeleteComment={handleDeleteComment}
        onSetDeletingCommentId={setDeletingCommentId}
        onScroll={handleScroll}
        formatDate={formatDate}
      />

      <SocialFooter
        customName={customName}
        mounted={mounted}
        onOpenNameModal={() => {
          setTempNameInput(customName);
          setIsNameModalOpen(true);
        }}
        likesCount={likesCount}
        hasLiked={hasLiked}
        isLiking={isLiking}
        commentMessageInput={commentMessageInput}
        isCommenting={isCommenting}
        commentError={commentError}
        onLike={handleLike}
        onCommentChange={setCommentMessageInput}
        onCommentSubmit={handleCommentSubmit}
      />

      <NameModal
        isOpen={isNameModalOpen}
        tempNameInput={tempNameInput}
        onTempNameChange={setTempNameInput}
        onSubmit={handleNameModalSubmit}
        onClose={() => setIsNameModalOpen(false)}
      />
    </div>
  );
}

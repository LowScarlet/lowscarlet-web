'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { FiUser, FiLock, FiUnlock } from "react-icons/fi";
import { LuExpand } from "react-icons/lu";

interface Comment {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

interface LikeHistory {
  id: string;
  name: string;
  createdAt: string;
}

export default function SocialDrawer() {
  const router = useRouter();
  const pathname = usePathname();
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
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>("");
  const [adminError, setAdminError] = useState<string>("");
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
        // Scroll instantly first
        container.scrollTop = container.scrollHeight;

        // Perform multiple scroll attempts during layout/animations to guarantee bottom alignment
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

  const handleAdminLogin = async () => {
    setAdminError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPasswordInput }),
      });
      if (res.ok) {
        setIsAdmin(true);
        setIsAdminModalOpen(false);
        setAdminPasswordInput("");
      } else {
        const data = await res.json();
        setAdminError(data.message || "Incorrect password!");
      }
    } catch (err) {
      console.error("Admin verification error:", err);
      setAdminError("Failed to connect to server.");
    }
  };

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
      // Fetch likes status and count
      const resLikes = await fetch("/api/likes");
      let hasLikesHistory = false;
      let dbName = null;
      if (resLikes.ok) {
        const dataLikes = await resLikes.json();
        setLikesCount(dataLikes.totalLikes);
        setHasLiked(dataLikes.hasLiked);
        if (dataLikes.userLikeName) {
          dbName = dataLikes.userLikeName;
        }
        setLikesHistory(dataLikes.history);
        hasLikesHistory = dataLikes.history.length > 0;
      }

      // Fetch first page of comments
      let hasComments = false;
      const resComments = await fetch("/api/comments?limit=5&offset=0");
      if (resComments.ok) {
        const dataComments = await resComments.json();
        setCommentsList(dataComments);
        hasComments = dataComments.length > 0;
        if (dataComments.length < 5) {
          setHasMoreComments(false);
        } else {
          setHasMoreComments(true);
        }
      }

      // Determine name on mount
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

      if (shouldScrollToBottom && (hasComments || hasLikesHistory)) {
        // Handled by the Scroll to bottom useEffect
      } else {
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

          // Retain scroll position
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
          behavior: "smooth"
        });
      }
    }
  };

  const feedItems = [
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
  ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); // oldest first

  // Sync like count to home layout
  useEffect(() => {
    if (mounted) {
      window.dispatchEvent(new CustomEvent('social-likes-updated', { detail: likesCount }));
    }
  }, [likesCount, mounted]);

  const isOpen = pathname === '/social';
  const isHome = pathname === '/';

  if (!isOpen && !isHome) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => router.push("/", { scroll: false })}
            className="lg:hidden z-40 fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <div className="z-50 lg:static fixed inset-0 flex justify-center items-center lg:items-start">
            <motion.div
              key="modal"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: 100,
                transition: { duration: 0.15, ease: "easeIn" },
              }}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 25 },
                opacity: { duration: 0.2 },
              }}
              className="relative lg:top-0 lg:sticky flex flex-col bg-[#090909] border-l border-neutral-900 shadow-xl lg:shadow-none rounded-2xl lg:rounded-none w-[90%] lg:w-96 lg:min-w-[420px] max-w-md lg:max-w-lg h-[90vh] lg:h-svh overflow-hidden text-neutral-100"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 bg-[#090909] shrink-0 border-b border-neutral-900/40">
                <h1 className="flex items-center space-x-2">
                  <GoHeart className="text-xl text-neutral-300" />
                  <span>Visitor Social Center</span>
                </h1>
                <div className="flex items-center space-x-2.5">
                  {mounted && (
                    <span className="text-[10px] text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded-md border border-neutral-900 font-medium select-none truncate max-w-[100px]" title={customName ? `Displaying name: ${customName}` : "Guest Mode (IP-Based)"}>
                      {customName || "Guest"}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setTempNameInput(customName);
                      setIsNameModalOpen(true);
                    }}
                    title="Change Name"
                    className="cursor-pointer text-gray-400 hover:text-white transition duration-200 flex items-center justify-center"
                  >
                    <FiUser className="text-lg" />
                  </button>
                  {mounted && (
                    <button
                      onClick={() => {
                        if (isAdmin) {
                          handleAdminLogout();
                        } else {
                          setIsAdminModalOpen(true);
                        }
                      }}
                      title={isAdmin ? "Log out from Admin" : "Admin Login"}
                      className={`cursor-pointer transition duration-200 flex items-center justify-center ${
                        isAdmin ? "text-pink-500 hover:text-pink-405" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {isAdmin ? <FiUnlock className="text-lg" /> : <FiLock className="text-lg" />}
                    </button>
                  )}
                  <button
                    onClick={() => window.location.reload()}
                    className="cursor-pointer text-gray-400 hover:text-white transition duration-200"
                  >
                    <LuExpand />
                  </button>
                  <Link scroll={false} href="/">
                    <IoMdClose className="text-2xl text-gray-400 hover:text-white transition duration-200 flex items-center justify-center" />
                  </Link>
                </div>
              </div>

              {/* Scrollable Chat Area */}
              <div
                ref={chatContainerRef}
                onScroll={handleScroll}
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
                                      handleDeleteComment(item.id);
                                    } else {
                                      setDeletingCommentId(item.id);
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

              {/* Sticky Chat Footer */}
              <div className="border-t border-neutral-900 p-4 bg-[#0a0a0a] space-y-2.5 shrink-0">
                {commentError && (
                  <span className="text-red-500 text-[11px] px-1 font-medium block">{commentError}</span>
                )}

                {/* Actions row: [Like] [Comment Input] [Send] */}
                <div className="flex items-center gap-2">
                  
                  {/* Like Button with Count */}
                  <button
                    type="button"
                    onClick={handleLike}
                    disabled={hasLiked || isLiking}
                    title={hasLiked ? "You already liked this page!" : "Like this page"}
                    className={`px-3 py-1.5 rounded-lg border transition duration-300 flex items-center justify-center gap-1.5 shrink-0 h-[32px] font-bold text-xs ${
                      hasLiked
                        ? 'bg-pink-500/10 border-pink-500/25 text-pink-500 cursor-not-allowed'
                        : 'bg-neutral-950 border-neutral-900 text-neutral-400 hover:text-pink-500 hover:border-pink-500/50 cursor-pointer'
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
                    onChange={(e) => setCommentMessageInput(e.target.value)}
                    maxLength={500}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCommentSubmit();
                      }
                    }}
                    className="flex-1 bg-neutral-950 hover:bg-neutral-950/80 focus:bg-neutral-950 border border-neutral-900 focus:border-violet-500 rounded-lg px-3 py-1.5 text-xs placeholder-neutral-500 focus:outline-hidden transition duration-200 h-[32px]"
                  />

                  {/* Submit button */}
                  <button
                    type="button"
                    onClick={handleCommentSubmit}
                    disabled={isCommenting || !commentMessageInput.trim()}
                    className="bg-linear-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 disabled:from-neutral-750 disabled:to-neutral-800 text-white font-semibold text-xs px-3.5 h-[32px] rounded-lg cursor-pointer transition duration-300 shadow-md shadow-violet-500/10 flex items-center justify-center"
                  >
                    {isCommenting ? "..." : "Send"}
                  </button>
                </div>

              </div>

              {/* Name Setup Modal Overlay */}
              <AnimatePresence>
                {isNameModalOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col justify-center items-center p-6 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="w-full max-w-xs bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-2xl relative"
                    >
                      {/* Close button - only show if name is already set */}
                      {typeof window !== "undefined" && localStorage.getItem("visitor_name_set") === "true" && (
                        <button
                          onClick={() => setIsNameModalOpen(false)}
                          className="absolute top-4 right-4 text-neutral-450 hover:text-white transition cursor-pointer"
                        >
                          <IoMdClose className="text-lg" />
                        </button>
                      )}

                      <div className="w-10 h-10 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mx-auto">
                        <FiUser className="text-pink-400 text-lg" />
                      </div>

                      <div className="space-y-1">
                        <h2 className="text-sm font-bold text-neutral-100">Set Display Name</h2>
                        <p className="text-[10px] text-neutral-455 leading-relaxed px-1">
                          Choose a name for your comments and likes, or select **Guest** to use your censored IP address.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Your custom name..."
                          value={tempNameInput}
                          onChange={(e) => setTempNameInput(e.target.value)}
                          maxLength={30}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && tempNameInput.trim()) {
                              e.preventDefault();
                              handleNameModalSubmit(false);
                            }
                          }}
                          className="w-full bg-neutral-950 border border-neutral-850 focus:border-violet-500 rounded-lg px-3 py-1.5 text-xs placeholder-neutral-500 focus:outline-hidden transition duration-200"
                        />

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleNameModalSubmit(true)}
                            className="flex-1 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/20 text-neutral-300 text-[11px] font-semibold cursor-pointer transition duration-200"
                          >
                            Guest
                          </button>
                          <button
                            type="button"
                            onClick={() => handleNameModalSubmit(false)}
                            disabled={!tempNameInput.trim()}
                            className="flex-1 bg-linear-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 disabled:from-neutral-800 disabled:to-neutral-850 disabled:text-neutral-550 text-white text-[11px] font-semibold py-1.5 rounded-lg cursor-pointer transition duration-200 shadow-md shadow-violet-500/10"
                          >
                            Save Name
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Admin Login Modal Overlay */}
              <AnimatePresence>
                {isAdminModalOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col justify-center items-center p-6 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="w-full max-w-xs bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-2xl relative"
                    >
                      <button
                        onClick={() => {
                          setIsAdminModalOpen(false);
                          setAdminError("");
                          setAdminPasswordInput("");
                        }}
                        className="absolute top-4 right-4 text-neutral-450 hover:text-white transition cursor-pointer"
                      >
                        <IoMdClose className="text-lg" />
                      </button>

                      <div className="w-10 h-10 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center mx-auto">
                        <FiLock className="text-violet-400 text-lg" />
                      </div>

                      <div className="space-y-1">
                        <h2 className="text-sm font-bold text-neutral-100">Admin Authentication</h2>
                        <p className="text-[10px] text-neutral-455 leading-relaxed px-1">
                          Enter the administrator password to enable comment moderation and management tools.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <input
                          type="password"
                          placeholder="Admin password..."
                          value={adminPasswordInput}
                          onChange={(e) => setAdminPasswordInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && adminPasswordInput) {
                              e.preventDefault();
                              handleAdminLogin();
                            }
                          }}
                          className="w-full bg-neutral-950 border border-neutral-850 focus:border-violet-500 rounded-lg px-3 py-1.5 text-xs placeholder-neutral-500 focus:outline-hidden transition duration-200"
                        />

                        {adminError && (
                          <span className="text-red-500 text-[10px] font-medium block text-left px-1">
                            {adminError}
                          </span>
                        )}

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAdminModalOpen(false);
                              setAdminError("");
                              setAdminPasswordInput("");
                            }}
                            className="flex-1 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/20 text-neutral-300 text-[11px] font-semibold cursor-pointer transition duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleAdminLogin}
                            disabled={!adminPasswordInput}
                            className="flex-1 bg-linear-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 disabled:from-neutral-800 disabled:to-neutral-855 disabled:text-neutral-550 text-white text-[11px] font-semibold py-1.5 rounded-lg cursor-pointer transition duration-200 shadow-md shadow-violet-500/10"
                          >
                            Login
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

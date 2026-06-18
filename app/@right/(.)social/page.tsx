'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { FaRegCommentDots } from "react-icons/fa";
import { FiUser } from "react-icons/fi";

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
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'comments' | 'likes'>('comments');

  // Likes states
  const [likesCount, setLikesCount] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [likeNameInput, setLikeNameInput] = useState<string>("");
  const [likesHistory, setLikesHistory] = useState<LikeHistory[]>([]);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  // Comments states
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [commentNameInput, setCommentNameInput] = useState<string>("");
  const [commentMessageInput, setCommentMessageInput] = useState<string>("");
  const [isCommenting, setIsCommenting] = useState<boolean>(false);
  const [commentError, setCommentError] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    fetchSocialData();
  }, []);

  const fetchSocialData = async () => {
    try {
      // Fetch likes status and count
      const resLikes = await fetch("/api/likes");
      if (resLikes.ok) {
        const dataLikes = await resLikes.json();
        setLikesCount(dataLikes.totalLikes);
        setHasLiked(dataLikes.hasLiked);
        setLikeNameInput(dataLikes.userLikeName || "");
        setLikesHistory(dataLikes.history);
      }

      // Fetch comments list
      const resComments = await fetch("/api/comments");
      if (resComments.ok) {
        const dataComments = await resComments.json();
        setCommentsList(dataComments);
      }
    } catch (err) {
      console.error("Error fetching social data:", err);
    }
  };

  const handleLike = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLiking(true);
    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: likeNameInput }),
      });
      if (res.ok) {
        await fetchSocialData();
      }
    } catch (err) {
      console.error("Error sending like:", err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
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
          name: commentNameInput,
          message: commentMessageInput,
        }),
      });
      if (res.ok) {
        setCommentMessageInput("");
        await fetchSocialData();
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

  return (
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
          className="lg:top-0 lg:sticky flex flex-col bg-[#090909] border-l border-neutral-900 shadow-xl lg:shadow-none rounded-2xl lg:rounded-none w-[90%] lg:w-96 lg:min-w-[420px] max-w-md lg:max-w-lg h-[90vh] lg:h-svh overflow-hidden text-neutral-100"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-neutral-900 p-6 bg-[#0c0c0c]">
            <h1 className="flex items-center space-x-2 font-semibold text-lg">
              <GoHeartFill className="text-pink-500 text-2xl" />
              <span>Visitor Social Center</span>
            </h1>
            <Link scroll={false} href="/" className="hover:bg-neutral-800 p-1.5 rounded-full text-neutral-400 hover:text-neutral-200 transition duration-300">
              <IoMdClose className="text-2xl" />
            </Link>
          </div>

          {/* Dynamic Like Action Panel */}
          <div className="border-b border-neutral-900 p-5 bg-[#0b0b0b]">
            <form onSubmit={handleLike} className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 text-sm font-medium">
                  {hasLiked ? "You liked this page! 🎉" : "Show some love! ❤️"}
                </span>
                <span className="flex items-center gap-1 font-bold text-pink-500 text-sm bg-pink-500/10 px-2 py-0.5 rounded-full">
                  <GoHeartFill /> {likesCount} Likes
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={hasLiked ? "Update your custom name..." : "Enter custom name (optional)..."}
                  value={likeNameInput}
                  onChange={(e) => setLikeNameInput(e.target.value)}
                  maxLength={30}
                  className="flex-1 bg-neutral-900 hover:bg-neutral-900/80 focus:bg-neutral-900 border border-neutral-800 focus:border-pink-500 rounded-lg px-3 py-2 text-sm placeholder-neutral-500 focus:outline-hidden transition duration-200"
                />
                <button
                  type="submit"
                  disabled={isLiking}
                  className="bg-linear-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 disabled:from-neutral-700 disabled:to-neutral-800 text-white font-semibold text-sm px-4 py-2 rounded-lg cursor-pointer transition duration-300 flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/10"
                >
                  {isLiking ? "..." : hasLiked ? "Update Name" : <>Like <GoHeart className="text-base" /></>}
                </button>
              </div>
            </form>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-neutral-900 bg-[#0a0a0a] text-sm">
            <button
              onClick={() => setActiveTab('comments')}
              className={`flex-1 py-3 font-medium text-center border-b-2 transition duration-300 flex justify-center items-center gap-2 cursor-pointer ${
                activeTab === 'comments'
                  ? 'border-pink-500 text-pink-500 bg-neutral-950/20'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/10'
              }`}
            >
              <FaRegCommentDots className="text-base" />
              Comments ({commentsList.length})
            </button>
            <button
              onClick={() => setActiveTab('likes')}
              className={`flex-1 py-3 font-medium text-center border-b-2 transition duration-300 flex justify-center items-center gap-2 cursor-pointer ${
                activeTab === 'likes'
                  ? 'border-pink-500 text-pink-500 bg-neutral-950/20'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/10'
              }`}
            >
              <GoHeart className="text-base" />
              Likes History ({likesHistory.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-[#070707]">
            {activeTab === 'comments' ? (
              <>
                {/* Comments Scrollable Container */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
                  {commentsList.length === 0 ? (
                    <div className="text-center text-neutral-500 py-10 text-sm">
                      No comments yet. Be the first to say hi! 👋
                    </div>
                  ) : (
                    commentsList.map((c) => (
                      <div key={c.id} className="flex gap-3 text-sm bg-neutral-900/30 border border-neutral-900/80 p-3.5 rounded-xl hover:border-neutral-800/80 transition duration-300">
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-pink-500/20 to-violet-500/20 border border-pink-500/20 flex items-center justify-center shrink-0">
                          <FiUser className="text-pink-400 text-xs" />
                        </div>
                        {/* Body */}
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-baseline">
                            <span className="font-semibold text-neutral-200 text-xs">{c.name}</span>
                            <span className="text-neutral-500 text-[10px]">{formatDate(c.createdAt)}</span>
                          </div>
                          <p className="text-neutral-300 leading-relaxed break-words">{c.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Comment Form */}
                <div className="border-t border-neutral-900 p-4 bg-[#0a0a0a]">
                  <form onSubmit={handleComment} className="flex flex-col gap-2.5">
                    {commentError && (
                      <span className="text-red-500 text-xs px-1 font-medium">{commentError}</span>
                    )}
                    <input
                      type="text"
                      placeholder="Your name (optional)..."
                      value={commentNameInput}
                      onChange={(e) => setCommentNameInput(e.target.value)}
                      maxLength={30}
                      className="bg-neutral-900 hover:bg-neutral-900/80 focus:bg-neutral-900 border border-neutral-800 focus:border-violet-500 rounded-lg px-3 py-2 text-xs placeholder-neutral-500 focus:outline-hidden transition duration-200"
                    />
                    <div className="flex gap-2">
                      <textarea
                        rows={1}
                        placeholder="Say something nice..."
                        value={commentMessageInput}
                        onChange={(e) => setCommentMessageInput(e.target.value)}
                        maxLength={500}
                        className="flex-1 bg-neutral-900 hover:bg-neutral-900/80 focus:bg-neutral-900 border border-neutral-800 focus:border-violet-500 rounded-lg px-3 py-2 text-xs placeholder-neutral-500 focus:outline-hidden resize-none transition duration-200 scrollbar-none"
                      />
                      <button
                        type="submit"
                        disabled={isCommenting}
                        className="bg-linear-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 disabled:from-neutral-700 disabled:to-neutral-800 text-white font-semibold text-xs px-4 rounded-lg cursor-pointer transition duration-300 shadow-md shadow-violet-500/10"
                      >
                        {isCommenting ? "..." : "Send"}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              /* Likes History List */
              <div className="flex-1 overflow-y-auto p-5 space-y-3 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
                {likesHistory.length === 0 ? (
                  <div className="text-center text-neutral-500 py-10 text-sm">
                    No likes history yet.
                  </div>
                ) : (
                  likesHistory.map((l) => (
                    <div
                      key={l.id}
                      className="flex items-center justify-between text-sm bg-neutral-900/20 border border-neutral-900/50 hover:border-neutral-900 px-4 py-3 rounded-lg transition duration-200"
                    >
                      <div className="flex items-center gap-2.5">
                        <GoHeartFill className="text-pink-500 text-sm shrink-0" />
                        <span className="font-medium text-neutral-200">{l.name}</span>
                      </div>
                      <span className="text-neutral-500 text-[10px]">{formatDate(l.createdAt)}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}

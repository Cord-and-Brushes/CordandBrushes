import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../../../api/api";
import MyButton from "../../components/common/Button/Button";
import { GoThumbsup } from "react-icons/go";
import { FiEdit3, FiTrash2, FiMessageSquare, FiX } from "react-icons/fi";
import {
  fetchBlogById,
  selectCurrentBlog,
  selectBlogStatus,
  selectBlogError,
  createComment,
  addLike,
  selectCurrentUser,
  selectAuthToken,
} from "../../../redux/features/blogSlice";
import { toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BlogDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const post = useSelector(selectCurrentBlog);
  const status = useSelector(selectBlogStatus);
  const error = useSelector(selectBlogError);
  const currentUser = useSelector(selectCurrentUser);
  const authToken = useSelector(selectAuthToken);

  const [newComment, setNewComment] = useState("");
  const [commentStatus, setCommentStatus] = useState("idle");
  const [likeStatus, setLikeStatus] = useState("idle");
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  // Reply states
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState("idle");
  const [editingReply, setEditingReply] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");
  const [expandedReplies, setExpandedReplies] = useState(new Set());

  // Get token from localStorage (this is what the backend expects)
  const getAuthToken = () => {
    return localStorage.getItem("token") || authToken;
  };

  // Fetch blog data when component mounts or ID changes
  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(id));
    }
  }, [id, dispatch]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    console.log("handlecomment submit called");
    if (!newComment.trim()) {
      toast.error("Please enter a comment.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
        transition: Zoom,
      });
      return;
    }

    const token = getAuthToken();
    if (!token) {
      toast.info("Please login to post a comment.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
        transition: Zoom,
      });
      return;
    }

    setCommentStatus("loading");
    try {
      const response = await api.post(
        "/api/comments/createcomment",
        { postId: id, content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Comment created successfully:", response.data);
      setNewComment("");
      setCommentStatus("succeeded");
      toast.info("An admin will verify your comment before it appears.", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
        transition: Zoom,
      });
      // Refresh the blog data to get the updated comments
      dispatch(fetchBlogById(id));
    } catch (error) {
      console.error("Failed to post comment:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to post comment";
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
        transition: Zoom,
      });
      setCommentStatus("failed");
    }
  };

  const handleLike = async () => {
    const token = getAuthToken();
    if (!token) {
      toast.info("Please login to like this post.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
        transition: Zoom,
      });
      return;
    }
    if (hasLiked) {
      toast.info("You have already liked this post.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }
    setLikeStatus("loading");
    try {
      const result = await dispatch(addLike(id)).unwrap();
      console.log("Like added successfully:", result);
      setLikeStatus("succeeded");
      toast.success("Liked the post!", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
      });
      // Refresh the blog data to get the updated likes
      dispatch(fetchBlogById(id));
    } catch (error) {
      console.error("Failed to like post:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to like post";
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
        transition: Zoom,
      });
      setLikeStatus("failed");
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editCommentText.trim()) {
      toast.error("Please enter a comment.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
        transition: Zoom,
      });
      return;
    }

    const token = getAuthToken();
    if (!token) {
      toast.info("Please login to edit comments.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
        transition: Zoom,
      });
      return;
    }

    console.log("Edit Comment Debug:", {
      commentId,
      currentUser,
      token: token ? "Token exists" : "No token",
      userRole: currentUser?.role,
      userId: currentUser?._id,
    });

    try {
      const response = await api.put(
        `/api/comments/edit/${commentId}`,
        { content: editCommentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Comment edited successfully:", response.data);
      setEditingComment(null);
      setEditCommentText("");
      // Refresh the blog data to get the updated comments
      dispatch(fetchBlogById(id));
    } catch (error) {
      console.error("Failed to edit comment:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to edit comment";
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
        transition: Zoom,
      });
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    const token = getAuthToken();
    if (!token) {
      toast.info("Please login to delete comments.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
        transition: Zoom,
      });
      return;
    }

    console.log("Delete Comment Debug:", {
      commentId,
      currentUser,
      token: token ? "Token exists" : "No token",
      userRole: currentUser?.role,
      userId: currentUser?._id,
    });

    // Decode token to see what's in it
    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      console.log("Token payload:", tokenPayload);
      console.log("Token role:", tokenPayload.role);
      console.log("Token user ID:", tokenPayload._id);
      console.log("Token email:", tokenPayload.email);
    } catch (e) {
      console.log("Could not decode token:", e);
    }

    // Check localStorage data
    console.log("localStorage token:", localStorage.getItem("token"));
    console.log("localStorage user:", localStorage.getItem("user"));
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      console.log("Parsed stored user:", storedUser);
    } catch (e) {
      console.log("Could not parse stored user:", e);
    }

    try {
      await api.delete(`/api/comments/delete/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Comment deleted successfully");
      // Refresh the blog data to get the updated comments
      dispatch(fetchBlogById(id));
    } catch (error) {
      console.error("Failed to delete comment:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete comment";
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
        transition: Zoom,
      });
    }
  };

  const startEditing = (comment) => {
    setEditingComment(comment._id);
    setEditCommentText(comment.content);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditCommentText("");
  };

  // Reply handlers
  const handleReplySubmit = async (commentId) => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
        transition: Zoom,
      });
      return;
    }

    const token = getAuthToken();
    if (!token) {
      toast.info("Please login to post a reply.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
        transition: Zoom,
      });
      return;
    }

    setReplyStatus("loading");
    try {
      const response = await api.post(
        "/api/comments/createreply",
        {
          content: replyText,
          author: currentUser._id,
          commentId: commentId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Reply created successfully:", response.data);
      setReplyText("");
      setReplyingTo(null);
      setReplyStatus("succeeded");
      // Automatically expand the replies section for this comment
      setExpandedReplies((prev) => new Set([...prev, commentId]));
      // Refresh the blog data to get the updated comments
      dispatch(fetchBlogById(id));
    } catch (error) {
      console.error("Failed to post reply:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to post reply";
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
        transition: Zoom,
      });
      setReplyStatus("failed");
    }
  };

  const handleEditReply = async (replyId, commentId) => {
    if (!editReplyText.trim()) {
      toast.error("Please enter a reply.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
        transition: Zoom,
      });
      return;
    }

    const token = getAuthToken();
    if (!token) {
      toast.info("Please login to edit replies.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
        transition: Zoom,
      });
      return;
    }

    try {
      const response = await api.put(
        `/api/comments/editreply/${replyId}`,
        {
          content: editReplyText,
          commentId: commentId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Reply edited successfully:", response.data);
      setEditingReply(null);
      setEditReplyText("");
      // Refresh the blog data to get the updated comments
      dispatch(fetchBlogById(id));
    } catch (error) {
      console.error("Failed to edit reply:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to edit reply";
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
        transition: Zoom,
      });
    }
  };

  const handleDeleteReply = async (replyId, commentId) => {
    if (!window.confirm("Are you sure you want to delete this reply?")) {
      return;
    }

    const token = getAuthToken();
    if (!token) {
      toast.info("Please login to delete replies.", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
        transition: Zoom,
      });
      return;
    }

    try {
      await api.delete(`/api/comments/deletereply/${replyId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { commentId: commentId },
      });
      console.log("Reply deleted successfully");
      // Refresh the blog data to get the updated comments
      dispatch(fetchBlogById(id));
    } catch (error) {
      console.error("Failed to delete reply:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete reply";
      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
        transition: Zoom,
      });
    }
  };

  const startReplying = (commentId) => {
    setReplyingTo(commentId);
    setReplyText("");
  };

  const cancelReplying = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  const startEditingReply = (reply, commentId) => {
    setEditingReply({ replyId: reply._id, commentId });
    setEditReplyText(reply.content);
  };

  const cancelEditingReply = () => {
    setEditingReply(null);
    setEditReplyText("");
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const renderComments = (comments) => {
    if (!comments || comments.length === 0) {
      return (
        <div className="text-gray-500">
          No comments yet. Be the first to comment!
        </div>
      );
    }

    return comments.map((comment, idx) => {
      // Date logic
      const date =
        comment.datePosted || comment.createdAt || comment.updatedAt || null;
      let formattedDate = "Unknown Date";
      if (date) {
        const d = new Date(date);
        formattedDate = isNaN(d) ? "Unknown Date" : d.toLocaleDateString();
      }

      // Author logic (robust)
      const author =
        typeof comment.author === "object"
          ? comment.author?.name || comment.author?.username || "Anonymous"
          : comment.author || "Anonymous";

      // Permission logic
      const isCommentAuthor =
        currentUser && comment.author?._id === currentUser._id;
      const isAdmin = currentUser && currentUser.role === "admin";
      const canEdit = isCommentAuthor; // Only comment author can edit
      const canDelete = isCommentAuthor || isAdmin; // Comment author or admin can delete

      // Debug logging for permissions
      if (currentUser) {
        console.log("Comment Permission Debug:", {
          commentId: comment._id,
          commentAuthor: comment.author?._id,
          currentUserId: currentUser._id,
          currentUserRole: currentUser.role,
          isCommentAuthor,
          isAdmin,
          canEdit,
          canDelete,
        });
      }

      const isEditing = editingComment === comment._id;
      const isReplying = replyingTo === comment._id;

      return (
        <div key={comment._id || idx} className="mb-4">
          <div className="p-4 bg-gray-100 rounded-lg">
            {isEditing ? (
              <div>
                <textarea
                  className="w-full p-2 border rounded mb-2"
                  value={editCommentText}
                  onChange={(e) => setEditCommentText(e.target.value)}
                  rows="3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditComment(comment._id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{comment.content}</p>
                  <div className="text-xs text-gray-500 mt-2">
                    <span>By {author}</span>
                    <span className="mx-2">|</span>
                    <span>{formattedDate}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  {isLoggedIn && (
                    <button
                      onClick={() => startReplying(comment._id)}
                      className="flex items-center gap-1 text-green-500 hover:text-green-700 hover:bg-green-50 px-2 py-1 rounded transition-colors"
                      title="Reply to comment"
                    >
                      <FiMessageSquare size={16} />
                    </button>
                  )}
                  {canEdit && (
                    <button
                      onClick={() => startEditing(comment)}
                      className="flex items-center gap-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                      title="Edit comment"
                    >
                      <FiEdit3 size={16} />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                      title="Delete comment"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Reply form */}
            {isReplying && (
              <div className="mt-4 ml-6 p-3 ">
                <textarea
                  className="w-full p-2 border rounded mb-2"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply..."
                  rows="3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReplySubmit(comment._id)}
                    disabled={replyStatus === "loading"}
                    className="px-3 py-1 rounded disabled:opacity-50"
                  >
                    {replyStatus === "loading" ? "Posting..." : "Post Reply"}
                  </button>
                  <button
                    onClick={cancelReplying}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Replies section */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 ml-6">
                <a
                  onClick={() => toggleReplies(comment._id)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium mb-2"
                >
                  <span>
                    {expandedReplies.has(comment._id) ? "Hide" : "Show"}{" "}
                    {comment.replies.length}{" "}
                    {comment.replies.length === 1 ? "reply" : "replies"}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      expandedReplies.has(comment._id) ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </a>

                {expandedReplies.has(comment._id) && (
                  <div>
                    {comment.replies.map((reply, replyIdx) => {
                      const replyDate = reply.datePosted
                        ? new Date(reply.datePosted).toLocaleDateString()
                        : "Unknown Date";
                      const replyAuthor =
                        typeof reply.author === "object"
                          ? reply.author?.name ||
                            reply.author?.username ||
                            "Anonymous"
                          : reply.author || "Anonymous";

                      const isReplyAuthor =
                        currentUser &&
                        (typeof reply.author === "object"
                          ? reply.author?._id === currentUser._id
                          : reply.author === currentUser._id);
                      const canEditReply = isReplyAuthor;
                      const canDeleteReply = isReplyAuthor || isAdmin;
                      const isEditingReply =
                        editingReply && editingReply.replyId === reply._id;

                      return (
                        <div
                          key={reply._id || replyIdx}
                          className="mb-3 p-3 bg-white rounded border"
                        >
                          {isEditingReply ? (
                            <div>
                              <textarea
                                className="w-full p-2 border rounded mb-2"
                                value={editReplyText}
                                onChange={(e) =>
                                  setEditReplyText(e.target.value)
                                }
                                rows="2"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    handleEditReply(reply._id, comment._id)
                                  }
                                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEditingReply}
                                  className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="text-sm text-gray-800">
                                  {reply.content}
                                </p>
                                <div className="text-xs text-gray-500 mt-1">
                                  <span>By {replyAuthor}</span>
                                  <span className="mx-2">|</span>
                                  <span>{replyDate}</span>
                                </div>
                              </div>
                              <div className="flex gap-1 ml-2">
                                {canEditReply && (
                                  <button
                                    onClick={() =>
                                      startEditingReply(reply, comment._id)
                                    }
                                    className="flex items-center gap-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 px-1 py-1 rounded transition-colors"
                                    title="Edit reply"
                                  >
                                    <FiEdit3 size={14} />
                                  </button>
                                )}
                                {canDeleteReply && (
                                  <button
                                    onClick={() =>
                                      handleDeleteReply(reply._id, comment._id)
                                    }
                                    className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-1 py-1 rounded transition-colors"
                                    title="Delete reply"
                                  >
                                    <FiTrash2 size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="flexCenter flex-col gap-4 bg-white p-8 rounded-lg">
          <div className="spinner"></div>
          <div className="text-lg font-medium">Loading blog...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (status === "failed") {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <div className="text-center text-lg text-red-500">
          Error loading blog: {error}
        </div>
      </div>
    );
  }

  // No post found
  if (!post) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <div className="text-center text-lg">Blog not found</div>
      </div>
    );
  }

  // Determine if the current user has already liked the post
  const isLoggedIn = !!getAuthToken();
  const userId = currentUser?._id;
  const hasLiked =
    isLoggedIn &&
    userId &&
    post.likes &&
    Array.isArray(post.likes) &&
    post.likes.some((like) =>
      typeof like === "object" ? like._id === userId : like === userId
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="flex items-center mb-6">
        <span className="text-gray-600">By {post.author || "Anonymous"}</span>
        <span className="mx-3">|</span>
        <span className="text-gray-600">
          {post.createdAt
            ? new Date(post.createdAt).toLocaleDateString()
            : post.datePosted
            ? new Date(post.datePosted).toLocaleDateString()
            : "Unknown Date"}
        </span>
      </div>
      <div className="mb-6">
        {post.bannerImage && post.bannerImage.length > 0 && (
          <img
            className="w-full h-64 object-cover rounded-lg"
            src={post.bannerImage[0]}
            alt="Banner"
          />
        )}
      </div>
      <div
        className="prose prose-lg mb-6"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <div className="flex justify-between items-center mb-6">
        <div className="flex justify-center items-center gap-x-4">
          <button
            className={`rounded-full p-3 text-[20px] hover:text-black text-white ${
              likeStatus === "loading" || hasLiked
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={handleLike}
            disabled={likeStatus === "loading"}
            title={
              !isLoggedIn
                ? "Login to like this post"
                : hasLiked
                ? "You have already liked this post"
                : "Click to like this post"
            }
          >
            <GoThumbsup />
          </button>
          <div className="text-gray-600">
            Likes: {post.likes ? post.likes.length : 0}
          </div>
          {likeStatus === "loading" && (
            <span className="text-sm text-blue-500">Liking...</span>
          )}
        </div>

        <div className="text-gray-600">
          Comments: {post.comments ? post.comments.length : 0}
        </div>
      </div>
      <section>
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        {!isLoggedIn && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            Please login to post comments and like this post.
          </div>
        )}
        <div>{renderComments(post.comments)}</div>
        <form onSubmit={handleCommentSubmit} className="mt-6">
          <textarea
            className={`w-full p-4 rounded-lg ${
              isLoggedIn ? "bg-gray-100" : "bg-gray-200"
            }`}
            rows="4"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={
              isLoggedIn ? "Write a comment..." : "Please login to comment..."
            }
            disabled={!isLoggedIn || commentStatus === "loading"}
          />

          <button
            type="submit"
            disabled={!isLoggedIn || commentStatus === "loading"}
            className="mt-2 px-4 py-2 rounded disabled:opacity-50"
          >
            {commentStatus === "loading" ? "Posting..." : "Post Comment"}
          </button>
          {commentStatus === "loading" && (
            <span className="ml-2 text-sm text-blue-500">
              Posting comment...
            </span>
          )}
        </form>
      </section>
    </div>
  );
};

export default BlogDetails;

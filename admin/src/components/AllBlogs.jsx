import React, { useEffect, useState } from "react";
import { toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TbTrash } from "react-icons/tb";
import { RiEdit2Line } from "react-icons/ri";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import Empty from "../assets/empty-cart.jpg";
import api from "../api/api";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [commentsByBlog, setCommentsByBlog] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get("/api/blogs/allblogs");
        const data = response.data.posts;
        setBlogs(data);
        // Fetch comments for each blog
        const token = localStorage.getItem("token");
        const commentsObj = {};
        await Promise.all(
          data.map(async (blog) => {
            try {
              const res = await api.get(`/api/comments/bypost/${blog._id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              commentsObj[blog._id] = res.data.comments || [];
            } catch (err) {
              commentsObj[blog._id] = [];
            }
          })
        );
        setCommentsByBlog(commentsObj);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        toast.error("Failed to fetch blogs. Please try again.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Zoom,
        });
      }
    };

    fetchBlogs();
  }, []);

  const handleRemoveBlog = (id) => {
    setBlogToDelete(id);
    setIsModalOpen(true);
  };

  const deleteBlog = async () => {
    setShowLoader(true);
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/blogs/delete/${blogToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlogs(blogs.filter((post) => post._id !== blogToDelete));
      toast.success("Blog removed successfully", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Zoom,
      });
    } catch (error) {
      console.error("Error removing blog:", error);
      toast.error("Error removing blog. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Zoom,
      });
    } finally {
      setShowLoader(false);
      setIsModalOpen(false);
    }
  };

  const handleEditBlog = (id) => {
    setShowLoader(true);
    navigate(`/admin/editblog/${id}`);
    setShowLoader(false);
  };

  // Approve or reject comment
  const handleApproveComment = async (commentId, blogId) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/api/comments/approve/${commentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCommentsByBlog((prev) => ({
        ...prev,
        [blogId]: prev[blogId].map((c) =>
          c._id === commentId ? { ...c, approved: true } : c
        ),
      }));
      toast.success("Comment approved!", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
        transition: Zoom,
      });
    } catch (err) {
      toast.error("Failed to approve comment", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
        transition: Zoom,
      });
    }
  };

  const handleRejectComment = async (commentId, blogId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/comments/delete/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommentsByBlog((prev) => ({
        ...prev,
        [blogId]: prev[blogId].filter((c) => c._id !== commentId),
      }));
      toast.success("Comment deleted!", {
        position: "bottom-right",
        autoClose: 2000,
        theme: "dark",
        transition: Zoom,
      });
    } catch (err) {
      toast.error("Failed to delete comment", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
        transition: Zoom,
      });
    }
  };

  return (
    <div className="text-white  font-anta p-8 box-border bg-black/15 w-full rounded-sm mt-4 lg:m-7">
      <h1 className="bold-22 font-anta text-center mb-5">All Blogs</h1>
      <div>
        {blogs?.length === 0 ? (
          <div className="flex flex-col justify-center items-center bg-black/60 py-8 rounded-full">
            <img src={Empty} className="rounded-full h-64" alt="Empty" />
            <p className="font-anta text-white text-center mt-5">
              No Blogs to show
            </p>
          </div>
        ) : (
          <div>
            {blogs?.map((post) => (
              <div
                key={post._id}
                className="ring-1 ring-white p-6 lg:p-12 mb-4"
              >
                <div className="flex lg:flex-row flex-col-reverse justify-between">
                  <div>
                    <h1 className="text-[24px] font-anta my-2">{post.title}</h1>
                    <p className="text-white">
                      {new Date(post.datePosted).toLocaleDateString()}
                    </p>
                    <div className="mt-4 flex justify-between w-[50px]">
                      <button
                        className="hover:text-orange-600"
                        onClick={() => handleRemoveBlog(post._id)}
                      >
                        <TbTrash className="text-[22px]" />
                      </button>
                      <button
                        className="hover:text-orange-600"
                        onClick={() => handleEditBlog(post._id)}
                      >
                        <RiEdit2Line className="text-[22px]" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <img
                      className="h-[30vh] lg:h-[50vh] w-full object-contain bg-white rounded"
                      src={post.bannerImage}
                      alt="Banner"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-white font-anta text-[18px] pt-3">
                    {post.content}
                  </p>
                  {/* Comments Section */}
                  <div className="mt-4">
                    <h3 className="text-lg font-bold mb-2">Comments</h3>
                    {commentsByBlog[post._id] &&
                    commentsByBlog[post._id].length > 0 ? (
                      <ul className="space-y-2">
                        {commentsByBlog[post._id].map((comment) => (
                          <li
                            key={comment._id}
                            className={`flex items-center justify-between p-2 rounded ${
                              comment.approved
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            <div>
                              <span className="font-semibold">
                                {comment.author?.name || "Anonymous"}:
                              </span>{" "}
                              {comment.content}
                              <span className="ml-2 text-xs text-gray-500">
                                {comment.datePosted
                                  ? new Date(
                                      comment.datePosted
                                    ).toLocaleDateString()
                                  : "Unknown"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {!comment.approved && (
                                <button
                                  title="Approve"
                                  onClick={() =>
                                    handleApproveComment(comment._id, post._id)
                                  }
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <FaCheckCircle size={20} />
                                </button>
                              )}
                              <button
                                title="Delete"
                                onClick={() =>
                                  handleRejectComment(comment._id, post._id)
                                }
                                className="text-red-600 hover:text-red-800"
                              >
                                <FaTimesCircle size={20} />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-400">No comments yet.</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {showLoader && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Delete Confirmation"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this blog?</p>
        <div className="flex gap-x-5 mt-3">
          <button
            onClick={() => setIsModalOpen(false)}
            className="btn_dark_rounded"
          >
            Cancel
          </button>
          <button
            onClick={deleteBlog}
            className="btn_dark_rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AllBlogs;

/* import React, { useEffect, useState } from "react";
import api from "../api/api";
import { toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch unapproved comments
  useEffect(() => {
    const fetchUnapproved = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/api/comments/unapproved", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(res.data.comments || []);
      } catch (err) {
        toast.error("Failed to fetch unapproved comments", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "dark",
          transition: Zoom,
        });
      }
      setLoading(false);
    };
    fetchUnapproved();
  }, []);

  // Approve a comment
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/api/comments/approve/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments((prev) => prev.filter((c) => c._id !== id));
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

  return (
    <div className="text-white font-anta p-8 box-border bg-black/15 w-full rounded-sm mt-4 lg:m-7">
      <h1 className="bold-22 font-anta text-center mb-5">
        Unapproved Comments
      </h1>
      {loading ? (
        <div className="flex justify-center items-center">Loading...</div>
      ) : comments.length === 0 ? (
        <div className="flex flex-col justify-center items-center bg-black/60 py-8 rounded-full">
          <p className="font-anta text-white text-center mt-5">
            No unapproved comments.
          </p>
        </div>
      ) : (
        <div className="max-h-[77vh] overflow-auto px-4 text-center">
          <table className="w-full mx-auto">
            <thead>
              <tr className="overflow-auto border-b-2 border-orange-600">
                <th className="p-2 font-anta uppercase">Content</th>
                <th className="p-2 font-anta uppercase">Author</th>
                <th className="p-2 font-anta uppercase">Date</th>
                <th className="p-2 font-anta uppercase">Approve</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr
                  key={comment._id}
                  className="border-b border-white/40 p-6 medium-14"
                >
                  <td className="p-2">{comment.content}</td>
                  <td className="p-2">
                    {comment.author?.name || comment.author || "Anonymous"}
                  </td>
                  <td className="p-2">
                    {comment.datePosted
                      ? new Date(comment.datePosted).toLocaleDateString()
                      : "Unknown"}
                  </td>
                  <td className="p-2">
                    <button
                      className="btn_dark_rounded bg-green-600 hover:bg-green-800 text-white px-4 py-1 rounded"
                      onClick={() => handleApprove(comment._id)}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllComments;
 */

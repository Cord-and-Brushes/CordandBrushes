import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../../../redux/features/authSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    number: user?.number || "",
    address: user?.address || "",
    profilePic: user?.profilePic || "",
  });
  const [preview, setPreview] = useState(user?.profilePic || "");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Optionally, upload to your server/cloudinary here and get the URL
      // For now, just preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setForm((prev) => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    const resultAction = await dispatch(updateProfile(form));
    if (updateProfile.fulfilled.match(resultAction)) {
      setSuccess("Profile updated successfully!");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Phone</label>
          <input
            type="text"
            name="number"
            value={form.number}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        {/* <div>
          <label className="block font-medium">Profile Picture</label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            {preview && (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-16 h-16 rounded-full object-cover border"
              />
            )}
          </div>
        </div> */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        {success && <div className="text-green-600 mt-2">{success}</div>}
        {error && (
          <div className="text-red-600 mt-2">{error.message || error}</div>
        )}
      </form>
    </div>
  );
};

export default ProfilePage;

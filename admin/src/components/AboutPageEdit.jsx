import React, { useEffect, useState } from "react";

const API = "/api/aboutpage";

const AboutPageEdit = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState({});
  const [story, setStory] = useState({
    storyTitle: "",
    storyText: "",
    storyImage: "",
  });
  const [newLeader, setNewLeader] = useState({
    name: "",
    designation: "",
    image: "",
    description: "",
  });
  const [newTeam, setNewTeam] = useState({
    name: "",
    designation: "",
    image: "",
  });
  const [editingLeaders, setEditingLeaders] = useState({});
  const [editingTeams, setEditingTeams] = useState({});

  useEffect(() => {
    fetch(`${API}/content`)
      .then((res) => res.json())
      .then((data) => {
        setAbout(data);
        setStory({
          storyTitle: data.storyTitle || "",
          storyText: data.storyText || "",
          storyImage: data.storyImage || "",
        });
        setLoading(false);
      });
  }, []);

  // --- STORY UPDATE ---
  const handleStoryChange = (e) =>
    setStory({ ...story, [e.target.name]: e.target.value });
  const handleStorySubmit = (e) => {
    e.preventDefault();
    fetch(`${API}/content/edit`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(story),
    })
      .then((res) => res.json())
      .then((data) => setAbout({ ...about, ...data }));
  };

  // --- LEADER CRUD ---
  const handleLeaderChange = (e) =>
    setNewLeader({ ...newLeader, [e.target.name]: e.target.value });
  const handleAddLeader = (e) => {
    e.preventDefault();
    fetch(`${API}/leader/addleader`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLeader),
    })
      .then((res) => res.json())
      .then((leaders) => {
        setAbout({ ...about, leaders });
        setNewLeader({ name: "", designation: "", image: "", description: "" });
      });
  };
  const handleEditLeader = (id, leader) => {
    fetch(`${API}/leader/edit/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leader),
    })
      .then((res) => res.json())
      .then((updated) => {
        setAbout({
          ...about,
          leaders: about.leaders.map((l) => (l._id === id ? updated : l)),
        });
      });
  };
  const handleDeleteLeader = (id) => {
    fetch(`${API}/leader/delete/${id}`, { method: "DELETE" }).then(() =>
      setAbout({ ...about, leaders: about.leaders.filter((l) => l._id !== id) })
    );
  };

  // --- TEAM CRUD ---
  const handleTeamChange = (e) =>
    setNewTeam({ ...newTeam, [e.target.name]: e.target.value });
  const handleAddTeam = (e) => {
    e.preventDefault();
    fetch(`${API}/team/addmember`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTeam),
    })
      .then((res) => res.json())
      .then((teams) => {
        setAbout({ ...about, teams });
        setNewTeam({ name: "", designation: "", image: "" });
      });
  };
  const handleEditTeam = (id, member) => {
    fetch(`${API}/team/edit/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member),
    })
      .then((res) => res.json())
      .then((updated) => {
        setAbout({
          ...about,
          teams: about.teams.map((m) => (m._id === id ? updated : m)),
        });
      });
  };
  const handleDeleteTeam = (id) => {
    fetch(`${API}/team/delete/${id}`, { method: "DELETE" }).then(() =>
      setAbout({ ...about, teams: about.teams.filter((m) => m._id !== id) })
    );
  };

  // --- IMAGE UPLOAD HANDLER ---
  const handleImageUpload = async (e, type, id, isNew) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadId = isNew ? `new-${type}` : id;
    setImageUploading({ ...imageUploading, [uploadId]: true });

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/aboutpage/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (type === "leader") {
        if (isNew) {
          setNewLeader({ ...newLeader, image: data.imageUrl });
        } else {
          setEditingLeaders({
            ...editingLeaders,
            [id]: { ...editingLeaders[id], image: data.imageUrl },
          });
        }
      } else {
        if (isNew) {
          setNewTeam({ ...newTeam, image: data.imageUrl });
        } else {
          setEditingTeams({
            ...editingTeams,
            [id]: { ...editingTeams[id], image: data.imageUrl },
          });
        }
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setImageUploading({ ...imageUploading, [uploadId]: false });
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="spinner"></div>
      </div>
    );
  if (!about) return <div>No data found.</div>;

  return (
    <div className="text-white font-anta p-8 box-border bg-black/15 w-full rounded-sm mt-4 lg:m-7">
      <h1 className="bold-22 font-anta text-center mb-5">ABOUT PAGE EDIT</h1>
      {/* STORY SECTION */}
      <form onSubmit={handleStorySubmit} className="mb-8">
        <h3 className="font-anta bold-18 pb-2">Our Story Section</h3>
        <div className="flex flex-col lg:flex-row gap-x-10">
          <div className="mb-3 max-w-[400px] w-full">
            <h4 className="font-anta bold-18 pb-2">Title:</h4>
            <input
              name="storyTitle"
              value={story.storyTitle}
              onChange={handleStoryChange}
              placeholder="Title"
              className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
            />
          </div>
          <div className="mb-3 max-w-[400px] w-full">
            <h4 className="font-anta bold-18 pb-2">Image URL:</h4>
            <input
              name="storyImage"
              value={story.storyImage}
              onChange={handleStoryChange}
              placeholder="Image URL"
              className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
            />
          </div>
        </div>
        <div className="mb-3 w-full">
          <h4 className="font-anta bold-18 pb-2">Text:</h4>
          <textarea
            name="storyText"
            value={story.storyText}
            onChange={handleStoryChange}
            placeholder="Text"
            className="bg-black/50 outline-none w-full py-3 px-4 rounded-md text-white"
          />
        </div>
        <button type="submit" className="btn_dark_rounded mt-2 !rounded">
          Update Story
        </button>
      </form>

      {/* LEADERS SECTION */}
      <div className="mb-8">
        <h3 className="font-anta bold-18 pb-2">Leaders</h3>
        {about.leaders.map((leader, idx) => {
          const editing = editingLeaders[leader._id] || leader;
          return (
            <div
              key={leader._id}
              className="mb-4 p-4 rounded bg-black/30 flex flex-col lg:flex-row gap-x-6 gap-y-2"
            >
              <div className="flex-1 flex flex-col gap-y-2">
                <div className="flex flex-col lg:flex-row gap-x-4 gap-y-2">
                  <h4 className="font-anta bold-18 ">Name:</h4>
                  <input
                    value={editing.name}
                    onChange={(e) =>
                      setEditingLeaders({
                        ...editingLeaders,
                        [leader._id]: { ...editing, name: e.target.value },
                      })
                    }
                    className="bg-black/50 outline-none w-full py-2 px-3 rounded-md text-white mb-1"
                    placeholder="Name"
                  />
                  <h4 className="font-anta bold-18 ">Designation:</h4>
                  <input
                    value={editing.designation}
                    onChange={(e) =>
                      setEditingLeaders({
                        ...editingLeaders,
                        [leader._id]: {
                          ...editing,
                          designation: e.target.value,
                        },
                      })
                    }
                    className="bg-black/50 outline-none w-full py-2 px-3 rounded-md text-white mb-1"
                    placeholder="Designation"
                  />
                </div>
                <div className="flex flex-col lg:flex-row gap-x-4 gap-y-2 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(e, "leader", leader._id, false)
                    }
                    className="text-white"
                  />
                  {editing.image && (
                    <img
                      src={editing.image}
                      alt="preview"
                      className="h-12 w-12 object-cover rounded ml-2"
                    />
                  )}
                </div>
                <h4 className="font-anta bold-18 pb-2">Description:</h4>
                <textarea
                  value={editing.description}
                  onChange={(e) =>
                    setEditingLeaders({
                      ...editingLeaders,
                      [leader._id]: { ...editing, description: e.target.value },
                    })
                  }
                  rows={5}
                  className="bg-black/50 outline-none w-full py-2 px-3 rounded-md text-white min-h-[100px]"
                  placeholder="Description"
                />
              </div>
              <div className="flex flex-col gap-y-2 justify-center items-stretch min-w-[120px]">
                <button
                  onClick={() => {
                    handleEditLeader(leader._id, editing);
                    setEditingLeaders({
                      ...editingLeaders,
                      [leader._id]: undefined,
                    });
                  }}
                  disabled={imageUploading[leader._id]}
                  className="btn_dark_rounded !rounded h-fit"
                >
                  {imageUploading[leader._id] ? "Uploading..." : "Update"}
                </button>
                <button
                  onClick={() => handleDeleteLeader(leader._id)}
                  disabled={imageUploading[leader._id]}
                  className="btn_dark_rounded !rounded h-fit"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
        <form
          onSubmit={handleAddLeader}
          className="p-4 rounded bg-black/20 flex flex-col lg:flex-row gap-x-6 gap-y-2"
        >
          <input
            name="name"
            value={newLeader.name}
            onChange={handleLeaderChange}
            placeholder="Name"
            required
            className="bg-black/50 outline-none w-full py-2 px-3 rounded-md text-white mb-1"
          />
          <input
            name="designation"
            value={newLeader.designation}
            onChange={handleLeaderChange}
            placeholder="Designation"
            required
            className="bg-black/50 outline-none w-full py-2 px-3 rounded-md text-white mb-1"
          />
          <textarea
            name="description"
            value={newLeader.description}
            onChange={handleLeaderChange}
            placeholder="Description"
            required
            className="bg-black/50 outline-none w-full py-2 px-3 rounded-md text-white"
          />
          <div className="flex flex-col lg:flex-row gap-x-4 gap-y-2 items-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "leader", null, true)}
              className="text-white"
            />
            {newLeader.image && (
              <img
                src={newLeader.image}
                alt="preview"
                className="h-12 w-12 object-cover rounded ml-2"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={imageUploading["new-leader"]}
            className="btn_dark_rounded mt-2 !rounded h-fit"
          >
            {imageUploading["new-leader"] ? "Uploading..." : "Add Leader"}
          </button>
        </form>
      </div>

      {/* TEAM MEMBERS SECTION */}
      <div>
        <h3 className="font-anta bold-18 pb-2">Team Members</h3>
        {about.teams.map((member, idx) => {
          const editing = editingTeams[member._id] || member;
          return (
            <div
              key={member._id}
              className="mb-4 p-4 rounded bg-black/30 flex flex-col lg:flex-row gap-x-6 gap-y-2"
            >
              <div className="flex-1 flex flex-col gap-y-2">
                <div className="flex flex-col lg:flex-row gap-x-4 gap-y-2">
                  <h4 className="font-anta bold-18 pb-2">Name:</h4>
                  <input
                    value={editing.name}
                    onChange={(e) =>
                      setEditingTeams({
                        ...editingTeams,
                        [member._id]: { ...editing, name: e.target.value },
                      })
                    }
                    className="bg-black/50 outline-none w-full py-2 px-3 rounded-md text-white mb-1"
                    placeholder="Name"
                  />
                  <h4 className="font-anta bold-18 pb-2">Designation:</h4>
                  <input
                    value={editing.designation}
                    onChange={(e) =>
                      setEditingTeams({
                        ...editingTeams,
                        [member._id]: {
                          ...editing,
                          designation: e.target.value,
                        },
                      })
                    }
                    className="bg-black/50 outline-none w-full py-2 px-3 rounded-md text-white mb-1"
                    placeholder="Designation"
                  />
                </div>
                <div className="flex flex-col lg:flex-row gap-x-4 gap-y-2 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(e, "team", member._id, false)
                    }
                    className="text-white"
                  />
                  {editing.image && (
                    <img
                      src={editing.image}
                      alt="preview"
                      className="h-12 w-12 object-cover rounded ml-2"
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-y-2 justify-center items-stretch min-w-[120px]">
                <button
                  onClick={() => {
                    handleEditTeam(member._id, editing);
                    setEditingTeams({
                      ...editingTeams,
                      [member._id]: undefined,
                    });
                  }}
                  disabled={imageUploading[member._id]}
                  className="btn_dark_rounded !rounded h-fit"
                >
                  {imageUploading[member._id] ? "Uploading..." : "Update"}
                </button>
                <button
                  onClick={() => handleDeleteTeam(member._id)}
                  disabled={imageUploading[member._id]}
                  className="btn_dark_rounded !rounded h-fit"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
        <form
          onSubmit={handleAddTeam}
          className="p-4 rounded bg-black/20 flex flex-col lg:flex-row gap-x-6 gap-y-2"
        >
          <input
            name="name"
            value={newTeam.name}
            onChange={handleTeamChange}
            placeholder="Name"
            required
            className="bg-black/50 outline-none w-full py-2 px-3 rounded-md text-white mb-1"
          />
          <input
            name="designation"
            value={newTeam.designation}
            onChange={handleTeamChange}
            placeholder="Designation"
            required
            className="bg-black/50 outline-none w-full py-2 px-3 rounded-md text-white mb-1"
          />
          <div className="flex flex-col lg:flex-row gap-x-4 gap-y-2 items-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, "team", null, true)}
              className="text-white"
            />
            {newTeam.image && (
              <img
                src={newTeam.image}
                alt="preview"
                className="h-12 w-12 object-cover rounded ml-2"
              />
            )}
          </div>
          <button
            type="submit"
            disabled={imageUploading["new-team"]}
            className="btn_dark_rounded mt-2 !rounded h-fit"
          >
            {imageUploading["new-team"] ? "Uploading..." : "Add Team Member"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AboutPageEdit;

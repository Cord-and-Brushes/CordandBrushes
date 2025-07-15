import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async thunks for API calls
export const fetchBlogs = createAsyncThunk("blogs/fetchBlogs", async () => {
  try {
    console.log("fetchBlogs - Making API call to /api/blogs/allblogs");
    const response = await api.get("/api/blogs/allblogs");
    console.log("fetchBlogs - API response:", response.data);
    console.log("fetchBlogs - Posts array:", response.data.posts);
    return response.data.posts || []; // Return the posts array from the response
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return []; // Return empty array on error
  }
});

export const fetchBlogById = createAsyncThunk(
  "blogs/fetchBlogById",
  async (id) => {
    try {
      console.log("fetchBlogById - Making API call to /api/blogs/blog/" + id);
      const response = await api.get(`/api/blogs/blog/${id}`);
      console.log("fetchBlogById - API response:", response.data);
      return response.data.post || response.data; // Return the post from the response
    } catch (error) {
      console.error("Error fetching blog by ID:", error);
      throw error;
    }
  }
);

export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async (blogData) => {
    try {
      const formData = new FormData();
      formData.append("title", blogData.title);
      formData.append("content", blogData.content);
      if (blogData.image) {
        formData.append("images", blogData.image);
      }

      const response = await api.post("/api/blogs/createblog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating blog:", error);
      throw error;
    }
  }
);

export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ id, blogData }) => {
    try {
      const formData = new FormData();
      formData.append("title", blogData.title);
      formData.append("content", blogData.content);
      if (blogData.image) {
        formData.append("images", blogData.image);
      }

      const response = await api.put(`/api/blogs/edit/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating blog:", error);
      throw error;
    }
  }
);

export const deleteBlog = createAsyncThunk("/blogs/deleteBlog", async (id) => {
  try {
    await api.delete(`/api/blogs/delete/${id}`);
    return id;
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
});

export const createComment = createAsyncThunk(
  "/api/blogs/createComment",
  async ({ postId, content }, { rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Authentication required");
      }

      // Get user info from auth state
      const state = getState();
      const user = state.auth?.user;

      const response = await api.post(
        "/api/comments/createcomment",
        {
          postId,
          content,
          author: user?._id || user?.id, // Use actual user ID if available
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error creating comment:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create comment"
      );
    }
  }
);

export const addLike = createAsyncThunk(
  "/api/blogs/addLike",
  async (postId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Authentication required");
      }

      // Corrected endpoint
      const response = await api.post(
        `/api/blogs/like/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error adding like:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to add like"
      );
    }
  }
);

const initialState = {
  blogs: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  currentBlog: null,
};

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    setCurrentBlog: (state, action) => {
      state.currentBlog = action.payload;
    },
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
    resetBlogs: (state) => {
      state.blogs = [];
      state.status = "idle";
      state.error = null;
      state.currentBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        console.log("fetchBlogs.fulfilled - Action payload:", action.payload);
        state.status = "succeeded";
        state.blogs = Array.isArray(action.payload) ? action.payload : [];
        console.log(
          "fetchBlogs.fulfilled - State blogs after update:",
          state.blogs
        );
        state.error = null;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.blogs = []; // Reset blogs on error
      })
      // Fetch blog by ID
      .addCase(fetchBlogById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        console.log(
          "fetchBlogById.fulfilled - Action payload:",
          action.payload
        );
        state.status = "succeeded";
        if (action.payload) {
          state.currentBlog = action.payload;
        }
        state.error = null;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.currentBlog = null;
      })
      // Create blog
      .addCase(createBlog.fulfilled, (state, action) => {
        if (action.payload) {
          state.blogs = Array.isArray(state.blogs)
            ? [...state.blogs, action.payload]
            : [action.payload];
        }
      })
      // Update blog
      .addCase(updateBlog.fulfilled, (state, action) => {
        if (action.payload && Array.isArray(state.blogs)) {
          const index = state.blogs.findIndex(
            (blog) => blog.id === action.payload.id
          );
          if (index !== -1) {
            state.blogs[index] = action.payload;
          }
        }
      })
      // Delete blog
      .addCase(deleteBlog.fulfilled, (state, action) => {
        if (Array.isArray(state.blogs)) {
          state.blogs = state.blogs.filter(
            (blog) => blog.id !== action.payload
          );
        }
      })
      // Create comment
      .addCase(createComment.fulfilled, (state, action) => {
        if (action.payload && state.currentBlog) {
          // Add the new comment to the current blog
          if (!state.currentBlog.comments) {
            state.currentBlog.comments = [];
          }
          state.currentBlog.comments.push(action.payload.comment);
        }
      })
      // Add like
      .addCase(addLike.fulfilled, (state, action) => {
        if (action.payload && state.currentBlog) {
          // Update the likes count for the current blog
          state.currentBlog.likes = action.payload.post.likes;
        }
      });
  },
});

export const { setCurrentBlog, clearCurrentBlog, resetBlogs } =
  blogSlice.actions;

// Selectors
export const selectAllBlogs = (state) => {
  const blogs = state.blogs?.blogs;
  return Array.isArray(blogs) ? blogs : [];
};
export const selectBlogStatus = (state) => state.blogs?.status || "idle";
export const selectBlogError = (state) => state.blogs?.error || null;
export const selectCurrentBlog = (state) => state.blogs?.currentBlog || null;
export const selectCurrentUser = (state) => state.auth?.user || null;
export const selectAuthToken = (state) => state.auth?.token || null;

export default blogSlice.reducer;

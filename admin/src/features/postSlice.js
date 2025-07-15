// features/postSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

// Async thunk for fetching posts
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  try {
    const response = await api.get("/api/blogs/allblogs");
    return response.data.posts;
  } catch (error) {
    return error.response.data;
  }
});

export const fetchPostById = createAsyncThunk(
  "posts/blog",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/blogs/blog/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for creating a post
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (blogData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/api/blogs/createblog", blogData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating a post
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, blogData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(`/api/blogs/edit/${id}`, blogData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for deleting a post
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.delete(`/api/blogs/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for liking a post
export const addLike = createAsyncThunk(
  "posts/addLike",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/blogs/like/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    post: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading"; 
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded"; 
        state.posts = action.payload.data.posts; 
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed"; 
        state.error = action.payload;
      });
      // .addCase(createPost.pending, (state) => {
      //   state.status = "loading"; 
      // })
      // .addCase(createPost.fulfilled, (state, action) => {
      //   state.status = "succeeded"; 
      //   state.posts.push(action.payload);
      // })
      // .addCase(createPost.rejected, (state, action) => {
      //   state.status = "failed"; 
      //   state.error = action.payload; 
      // })
      // .addCase(updatePost.pending, (state) => {
      //   state.status = "loading"; 
      // })
      // .addCase(updatePost.fulfilled, (state, action) => {
      //   state.status = "succeeded"; 
      //   const index = state.posts.findIndex(
      //     (post) => post.id === action.payload.post._id
      //   );
      //   if (index !== -1) {
      //     state.posts[index] = action.payload.post; 
      //   }
      // })
      // .addCase(updatePost.rejected, (state, action) => {
      //   state.status = "failed"; 
      //   state.error = action.payload; 
      // })
      // .addCase(deletePost.pending, (state) => {
      //   state.status = "loading"; 
      // })
      // .addCase(deletePost.fulfilled, (state, action) => {
      //   state.status = "succeeded"; 
      //   state.posts = state.posts.filter((post) => post._id !== action.payload.post._id); 
      // })
      // .addCase(deletePost.rejected, (state, action) => {
      //   state.status = "failed"; 
      //   state.error = action.payload; 
      // });
      // .addCase(addLike.pending, (state) => {
      //   state.status = "loading"; 
      // })
      // .addCase(addLike.fulfilled, (state, action) => {
      //   state.status = "succeeded"; 
      //   const post = state.posts.find((post) => post.id === action.payload.id);
      //   if (post) {
      //     post.likes.push(action.payload.userId); 
      //   }
      // })
      // .addCase(addLike.rejected, (state, action) => {
      //   state.status = "failed"; 
      //   state.error = action.error.message;
      // });
  },
});

export default postSlice.reducer;

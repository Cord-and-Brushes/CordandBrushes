// src/features/bannerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

// Async thunk for uploading banner images
export const uploadBannerImages = createAsyncThunk(
  "banner/uploadImages",
  async (bannerData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/api/banners/uploadbanner", bannerData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for editing banner images
export const editBanner = createAsyncThunk(
  "banner/editImage",
  async ({ id, bannerData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(`/api/banners/edit/${id}`, bannerData, {
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

// Async thunk for deleting banner images
export const deleteBannerImage = createAsyncThunk(
  "banner/deleteImage",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.delete(`/api/banners/delete/${id}`, {
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

export const getBannerById = createAsyncThunk(
  "banner/getBannerById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/api/banners/banner/${id}`, {
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

// Async thunk for getting all banner images
export const getAllBannerImages = createAsyncThunk(
  "banner/getAllImages",
  async () => {
    try {
      const response = await api.get("/api/banners/allbanners");
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);

const bannerSlice = createSlice({
  name: "banner",
  initialState: {
    banners: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadBannerImages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadBannerImages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.banners = action.payload;
      })
      .addCase(uploadBannerImages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Handling for editBannerImage
      .addCase(editBanner.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editBanner.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Assuming the payload contains the updated banner data
        const index = state.banners.findIndex(
          (banner) => banner.id === action.payload.id
        );
        if (index !== -1) {
          state.banners[index] = action.payload;
        }
      })
      .addCase(editBanner.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Handling for deleteBannerImage
      .addCase(deleteBannerImage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteBannerImage.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.banners = state.banners.filter(
          (banner) => banner.id !== action.payload.id
        );
      })
      .addCase(deleteBannerImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getBannerById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBannerById.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.banners = [action.payload.banner];
      })
      .addCase(getBannerById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(getAllBannerImages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllBannerImages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.banners = action.payload;
      })
      .addCase(getAllBannerImages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default bannerSlice.reducer;

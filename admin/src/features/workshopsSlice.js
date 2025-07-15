import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api"; // Adjust the import path as necessary

// Async thunk to create a new workshop
export const createWorkshop = createAsyncThunk(
  "workshops/createWorkshop",
  async (formData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/api/workshops/addworkshop", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// Async thunk to update an existing workshop
export const updateWorkshop = createAsyncThunk(
  "workshops/updateWorkshop",
  async ({ id, formData }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(`/api/workshops/edit/${id}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Error updating live class"
      );
    }
  }
);

// Add a thunk to fetch all live classes (no location filter)
export const fetchAllWorkshops = createAsyncThunk(
  "workshops/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await api.get(`/api/workshops/getallworkshops`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Error fetching all live classes"
      );
    }
  }
);

const workshopsSlice = createSlice({
  name: "workshops",
  initialState: {
    workshops: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createWorkshop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkshop.fulfilled, (state, action) => {
        state.loading = false;
        state.workshops.push(action.payload);
      })
      .addCase(createWorkshop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateWorkshop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorkshop.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.workshop;
        if (!updated) return;
        const index = state.workshops.findIndex(
          (cls) => cls._id === updated._id
        );
        if (index !== -1) {
          state.workshops[index] = updated;
        }
      })
      .addCase(updateWorkshop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllWorkshops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllWorkshops.fulfilled, (state, action) => {
        state.loading = false;
        state.workshops = Array.isArray(action.payload)
          ? action.payload
          : action.payload.workshops || [];
        /* action.payload.workshops || action.payload.workshops || []; */
      })
      .addCase(fetchAllWorkshops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default workshopsSlice.reducer;

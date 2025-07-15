import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api"; // Adjust the import path as necessary

// Async thunk to fetch classes by location
export const fetchClassesByLocation = createAsyncThunk(
  "liveclasses/fetchByLocation",
  async (location, thunkAPI) => {
    try {
      const response = await api.get(
        `/api/liveclasses?location=${encodeURIComponent(location)}`
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Error fetching classes"
      );
    }
  }
);

// Async thunk to create a new live class
export const createLiveClass = createAsyncThunk(
  "liveclasses/createLiveClass",
  async (formData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/api/liveclasses/addclass", formData, {
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

// Async thunk to update an existing live class
export const updateLiveClass = createAsyncThunk(
  "liveclasses/updateLiveClass",
  async ({ id, formData }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(`/api/liveclasses/edit/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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
export const fetchAllLiveClasses = createAsyncThunk(
  "liveclasses/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await api.get(`/api/liveclasses/getclasses`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Error fetching all live classes"
      );
    }
  }
);

const liveclassesSlice = createSlice({
  name: "liveclasses",
  initialState: {
    classes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassesByLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassesByLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.classes =
          action.payload.liveClasses || action.payload.classes || [];
      })
      .addCase(fetchClassesByLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createLiveClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLiveClass.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally, add the new class to state.classes
        state.classes.push(action.payload);
      })
      .addCase(createLiveClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateLiveClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLiveClass.fulfilled, (state, action) => {
        /*  state.loading = false;
        const index = state.classes.findIndex(
          (cls) => cls._id === action.payload._id
        );
        if (index !== -1) {
          state.classes[index] = action.payload;
        } */
        state.loading = false;
        const updated = action.payload.liveClass;
        if (!updated) return;
        const index = state.classes.findIndex((cls) => cls._id === updated._id);
        if (index !== -1) {
          state.classes[index] = updated;
        }
      })
      .addCase(updateLiveClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllLiveClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLiveClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes =
          action.payload.liveClasses || action.payload.classes || [];
      })
      .addCase(fetchAllLiveClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default liveclassesSlice.reducer;

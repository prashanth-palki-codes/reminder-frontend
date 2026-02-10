import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

/* ✅ FETCH REMINDERS */
export const fetchReminders = createAsyncThunk(
  "reminders/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/reminders");
      return res.data;
    } catch (err: any) {
      return rejectWithValue("Failed to fetch reminders");
    }
  }
);

/* ✅ DELETE REMINDER (NAMED EXPORT) */
export const deleteReminder = createAsyncThunk(
  "reminders/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/reminders/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue("Failed to delete reminder");
    }
  }
);

/* ✅ UPDATE REMINDER (OPTIONAL – READY) */
export const updateReminder = createAsyncThunk(
  "reminders/update",
  async (
    { id, data }: { id: string; data: any },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(`/reminders/${id}`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue("Failed to update reminder");
    }
  }
);

const reminderSlice = createSlice({
  name: "reminders",
  initialState: {
    list: [] as any[],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReminders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReminders.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(deleteReminder.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (r) => r._id !== action.payload
        );
      })
      .addCase(updateReminder.fulfilled, (state, action) => {
        state.list = state.list.map((r) =>
          r._id === action.payload._id ? action.payload : r
        );
      });
  },
});

export default reminderSlice.reducer;

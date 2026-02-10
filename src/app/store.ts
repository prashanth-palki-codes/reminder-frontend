import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import reminderReducer from "../features/reminders/reminderSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    reminders: reminderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

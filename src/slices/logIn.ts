import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Log {
  step?: number;
  name: string;
}

const initialState: Log = {
  step: 0,
  name: "",
};

export const logInSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    log: (state, action: PayloadAction<Log>) => {
      state.name = action.payload.name;
      state.step = action.payload.step;
    },
  },
});

export const { log } = logInSlice.actions;

export default logInSlice.reducer;

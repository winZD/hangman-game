import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import getHighscores from "../services/getHighscores";
import { UserHighscore } from "../models/userHighscores";

const initialState: { data: UserHighscore[] } = {
  data: [],
};

export const getHighscoresThunk = createAsyncThunk(
  "highscore/getHighscoreThunk",
  async () => {
    const highscores = await getHighscores();
    return highscores;
  }
);

export const getHighscoresSlice = createSlice({
  name: "highscore",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getHighscoresThunk.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export default getHighscoresSlice.reducer;

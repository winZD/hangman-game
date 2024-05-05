import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HighscoreParams, postHighscore } from "../services/highscore";

interface Highscore {
  data: any;
}

const initialState: Highscore = {
  data: "",
};

export const highscoreThunk = createAsyncThunk(
  "highscore/postHighscoreThunk",
  async (args: HighscoreParams) => {
    await postHighscore(args);
  }
);

export const highscoreSlice = createSlice({
  name: "highscore",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(highscoreThunk.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export default highscoreSlice.reducer;

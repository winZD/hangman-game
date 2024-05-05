import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HighscoreParams } from "../services/highscore";
import getHighscores from "../services/getHighscores";

export interface UserHighscore {
  data: {
    id: number;
    quoteId: string;
    length: number;
    uniqueCharacters: number;
    userName: string;
    errors: number;
    duration: number;
  }[];
}

const initialState: UserHighscore = {
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
      state.data = [...action.payload];
    });
  },
});

export default getHighscoresSlice.reducer;

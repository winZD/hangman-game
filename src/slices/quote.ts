import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HighscoreParams } from "../services/highscore";
import getHighscores from "../services/getHighscores";
import getQuote from "../services/getQuote";

export interface Quote {
  _id: string;
  content: string;
  author: string;
  tags: string[];
  authorSlug: string;
  length: number;
  dateAdded: Date | null;
  dateModified: Date | null;
}

const initialState: Quote = {
  _id: "",
  content: "",
  author: "",
  tags: [],
  authorSlug: "",
  length: 0,
  dateAdded: null,
  dateModified: null,
};

export const getQuoteThunk = createAsyncThunk(
  "quote/getQuoteThunk",
  async () => {
    const quote = await getQuote();
    return quote;
  }
);

export const getQuoteSlice = createSlice({
  name: "quote",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getQuoteThunk.fulfilled, (state, action) => {
      state = { ...state, ...action.payload };
    });
  },
});

export default getQuoteSlice.reducer;

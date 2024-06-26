import { combineReducers } from "@reduxjs/toolkit";
import { logInSlice } from "./slices/logIn";
import highscore from "./slices/highscore";
import highscores from "./slices/highscores";
import quote from "./slices/quote";

const rootReducer = combineReducers({
  logIn: logInSlice.reducer,
  highscore: highscore,
  highscores: highscores,
  quote: quote,

  // Add other slices here
});

export default rootReducer;

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Button } from "@mantine/core";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import GameFigure from "./GameFigure";
import { postHighscore } from "../services/highscore";
import { highscoreThunk } from "../slices/highscore";

import { getQuoteThunk } from "../slices/quote";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const Game = () => {
  const logInData = useSelector((state: RootState) => state.logIn);
  const quotes = useSelector((state: RootState) => state.quote);
  const [quote, setQuote] = useState("");
  const [maskedQuote, setMaskedQuote] = useState("");
  const [errors, setErrors] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isUppercase, setUppercase] = useState(false);

  const [keyboardLetters, setKeyboardLetters] = useState([
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ]);

  const dispatch = useAppDispatch();
  /* 
  const [correctLetters, setCorrectLetters] = useState<string[]>([""]);
  const [wrongLetters, setWrongLetters] = useState<string[]>([""]); */

  const fetchText = async () => {
    try {
      const response = await axios.get("https://api.quotable.io/random");
      console.log(response);
      const { content } = response.data;
      setQuote(content);
      setMaskedQuote(content.replace(/[a-zA-Z]/g, "_"));
    } catch (error) {
      console.error(error);
    }
  };

  const handleLetterGuess = (letter: string) => {
    const lowerCaseLetter = letter.toLowerCase(); // Ensure the comparison is case-insensitive
    if (quote.includes(lowerCaseLetter)) {
      const newMaskedQuote = replaceUnderscores(maskedQuote, letter);
      setMaskedQuote(newMaskedQuote);
    } else {
      setErrors(errors + 1);
    }
  };

  const replaceUnderscores = (maskedQuote: string, guessedLetter: string) => {
    // Convert the maskedQuote to an array
    const maskedQuoteArray = maskedQuote.split("");

    // Iterate over the original quote
    for (let i = 0; i < quote.length; i++) {
      // If the original quote at this position matches the guessed letter
      // and the maskedQuote at this position is an underscore
      if (
        quote[i] ===
          (isUppercase ? guessedLetter.toUpperCase() : guessedLetter) &&
        maskedQuoteArray[i] === "_"
      ) {
        // Replace the underscore with the guessed letter

        maskedQuoteArray[i] = guessedLetter;
      }
    }
    if (maskedQuote.toLowerCase() === quote.toLowerCase()) {
      setGameWon(true);
      setTimerStarted(false);
      clearInterval(interval.current);
      alert("GAME WON");
    }
    // Convert the array back into a string

    return maskedQuoteArray.join("");
  };
  const [timer, setTimer] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);

  const interval = useRef<number>();

  useEffect(() => {
    interval.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    return () => clearInterval(interval.current);
  }, [timerStarted]);

  useEffect(() => {
    fetchText();
    dispatch(getQuoteThunk());
  }, [dispatch]);

  return (
    <>
      <div>
        {" "}
        <p>Timer: {timer}</p>
      </div>
      {gameWon && <p>Game won</p>}
      <div>
        <GameFigure errors={errors} />

        <h1>{logInData.name + " "}Enter the game</h1>
        <p>{maskedQuote}</p>
        <p>Errors: {errors}</p>

        <div>
          {keyboardLetters.map((letter) => (
            <button key={letter} onClick={() => handleLetterGuess(letter)}>
              {letter}
            </button>
          ))}
          <button
            style={{ background: isUppercase ? "green" : "red" }}
            onClick={() => setUppercase(!isUppercase)}
          >
            CAPS LOCK
          </button>
        </div>
        <Button disabled={errors >= 6} onClick={async () => await fetchText()}>
          Refresh
        </Button>
        <Button
          onClick={async () =>
            await dispatch(
              highscoreThunk({
                userName: "sas",
                duration: timer * 1000,
                errors: errors,
                quoteId: "",
                length: 2,
                uniqueCharacters: 2,
              })
            )
          }
        >
          Send highscore
        </Button>
        <Button
          onClick={() => {
            //setTimerStarted(false);
            clearInterval(interval.current);
          }}
        >
          STOP TImer
        </Button>
        {/*  <Button
          onClick={() => {
            setTimerStarted(true);
          }}
        >
          START TImer
        </Button> */}
      </div>
    </>
  );
};

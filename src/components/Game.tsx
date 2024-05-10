import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Button } from "@mantine/core";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import GameFigure from "./GameFigure";
import { highscoreThunk } from "../slices/highscore";

import { keyboardLetters } from "../models/letters";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const Game = () => {
  const logInData = useSelector((state: RootState) => state.logIn);
  const quotes = useSelector((state: RootState) => state.quote);
  const [quote, setQuote] = useState("");
  const [maskedQuote, setMaskedQuote] = useState("");
  const [errors, setErrors] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isUppercase, setUppercase] = useState(false);

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
    /* const lowerCaseLetter = letter.toLowerCase(); */
    const letterToUppercase = letter.toUpperCase(); // Ensure the comparison is case-insensitive
    /*  if (!isUppercase && quote.includes(lowerCaseLetter)) {
      console.log("LOWERCASE: ", lowerCaseLetter);
      const newMaskedQuote = replaceUnderscores(maskedQuote, lowerCaseLetter);
      setMaskedQuote(newMaskedQuote);
    } */
    if (quote.includes(letter)) {
      console.log("UPPERCASE: ", letter);
      const newMaskedQuote = replaceUnderscores(maskedQuote, letter);
      setMaskedQuote(newMaskedQuote);
    }
    if (
      !quote.includes(letter.toLowerCase()) &&
      !quote.includes(letter.toUpperCase())
    ) {
      // Increment the error count if the letter is not found and is not uppercase
      setErrors(errors + 1);
    }

    console.log(isUppercase ? letter.toUpperCase() : letter.toLowerCase());
  };

  const replaceUnderscores = (maskedQuote: string, guessedLetter: string) => {
    // Convert the maskedQuote to an array
    const maskedQuoteArray = maskedQuote.split("");

    // Iterate over the original quote
    for (let i = 0; i < quote.length; i++) {
      // If the original quote at this position matches the guessed letter
      // and the maskedQuote at this position is an underscore
      /*  if (
        quote[i] === guessedLetter.toLowerCase() &&
        maskedQuoteArray[i] === "_"
      ) {
        // Replace the underscore with the guessed letter

        maskedQuoteArray[i] = guessedLetter.toLowerCase();
      } */
      if (quote[i] === guessedLetter && maskedQuoteArray[i] === "_") {
        {
          maskedQuoteArray[i] = guessedLetter;
        }
      }
      if (
        quote[i] === guessedLetter.toUpperCase() &&
        maskedQuoteArray[i] === "_"
      ) {
        {
          maskedQuoteArray[i] = guessedLetter.toUpperCase();
        }
      }
    }
    if (maskedQuoteArray.join("").toUpperCase() === quote) {
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
    /* dispatch(getQuoteThunk()); */
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
        {maskedQuote.split("").map((char, index) =>
          char === "_" ? (
            <span style={{ padding: 2 }} key={index}>
              {"_"}
            </span>
          ) : (
            char
          )
        )}

        <p>Errors: {errors}</p>

        <div>
          <div>
            {keyboardLetters.slice(0, 13).map((letter) => (
              <button
                style={{ margin: 3 }}
                key={letter}
                onClick={() => handleLetterGuess(letter)}
              >
                {letter}
              </button>
            ))}
          </div>
          <div>
            {keyboardLetters.slice(13).map((letter) => (
              <button
                style={{ margin: 3 }}
                key={letter}
                onClick={() => handleLetterGuess(letter)}
              >
                {letter}
              </button>
            ))}
          </div>
          {/*   <button
            style={{ background: isUppercase ? "green" : "red" }}
            onClick={() => setUppercase(!isUppercase)}
          >
            CAPS LOCK
          </button> */}
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

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Badge, Button, Card, Group } from "@mantine/core";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import GameFigure from "./GameFigure";
import { highscoreThunk } from "../slices/highscore";

import { keyboardLetters } from "../models/letters";
import { getQuoteThunk } from "../slices/quote";
import { Quote } from "../models/quote";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const Game = () => {
  const logInData = useSelector((state: RootState) => state.logIn);
  const quotes = useSelector((state: RootState) => state.quote);
  const [quote, setQuote] = useState<Quote>();
  const [maskedQuote, setMaskedQuote] = useState<string>("");
  const [errors, setErrors] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isUppercase, setUppercase] = useState(false);

  const dispatch = useAppDispatch();

  /*   const fetchText = async () => {
    try {
      const response = await axios.get("https://api.quotable.io/random");
      console.log(response);
      const { content } = response.data;
      setQuote(content);
      setMaskedQuote(content.replace(/[a-zA-Z]/g, "_"));
    } catch (error) {
      console.error(error);
    }
  }; */

  const handleLetterGuess = (letter: string) => {
    if (
      quote?.content.includes(letter.toLowerCase()) ||
      quote?.content.includes(letter.toUpperCase())
    ) {
      const newMaskedQuote = replaceUnderscores(maskedQuote!, letter);
      setMaskedQuote(newMaskedQuote);
    }
    if (
      !quote?.content.includes(letter.toLowerCase()) &&
      !quote?.content.includes(letter.toUpperCase())
    ) {
      // Increment the error count if the letter is not found and is not uppercase
      setErrors(errors + 1);
    }

    console.log(isUppercase ? letter.toUpperCase() : letter.toLowerCase());
  };

  const replaceUnderscores = (maskedQuote: string, guessedLetter: string) => {
    // Convert the maskedQuote to an array
    const maskedQuoteArray = maskedQuote?.split("");

    for (let i = 0; i < quote!.content.length; i++) {
      if (
        quote?.content[i] === guessedLetter.toLowerCase() &&
        maskedQuoteArray[i] === "_"
      ) {
        {
          maskedQuoteArray[i] = guessedLetter.toLowerCase();
        }
      }
      if (
        quote?.content[i] === guessedLetter.toUpperCase() &&
        maskedQuoteArray[i] === "_"
      ) {
        {
          maskedQuoteArray[i] = guessedLetter.toUpperCase();
        }
      }
    }
    if (
      maskedQuoteArray.join("").toUpperCase() === quote?.content.toUpperCase()
    ) {
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

  function countUniqueCharacters(input: string): number {
    const lowerCaseInput = input.toLowerCase();
    const uniqueCharacters = new Set(lowerCaseInput.split(""));
    return uniqueCharacters.size;
  }
  useEffect(() => {
    /*  fetchText(); */
    dispatch(getQuoteThunk()).then((data) => {
      setQuote(data?.payload as Quote);
      setMaskedQuote(
        (data?.payload as Quote).content.replace(/[a-zA-Z]/g, "_")
      );
    });
  }, []);

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <div>
          {" "}
          <p>Timer: {timer}</p>
        </div>
        {gameWon && <p>Game won</p>}
        <div>
          <GameFigure errors={errors} />
          <h1>{logInData.name + " "}Enter the game</h1>
          {maskedQuote?.split("").map((char, index) =>
            char === "_" ? (
              <span style={{ padding: 2 }} key={index}>
                {"_"}
              </span>
            ) : (
              char
            )
          )}
          <p>
            <Badge color={errors ? "red" : "green"}>Errors: {errors}</Badge>
          </p>

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
          <Group justify="center">
            <Button
              mt="md"
              disabled={errors >= 6}
              onClick={async () => {
                await dispatch(getQuoteThunk()).then((data) => {
                  setQuote(data?.payload as Quote);
                  setMaskedQuote(
                    (data?.payload as Quote).content.replace(/[a-zA-Z]/g, "_")
                  );
                });
                setErrors(0);
                clearInterval(interval.current);
                setTimer(0);
                interval.current = setInterval(() => {
                  setTimer((prevTimer) => prevTimer + 1);
                }, 1000);
              }}
            >
              Refresh
            </Button>
            <Button
              mt="md"
              color={gameWon ? "green" : ""}
              disabled={!gameWon}
              onClick={async () =>
                await dispatch(
                  highscoreThunk({
                    userName: logInData.name,
                    duration: timer * 1000,
                    errors: errors,
                    quoteId: quote?._id || "",
                    length: quote?.length || 0,
                    uniqueCharacters: countUniqueCharacters(
                      quote?.content || ""
                    ),
                  })
                )
              }
            >
              Send highscore
            </Button>
          </Group>
          {/*   <Button
            onClick={() => {
              //setTimerStarted(false);
              clearInterval(interval.current);
            }}
          >
            STOP TImer
          </Button> */}
          {/*  <Button
          onClick={() => {
            setTimerStarted(true);
          }}
        >
          START TImer
        </Button> */}
        </div>
      </Card>
    </>
  );
};

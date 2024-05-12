import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useEffect, useRef, useState } from "react";
import { Badge, Button, Card, Group, Notification } from "@mantine/core";
import GameFigure from "./GameFigure";
import { highscoreThunk } from "../slices/highscore";
import { KEYBOARD_LETTERS, keyboardLetters } from "../models/letters";
import { getQuoteThunk } from "../slices/quote";
import { Quote } from "../models/quote";

import { Highscores } from "./Highscores";

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const Game = () => {
  const logInData = useSelector((state: RootState) => state.logIn);

  const [show, setShow] = useState<boolean>(false);
  const [quote, setQuote] = useState<Quote>();
  const [maskedQuote, setMaskedQuote] = useState<string>("");
  const [errors, setErrors] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isUppercase, setUppercase] = useState(false);

  const dispatch = useAppDispatch();

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

  const interval = useRef<NodeJS.Timeout | undefined>();

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
          {errors >= 6 && (
            <Notification
              closeButtonProps={{ "aria-label": "Hide notification" }}
              color="red"
              title="We notify you that"
              withCloseButton={false}
              withBorder
            >
              You lose!
            </Notification>
          )}
          <GameFigure errors={errors} />
          <h1>
            {"Player: " + (logInData.name.length ? logInData.name : "Guest")}
          </h1>
          {maskedQuote?.split("").map((char, index) =>
            char === "_" ? (
              <span style={{ padding: 2 }} key={index}>
                {"_"}
              </span>
            ) : (
              char
            )
          )}
          <div>
            <Badge color={errors ? "red" : "green"}>Errors: {errors}</Badge>
          </div>

          <div>
            {!isUppercase ? (
              <div>
                {keyboardLetters.slice(0, 13).map((letter) => (
                  <button
                    disabled={errors === 6}
                    style={{ margin: 3 }}
                    key={letter}
                    onClick={() => handleLetterGuess(letter)}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            ) : (
              <div>
                {KEYBOARD_LETTERS.slice(0, 13).map((letter) => (
                  <button
                    disabled={errors === 6}
                    style={{ margin: 3 }}
                    key={letter}
                    onClick={() => handleLetterGuess(letter)}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            )}
            {!isUppercase ? (
              <div>
                {keyboardLetters.slice(13).map((letter) => (
                  <button
                    disabled={errors === 6}
                    style={{ margin: 3 }}
                    key={letter}
                    onClick={() => handleLetterGuess(letter)}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            ) : (
              <div>
                {KEYBOARD_LETTERS.slice(13).map((letter) => (
                  <button
                    disabled={errors === 6}
                    style={{ margin: 3 }}
                    key={letter}
                    onClick={() => handleLetterGuess(letter)}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            )}
            {
              <button
                style={{ background: isUppercase ? "green" : "red" }}
                onClick={() => setUppercase(!isUppercase)}
              >
                CAPS LOCK
              </button>
            }
          </div>
          <Group justify="center">
            <Button
              mt="md"
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
            <Button
              mt="md"
              onClick={async () => {
                setShow(!show);
              }}
            >
              Show/hide scores
            </Button>
          </Group>
        </div>
      </Card>
      {show ? <Highscores /> : <div></div>}
    </>
  );
};

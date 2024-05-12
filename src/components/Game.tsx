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
  const [timer, setTimer] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const interval = useRef<NodeJS.Timeout | undefined>();
  const [show, setShow] = useState<boolean>(false);
  const [quote, setQuote] = useState<Quote>();
  const [maskedQuote, setMaskedQuote] = useState<string>("");
  const [errors, setErrors] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isUppercase, setUppercase] = useState(false);

  const dispatch = useAppDispatch();

  /**
   * Handles the guessing of letters by the user.
   *
   * @param {string} letter - The letter guessed by the user.
   *
   * This function checks if the guessed letter is present in the quote content, either in lowercase or uppercase.
   * If the letter is found, it replaces the corresponding underscore in the masked quote with the guessed letter.
   * If the letter is not found, it increments the error count.
   */
  const handleLetterGuess = (letter: string) => {
    if (
      quote?.content.includes(letter.toLowerCase()) ||
      quote?.content.includes(letter.toUpperCase())
    ) {
      // Replace underscores in the masked quote with the guessed letter
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
  };

  /**
   * Replaces underscores in the masked quote with the guessed letter(s).
   *
   * @param {string} maskedQuote - The current masked quote string.
   * @param {string} guessedLetter - The letter guessed by the user.
   *
   * This function iterates through the masked quote and the quote content simultaneously.
   * If the guessed letter matches a character in the quote content and the corresponding position in the masked quote is an underscore,
   * it replaces the underscore with the guessed letter. If the entire masked quote matches the original quote content after replacements,
   * it indicates that the game has been won, and it stops the timer.
   *
   * @returns {string} - The updated masked quote with underscores replaced by the guessed letter(s).
   */
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
    }

    // Convert the array back into a string

    return maskedQuoteArray.join("");
  };

  /**
   * Counts the number of unique characters in the given input string.
   *
   * @param {string} input - The input string to count unique characters from.
   * @returns {number} The number of unique characters in the input string.
   *
   * @example
   * countUniqueCharacters("Hello World"); // Returns 10
   * countUniqueCharacters("Programming"); // Returns 9
   */
  function countUniqueCharacters(input: string): number {
    const lowerCaseInput = input.toLowerCase(); // Convert the input to lowercase
    const uniqueCharacters = new Set(lowerCaseInput.split("")); // Create a Set from the split characters
    return uniqueCharacters.size; // Return the size of the Set, which represents the number of unique characters
  }

  /**
   * Sets up an interval that increments a timer every second when the component mounts
   * and clears the interval when the component unmounts or when the timer starts.
   * It also clears the interval if there are exactly 6 errors.
   */
  useEffect(() => {
    // Set up an interval that increments the timer every second
    interval.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
    // Cleanup function to clear the interval when the component unmounts or when the timer starts
    return () => clearInterval(interval.current);
  }, [timerStarted]);

  /**
   * Clears the interval if there are exactly 6 errors.
   * This is useful for stopping the timer when an error threshold is reached.
   */
  useEffect(() => {
    if (errors === 6) {
      clearInterval(interval.current);
    }
  }, [errors]);

  /**
   * Dispatches a thunk action to fetch a quote and updates the component's state
   * with the fetched quote and a masked version of the quote content.
   * The masked quote replaces all alphabetic characters with underscores.
   *
   * This effect runs once when the component mounts because it has an empty dependency array.
   */
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
                Caps Lock
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

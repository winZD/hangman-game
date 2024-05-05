import axios from "axios";

export interface HighscoreParams {
  quoteId: string;
  length: number;
  uniqueCharacters: number;
  userName: string;
  errors: number;
  duration: number;
}
export const postHighscore = async ({
  quoteId,
  length,
  uniqueCharacters,
  userName,
  errors,
  duration,
}: HighscoreParams) =>
  await axios.post(
    "https://my-json-server.typicode.com/stanko-ingemark/hang_the_wise_man_frontend_task/highscores",
    {
      quoteId,
      length,
      uniqueCharacters,
      userName,
      errors,
      duration,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

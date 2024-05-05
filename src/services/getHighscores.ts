import axios from "axios";

export interface UserHighscore {
  id: number;
  quoteId: string;
  length: number;
  uniqueCharacters: number;
  userName: string;
  errors: number;
  duration: number;
}

const getHighscores = async (): Promise<UserHighscore[]> => {
  const response = await axios.get<UserHighscore[]>(
    "https://my-json-server.typicode.com/stanko-ingemark/hang_the_wise_man_frontend_task/highscores",
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  // Return the data from the response
  return response.data;
};

export default getHighscores;

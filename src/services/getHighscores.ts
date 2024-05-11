import axios from "axios";
import { UserHighscore } from "../models/userHighscore";

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

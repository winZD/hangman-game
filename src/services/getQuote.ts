import axios from "axios";
import { Quote } from "../models/quote";

const getQuote = async () => {
  try {
    const response = await axios.get<Quote>("https://api.quotable.io/random");
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default getQuote;

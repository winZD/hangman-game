import axios from "axios";

export interface Quote {
  _id: string;
  content: string;
  author: string;
  tags: string[];
  authorSlug: string;
  length: number;
  dateAdded: Date;
  dateModified: Date;
}
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

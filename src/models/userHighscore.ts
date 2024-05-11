export interface UserHighscore {
  data: {
    id: number;
    quoteId: string;
    length: number;
    uniqueCharacters: number;
    userName: string;
    errors: number;
    duration: number;
  };
}

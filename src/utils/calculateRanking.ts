export const calculateRanking = (
  L: number,
  U: number,
  E: number,
  T: number
): number => {
  const baseScore = 100 / (1 + E);
  const uniqueLettersScore = U * 10;
  const quoteLengthScore = L * 5;
  const solvingTimeScore = 100 / T;

  return baseScore + uniqueLettersScore + quoteLengthScore + solvingTimeScore;
};

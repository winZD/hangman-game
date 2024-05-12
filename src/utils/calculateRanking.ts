/**
 * Calculates a ranking score based on several factors: length of the input, number of unique characters, number of errors, and duration.
 *
 * The scoring system is as follows:
 * - Base score is calculated as 100 divided by (1 plus the number of errors).
 * - Unique letters score is the number of unique characters multiplied by 10.
 * - Quote length score is the length of the input multiplied by 5.
 * - Solving time score is 100 divided by the duration.
 * The final score is the sum of these four scores.
 *
 * @param {number} length - The length of the input.
 * @param {number} uniqueCharacters - The number of unique characters in the input.
 * @param {number} errors - The number of errors in the input.
 * @param {number} duration - The duration taken to solve the input.
 * @returns {number} The calculated ranking score.
 *
 * @example
 * calculateRanking(10, 5, 2, 30); // Example usage
 */

export const calculateRanking = (
  length: number,
  uniqueCharacters: number,
  errors: number,
  duration: number
): number => {
  const baseScore = 100 / (1 + errors);
  const uniqueLettersScore = uniqueCharacters * 10;
  const quoteLengthScore = length * 5;
  const solvingTimeScore = 100 / duration;

  return baseScore + uniqueLettersScore + quoteLengthScore + solvingTimeScore;
};

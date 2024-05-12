import { calculateRanking } from "../utils/calculateRanking";

describe("calculateRanking", () => {
  it("should score solutions with fewer errors higher", () => {
    expect(calculateRanking(50, 20, 1, 30)).toBeGreaterThan(
      calculateRanking(50, 20, 2, 30)
    );
  });

  it("should score solutions with larger numbers of unique letters higher", () => {
    expect(calculateRanking(50, 25, 1, 30)).toBeGreaterThan(
      calculateRanking(50, 20, 1, 30)
    );
  });

  it("should score longer solutions higher", () => {
    expect(calculateRanking(60, 20, 1, 30)).toBeGreaterThan(
      calculateRanking(50, 20, 1, 30)
    );
  });

  it("should score faster solutions higher", () => {
    expect(calculateRanking(50, 20, 1, 20)).toBeGreaterThan(
      calculateRanking(50, 20, 1, 30)
    );
  });

  // Additional tests can be added here to cover more edge cases or specific scenarios.
});

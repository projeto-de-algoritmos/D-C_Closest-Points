import { expect, test, describe } from "vitest";
import { ClosestPair, Point } from "./lib";

const makeRandomArray = (length: number) =>
  Array.from({ length }, () => ({
    x: Math.floor(Math.random() * 100_000),
    y: Math.floor(Math.random() * 100_000),
  } as Point));

describe("Closest Pairs", () => {
  const solver = new ClosestPair();

  test("Small array", () => {
    const arr = makeRandomArray(20);

    expect(solver.conquer(arr)).toEqual(
      expect.arrayContaining(solver.bruteForce(arr))
    );
  });

  test("Medium array", () => {
    const arr = makeRandomArray(100);

    expect(solver.conquer(arr)).toEqual(
      expect.arrayContaining(solver.bruteForce(arr))
    );
  });

  test("Big array", () => {
    const arr = makeRandomArray(1000);

    expect(solver.conquer(arr)).toEqual(
      expect.arrayContaining(solver.bruteForce(arr))
    );
  });
});

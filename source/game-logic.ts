import itiriri from "itiriri";
import { possibleSolutions } from "./possible-solutions";
import { GuessedLetter, GuessedRow } from "./types";
import { pickTwo } from "./util";
import { validWords } from "./valid-words";

// https://stackoverflow.com/a/46700791
function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

// todo: reimplement better version. recursion? reduce?
export function colorGuess(solution: string, currentRow: string): GuessedRow {
  const remainingSolution = Array.from(solution);

  let answer: (GuessedLetter | null)[] = [null, null, null, null, null];

  [...currentRow].map((c, i) => {
    if (remainingSolution[i] == c) {
      answer[i] = { color: "green", letter: c };
      remainingSolution[i] = "_";
    }
  });
  [...currentRow].map((c, i) => {
    if (answer[i] == null) {
      const n = remainingSolution.indexOf(c);
      if (n != -1) {
        answer[i] = { color: "yellow", letter: c };
        remainingSolution[n] = "_";
      }
    }
  });
  [...currentRow].map((c, i) => {
    if (answer[i] == null) {
      answer[i] = { color: "gray", letter: c };
    }
  });

  const values = answer.filter(notEmpty);

  if (values.length != 5) {
    throw new Error("Error coloring guess");
  }
  return { letters: values };
}

export const isValidWord = (s: string) =>
  validWords.includes(s.toLowerCase()) ||
  possibleSolutions.includes(s.toLowerCase());

export const pickSolution = () => {
  const word = itiriri(possibleSolutions).shuffle().take(1).toArray()[0];
  if (typeof word == "string" && word.length == 5) {
    return word.toUpperCase();
  }
  throw new Error("Problem selecting word.");
};

export const chooseTwoTitleColors = () =>
  pickTwo(["yellow", "green", "gray", "white"]);

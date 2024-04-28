import { customAlphabet } from "nanoid";

const ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export const generateId = (chars: number) => {
  const nanoId = customAlphabet(ALPHABET, chars);

  return nanoId();
};

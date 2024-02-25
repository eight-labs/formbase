/* eslint-disable @typescript-eslint/no-explicit-any */
interface FlattenedObject {
  [key: string]: any;
}

export const flattenObject = (
  obj: Record<string, any>,
  parentKey = "",
): FlattenedObject => {
  let flattenedObj: FlattenedObject = {};

  for (const key in obj) {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const nestedObj = flattenObject(obj[key], `${parentKey}${key}.`);
      flattenedObj = { ...flattenedObj, ...nestedObj };
    } else {
      flattenedObj[`${parentKey}${key}`] = obj[key];
    }
  }

  return flattenedObj;
};

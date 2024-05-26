type FlattenedObject = Record<string, unknown>;

export const flattenObject = (
  obj: Record<string, unknown>,
  parentKey = '',
): FlattenedObject => {
  let flattenedObj: FlattenedObject = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        const nestedObj = flattenObject(
          value as Record<string, unknown>,
          `${parentKey}${key}.`,
        );
        flattenedObj = { ...flattenedObj, ...nestedObj };
      } else {
        flattenedObj[`${parentKey}${key}`] = value;
      }
    }
  }

  return flattenedObj;
};

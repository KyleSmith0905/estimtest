import { camelToKebab } from "./string";

const objectToAttributes = (object: Record<string, any>) => {
  const segmentedObject = Object.entries(object);

  let attributes = '';

  segmentedObject.forEach(([key, value]) => {
    const stringifiedValue = typeof value === 'string' ? value : JSON.stringify(value);

    const normalizedValue = stringifiedValue.replaceAll('"', '&quot;');
    const normalizedKey = camelToKebab(key);

    attributes = `${attributes} ${normalizedKey}="${normalizedValue}"`
  })

  return attributes;
}

export { objectToAttributes };
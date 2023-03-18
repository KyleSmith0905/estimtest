const splice = (originalText: string, insertionText: string, position: number) => {
  return originalText.substring(0, position) + insertionText + originalText.substring(position);
}

/**
 * Converts camel case text to kebab case text.
 * Sourced from {@link https://stackoverflow.com/a/63116134/13463861}
 */
const camelToKebab = (str: string) => {
  return str.split('').map((letter, idx) => {
    return letter.toUpperCase() === letter
     ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
     : letter;
  }).join('');
}

export { splice, camelToKebab };
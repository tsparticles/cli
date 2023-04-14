/**
 * This function is used to capitalize a string.
 *
 * @param str - the string to capitalize (e.g. "my-string" -\> "MyString")
 * @param split - the character used to split the string, if not provided the string will be considered a single word
 * @returns the capitalized string
 */
export function capitalize(str: string, split?: string): string {
    const words = split ? str.split(split) : [str];

    return words.map(w => w.replace(/./, c => c.toUpperCase())).join("");
}

/**
 * This function is used to camelcase a string.
 *
 * @param str - the string to camelcase (e.g. "my-string" -\> "myString")
 * @param split - the character used to split the string, if not provided the string will be considered a single word
 * @returns the camelized string
 */
export function camelize(str: string, split?: string): string {
    return capitalize(str, split).replace(/./, c => c.toLowerCase());
}

/**
 * This function is used to dash a string.
 *
 * @param str - the string to dash (e.g. "myString" -\> "my-string")
 * @returns the dashed string
 */
export function dash(str: string): string {
    const dashed = str.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`);

    return dashed.startsWith("-") ? dashed.substring(1) : dashed;
}

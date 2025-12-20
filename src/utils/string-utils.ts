/**
 * This function is used to capitalize a string.
 * @param str - the string to capitalize (e.g. "my-string" -\> "MyString")
 * @param splits - the characters used to split the string, if not provided the string will be considered a single word
 * @returns the capitalized string
 */
export function capitalize(str: string, ...splits: string[]): string {
    let res = str.replace(/./, c => c.toUpperCase());

    for (const split of splits) {
        res = res
            .split(split)
            .map(w => w.replace(/./, c => c.toUpperCase()))
            .join("");
    }

    return res;
}

/**
 * This function is used to camelcase a string.
 * @param str - the string to camelcase (e.g. "my-string" -\> "myString")
 * @param splits - the characters used to split the string, if not provided the string will be considered a single word
 * @returns the camelized string
 */
export function camelize(str: string, ...splits: string[]): string {
    return capitalize(str, ...splits).replace(/./, c => c.toLowerCase());
}

/**
 * This function is used to dash a string.
 * @param str - the string to dash (e.g. "myString" -\> "my-string")
 * @returns the dashed string
 */
export function dash(str: string): string {
    const index = 0,
        dashed = str.replace(/([A-Z])/g, g => `-${g[index]?.toLowerCase() ?? ""}`),
        startPos = 1;

    return dashed.startsWith("-") ? dashed.substring(startPos) : dashed;
}

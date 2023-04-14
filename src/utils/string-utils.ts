/**
 *
 * @param str -
 * @param split -
 * @returns the capitalized string
 */
export function capitalize(str: string, split?: string): string {
    if (split) {
        return str
            .split(split)
            .map(token => capitalize(token))
            .join("");
    } else {
        return str.replace(/./, c => c.toUpperCase());
    }
}

/**
 *
 * @param str -
 * @param split -
 * @returns the camelized string
 */
export function camelize(str: string, split?: string): string {
    const capitalized = capitalize(str, split);

    return capitalized.replace(/./, c => c.toLowerCase());
}

/**
 *
 * @param str -
 * @returns the dashed string
 */
export function dash(str: string): string {
    return str.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
}

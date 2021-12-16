export const MATCH_DIGITS_REGEX = /\d+/g;

export const stripToDigits = (value: string) =>
    value.match(MATCH_DIGITS_REGEX)?.join('');

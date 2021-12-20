import { IContactRaw, IContact } from './types';
import { stripToDigits } from '../../utilities/parse';

type PhoneNumberSpliceRangeT = [number, number];

const extractUsablePhoneNumberDigits = (
    digits: string,
    minDigits: number,
    maxDigits: number
): string | null =>
    digits.length == minDigits
        ? digits
        : digits.length == maxDigits
        ? digits.substring(1)
        : null;

const applyPhoneNumberFormatToUsableDigits = (
    usableDigits: string,
    spliceRanges: PhoneNumberSpliceRangeT[]
) => {
    const [area, prefix, line] = spliceRanges.map((range) =>
        usableDigits?.slice(...range)
    );

    return `(${area}) ${prefix}-${line}`;
};

export const formatPhoneNumber = (potentialPhoneNumber: string) => {
    const digits = stripToDigits(potentialPhoneNumber);
    const minDigits = 10;
    const maxDigits = 11;

    const usableDigits = extractUsablePhoneNumberDigits(
        digits,
        minDigits,
        maxDigits
    );

    if (!usableDigits) return null;

    const areaRange: PhoneNumberSpliceRangeT = [0, 3];
    const prefixRange: PhoneNumberSpliceRangeT = [3, 6];
    const lineRange: PhoneNumberSpliceRangeT = [6, 10];
    const spliceRanges: PhoneNumberSpliceRangeT[] = [
        areaRange,
        prefixRange,
        lineRange,
    ];

    return applyPhoneNumberFormatToUsableDigits(usableDigits, spliceRanges);
};

export const formatPhoneNumbers = (phoneNumbers: string[]) =>
    phoneNumbers.reduce<string[]>(
        (phoneNumbers, currentPhoneNumber) =>
            currentPhoneNumber
                ? [...phoneNumbers, formatPhoneNumber(currentPhoneNumber)]
                : phoneNumbers,
        []
    );

export class ContactFactory {
    static create = ({
        id,
        primaryPhoneNumber,
        secondaryPhoneNumber,
        firstName,
        nickName,
        lastName,
        primaryEmail,
        addressLine1,
    }: IContactRaw): IContact => ({
        id,
        name: `${nickName || firstName} ${lastName}`,
        email: `${primaryEmail}`,
        phones: formatPhoneNumbers([primaryPhoneNumber, secondaryPhoneNumber]),
        address: addressLine1,
    });
}

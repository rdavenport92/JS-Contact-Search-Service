import { IContactRaw, IContact } from '../types';
import { stripToDigits } from '../utilities/parse';

const formatPhoneNumber = (potentialPhoneNumber: string) => {
    const digits = stripToDigits(potentialPhoneNumber);
    const minDigits = 10;
    const maxDigits = 11;
    const areaRange = [0, 3];
    const prefixRange = [3, 6];
    const lineRange = [6, 10];

    const usableDigits =
        digits.length == minDigits
            ? digits
            : digits.length == maxDigits
            ? digits.substring(1)
            : null;

    const [area, prefix, line] = [areaRange, prefixRange, lineRange].map(
        (range) => usableDigits?.slice(...range)
    );

    return `(${area}) ${prefix}-${line}`;
};

const formatPhoneNumbers = (phoneNumbers: string[]) =>
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

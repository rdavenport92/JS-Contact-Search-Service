import { IContact, IContactRaw } from '../types';

const MATCH_DIGITS_REGEX = /\d+/g;

const stripToDigits = (value: string) =>
    value.match(MATCH_DIGITS_REGEX)?.join('');

const defaultMatcher = (
    query: string,
    contact: IContactRaw,
    contactField: string
) => contact[contactField].includes(query);

const phoneNumberMatcher = (
    query: string,
    contact: IContactRaw,
    contactField: string
) => {
    const cleanQuery = stripToDigits(query);
    const cleanPhoneNumber = stripToDigits(contact[contactField]);
    return cleanPhoneNumber.includes(cleanQuery);
};

const fullNameMatcher = (
    query: string,
    contact: IContactRaw,
    contactField: string
) => {
    const { lastName } = contact;
    const firstNamePart = contact[contactField];
    return `${firstNamePart} ${lastName}`.includes(query);
};

const queryMatcherMap = {
    default: defaultMatcher,
    primaryPhoneNumber: phoneNumberMatcher,
    secondaryPhoneNumber: phoneNumberMatcher,
    firstName: fullNameMatcher,
    nickName: fullNameMatcher,
};

const doesQueryMatchContactField = (query: string, contact: IContactRaw) =>
    !!Object.keys(contact).find((fieldToCheck) => {
        if (contact[fieldToCheck]) {
            const queryMatcher =
                queryMatcherMap[fieldToCheck] || queryMatcherMap.default;

            return queryMatcher(query, contact, fieldToCheck);
        }
    });

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

class ContactFactory {
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

export default (query: string, contacts: IContactRaw[]): IContact[] =>
    contacts.reduce<IContact[]>(
        (matchedContacts, currentContact) =>
            doesQueryMatchContactField(query, currentContact)
                ? [...matchedContacts, ContactFactory.create(currentContact)]
                : matchedContacts,
        []
    );

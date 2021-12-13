import { IContact, IContactDB } from '../types';

const defaultMatcher = (
    query: string,
    contact: IContactDB,
    contactField: string
) => contact[contactField].includes(query);

const phoneNumberMatcher = (
    query: string,
    contact: IContactDB,
    contactField: string
) => {
    const cleanQuery = query.match(/\d+/g)?.join('');
    const cleanPhoneNumber = contact[contactField].match(/\d+/g)?.join('');
    return cleanPhoneNumber.includes(cleanQuery);
};

const fullNameMatcher = (
    query: string,
    contact: IContactDB,
    contactField: string
) => {
    const { lastName } = contact;
    const firstNamePart = contact[contactField];
    return `${firstNamePart} ${lastName}`.includes(query);
};

const queryMatcher = {
    default: defaultMatcher,
    primaryPhoneNumber: phoneNumberMatcher,
    secondaryPhoneNumber: phoneNumberMatcher,
    firstName: fullNameMatcher,
    nickName: fullNameMatcher,
};

const doesQueryMatchContactField = (query: string, contact: IContactDB) =>
    !!Object.keys(contact).find((contactField) => {
        if (contact[contactField]) {
            const matcher = queryMatcher[contactField];
            if (matcher) {
                const isMatch = matcher(query, contact, contactField);
                if (isMatch) return true;
            }
            return queryMatcher.default(query, contact, contactField);
        }
    });

export const findContactsByQuery = (
    query: string,
    contacts: IContactDB[]
): IContact[] =>
    contacts.reduce<IContact[]>((matchedContacts, currentContact) => {
        const isMatch = doesQueryMatchContactField(query, currentContact);
        return isMatch
            ? [...matchedContacts, ContactFactory.create(currentContact)]
            : matchedContacts;
    }, []);

export class ContactFactory {
    static create({
        id,
        primaryPhoneNumber,
        secondaryPhoneNumber,
        firstName,
        nickName,
        lastName,
        primaryEmail,
        addressLine1,
    }: IContactDB): IContact {
        const formatPhoneNumber = (potentialPhoneNumber: string) => {
            const digits = potentialPhoneNumber.match(/\d+/g).join('');

            const usableDigits =
                digits.length == 10
                    ? digits
                    : digits.length == 11
                    ? digits.substring(1)
                    : null;

            const [area, prefix, line] = [
                usableDigits.slice(0, 3),
                usableDigits.slice(3, 6),
                usableDigits.slice(6, 10),
            ];

            return `(${area}) ${prefix}-${line}`;
        };

        const formatPhoneNumbers = (phoneNumbers: string[]) => {
            return phoneNumbers.reduce<string[]>(
                (phoneNumbers, currentPhoneNumber) => {
                    if (currentPhoneNumber) {
                        return [
                            ...phoneNumbers,
                            formatPhoneNumber(currentPhoneNumber),
                        ];
                    }

                    return phoneNumbers;
                },
                []
            );
        };

        return {
            id,
            name: `${nickName || firstName} ${lastName}`,
            email: `${primaryEmail}`,
            phones: formatPhoneNumbers([
                primaryPhoneNumber,
                secondaryPhoneNumber,
            ]),
            address: addressLine1,
        };
    }
}

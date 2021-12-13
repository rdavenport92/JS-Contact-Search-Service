import { IContact, IContactDB } from '../types';

const queryMatcher = {
    default(query: string, value: string) {
        return value.includes(query);
    },
    primaryPhoneNumber(query: string, value: string) {
        const cleanQuery = query.match(/\d+/g)?.join('');
        const cleanPhoneNumber = value.match(/\d+/g)?.join('');
        return cleanPhoneNumber.includes(cleanQuery);
    },
    secondaryPhoneNumber(query: string, value: string) {
        const cleanQuery = query.match(/\d+/g)?.join('');
        const cleanPhoneNumber = value.match(/\d+/g)?.join('');
        return cleanPhoneNumber.includes(cleanQuery);
    },
};

const doesQueryMatchContactField = (query: string, contact: IContactDB) =>
    !!Object.keys(contact).find((contactField) => {
        if (contact[contactField]) {
            if (queryMatcher[contactField]) {
                return queryMatcher[contactField](query, contact[contactField]);
            }
            return queryMatcher.default(query, contact[contactField]);
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
    static create(contact: IContactDB): IContact {
        const {
            id,
            primaryPhoneNumber,
            secondaryPhoneNumber,
            firstName,
            nickName,
            lastName,
            primaryEmail,
            addressLine1,
        } = contact;

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

import { IContact, IContactDB } from '../types';

const doesQueryMatchContactField = (query: string, contact: IContactDB) =>
    !!Object.keys(contact).find((contactField) =>
        contact[contactField].includes(query)
    );

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

        const formatPhoneNumbers = (phoneNumbers: string[]) => {
            return phoneNumbers.reduce<string[]>(
                (phoneNumbers, currentPhoneNumber) => {
                    if (currentPhoneNumber) {
                        const digits = currentPhoneNumber
                            .match(/\d+/g)
                            .join('');

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

                        return [...phoneNumbers, `(${area}) ${prefix}-${line}`];
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

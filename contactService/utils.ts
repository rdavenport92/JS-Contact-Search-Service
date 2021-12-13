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
        const { primaryPhoneNumber, secondaryPhoneNumber } = contact;

        const formatPhoneNumbers = (phoneNumbers: string[]) => {
            return phoneNumbers.reduce<string[]>(
                (phoneNumbers, currentPhoneNumber) => {
                    if (currentPhoneNumber) {
                        const [area, prefix, line] =
                            currentPhoneNumber.split('-');
                        return [...phoneNumbers, `(${area}) ${prefix}-${line}`];
                    }
                    return phoneNumbers;
                },
                []
            );
        };

        return {
            id: contact.id,
            name: `${contact.firstName} ${contact.lastName}`,
            email: `${contact.primaryEmail}`,
            phones: formatPhoneNumbers([
                primaryPhoneNumber,
                secondaryPhoneNumber,
            ]),
            address: contact.addressLine1,
        };
    }
}

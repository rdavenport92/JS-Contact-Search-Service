import { IContact, IContactDB } from '../types';


const formatContact = (
    contact: IContactDB
): IContact => (
    {
        id: contact.id,
        name: `${contact.firstName} ${contact.lastName}`,
        email: `${contact.primaryEmail}`,
        phones: [
        contact.primaryPhoneNumber,
        contact.secondaryPhoneNumber
        ],
        address: contact.addressLine1
    }
)


const doesQueryMatchContactField = (query: string, contact: IContactDB) => (
    !!Object.keys(contact).find(contactField => (
        contact[contactField].includes(query)
    ))
)


export const findContactsByQuery = (query: string, contacts: IContactDB[]): IContact[] => (
    contacts.reduce<IContact[]>((matchedContacts, currentContact) => {
        const isMatch = doesQueryMatchContactField(query, currentContact);
        return isMatch
            ? [...matchedContacts, formatContact(currentContact)]
                : matchedContacts
    }, [])
)

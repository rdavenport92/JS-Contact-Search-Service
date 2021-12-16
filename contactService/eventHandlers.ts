import {
    AddContactEventHandler,
    ContactID,
    IContactDB,
    ContactUpdateEventType,
    ChangeContactEventHandler,
    RemoveContactEventHandler,
} from '../types';

export const addContactUpdatesHandler = (
    onUpdates: AddContactEventHandler,
    getContactById: (id: ContactID) => Promise<IContactDB>,
    addToCache: (id: ContactID, contact: IContactDB) => IContactDB
) =>
    onUpdates(ContactUpdateEventType.ADD, async (id: ContactID) => {
        const contact = await getContactById(id);
        addToCache(id, contact);
    });

export const changeContactUpdatesHandler = (
    onUpdates: ChangeContactEventHandler,
    updateCache: (id: ContactID, field: string, value: string) => IContactDB
) => onUpdates(ContactUpdateEventType.CHANGE, updateCache);

export const removeContactUpdatesHandler = (
    onUpdates: RemoveContactEventHandler,
    removeFromCache: (id: ContactID) => number
) => onUpdates(ContactUpdateEventType.REMOVE, removeFromCache);

import {
    AddContactEventHandler,
    ContactID,
    IContactDB,
    ContactUpdateEventType,
    ChangeContactEventHandler,
    RemoveContactEventHandler,
    EventUnsubscriber,
    ContactEventHandler,
} from '../types';

const addContactUpdatesHandler = (
    onUpdates: AddContactEventHandler,
    getContactById: (id: ContactID) => Promise<IContactDB>,
    addToCache: (id: ContactID, contact: IContactDB) => IContactDB
) =>
    onUpdates(ContactUpdateEventType.ADD, async (id: ContactID) => {
        const contact = await getContactById(id);
        addToCache(id, contact);
    });

const changeContactUpdatesHandler = (
    onUpdates: ChangeContactEventHandler,
    updateCache: (id: ContactID, field: string, value: string) => IContactDB
) => onUpdates(ContactUpdateEventType.CHANGE, updateCache);

const removeContactUpdatesHandler = (
    onUpdates: RemoveContactEventHandler,
    removeFromCache: (id: ContactID) => number
) => onUpdates(ContactUpdateEventType.REMOVE, removeFromCache);

export default (
    onUpdates: ContactEventHandler,
    getContactById: (id: ContactID) => Promise<IContactDB>,
    addToCache: (id: ContactID, contact: IContactDB) => IContactDB,
    updateCache: (id: ContactID, field: string, value: string) => IContactDB,
    removeFromCache: (id: ContactID) => number
): EventUnsubscriber[] => [
    addContactUpdatesHandler(onUpdates, getContactById, addToCache),
    changeContactUpdatesHandler(onUpdates, updateCache),
    removeContactUpdatesHandler(onUpdates, removeFromCache),
];

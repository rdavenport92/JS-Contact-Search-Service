import {
    AddContactEventHandler,
    ContactID,
    IContactRaw,
    ContactUpdateEventType,
    ChangeContactEventHandler,
    RemoveContactEventHandler,
    EventUnsubscriber,
    ContactEventHandler,
} from '../types';

const addContactUpdatesHandler = (
    onUpdates: AddContactEventHandler,
    getContactById: (id: ContactID) => Promise<IContactRaw>,
    addToCache: (id: ContactID, contact: IContactRaw) => IContactRaw
) =>
    onUpdates(ContactUpdateEventType.ADD, async (id: ContactID) =>
        addToCache(id, await getContactById(id))
    );

const changeContactUpdatesHandler = (
    onUpdates: ChangeContactEventHandler,
    updateCache: (id: ContactID, field: string, value: string) => IContactRaw
) => onUpdates(ContactUpdateEventType.CHANGE, updateCache);

const removeContactUpdatesHandler = (
    onUpdates: RemoveContactEventHandler,
    removeFromCache: (id: ContactID) => number
) => onUpdates(ContactUpdateEventType.REMOVE, removeFromCache);

export default (
    onUpdates: ContactEventHandler,
    getContactById: (id: ContactID) => Promise<IContactRaw>,
    addToCache: (id: ContactID, contact: IContactRaw) => IContactRaw,
    updateCache: (id: ContactID, field: string, value: string) => IContactRaw,
    removeFromCache: (id: ContactID) => number
): EventUnsubscriber[] => [
    addContactUpdatesHandler(onUpdates, getContactById, addToCache),
    changeContactUpdatesHandler(onUpdates, updateCache),
    removeContactUpdatesHandler(onUpdates, removeFromCache),
];

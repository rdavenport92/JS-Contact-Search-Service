import {
    AddContactEventHandler,
    ContactID,
    IContactDB,
    ContactUpdateEventType,
    ChangeContactEventHandler,
    RemoveContactEventHandler,
    EventUnsubscriber,
    ICacheService,
    IContactAccessService,
    IContactUpdateEmitter,
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
    updates: IContactUpdateEmitter,
    service: IContactAccessService,
    cache: ICacheService<IContactDB>
): EventUnsubscriber[] => {
    const onUpdates = updates.on.bind(updates);

    return [
        addContactUpdatesHandler(onUpdates, service.getById, cache.add),
        changeContactUpdatesHandler(onUpdates, cache.update),
        removeContactUpdatesHandler(onUpdates, cache.remove),
    ];
};

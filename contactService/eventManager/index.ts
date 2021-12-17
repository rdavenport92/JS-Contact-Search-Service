import { IContactRaw } from '../contactHelper/types';
import {
    AddContactEventHandlerT,
    ChangeContactEventHandlerT,
    ContactEventHandlerT,
    ContactUpdateEventType,
    EventUnsubscriberT,
    RemoveContactEventHandlerT,
} from './types';

const addContactUpdatesHandler = (
    onUpdates: AddContactEventHandlerT,
    getContactById: (id: string) => Promise<IContactRaw>,
    addToCache: (id: string, contact: IContactRaw) => IContactRaw
) =>
    onUpdates(ContactUpdateEventType.ADD, async (id: string) =>
        addToCache(id, await getContactById(id))
    );

const changeContactUpdatesHandler = (
    onUpdates: ChangeContactEventHandlerT,
    updateCache: (id: string, field: string, value: string) => IContactRaw
) => onUpdates(ContactUpdateEventType.CHANGE, updateCache);

const removeContactUpdatesHandler = (
    onUpdates: RemoveContactEventHandlerT,
    removeFromCache: (id: string) => number
) => onUpdates(ContactUpdateEventType.REMOVE, removeFromCache);

export default class {
    static registerHandlers = (
        onUpdates: ContactEventHandlerT,
        getContactById: (id: string) => Promise<IContactRaw>,
        addToCache: (id: string, contact: IContactRaw) => IContactRaw,
        updateCache: (id: string, field: string, value: string) => IContactRaw,
        removeFromCache: (id: string) => number
    ): EventUnsubscriberT[] => [
        addContactUpdatesHandler(onUpdates, getContactById, addToCache),
        changeContactUpdatesHandler(onUpdates, updateCache),
        removeContactUpdatesHandler(onUpdates, removeFromCache),
    ];
}

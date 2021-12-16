// Start your code here!
// You should not need to edit any other existing files (other than if you would like to add tests)
// You do not need to import anything as all the necessary data and events will be delivered through
// updates and service, the 2 arguments to the constructor
// Feel free to add files as necessary

import {
    IContactAccessService,
    IContact,
    IContactDB,
    IContactSearchService,
    IContactUpdateEmitter,
    ICacheService,
    EventUnsubscriber,
    ContactEventHandler,
    ContactID,
} from '../types';
import ContactCacheService from '../cacheService';
import findContactsByQuery from './queryHelper';
import getEventHandlers from './eventHandlers';

export type RegisterEventHandlerT = (
    onUpdates: ContactEventHandler,
    getContactById: (id: ContactID) => Promise<IContactDB>,
    addToCache: (id: ContactID, contact: IContactDB) => IContactDB,
    updateCache: (id: ContactID, field: string, value: string) => IContactDB,
    removeFromCache: (id: ContactID) => number
) => EventUnsubscriber[];

type SearchEngineT = (query: string, contacts: IContactDB[]) => IContact[];
export default class implements IContactSearchService {
    private _contactCache: ICacheService<IContactDB>;
    private _subscriptions: EventUnsubscriber[];
    private _searchEngine: SearchEngineT;

    constructor(
        updates: IContactUpdateEmitter,
        service: IContactAccessService,
        cache: ICacheService<IContactDB> = new ContactCacheService(),
        registerEventHandlers: RegisterEventHandlerT = getEventHandlers,
        searchEngine: SearchEngineT = findContactsByQuery
    ) {
        this._contactCache = cache;
        this._searchEngine = searchEngine;
        this._subscriptions = registerEventHandlers(
            updates.on.bind(updates),
            service.getById,
            this._contactCache.add,
            this._contactCache.update,
            this._contactCache.remove
        );
    }

    search = (query: string): IContact[] =>
        this._searchEngine(query, this._contactCache.getAll());

    removeListeners = () => this._subscriptions.forEach((unsub) => unsub());
}

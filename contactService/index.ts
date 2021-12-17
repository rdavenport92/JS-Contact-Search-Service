// Start your code here!
// You should not need to edit any other existing files (other than if you would like to add tests)
// You do not need to import anything as all the necessary data and events will be delivered through
// updates and service, the 2 arguments to the constructor
// Feel free to add files as necessary

import {
    IContactAccessService,
    IContact,
    IContactRaw,
    IContactSearchService,
    IContactUpdateEmitter,
    ICacheService,
    EventUnsubscriber,
    ContactEventHandler,
    ContactID,
    ISearchEngine,
} from '../types';
import ContactCacheService from '../cacheService';
import contactSearchEngine from './searchEngine';
import registerContactUpdateEventHandlers from './eventHandlers';

export type RegisterEventHandlerT = (
    onUpdates: ContactEventHandler,
    getContactById: (id: ContactID) => Promise<IContactRaw>,
    addToCache: (id: ContactID, contact: IContactRaw) => IContactRaw,
    updateCache: (id: ContactID, field: string, value: string) => IContactRaw,
    removeFromCache: (id: ContactID) => number
) => EventUnsubscriber[];

export default class implements IContactSearchService {
    private _contactCache: ICacheService<IContactRaw>;
    private _subscriptions: EventUnsubscriber[];
    private _searchEngine: ISearchEngine<IContactRaw, IContact>;

    constructor(
        updates: IContactUpdateEmitter,
        service: IContactAccessService,
        cache: ICacheService<IContactRaw> = new ContactCacheService(),
        registerEventHandlers: RegisterEventHandlerT = registerContactUpdateEventHandlers,
        searchEngine: ISearchEngine<IContactRaw, IContact> = contactSearchEngine
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
        this._searchEngine.search(query, this._contactCache.getAll());

    removeListeners = () => this._subscriptions.forEach((unsub) => unsub());
}

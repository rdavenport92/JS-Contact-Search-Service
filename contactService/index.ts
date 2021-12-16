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
} from '../types';
import ContactCacheService from '../cacheService';
import findContactsByQuery from './queryHelper';
import {
    addContactUpdatesHandler,
    changeContactUpdatesHandler,
    removeContactUpdatesHandler,
} from './eventHandlers';

const _registerEventHandlers = (
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

export default class implements IContactSearchService {
    private _contactCache: ICacheService<IContactDB>;
    private _subscriptions: EventUnsubscriber[];
    private _searchEngine: (
        query: string,
        contacts: IContactDB[]
    ) => IContact[];

    constructor(
        updates: IContactUpdateEmitter,
        service: IContactAccessService,
        cache: ICacheService<IContactDB> = new ContactCacheService(),
        registerEventHandlers: (
            updates: IContactUpdateEmitter,
            service: IContactAccessService,
            cache: ICacheService<IContactDB>
        ) => EventUnsubscriber[] = _registerEventHandlers,
        searchEngine: (
            query: string,
            contacts: IContactDB[]
        ) => IContact[] = findContactsByQuery
    ) {
        this._contactCache = cache;
        this._searchEngine = searchEngine;

        this._subscriptions = registerEventHandlers(
            updates,
            service,
            this._contactCache
        );
    }

    search = (query: string): IContact[] =>
        this._searchEngine(query, this._contactCache.getAll());

    removeListeners = () => this._subscriptions.forEach((unsub) => unsub());
}

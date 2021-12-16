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
import { findContactsByQuery } from './utils';
import getEventHandlers from './eventHandlers';

export default class implements IContactSearchService {
    private _contactCache: ICacheService<IContactDB>;
    private _subscriptions: EventUnsubscriber[];

    constructor(
        updates: IContactUpdateEmitter,
        service: IContactAccessService,
        cache: ICacheService<IContactDB> = new ContactCacheService(),
        registerEventHandlers: (
            updates: IContactUpdateEmitter,
            service: IContactAccessService,
            cache: ICacheService<IContactDB>
        ) => EventUnsubscriber[] = getEventHandlers
    ) {
        this._contactCache = cache;

        this._subscriptions = registerEventHandlers(
            updates,
            service,
            this._contactCache
        );
    }

    search(query: string): IContact[] {
        return findContactsByQuery(query, this._contactCache.getAll());
    }

    removeListeners() {
        for (const unsub of this._subscriptions) {
            unsub();
        }
    }
}

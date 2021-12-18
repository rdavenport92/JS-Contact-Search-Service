// Start your code here!
// You should not need to edit any other existing files (other than if you would like to add tests)
// You do not need to import anything as all the necessary data and events will be delivered through
// updates and service, the 2 arguments to the constructor
// Feel free to add files as necessary

import ContactCacheService from '../cacheService';
import { ICacheService } from '../cacheService/types';
import { IContactAccessService, IContactSearchService } from './types';
import { IContact, IContactRaw } from './contactHelper/types';
import EventManager from './eventManager';
import {
    EventUnsubscriberT,
    IContactUpdateEmitter,
    RegisterEventHandlerT,
} from './eventManager/types';
import contactSearchEngine from './searchEngine';
import { ISearchEngine } from './searchEngine/types';

export default class implements IContactSearchService {
    private _contactCache: ICacheService<IContactRaw>;
    private _subscriptions: EventUnsubscriberT[];
    private _searchEngine: ISearchEngine<IContactRaw, IContact>;

    constructor(
        updates: IContactUpdateEmitter,
        service: IContactAccessService,
        cache: ICacheService<IContactRaw> = new ContactCacheService(),
        registerEventHandlers: RegisterEventHandlerT = EventManager.registerHandlers,
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

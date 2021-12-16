import NodeCache from 'node-cache';

import { ContactID, ICacheService, IContactDB } from '../types';

export default class ContactCacheService implements ICacheService<IContactDB> {
    private _cache: NodeCache;

    constructor(
        initialContactCacheContent: IContactDB[] = [],
        cache: NodeCache = new NodeCache()
    ) {
        this._cache = cache;
        this._initializeContactCache(initialContactCacheContent);
    }

    private _initializeContactCache(initialContactCacheContent: IContactDB[]) {
        for (const currentContact of initialContactCacheContent) {
            this.add(currentContact.id, currentContact);
        }
    }

    get = (id: ContactID) => this._cache.get<IContactDB>(id) || null;

    getAll = () =>
        this._cache.keys().map((key) => this._cache.get<IContactDB>(key));

    add = (id: ContactID, contact: IContactDB) =>
        this._cache.set(id, contact) && contact;

    remove = (id: ContactID) => this._cache.del(id);

    update = (id: ContactID, field: string, value: string) => {
        const contactToUpdate = this._cache.get<IContactDB>(id);

        if (!!contactToUpdate) {
            const updatedContact = {
                ...contactToUpdate,
                [field]: value,
            };

            this._cache.set(id, updatedContact);

            return updatedContact;
        }
    };
}

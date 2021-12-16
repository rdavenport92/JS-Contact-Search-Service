import NodeCache from 'node-cache';

import { ContactID, ICacheService, IContactRaw } from '../types';

export default class ContactCacheService implements ICacheService<IContactRaw> {
    private _cache: NodeCache;

    constructor(
        initialContactCacheContent: IContactRaw[] = [],
        cache: NodeCache = new NodeCache()
    ) {
        this._cache = cache;
        this._initializeContactCache(initialContactCacheContent);
    }

    private _initializeContactCache(initialContactCacheContent: IContactRaw[]) {
        for (const currentContact of initialContactCacheContent) {
            this.add(currentContact.id, currentContact);
        }
    }

    get = (id: ContactID) => this._cache.get<IContactRaw>(id) || null;

    getAll = () =>
        this._cache.keys().map((key) => this._cache.get<IContactRaw>(key));

    add = (id: ContactID, contact: IContactRaw) =>
        this._cache.set(id, contact) && contact;

    remove = (id: ContactID) => this._cache.del(id);

    update = (id: ContactID, field: string, value: string) => {
        const contactToUpdate = this._cache.get<IContactRaw>(id);

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

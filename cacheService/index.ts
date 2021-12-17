import NodeCache from 'node-cache';

import { ICacheService } from './types';

export default class CacheService<T extends { id: string }>
    implements ICacheService<T>
{
    private _cache: NodeCache;

    constructor(initialCache: T[] = [], cache: NodeCache = new NodeCache()) {
        this._cache = cache;
        this._initializeCache(initialCache);
    }

    private _initializeCache(initialCache: T[]) {
        for (const item of initialCache) {
            this.add(item.id, item);
        }
    }

    get = (id: string) => this._cache.get<T>(id) || null;

    getAll = () => this._cache.keys().map((key) => this._cache.get<T>(key));

    add = (id: string, item: T) => (this._cache.set(id, item) ? item : null);

    remove = (id: string) => this._cache.del(id);

    update = (id: string, field: string, value: string) => {
        const itemToUpdate = this._cache.get<T>(id);

        if (!!itemToUpdate) {
            const updatedItem = {
                ...itemToUpdate,
                [field]: value,
            };

            this._cache.set(id, updatedItem);

            return updatedItem;
        }
    };
}

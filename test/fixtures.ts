import { ICacheService } from '../cacheService/types';

export const testCacheServiceFactory = <T>(cache: Object): ICacheService<T> =>
    ({
        add(id: string, newItem: T) {
            cache[id] = newItem;
            return cache[id];
        },
        update(id: string, field: string, value: string) {
            cache[id][field] = value;
            return cache[id];
        },
        remove(id: string) {
            delete cache[id];
            return 1;
        },
    } as ICacheService<T>);

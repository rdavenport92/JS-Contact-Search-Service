export interface ICacheService<T> {
    get(id: string): T | null;

    getAll(): T[];

    add(id: string, newItem: T): T;

    remove(id: string): number;

    update(id: string, field: string, value: string): T;
}

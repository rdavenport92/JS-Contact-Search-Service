export type QueryObjectT<T> = {
    [K in QueryObjFieldT<T>]: T[K];
};

export type QueryObjFieldT<T> = keyof T & string;

export type QueryMatcherMapT<T> = {
    [K in QueryObjFieldT<T>]: QueryMatcherT<T>;
};

export type QueryMatcherT<T> = (
    query: string,
    obj: QueryObjectT<T>,
    field: QueryObjFieldT<T>
) => boolean;

export interface IQueryMatcherPlugin<T> {
    applicableQueryFields: QueryObjFieldT<T>[];
    match: QueryMatcherT<T>;
}

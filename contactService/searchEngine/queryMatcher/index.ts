import {
    IQueryMatcherPlugin,
    QueryMatcherMapT,
    QueryMatcherT,
    QueryObjectT,
    QueryObjFieldT,
} from './types';

const assignDefaultHandlers = <T>(
    matcherMap: QueryMatcherMapT<T>,
    currentField: QueryObjFieldT<T>,
    defaultMatchHandler: QueryMatcherT<T>
) =>
    matcherMap[currentField]
        ? matcherMap
        : { ...matcherMap, [currentField]: defaultMatchHandler };

const assignMatcherPluginHandlers = <T>(
    matcherPlugins: IQueryMatcherPlugin<T>[],
    initialMatcherMap: QueryMatcherMapT<T>
) => {
    for (const { applicableQueryFields, match: matchFn } of matcherPlugins) {
        for (const entry of applicableQueryFields) {
            initialMatcherMap[entry] = matchFn;
        }
    }

    return initialMatcherMap;
};

export const defaultMatcher = <T>(
    query: string,
    obj: QueryObjectT<T>,
    field: string
) => typeof obj[field] === 'string' && (obj[field] as string).includes(query);

export class QueryMatcherMapFactory {
    static create = <T>(
        objFields: QueryObjFieldT<T>[],
        matcherPlugins: IQueryMatcherPlugin<T>[],
        defaultMatchHandler: QueryMatcherT<T>
    ): QueryMatcherMapT<T> =>
        objFields.reduce((matcherMap, currentField) => {
            return assignDefaultHandlers(
                matcherMap,
                currentField,
                defaultMatchHandler
            );
        }, assignMatcherPluginHandlers(matcherPlugins, {} as QueryMatcherMapT<T>));
}

export default class QueryMatcher<T> {
    _queryMatcherMap: QueryMatcherMapT<T>;

    constructor(queryMatcherMap: QueryMatcherMapT<T>) {
        this._queryMatcherMap = queryMatcherMap;
    }

    match = (query: string, obj: QueryObjectT<T>): boolean =>
        !!Object.keys(this._queryMatcherMap).find((fieldToCheck) =>
            obj[fieldToCheck]
                ? this._queryMatcherMap[fieldToCheck](query, obj, fieldToCheck)
                : false
        );
}

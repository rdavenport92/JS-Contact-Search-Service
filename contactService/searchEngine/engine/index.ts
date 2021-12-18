import QueryMatcher from '../queryMatcher';
import { ISearchEngine } from '../types';

export default class<T1, T2 = T1> implements ISearchEngine<T1, T2> {
    private _queryMatcher: QueryMatcher<T1>;
    private _handleResult: (result: T1) => T2;

    constructor(
        queryMatcher: QueryMatcher<T1>,
        handleResult: (result: T1) => T2
    ) {
        this._queryMatcher = queryMatcher;
        this._handleResult = handleResult;
    }

    search = (query: string, contentToSearch: T1[]) =>
        contentToSearch.reduce<T2[]>(
            (results, currentContent) =>
                this._queryMatcher.match(query, currentContent)
                    ? [...results, this._handleResult(currentContent)]
                    : results,
            []
        );
}

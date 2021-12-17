import Contact from '../../accessLayer/model';
import QueryMatcher, {
    QueryMatcherMapFactory,
} from '../../utilities/queryMatcher';
import { ContactFactory } from '../contactHelper';
import { IContact, IContactRaw } from '../contactHelper/types';
import matcherPlugins from './matcherPlugins';
import { EngineSearchT } from './types';

class ContactSearchEngine {
    private _queryMatcher: QueryMatcher<IContactRaw>;

    constructor(queryMatcher: QueryMatcher<IContactRaw>) {
        this._queryMatcher = queryMatcher;
    }

    search: EngineSearchT<IContactRaw, IContact> = (
        query: string,
        contentToSearch: IContactRaw[],
        handleResult: (result: IContactRaw) => IContact = ContactFactory.create
    ) =>
        contentToSearch.reduce<IContact[]>(
            (results, currentContent) =>
                this._queryMatcher.match(query, currentContent)
                    ? [...results, handleResult(currentContent)]
                    : results,
            []
        );
}

const contactQueryMatcherMap = QueryMatcherMapFactory.create<IContactRaw>(
    Object.keys(new Contact()) as (keyof IContactRaw)[],
    matcherPlugins
);

export default new ContactSearchEngine(
    new QueryMatcher<IContactRaw>(contactQueryMatcherMap)
);

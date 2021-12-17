import Contact from '../../accessLayer/model';
import {
    IContactRaw,
    QueryObjFieldsT,
    IContact,
    ISearchEngine,
} from '../../types';
import QueryMatcher, {
    QueryMatcherMapFactory,
} from '../../utilities/queryMatcher';
import { ContactFactory } from '../contactHelper';
import matcherPlugins from './matcherPlugins';

class ContactSearchEngine implements ISearchEngine<IContactRaw, IContact> {
    private _queryMatcher: QueryMatcher<IContactRaw>;

    constructor(queryMatcher: QueryMatcher<IContactRaw>) {
        this._queryMatcher = queryMatcher;
    }

    search = (
        query: string,
        contentToSearch: IContactRaw[],
        handleResult = ContactFactory.create
    ) =>
        contentToSearch.reduce<IContact[]>(
            (matchedContacts, currentContact) =>
                this._queryMatcher.match(query, currentContact)
                    ? [...matchedContacts, handleResult(currentContact)]
                    : matchedContacts,
            []
        );
}

const contactQueryMatcherMap = QueryMatcherMapFactory.create<IContactRaw>(
    Object.keys(new Contact()) as QueryObjFieldsT<IContactRaw>,
    matcherPlugins
);

export default new ContactSearchEngine(
    new QueryMatcher<IContactRaw>(contactQueryMatcherMap)
);

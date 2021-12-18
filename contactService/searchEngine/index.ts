import Contact from '../../accessLayer/model';
import { ContactFactory } from '../contactHelper';
import { IContactRaw } from '../contactHelper/types';
import QueryMatcher, {
    defaultMatcher,
    QueryMatcherMapFactory,
} from './queryMatcher';
import matcherPlugins from './queryMatcher/plugins';
import Engine from './engine';

const fieldsToSearch = Object.keys(new Contact()) as (keyof IContactRaw)[];

const matcher = new QueryMatcher(
    QueryMatcherMapFactory.create(
        fieldsToSearch,
        matcherPlugins,
        defaultMatcher
    )
);

export default new Engine(matcher, ContactFactory.create);

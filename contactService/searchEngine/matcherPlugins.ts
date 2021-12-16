import { IQueryMatcherPlugin, IContactRaw } from '../../types';
import { stripToDigits } from '../../utilities/parse';

const contactFullNameMatcher: IQueryMatcherPlugin<IContactRaw> = {
    applicableQueryFields: ['firstName', 'nickName'],
    match: (query, entry, field) => {
        const { lastName } = entry;
        const firstNamePart = entry[field];
        return `${firstNamePart} ${lastName}`.includes(query);
    },
};

const contactPhoneNumberMatcher: IQueryMatcherPlugin<IContactRaw> = {
    applicableQueryFields: ['primaryPhoneNumber', 'secondaryPhoneNumber'],
    match: (query, entry, field) => {
        const cleanQuery = stripToDigits(query);
        const cleanPhoneNumber = stripToDigits(entry[field]);
        return cleanPhoneNumber.includes(cleanQuery);
    },
};

export default [contactFullNameMatcher, contactPhoneNumberMatcher];

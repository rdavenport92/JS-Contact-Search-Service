import { stripToDigits } from '../../../../utilities/parse';
import { IQueryMatcherPlugin } from '../types';
import { IContactRaw } from '../../../contactHelper/types';

const matcherPlugins: IQueryMatcherPlugin<IContactRaw>[] = [
    {
        applicableQueryFields: ['firstName', 'nickName'],
        match: (query, entry, field) => {
            const { lastName } = entry;
            const firstNamePart = entry[field];
            return `${firstNamePart} ${lastName}`.includes(query);
        },
    },
    {
        applicableQueryFields: ['primaryPhoneNumber', 'secondaryPhoneNumber'],
        match: (query, entry, field) => {
            const cleanQuery = stripToDigits(query);
            const cleanPhoneNumber = stripToDigits(entry[field]);
            return cleanPhoneNumber.includes(cleanQuery);
        },
    },
];

export default matcherPlugins;

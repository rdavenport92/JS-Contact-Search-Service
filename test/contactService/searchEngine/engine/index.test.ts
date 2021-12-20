import { expect } from 'chai';
import { Chance } from 'chance';
import QueryMatcher, {
    QueryMatcherMapFactory,
} from '../../../../contactService/searchEngine/queryMatcher';
import Engine from '../../../../contactService/searchEngine/engine';

const chance = new Chance();

const TEST_PROP = 'testProp';
const COMMON_PROP = 'name';
const COMMON_VALUE = chance.word();

const generateContentToSearch = (contentQty: number) =>
    chance.unique(chance.word, contentQty).map((testProp, index) => ({
        [COMMON_PROP]: `${COMMON_VALUE} ${index + 1}`,
        [TEST_PROP]: testProp.toLowerCase(),
    }));

const generateTestVars = ({ minContentQty = 5, maxContentQty = 15 } = {}) => {
    const contentLength = chance.integer({
        min: minContentQty,
        max: maxContentQty,
    });
    return {
        indexOfItemToFnd: chance.integer({ min: 0, max: contentLength - 1 }),
        contentToSearch: generateContentToSearch(contentLength),
    };
};

const createSearchEngine = ({
    fieldsToCheck = [] as string[],
    resultHandler = (result: any) => result,
} = {}) => {
    const testMatcher = new QueryMatcher(
        QueryMatcherMapFactory.create<{ [key: string]: string }>(
            fieldsToCheck,
            [],
            (query, obj, field) => obj[field].includes(query)
        )
    );
    return new Engine(testMatcher, resultHandler);
};

describe('Engine', () => {
    describe('search', () => {
        it('should use matcher dependency to find results', () => {
            const { indexOfItemToFnd: i, contentToSearch } = generateTestVars();
            const { [TEST_PROP]: testQuery } = contentToSearch[i];
            const searchEngine = createSearchEngine({
                fieldsToCheck: [TEST_PROP],
            });

            const result = searchEngine
                .search(testQuery, contentToSearch)
                .find(
                    (match) => match.testProp === contentToSearch[i].testProp
                );

            expect(result.testProp).to.equal(contentToSearch[i].testProp);
        });

        it('should return empty array if no matches found', () => {
            const { indexOfItemToFnd: i, contentToSearch } = generateTestVars();
            const { [TEST_PROP]: testQuery } = contentToSearch[i];
            const bogusQuery = `${testQuery}asdf1234`;
            const searchEngine = createSearchEngine({
                fieldsToCheck: [TEST_PROP],
            });

            const result = searchEngine.search(bogusQuery, contentToSearch);

            expect(result.length).to.equal(0);
        });

        it('should return all matches', () => {
            const { contentToSearch } = generateTestVars();
            const searchEngine = createSearchEngine({
                fieldsToCheck: [TEST_PROP, COMMON_PROP],
            });

            const result = searchEngine.search(COMMON_VALUE, contentToSearch);

            expect(result).to.deep.eq(contentToSearch);
        });

        it('should format results using result handler', () => {
            const { contentToSearch } = generateTestVars();
            const resultHandler = (result: {}) =>
                (result[COMMON_PROP] = result[COMMON_PROP].toUpperCase());
            const searchEngine = createSearchEngine({
                fieldsToCheck: [COMMON_PROP],
                resultHandler,
            });

            const result = searchEngine.search(COMMON_VALUE, contentToSearch);

            expect(result).to.deep.eq(
                contentToSearch.map((item) => resultHandler(item))
            );
        });
    });
});

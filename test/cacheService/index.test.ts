import { expect } from 'chai';
import Chance from 'chance';
import CacheService from '../../cacheService';
import uuid from '../../utilities/uuid';

const chance = new Chance();

const generateItems = (minItems: number = 1, maxItems: number = 1) =>
    [...Array(chance.integer({ min: minItems, max: maxItems }))].map(() => ({
        id: uuid(),
        prop: chance.word(),
    }));

describe('Cache Service', () => {
    describe('getAll', () => {
        it('should return all items in cache', () => {
            const initialItems = generateItems(5, 15);
            const testCache = new CacheService(initialItems);

            const result = testCache.getAll();

            expect(result).to.deep.equal(initialItems);
        });
    });
    describe('get', () => {
        it('should retrieve item by id', () => {
            const initialItems = generateItems();
            const testId = initialItems[0].id;
            const testCache = new CacheService(initialItems);

            const result = testCache.get(testId);

            expect(result).to.deep.equal(initialItems[0]);
        });

        it('should return null if item does not exist for the specified id', () => {
            const testCache = new CacheService();

            const result = testCache.get('invalid-id');

            expect(result).to.be.null;
        });
    });
    describe('add', () => {
        it('should add an item to cache with specified id as key', () => {
            const testItem = generateItems()[0];
            const testId = testItem.id;
            const testCache = new CacheService();

            testCache.add(testId, testItem);

            expect(testCache.get(testId)).to.deep.equal(testItem);
        });
        it('should return the item back to the caller', () => {
            const testItem = generateItems()[0];
            const testId = testItem.id;
            const testCache = new CacheService();

            const result = testCache.add(testId, testItem);

            expect(result).to.deep.equal(testItem);
        });
    });
    describe('update', () => {
        it('should update an item with new field by specified id', () => {
            const testItems = generateItems();
            const testItem = testItems[0];
            const testId = testItem.id;
            const testCache = new CacheService(testItems);
            const expectedProp = chance.word();

            testCache.update(testId, 'prop', expectedProp);

            expect(testCache.get(testId).prop).to.equal(expectedProp);
        });
        it('should return the item back to the caller', () => {
            const testItems = generateItems();
            const testItem = testItems[0];
            const testId = testItem.id;
            const testCache = new CacheService(testItems);
            const expectedProp = chance.word();

            const result = testCache.update(testId, 'prop', expectedProp);

            expect(result).to.deep.equal({
                ...testItem,
                prop: expectedProp,
            });
        });
    });
    describe('remove', () => {
        it('should remove an item by specified id', () => {
            const testItems = generateItems();
            const { id: testId } = testItems[0];
            const testCache = new CacheService(testItems);

            testCache.remove(testId);

            expect(testCache.get(testId)).to.be.null;
        });
        it('should return number of items deleted', () => {
            const testItems = generateItems();
            const testItem = testItems[0];
            const goodId = testItem.id;
            const bogusId = goodId + 1;
            const testIds = [
                { id: goodId, expectedResult: 1 },
                { id: bogusId, expectedResult: 0 },
            ];
            const testCache = new CacheService(testItems);

            for (const { id, expectedResult } of testIds) {
                const result = testCache.remove(id);
                expect(result).to.equal(expectedResult);
            }
        });
    });
    it('should initialize with no items in cache if no initial value specified', () => {
        const testCache = new CacheService();

        const result = testCache.getAll();

        expect(result.length).equals(0);
    });
});

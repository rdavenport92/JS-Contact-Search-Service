import { expect } from 'chai';
import Chance from 'chance';
import Contact from '../../accessLayer/model';

import ContactCacheService from '../../cacheService';
import { IContactDB } from '../../types';
import uuid from '../../utilities/uuid';

const chance = new Chance();

const generateContacts = (
    minContacts: number = 1,
    maxContacts: number = 1
): IContactDB[] =>
    [...Array(chance.integer({ min: minContacts, max: maxContacts }))].map(
        () => new Contact(uuid()) as IContactDB
    );

describe('Contact Cache', () => {
    describe('getAll', () => {
        it('should return all contacts in cache', () => {
            const initialContacts = generateContacts(5, 15);
            const testCache = new ContactCacheService(initialContacts);

            const result = testCache.getAll();

            expect(result).to.deep.equal(initialContacts);
        });
    });
    describe('get', () => {
        it('should retrieve a contact by id', () => {
            const initialContacts = generateContacts();
            const testId = initialContacts[0].id;
            const testCache = new ContactCacheService(initialContacts);

            const result = testCache.get(testId);

            expect(result).to.deep.equal(initialContacts[0]);
        });

        it('should return null if contact does not exist for the specified id', () => {
            const testCache = new ContactCacheService();

            const result = testCache.get('invalid-id');

            expect(result).to.be.null;
        });
    });
    describe('add', () => {
        it('should add a contact to cache with specified id as key', () => {
            const testContact = generateContacts()[0];
            const testId = testContact.id;
            const testCache = new ContactCacheService();

            testCache.add(testId, testContact);

            expect(testCache.get(testId)).to.deep.equal(testContact);
        });
        it('should return the contact back to the caller', () => {
            const testContact = generateContacts()[0];
            const testId = testContact.id;
            const testCache = new ContactCacheService();

            const result = testCache.add(testId, testContact);

            expect(result).to.deep.equal(testContact);
        });
    });
    describe('update', () => {
        it('should update a contact with new field by specified id', () => {
            const testContacts = generateContacts();
            const testContact = testContacts[0];
            const testId = testContact.id;
            const testCache = new ContactCacheService(testContacts);
            const expectedLastName = chance.word();

            testCache.update(testId, 'lastName', expectedLastName);

            expect(testCache.get(testId).lastName).to.equal(expectedLastName);
        });
        it('should return the contact back to the caller', () => {
            const testContacts = generateContacts();
            const testContact = testContacts[0];
            const testId = testContact.id;
            const testCache = new ContactCacheService(testContacts);
            const expectedLastName = chance.word();

            const result = testCache.update(
                testId,
                'lastName',
                expectedLastName
            );

            expect(result).to.deep.equal({
                ...testContact,
                lastName: expectedLastName,
            });
        });
    });
    describe('remove', () => {
        it('should remove a contact by specified id', () => {
            const testContacts = generateContacts();
            const { id: testId } = testContacts[0];
            const testCache = new ContactCacheService(testContacts);

            testCache.remove(testId);

            expect(testCache.get(testId)).to.be.null;
        });
        it('should return number of items deleted', () => {
            const testContacts = generateContacts();
            const testContact = testContacts[0];
            const goodId = testContact.id;
            const bogusId = goodId + 1;
            const testIds = [
                { id: goodId, expectedResult: 1 },
                { id: bogusId, expectedResult: 0 },
            ];
            const testCache = new ContactCacheService(testContacts);

            for (const { id, expectedResult } of testIds) {
                const result = testCache.remove(id);
                expect(result).to.equal(expectedResult);
            }
        });
    });
    it('should initialize with no contacts in cache if no initial value specified', () => {
        const testCache = new ContactCacheService();

        const result = testCache.getAll();

        expect(result.length).equals(0);
    });
});

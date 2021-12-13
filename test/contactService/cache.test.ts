import { expect } from 'chai';
import Chance from 'chance';
import Contact from '../../accessLayer/model';

import ContactCache from '../../contactService/cache';
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
            const testCache = new ContactCache(initialContacts);

            const result = testCache.getAll();

            expect(result).to.deep.equal(initialContacts);
        });
    });
    describe('get', () => {
        it('should retrieve a contact by id', () => {
            const initialContacts = generateContacts();
            const testId = initialContacts[0].id;
            const testCache = new ContactCache(initialContacts);

            const result = testCache.get(testId);

            expect(result).to.deep.equal(initialContacts[0]);
        });

        it('should return null if contact does not exist for the specified id', () => {
            const testCache = new ContactCache();

            const result = testCache.get('invalid-id');

            expect(result).to.be.null;
        });
    });
    describe('add', () => {
        it('should add a contact to cache with specified id as key', () => {
            const testContact = generateContacts()[0];
            const testId = testContact.id;
            const testCache = new ContactCache();

            testCache.add(testId, testContact);

            expect(testCache.get(testId)).to.deep.equal(testContact);
        });
        it('should return the contact back to the caller', () => {
            const testContact = generateContacts()[0];
            const testId = testContact.id;
            const testCache = new ContactCache();

            const result = testCache.add(testId, testContact);

            expect(result).to.deep.equal(testContact);
        });
    });
    describe('update', () => {
        it('should update a contact with new field by specified id', () => {
            const testContacts = generateContacts();
            const testContact = testContacts[0];
            const testId = testContact.id;
            const testCache = new ContactCache(testContacts);
            const expectedLastName = chance.word();

            testCache.update(testId, 'lastName', expectedLastName);

            expect(testCache.get(testId).lastName).to.equal(expectedLastName);
        });
        it('should return the contact back to the caller', () => {
            const testContacts = generateContacts();
            const testContact = testContacts[0];
            const testId = testContact.id;
            const testCache = new ContactCache(testContacts);
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
    it('initializes with no contacts in cache if no initial value specified', () => {
        const testCache = new ContactCache();

        const result = testCache.getAll();

        expect(result.length).equals(0);
    });
});

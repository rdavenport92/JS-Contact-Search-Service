import { expect } from 'chai';
import Chance from 'chance';
import { IContactRaw } from '../../../contactService/contactHelper/types';
import EventManager from '../../../contactService/eventManager';
import {
    ContactEventHandlerT,
    ContactUpdateEventType,
} from '../../../contactService/eventManager/types';
import uuid from '../../../utilities/uuid';
import { testCacheServiceFactory } from '../../fixtures';

const mockOnUpdatesFactory = (
    mockId: string,
    eventTypeToTest: ContactUpdateEventType,
    ...rest: any
) =>
    ((
        eventType: ContactUpdateEventType,
        cb: (id: string, ...rest: any) => any
    ) =>
        eventTypeToTest === eventType &&
        cb(mockId, ...rest)) as ContactEventHandlerT;

const eventManagerRegisterHandlersFactory =
    ({
        onUpdates = (() => null) as ContactEventHandlerT,
        getContactById = (id: string) => Promise.resolve({} as IContactRaw),
        addToCache = (id: string, newItem: IContactRaw) => ({} as IContactRaw),
        updateCache = (id: string, field: string, value: string) =>
            ({} as IContactRaw),
        removeFromCache = (id: string): number => null,
    } = {}) =>
    () =>
        EventManager.registerHandlers(
            onUpdates,
            getContactById,
            addToCache,
            updateCache,
            removeFromCache
        );

const flushPromises = () => Promise.resolve();
const chance = new Chance();

describe('EventManager', () => {
    describe('registerHandlers', () => {
        let mockId: string;
        let mockContact: IContactRaw;

        beforeEach(() => {
            mockId = `${uuid()}`;
            mockContact = {
                id: mockId,
                lastName: chance.word(),
            } as IContactRaw;
        });

        describe('ADD Contact Event', () => {
            it('should add contact retrieved by id to cache', async () => {
                const testCache = {};
                const testCacheService =
                    testCacheServiceFactory<IContactRaw>(testCache);
                const mockGetContactById = (id: string): Promise<IContactRaw> =>
                    Promise.resolve(id === mockContact.id ? mockContact : null);
                const mockOnUpdates = mockOnUpdatesFactory(
                    mockId,
                    ContactUpdateEventType.ADD
                );
                const registerHandlers = eventManagerRegisterHandlersFactory({
                    onUpdates: mockOnUpdates,
                    getContactById: mockGetContactById,
                    addToCache: testCacheService.add,
                });

                registerHandlers();

                await flushPromises();
                expect(testCache[mockId]).to.deep.eq(mockContact);
            });
        });

        describe('CHANGE Contact Event', () => {
            it('should update contact in cache by id', () => {
                const updatedFirstName = chance.word();
                const testCache = { [mockId]: mockContact };
                const testCacheService =
                    testCacheServiceFactory<IContactRaw>(testCache);
                const mockOnUpdates = mockOnUpdatesFactory(
                    mockId,
                    ContactUpdateEventType.CHANGE,
                    'firstName',
                    updatedFirstName
                );
                const registerHandlers = eventManagerRegisterHandlersFactory({
                    onUpdates: mockOnUpdates,
                    updateCache: testCacheService.update,
                });

                registerHandlers();

                expect(testCache[mockId].firstName).to.equal(updatedFirstName);
            });
        });

        describe('REMOVE Contact Event', () => {
            it('should remove contact from cache by id', () => {
                const testCache = { [mockId]: mockContact };
                const testCacheService =
                    testCacheServiceFactory<IContactRaw>(testCache);
                const mockOnUpdates = mockOnUpdatesFactory(
                    mockId,
                    ContactUpdateEventType.REMOVE
                );
                const registerHandlers = eventManagerRegisterHandlersFactory({
                    onUpdates: mockOnUpdates,
                    removeFromCache: testCacheService.remove,
                });

                registerHandlers();

                expect(testCache[mockId]).to.be.undefined;
            });
        });

        it('should return unsubscription handlers', () => {
            const ADD_SYMBOL = Symbol('ADD');
            const CHANGE_SYMBOL = Symbol('CHANGE');
            const REMOVE_SYMBOL = Symbol('REMOVE');
            const testUnsubMap = {
                [ContactUpdateEventType.ADD]: () => ADD_SYMBOL,
                [ContactUpdateEventType.CHANGE]: () => CHANGE_SYMBOL,
                [ContactUpdateEventType.REMOVE]: () => REMOVE_SYMBOL,
            };
            const registerHandlers = eventManagerRegisterHandlersFactory({
                onUpdates: (eventType: ContactUpdateEventType) =>
                    testUnsubMap[eventType],
            });

            const result = registerHandlers();

            expect(result.map((unsub) => unsub())).to.have.members([
                ADD_SYMBOL,
                CHANGE_SYMBOL,
                REMOVE_SYMBOL,
            ]);
        });
    });
});

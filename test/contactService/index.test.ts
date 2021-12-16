import { expect } from 'chai';
import { Chance } from 'chance';
import ContactService from '../../contactService';
import {
    EventUnsubscriber,
    ICacheService,
    IContactAccessService,
    IContactDB,
    IContactUpdateEmitter,
} from '../../types';

const chance = new Chance();

describe('Contact Service', () => {
    describe('removeListeners', () => {
        it('should call all unsubscribers', () => {
            const testResults = { unsubscriptionCount: 0 };
            const unsubscriberQty = chance.integer({ min: 5, max: 10 });
            const testUnsubscribers = Array(unsubscriberQty)
                .fill(0)
                .map(() => () => {
                    testResults.unsubscriptionCount += 1;
                });

            const mockEventRegister: (
                updates: IContactUpdateEmitter,
                service: IContactAccessService,
                cache: ICacheService<IContactDB>
            ) => EventUnsubscriber[] = () =>
                testUnsubscribers as unknown as EventUnsubscriber[];

            const contactService = new ContactService(
                {} as IContactUpdateEmitter,
                {} as IContactAccessService,
                {} as ICacheService<IContactDB>,
                mockEventRegister
            );

            contactService.removeListeners();

            expect(testResults.unsubscriptionCount).to.equal(unsubscriberQty);
        });
    });
});

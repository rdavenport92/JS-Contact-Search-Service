// Start your code here!
// You should not need to edit any other existing files (other than if you would like to add tests)
// You do not need to import anything as all the necessary data and events will be delivered through
// updates and service, the 2 arguments to the constructor
// Feel free to add files as necessary

import {
    ContactUpdateEventType,
    IContactAccessService,
    IContact,
    IContactDB,
    IContactSearchService,
    IContactUpdateEmitter,
    ICache,
    ContactID,
} from '../types';
import ContactCache from './cache';
import { findContactsByQuery } from './utils';

export default class implements IContactSearchService {
    private _contactCache: ICache<IContactDB>;

    constructor(
        updates: IContactUpdateEmitter,
        service: IContactAccessService,
        cache: ICache<IContactDB> = new ContactCache()
    ) {
        this._contactCache = cache;

        // TODO: setup initial cache
        this._registerAccessLayerListeners(updates, service);
    }

    private _registerAccessLayerListeners(
        updates: IContactUpdateEmitter,
        service: IContactAccessService
    ) {
        updates.on(ContactUpdateEventType.ADD, async (id: ContactID) => {
            const contact = await service.getById(id);
            this._contactCache.add(id, contact);
        });

        updates.on(
            ContactUpdateEventType.CHANGE,
            (id: ContactID, field: string, value: string) => {
                this._contactCache.update(id, field, value);
            }
        );

        updates.on(ContactUpdateEventType.REMOVE, (id: ContactID) => {
            this._contactCache.remove(id);
        });
    }

    search(query: string): IContact[] {
        return findContactsByQuery(query, this._contactCache.getAll());
    }
}

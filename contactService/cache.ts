import { ContactID, IContactCacheContent, ICache, IContactDB } from '../types';

export default class ContactCache implements ICache<IContactDB> {
    private _content: IContactCacheContent = {};

    constructor(initialContactCacheContent: IContactDB[] = []) {
        this._initializeContactCache(initialContactCacheContent);
    }

    private _initializeContactCache(initialContactCacheContent: IContactDB[]) {
        for (const currentContact of initialContactCacheContent) {
            this.add(currentContact.id, currentContact);
        }
    }

    get(id: ContactID) {
        return !!this._content[id]
            ? {
                  ...this._content[id],
              }
            : null;
    }

    getAll() {
        return Object.keys(this._content).map(
            (itemKey) => this._content[itemKey]
        );
    }

    add(id: ContactID, contact: IContactDB) {
        this._content[id] = contact;
        return this._content[id];
    }

    remove(id: ContactID) {
        // TODO: implement
        return {} as IContactDB;
    }

    update(id: ContactID, field: string, value: string) {
        if (!!this._content[id]) {
            const updatedContact = {
                ...this._content[id],
                [field]: value,
            };
            this._content[id] = updatedContact;
            return this._content[id];
        }
    }
}

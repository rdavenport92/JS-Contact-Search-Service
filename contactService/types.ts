import { ContactID, IContactRaw, IContact } from './contactHelper/types';

export interface IContactAccessService {
    getById(id: ContactID): Promise<IContactRaw | null>;
}

export interface IContactSearchService {
    search: (query: string) => IContact[];
}

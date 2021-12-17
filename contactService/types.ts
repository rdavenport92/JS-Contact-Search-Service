import { IContactRaw, IContact } from './contactHelper/types';

export interface IContactAccessService {
    getById(id: string): Promise<IContactRaw | null>;
}

export interface IContactSearchService {
    search: (query: string) => IContact[];
}

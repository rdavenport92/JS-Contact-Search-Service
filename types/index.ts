// Contact update event types

export type EventUnsubscriber = () => void;

export enum ContactUpdateEventType {
    ADD = 'add',
    REMOVE = 'remove',
    CHANGE = 'change',
}

export type AddContactEventHandler = (id: string) => void;
export type RemoveContactEventHandler = (id: string) => unknown;
export type ChangeContactEventHandler = (
    id: string,
    field: string,
    value: string
) => unknown;

type AddContactEvent = (
    event: ContactUpdateEventType.ADD,
    listener: AddContactEventHandler
) => EventUnsubscriber;

type RemoveContactEvent = (
    event: ContactUpdateEventType.REMOVE,
    listener: RemoveContactEventHandler
) => EventUnsubscriber;

type ChangeContactEvent = (
    event: ContactUpdateEventType.CHANGE,
    listener: ChangeContactEventHandler
) => EventUnsubscriber;

export type ContactEvent = AddContactEvent &
    RemoveContactEvent &
    ChangeContactEvent;

export interface IContactUpdateEmitter {
    listeners: {
        [ContactUpdateEventType.ADD]: AddContactEventHandler[];
        [ContactUpdateEventType.REMOVE]: RemoveContactEventHandler[];
        [ContactUpdateEventType.CHANGE]: ChangeContactEventHandler[];
    };

    emit(
        event: ContactUpdateEventType.ADD | ContactUpdateEventType.REMOVE,
        id: string
    ): void;
    emit(
        event: ContactUpdateEventType.CHANGE,
        id: string,
        field: string,
        value: string
    ): void;

    on: ContactEvent;
}

// Contact access types

export type ContactID = string;

export interface IContactDB {
    id: ContactID;
    firstName: string;
    lastName: string;
    nickName: string;
    primaryPhoneNumber: string;
    secondaryPhoneNumber: string;
    primaryEmail: string;
    secondaryEmail: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface IContact {
    id: ContactID;
    name: string;
    email: string;
    phones: Array<string>;
    address: string;
}

export interface IContactAccessService {
    getById(id: ContactID): Promise<IContactDB | null>;
}

// Contact search types

export interface IContactSearchService {
    search: (query: string) => IContact[];
}

// Cache types

export interface ICache<T> {
    get(id: string): T | null;

    getAll(): T[];

    add(id: string, newItem: T): T;

    remove(id: string): number;

    update(id: string, field: string, value: string): T;
}

export interface IContactCacheContent {
    [key: ContactID]: IContactDB;
}

// Contact update event types

export enum ContactUpdateEventType {
    ADD = 'add',
    REMOVE = 'remove',
    CHANGE = 'change',
}

type AddContactEventListener = (id: string) => void;
type RemoveContactEventListener = (id: string) => void;
type ChangeContactEventListener = (
    id: string,
    field: string,
    value: string
) => void;

export type AddContactEventHandler = (
    event: ContactUpdateEventType.ADD,
    listener: AddContactEventListener
) => EventUnsubscriber;

export type RemoveContactEventHandler = (
    event: ContactUpdateEventType.REMOVE,
    listener: RemoveContactEventListener
) => EventUnsubscriber;

export type ChangeContactEventHandler = (
    event: ContactUpdateEventType.CHANGE,
    listener: ChangeContactEventListener
) => EventUnsubscriber;

export type ContactEventHandler = AddContactEventHandler &
    RemoveContactEventHandler &
    ChangeContactEventHandler;

export interface IContactUpdateEmitter {
    listeners: {
        [ContactUpdateEventType.ADD]: AddContactEventListener[];
        [ContactUpdateEventType.REMOVE]: RemoveContactEventListener[];
        [ContactUpdateEventType.CHANGE]: ChangeContactEventListener[];
    };

    emit(event: ContactUpdateEventType.ADD, id: ContactID): void;
    emit(event: ContactUpdateEventType.REMOVE, id: ContactID): void;
    emit(
        event: ContactUpdateEventType.CHANGE,
        id: ContactID,
        field: string,
        value: string
    ): void;

    on: ContactEventHandler;
}

export type EventUnsubscriber = () => void;

// Contact types

export type ContactID = string;

export interface IContactRaw {
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
    getById(id: ContactID): Promise<IContactRaw | null>;
}

export interface IContactSearchService {
    search: (query: string) => IContact[];
}

// Cache types

export interface ICacheService<T> {
    get(id: string): T | null;

    getAll(): T[];

    add(id: string, newItem: T): T;

    remove(id: string): number;

    update(id: string, field: string, value: string): T;
}

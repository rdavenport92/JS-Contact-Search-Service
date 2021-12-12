// Contact update event types

export enum ContactUpdateEventType {
    ADD = 'add',
    REMOVE = 'remove',
    CHANGE = 'change'
}

export type AddContactEventHandler = (id: string) => unknown;
export type RemoveContactEventHandler = (id: string) => unknown;
export type ChangeContactEventHandler = (id: string, field: string, value: string) => unknown;

export type EventUnsubscriber = () => void;


export interface IContactUpdateService {
    listeners: {
        [ContactUpdateEventType.ADD]: AddContactEventHandler[],
        [ContactUpdateEventType.REMOVE]: RemoveContactEventHandler[],
        [ContactUpdateEventType.CHANGE]: ChangeContactEventHandler[]
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

    on(
        event: ContactUpdateEventType.ADD,
        listener: AddContactEventHandler
    ): EventUnsubscriber;
    on(
        event: ContactUpdateEventType.REMOVE,
        listener: RemoveContactEventHandler
    ): EventUnsubscriber;
    on(
        event: ContactUpdateEventType.CHANGE,
        listener: ChangeContactEventHandler
    ): EventUnsubscriber;
}


// Contact access types

export type ContactID = string;

export interface IContactDB {
    id: ContactID
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


export interface IContactCache {
    [key: ContactID]: IContactDB;
}

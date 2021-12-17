import { ContactID, IContactRaw } from '../contactHelper/types';

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

export type RegisterEventHandlerT = (
    onUpdates: ContactEventHandler,
    getContactById: (id: ContactID) => Promise<IContactRaw>,
    addToCache: (id: ContactID, contact: IContactRaw) => IContactRaw,
    updateCache: (id: ContactID, field: string, value: string) => IContactRaw,
    removeFromCache: (id: ContactID) => number
) => EventUnsubscriber[];

export type EventUnsubscriber = () => void;

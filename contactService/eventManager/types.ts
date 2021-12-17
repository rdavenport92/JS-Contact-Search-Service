import { IContactRaw } from '../contactHelper/types';

export enum ContactUpdateEventType {
    ADD = 'add',
    REMOVE = 'remove',
    CHANGE = 'change',
}

type AddContactEventListenerT = (id: string) => void;
type RemoveContactEventListenerT = (id: string) => void;
type ChangeContactEventListenerT = (
    id: string,
    field: string,
    value: string
) => void;

export type AddContactEventHandlerT = (
    event: ContactUpdateEventType.ADD,
    listener: AddContactEventListenerT
) => EventUnsubscriberT;

export type RemoveContactEventHandlerT = (
    event: ContactUpdateEventType.REMOVE,
    listener: RemoveContactEventListenerT
) => EventUnsubscriberT;

export type ChangeContactEventHandlerT = (
    event: ContactUpdateEventType.CHANGE,
    listener: ChangeContactEventListenerT
) => EventUnsubscriberT;

export type ContactEventHandlerT = AddContactEventHandlerT &
    RemoveContactEventHandlerT &
    ChangeContactEventHandlerT;

export interface IContactUpdateEmitter {
    listeners: {
        [ContactUpdateEventType.ADD]: AddContactEventListenerT[];
        [ContactUpdateEventType.REMOVE]: RemoveContactEventListenerT[];
        [ContactUpdateEventType.CHANGE]: ChangeContactEventListenerT[];
    };

    emit(event: ContactUpdateEventType.ADD, id: string): void;
    emit(event: ContactUpdateEventType.REMOVE, id: string): void;
    emit(
        event: ContactUpdateEventType.CHANGE,
        id: string,
        field: string,
        value: string
    ): void;

    on: ContactEventHandlerT;
}

export type RegisterEventHandlerT = (
    onUpdates: ContactEventHandlerT,
    getContactById: (id: string) => Promise<IContactRaw>,
    addToCache: (id: string, contact: IContactRaw) => IContactRaw,
    updateCache: (id: string, field: string, value: string) => IContactRaw,
    removeFromCache: (id: string) => number
) => EventUnsubscriberT[];

export type EventUnsubscriberT = () => void;

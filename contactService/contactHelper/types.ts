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

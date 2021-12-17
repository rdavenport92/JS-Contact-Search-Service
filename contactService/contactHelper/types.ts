export interface IContactRaw {
    id: string;
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
    id: string;
    name: string;
    email: string;
    phones: Array<string>;
    address: string;
}

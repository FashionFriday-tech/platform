export interface Address {
  id: string;
  name: string;
  phone: string;
  altPhone?: string;
  pincode: string;
  addressLine1: string;
  addressLine2: string;
  landmark?: string;
  city: string;
  district: string;
  state: string;
  type: 'Home' | 'Work';
  isDefault: boolean;
}

export interface PincodeAPIResponse {
  Status: string;
  PostOffice:
    | {
        State: string;
        District: string;
      }[]
    | null;
}

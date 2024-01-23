export interface MerchantData {
  owner: string;
  name: string;
  street: string;
  number: string;
  postcode: string;
  country: string;
  latitude: number;
  longitude: number;
  description: string;
  city: string;
  phoneNumber: string;
  openingHours: { [key: string]: string };
  timezone: string;
}

export interface MerchantMetadata {
  name: string;
  symbol: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  properties: {
    files: Array<{
      uri: string;
      type: string;
      cdn?: boolean;
    }>;
    category: string;
  };
}

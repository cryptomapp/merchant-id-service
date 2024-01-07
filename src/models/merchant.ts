export interface MerchantData {
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

export interface MerchantMetadata extends MerchantData {
  imageUrl: string;
}

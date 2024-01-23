import mongoose from "mongoose";

const merchantSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  name: { type: String, required: true },
  street: { type: String, required: true },
  number: { type: String, required: true },
  postcode: { type: String, required: true },
  country: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  description: { type: String, required: true },
  city: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  openingHours: {
    type: Map,
    of: String,
  },
  timezone: { type: String, required: true },
  image: { type: String, required: false },
});

// Interface to represent a merchant document in MongoDB
export interface MerchantDocument extends Document {
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
  openingHours: Map<string, string>;
  timezone: string;
  image?: string;
}

export const Merchant = mongoose.model("Merchant", merchantSchema);

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

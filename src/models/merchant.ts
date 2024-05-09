import mongoose, { Document } from "mongoose";

const merchantSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  name: { type: String, required: true },
  street: { type: String, required: true },
  number: { type: String, required: true },
  postcode: { type: String, required: true },
  country: { type: String, required: true },
  description: { type: String, required: true },
  city: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  openingHours: {
    type: Map,
    of: String,
  },
  timezone: { type: String, required: true },
  image: { type: String, required: false },
  categories: { type: [String], required: true },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

// Ensure the schema uses 2dsphere index for GeoJSON location field
merchantSchema.index({ location: "2dsphere" });
merchantSchema.index(
  { name: "text", description: "text", categories: "text" },
  { default_language: "none" }
);

// Interface to represent a merchant document in MongoDB, updated with the location field
export interface MerchantDocument extends Document {
  owner: string;
  name: string;
  street: string;
  number: string;
  postcode: string;
  country: string;
  description: string;
  city: string;
  phoneNumber: string;
  openingHours: Map<string, string>;
  timezone: string;
  image?: string;
  categories?: string[];
  location: {
    type: string;
    coordinates: number[];
  };
}

export const Merchant = mongoose.model<MerchantDocument>(
  "Merchant",
  merchantSchema
);

export interface MerchantData {
  owner: string;
  name: string;
  street: string;
  number: string;
  postcode: string;
  country: string;
  description: string;
  city: string;
  phoneNumber: string;
  openingHours: { [key: string]: string };
  timezone: string;
  categories?: string[];
  location: {
    type: string;
    coordinates: number[];
  };
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

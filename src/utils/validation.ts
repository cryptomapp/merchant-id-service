import { MerchantData } from "../models/merchant";

const isValidAddress = (address: string): boolean => {
  return address.trim().length > 0;
};

export const isValidMerchantData = (data: MerchantData): boolean => {
  // Validate name, street, number, postcode, country (not empty)
  if (
    !isValidAddress(data.name) ||
    !isValidAddress(data.street) ||
    !isValidAddress(data.number) ||
    !isValidAddress(data.postcode) ||
    !isValidAddress(data.country)
  ) {
    console.log("Invalid address-related fields.");
    return false;
  }

  // Validate latitude and longitude (basic checks)
  if (
    typeof data.latitude !== "number" ||
    data.latitude < -90 ||
    data.latitude > 90 ||
    typeof data.longitude !== "number" ||
    data.longitude < -180 ||
    data.longitude > 180
  ) {
    console.log("Invalid latitude and/or longitude.");
    return false;
  }

  if (!isValidAddress(data.city) || !isValidAddress(data.phoneNumber)) {
    console.log("Invalid city or phone number.");
    return false;
  }

  // Validate openingHours (ensure every day of the week is covered)
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  for (let day of daysOfWeek) {
    if (!data.openingHours[day]) {
      console.log(`Missing opening hours for ${day}.`);
      return false;
    }
  }

  // Validate description (up to 300 characters)
  if (typeof data.description !== "string" || data.description.length > 300) {
    console.log("Invalid description.");
    return false;
  }

  // If all validations pass
  return true;
};

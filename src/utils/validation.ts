import { MerchantData } from "../models/merchant";
import moment from "moment-timezone";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const isValidAddress = (address: string): boolean => {
  return address.trim().length > 0;
};

const isValidLatitude = (latitude: number): boolean => {
  return typeof latitude === "number" && latitude >= -90 && latitude <= 90;
};

const isValidLongitude = (longitude: number): boolean => {
  return typeof longitude === "number" && longitude >= -180 && longitude <= 180;
};

const isValidLocation = (location: {
  type: string;
  coordinates: number[];
}): boolean => {
  if (!location || location.type !== "Point") return false;
  const [longitude, latitude] = location.coordinates;
  return isValidLatitude(latitude) && isValidLongitude(longitude);
};

const isValidOpeningHourFormat = (hours: string): boolean => {
  // Assuming format like "9am-5pm" or "Closed"
  // todo: 9:15am-5:30pm must be valid
  const hoursRegex = /^([1-9]|1[0-2])(am|pm)-([1-9]|1[0-2])(am|pm)$|^Closed$/;
  return hoursRegex.test(hours.trim());
};

const hasValidOpeningHours = (openingHours: {
  [key: string]: string;
}): boolean => {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return daysOfWeek.every((day) => {
    const hours = openingHours[day] || "";
    return hours && isValidOpeningHourFormat(hours);
  });
};

const isValidTimezone = (timezone: string): boolean => {
  return moment.tz.zone(timezone) ? true : false; // Check if the timezone is known to moment-timezone
};

const isValidDescription = (description: string): boolean => {
  const trimmedDescription = description.trim();
  return trimmedDescription.length >= 50 && trimmedDescription.length <= 500;
};

export const isValidMerchantData = (data: MerchantData): boolean => {
  if (
    !isValidAddress(data.name) ||
    !isValidAddress(data.street) ||
    !isValidAddress(data.number) ||
    !isValidAddress(data.postcode) ||
    !isValidAddress(data.country) ||
    !isValidAddress(data.city) ||
    !isValidLocation(data.location) ||
    !hasValidOpeningHours(data.openingHours) ||
    !isValidDescription(data.description) ||
    !isValidTimezone(data.timezone)
  ) {
    return false;
  }
  return true;
};

import { isValidMerchantData } from "../../src/utils/validation";
import { MerchantData } from "../../src/models/merchant";

describe.only("isValidMerchantData", () => {
  const baseValidData: MerchantData = {
    name: "Test Store",
    street: "123 Test St",
    number: "10A",
    postcode: "12345",
    country: "Testland",
    location: {
      type: "Point",
      coordinates: [-74.006, 40.7128], // Note: [longitude, latitude]
    },
    description: "A test store description that is under 300 characters.",
    city: "Test City",
    phoneNumber: "+12345678901",
    openingHours: {
      Monday: "9am-5pm",
      Tuesday: "9am-5pm",
      Wednesday: "9am-5pm",
      Thursday: "9am-5pm",
      Friday: "9am-5pm",
      Saturday: "9am-5pm",
      Sunday: "9am-5pm",
    },
    timezone: "Europe/Paris",
    owner: "HyZWBzi5EH9mm7FFhpAHQArm5JyY1KPeWgSxMN6YZdJy",
  };

  test("should return true for valid merchant data", () => {
    expect(isValidMerchantData(baseValidData)).toBe(true);
  });

  test("should return false for invalid name", () => {
    const invalidNameData = { ...baseValidData, name: "" };
    expect(isValidMerchantData(invalidNameData)).toBe(false);
  });

  test("should return false for invalid phone number", () => {
    const invalidPhoneData = {
      ...baseValidData,
      phoneNumber: "NotAPhoneNumber",
    };
    expect(isValidMerchantData(invalidPhoneData)).toBe(false);
  });

  test("should return false for invalid timezone", () => {
    const invalidTimezoneData = { ...baseValidData, timezone: "NotATimezone" };
    expect(isValidMerchantData(invalidTimezoneData)).toBe(false);
  });

  test("should return false for latitude just below valid range", () => {
    const invalidLatitudeData = { ...baseValidData, latitude: -90.1 };
    expect(isValidMerchantData(invalidLatitudeData)).toBe(false);
  });

  test("should return false for longitude just above valid range", () => {
    const invalidLongitudeData = { ...baseValidData, longitude: 180.1 };
    expect(isValidMerchantData(invalidLongitudeData)).toBe(false);
  });

  test("should return true for latitude at the edge of valid range", () => {
    const edgeLatitudeData = { ...baseValidData, latitude: -90 };
    expect(isValidMerchantData(edgeLatitudeData)).toBe(true);
  });

  test("should return false for invalid opening hours format", () => {
    const invalidHours = {
      ...baseValidData,
      openingHours: { ...baseValidData.openingHours, Monday: "24:00-25:00" },
    };
    expect(isValidMerchantData(invalidHours)).toBe(false);
  });

  test("should return false for missing opening hours", () => {
    const missingHours = {
      ...baseValidData,
      openingHours: { ...baseValidData.openingHours, Monday: "" }, // missing hours
    };
    expect(isValidMerchantData(missingHours)).toBe(false);
  });

  test("should return false for empty description", () => {
    const emptyDescriptionData = { ...baseValidData, description: "" };
    expect(isValidMerchantData(emptyDescriptionData)).toBe(false);
  });

  test("should return false for description exceeding maximum length", () => {
    const longDescription = "a".repeat(501); // 301 characters
    const longDescriptionData = {
      ...baseValidData,
      description: longDescription,
    };
    expect(isValidMerchantData(longDescriptionData)).toBe(false);
  });

  test("should return false for invalid street", () => {
    const invalidStreetData = { ...baseValidData, street: "" }; // Empty street
    expect(isValidMerchantData(invalidStreetData)).toBe(false);
  });

  test("should return false for invalid postcode", () => {
    const invalidPostcodeData = { ...baseValidData, postcode: "" }; // Empty postcode
    expect(isValidMerchantData(invalidPostcodeData)).toBe(false);
  });

  test("should return false for invalid country", () => {
    const invalidCountryData = { ...baseValidData, country: "" }; // Empty country
    expect(isValidMerchantData(invalidCountryData)).toBe(false);
  });
});

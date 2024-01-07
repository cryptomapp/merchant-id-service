// src/utils/validation.test.ts

import { isValidMerchantData } from "../../src/utils/validation";
import { MerchantData } from "../../src/models/merchant";

describe("isValidMerchantData", () => {
  test("should return true for valid merchant data", () => {
    const validData: MerchantData = {
      name: "Test Store",
      street: "123 Test St",
      number: "10",
      postcode: "12345",
      country: "Testland",
      latitude: 40.7128,
      longitude: -74.006,
      description: "A test store description.",
      city: "Test City",
      phoneNumber: "123456789",
      openingHours: {
        Monday: "9am-5pm",
        Tuesday: "9am-5pm",
        Wednesday: "9am-5pm",
        Thursday: "9am-5pm",
        Friday: "9am-5pm",
        Saturday: "9am-5pm",
        Sunday: "9am-5pm",
      },
      timezone: "CET",
    };

    expect(isValidMerchantData(validData)).toBe(true);
  });

  test("should return false for invalid merchant data", () => {
    const invalidData: Partial<MerchantData> = {
      name: "", // Invalid name
      // ... rest of the fields
    };

    expect(isValidMerchantData(invalidData as MerchantData)).toBe(false);
  });

  // Add more tests for specific edge cases and invalid scenarios
});

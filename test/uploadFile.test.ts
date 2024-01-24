import request from "supertest";
import app from "../src/app";
import path from "path";
import { uploadFileService } from "../src/services/uploadFileService";

jest.mock("../src/services/uploadFileService");

const baseValidData = {
  name: "Test Store",
  street: "123 Test St",
  number: "10A",
  postcode: "12345",
  country: "Testland",
  latitude: 40.7128,
  longitude: -74.006,
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

describe("POST /upload", () => {
  it("successfully uploads a file", async () => {
    (uploadFileService as jest.Mock).mockResolvedValue({
      someKey: "someValue",
    });

    const response = await request(app)
      .post("/upload")
      .field("data", JSON.stringify(baseValidData))
      .attach("image", path.join(__dirname, "../test.jpg")); // Ensure the path is correct

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
  });

  it("handles missing file error", async () => {
    const response = await request(app)
      .post("/upload")
      .field("data", JSON.stringify(baseValidData)); // No file attached

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("error", "Image file is missing.");
  });

  // Add more tests as needed
});

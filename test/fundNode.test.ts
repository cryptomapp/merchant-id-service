jest.mock("../src/services/fundNodeService", () => ({
  fundNodeService: jest.fn(),
}));
import request from "supertest";
import app from "../src/app";
import { fundNodeService } from "../src/services/fundNodeService";

describe("POST /fundNode", () => {
  it("should fund a node with valid input", async () => {
    const mockAmount = 100;
    (fundNodeService as jest.Mock).mockResolvedValue("mock-transaction-id");

    const response = await request(app)
      .post("/fundNode")
      .send({ amount: mockAmount });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: `Successfully funded ${mockAmount} tokens`,
      transactionId: "mock-transaction-id",
    });
  });

  it("should handle errors from the service", async () => {
    (fundNodeService as jest.Mock).mockRejectedValue(
      new Error("Funding error")
    );

    const response = await request(app).post("/fundNode").send({ amount: 100 });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("error");
  });
});

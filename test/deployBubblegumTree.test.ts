import request from "supertest";
import app from "../src/app";
import { deployBubblegumTreeService } from "../src/services/deployBubblegumTreeService";

jest.mock("../src/services/deployBubblegumTreeService");

describe("POST /deployBubblegumTree", () => {
  it("successfully deploys bubblegum tree", async () => {
    // Mock the service for successful deployment
    (deployBubblegumTreeService as jest.Mock).mockResolvedValue(
      "mock-merkle-tree-address"
    );

    const response = await request(app)
      .post("/deployBubblegumTree")
      .send({ maxDepth: 20, maxBufferSize: 64 });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: "Bubblegum Tree successfully deployed",
      merkleTreeAddress: "mock-merkle-tree-address",
    });
  });

  it("handles errors during deployment", async () => {
    // Mock the service to throw an error
    (deployBubblegumTreeService as jest.Mock).mockRejectedValue(
      new Error("Deployment error")
    );

    const response = await request(app)
      .post("/deployBubblegumTree")
      .send({ maxDepth: 20, maxBufferSize: 64 });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty("error");
  });

  // Add more tests as needed
});

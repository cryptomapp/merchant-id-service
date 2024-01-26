import { ProgramState } from "../generated/accounts/ProgramState";
import { PROGRAM_ID } from "../generated";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

export async function getMerchantCounter(): Promise<number> {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const programStatePubkey = PROGRAM_ID;
  const accountInfo = await connection.getAccountInfo(programStatePubkey);

  if (!accountInfo || !accountInfo.data) {
    throw new Error("ProgramState account not found or has no data"); // todo: error from commons
  }
  const programState = ProgramState.deserialize(accountInfo.data)[0];

  return programState.merchantCounter;
}

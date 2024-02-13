const path = require("path");

const programDir = path.join(
  __dirname,
  "..",
  "..",
  "Solana",
  "crypto-mapp",
  "programs",
  "crypto-mapp"
);
const idlDir = path.join(__dirname, "idl");
const sdkDir = path.join(__dirname, "src", "generated");
const binaryInstallDir = path.join(__dirname, ".crates");

module.exports = {
  idlGenerator: "anchor",
  programName: "crypto_mapp",
  programId: "8mDhNcko1rByfWLzVTuddx386JFwFnD3oDPWV2pzBckN", // Replace with your actual program ID
  idlDir,
  sdkDir,
  binaryInstallDir,
  programDir,
};

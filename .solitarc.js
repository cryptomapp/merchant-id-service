const path = require("path");

const programDir = path.join(
  __dirname,
  "..",
  "..",
  "Solana",
  "cryptom-protocol",
  "programs",
  "cryptom-protocol"
);
const idlDir = path.join(__dirname, "idl");
const sdkDir = path.join(__dirname, "src", "generated");
const binaryInstallDir = path.join(__dirname, ".crates");

module.exports = {
  idlGenerator: "anchor",
  programName: "cryptom_protocol",
  programId: "6gVqqXEwoTX7AZTBYQDEaXntMiBPnTAyBbuMCeqk5avi", // Replace with your actual program ID
  idlDir,
  sdkDir,
  binaryInstallDir,
  programDir,
};

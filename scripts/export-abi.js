const fs = require("fs");
const path = require("path");

const artifactPath = path.join(
  __dirname,
  "../artifacts/contracts/JudicialEvidenceLedger.sol/JudicialEvidenceLedger.json"
);

const outputPath = path.join(__dirname, "../EvidenceABI.json");

const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
fs.writeFileSync(outputPath, JSON.stringify(artifact.abi, null, 2));

console.log("ABI exported to EvidenceABI.json");

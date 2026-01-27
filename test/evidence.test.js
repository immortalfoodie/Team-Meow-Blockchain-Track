const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("JudicialEvidenceLedger", function () {
  let ledger;
  let owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const JudicialEvidenceLedger = await ethers.getContractFactory("JudicialEvidenceLedger");
    ledger = await JudicialEvidenceLedger.deploy();
    await ledger.deployed();
  });

  describe("addEvidence", function () {
    it("should add evidence and emit EvidenceAdded event", async function () {
      const evidenceId = "EVD-001";
      const caseId = "CASE-001";
      const hash = "0xabc123def456";
      const ownerRole = "Police";

      const tx = await ledger.addEvidence(evidenceId, caseId, hash, ownerRole);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      await expect(tx)
        .to.emit(ledger, "EvidenceAdded")
        .withArgs(evidenceId, caseId, hash, ownerRole, block.timestamp);

      const [retEvidenceId, retCaseId, retHash, retOwnerRole, retTimestamp] =
        await ledger.getEvidence(evidenceId);

      expect(retEvidenceId).to.equal(evidenceId);
      expect(retCaseId).to.equal(caseId);
      expect(retHash).to.equal(hash);
      expect(retOwnerRole).to.equal(ownerRole);
      expect(retTimestamp).to.equal(block.timestamp);
    });

    it("should revert on duplicate evidence ID", async function () {
      const evidenceId = "EVD-001";
      const caseId = "CASE-001";
      const hash = "0xabc123def456";
      const ownerRole = "Police";

      await ledger.addEvidence(evidenceId, caseId, hash, ownerRole);

      await expect(
        ledger.addEvidence(evidenceId, "CASE-002", "0xdef789", "Forensics")
      ).to.be.revertedWith("Evidence already exists");
    });
  });

  describe("transferCustody", function () {
    it("should transfer custody and emit CustodyTransferred event", async function () {
      const evidenceId = "EVD-001";
      const caseId = "CASE-001";
      const hash = "0xabc123def456";
      const initialOwner = "Police";
      const newOwner = "Forensics";

      await ledger.addEvidence(evidenceId, caseId, hash, initialOwner);

      const tx = await ledger.transferCustody(evidenceId, newOwner);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      await expect(tx)
        .to.emit(ledger, "CustodyTransferred")
        .withArgs(evidenceId, initialOwner, newOwner, block.timestamp);

      const [, , , retOwnerRole] = await ledger.getEvidence(evidenceId);
      expect(retOwnerRole).to.equal(newOwner);

      const trail = await ledger.getCustodyTrail(evidenceId);
      expect(trail).to.deep.equal([initialOwner, newOwner]);
    });

    it("should revert when transferring non-existent evidence", async function () {
      await expect(
        ledger.transferCustody("NON-EXISTENT", "Forensics")
      ).to.be.revertedWith("Evidence does not exist");
    });
  });

  describe("getCustodyTrail", function () {
    it("should return correct custody trail length and contents", async function () {
      const evidenceId = "EVD-001";
      const caseId = "CASE-001";
      const hash = "0xabc123def456";

      await ledger.addEvidence(evidenceId, caseId, hash, "Police");
      await ledger.transferCustody(evidenceId, "Forensics");
      await ledger.transferCustody(evidenceId, "Court");
      await ledger.transferCustody(evidenceId, "Archive");

      const trail = await ledger.getCustodyTrail(evidenceId);

      expect(trail.length).to.equal(4);
      expect(trail[0]).to.equal("Police");
      expect(trail[1]).to.equal("Forensics");
      expect(trail[2]).to.equal("Court");
      expect(trail[3]).to.equal("Archive");
    });

    it("should revert when getting trail for non-existent evidence", async function () {
      await expect(
        ledger.getCustodyTrail("NON-EXISTENT")
      ).to.be.revertedWith("Evidence does not exist");
    });
  });
});

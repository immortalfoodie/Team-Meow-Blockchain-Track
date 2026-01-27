// evidence management routes
const express = require("express");
const multer = require("multer");

const generateHash = require("../services/hash");
const { addEvidence, transferCustody, getEvidence, getCustodyHistory, getAllCaseEvidence } = require("../services/blockchain");
const { verifyToken, allowRoles } = require("../middleware/auth");
const { logAction, ACTIONS, getEvidenceHistory } = require("../services/audit");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// upload new evidence (police only)
router.post("/upload", verifyToken, allowRoles(["POLICE"]), upload.single("file"), async (req, res) => {
  try {
    const { evidenceId, caseId, description } = req.body;

    if (!evidenceId || !caseId || !req.file) {
      return res.status(400).json({ error: "Missing evidenceId, caseId or file" });
    }

    const hash = generateHash(req.file.buffer);
    const txHash = await addEvidence(evidenceId, caseId, hash, req.user.userId);

    logAction({
      action: ACTIONS.EVIDENCE_UPLOAD,
      userId: req.user.userId,
      username: req.user.username,
      role: req.user.role,
      evidenceId, caseId,
      details: { fileName: req.file.originalname, fileSize: req.file.size, hash, description },
      txHash,
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      evidenceId, caseId, hash, txHash,
      uploadedBy: req.user.name,
      uploadedAt: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// transfer custody
router.post("/transfer", verifyToken, allowRoles(["POLICE", "LAB"]), async (req, res) => {
  try {
    const { evidenceId, newOwnerId, reason } = req.body;

    if (!evidenceId || !newOwnerId) {
      return res.status(400).json({ error: "Missing evidenceId or newOwnerId" });
    }

    const txHash = await transferCustody(evidenceId, newOwnerId);

    logAction({
      action: ACTIONS.CUSTODY_TRANSFER,
      userId: req.user.userId,
      username: req.user.username,
      role: req.user.role,
      evidenceId,
      details: { from: req.user.userId, to: newOwnerId, reason },
      txHash,
      ipAddress: req.ip
    });

    res.json({
      success: true,
      evidenceId,
      previousOwner: req.user.userId,
      newOwner: newOwnerId,
      txHash
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// verify evidence integrity (judge only)
router.post("/verify", verifyToken, allowRoles(["JUDGE"]), upload.single("file"), async (req, res) => {
  try {
    const { evidenceId } = req.body;

    if (!evidenceId || !req.file) {
      return res.status(400).json({ error: "Missing evidenceId or file" });
    }

    const newHash = generateHash(req.file.buffer);
    const evidence = await getEvidence(evidenceId);

    if (!evidence || !evidence.hash) {
      return res.status(404).json({ error: "Evidence not found" });
    }

    const isValid = newHash === evidence.hash;

    logAction({
      action: ACTIONS.EVIDENCE_VERIFY,
      userId: req.user.userId,
      username: req.user.username,
      role: req.user.role,
      evidenceId,
      details: { originalHash: evidence.hash, newHash, isValid },
      ipAddress: req.ip
    });

    res.json({
      verified: isValid,
      message: isValid ? "Evidence intact - no tampering detected" : "WARNING: Evidence has been modified!",
      originalHash: evidence.hash,
      currentHash: newHash,
      verifiedBy: req.user.name
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get evidence details
router.get("/:evidenceId", verifyToken, async (req, res) => {
  try {
    const evidence = await getEvidence(req.params.evidenceId);
    if (!evidence) {
      return res.status(404).json({ error: "Not found" });
    }

    logAction({
      action: ACTIONS.EVIDENCE_VIEW,
      userId: req.user.userId,
      username: req.user.username,
      role: req.user.role,
      evidenceId: req.params.evidenceId,
      ipAddress: req.ip
    });

    res.json({ evidence });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get custody history
router.get("/:evidenceId/history", verifyToken, async (req, res) => {
  try {
    const blockchainHistory = await getCustodyHistory(req.params.evidenceId);
    const auditHistory = getEvidenceHistory(req.params.evidenceId);

    res.json({
      evidenceId: req.params.evidenceId,
      blockchainHistory,
      auditHistory
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get all evidence for a case
router.get("/case/:caseId", verifyToken, async (req, res) => {
  try {
    const evidence = await getAllCaseEvidence(req.params.caseId);
    res.json({ caseId: req.params.caseId, evidence });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get audit trail (admin/judge only)
router.get("/:evidenceId/audit", verifyToken, allowRoles(["ADMIN", "JUDGE"]), async (req, res) => {
  try {
    const auditTrail = getEvidenceHistory(req.params.evidenceId);
    res.json({ evidenceId: req.params.evidenceId, auditTrail });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

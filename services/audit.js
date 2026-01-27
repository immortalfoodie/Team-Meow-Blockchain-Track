/**
 * Audit Logging Service
 * 
 * Maintains an immutable audit trail of all evidence-related actions.
 * Each log entry captures WHO did WHAT to WHICH evidence and WHEN.
 * 
 * In production, this would be stored in a database with additional
 * integrity measures (chained hashes, etc.)
 */

const crypto = require("crypto");

// In-memory audit log storage
const auditLogs = [];

/**
 * Generate a unique log ID
 */
function generateLogId() {
    return `LOG-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
}

/**
 * Create an audit log entry
 * 
 * @param {Object} params - Log parameters
 * @param {string} params.action - Action performed (UPLOAD, TRANSFER, VERIFY, etc.)
 * @param {string} params.userId - ID of the user performing the action
 * @param {string} params.username - Username of the user
 * @param {string} params.role - Role of the user
 * @param {string} params.evidenceId - ID of the evidence affected
 * @param {string} params.caseId - Associated case ID (if applicable)
 * @param {Object} params.details - Additional action-specific details
 * @param {string} params.txHash - Blockchain transaction hash (if applicable)
 * @param {boolean} params.success - Whether the action was successful
 * @param {string} params.errorMessage - Error message if action failed
 */
function logAction(params) {
    const entry = {
        id: generateLogId(),
        timestamp: new Date().toISOString(),
        action: params.action,
        user: {
            id: params.userId,
            username: params.username,
            role: params.role
        },
        evidenceId: params.evidenceId || null,
        caseId: params.caseId || null,
        details: params.details || {},
        txHash: params.txHash || null,
        success: params.success !== false,
        errorMessage: params.errorMessage || null,
        ipAddress: params.ipAddress || null
    };

    // Calculate hash of this entry for integrity verification
    entry.entryHash = crypto
        .createHash("sha256")
        .update(JSON.stringify(entry))
        .digest("hex");

    auditLogs.push(entry);

    // Console log for debugging (remove in production)
    console.log(`[AUDIT] ${entry.timestamp} | ${entry.action} | ${entry.user.username} | Evidence: ${entry.evidenceId}`);

    return entry;
}

/**
 * Get all audit logs with optional filtering
 */
function getLogs(filters = {}) {
    let results = [...auditLogs];

    if (filters.evidenceId) {
        results = results.filter(log => log.evidenceId === filters.evidenceId);
    }

    if (filters.caseId) {
        results = results.filter(log => log.caseId === filters.caseId);
    }

    if (filters.userId) {
        results = results.filter(log => log.user.id === filters.userId);
    }

    if (filters.action) {
        results = results.filter(log => log.action === filters.action);
    }

    if (filters.startDate) {
        results = results.filter(log => new Date(log.timestamp) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
        results = results.filter(log => new Date(log.timestamp) <= new Date(filters.endDate));
    }

    // Sort by timestamp descending (newest first)
    results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Apply pagination
    if (filters.limit) {
        const offset = filters.offset || 0;
        results = results.slice(offset, offset + filters.limit);
    }

    return results;
}

/**
 * Get logs for a specific evidence item (full history)
 */
function getEvidenceHistory(evidenceId) {
    return auditLogs
        .filter(log => log.evidenceId === evidenceId)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

/**
 * Get audit statistics
 */
function getStats() {
    const stats = {
        totalLogs: auditLogs.length,
        byAction: {},
        byRole: {},
        successRate: 0
    };

    let successCount = 0;

    auditLogs.forEach(log => {
        // Count by action
        stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;

        // Count by role
        stats.byRole[log.user.role] = (stats.byRole[log.user.role] || 0) + 1;

        // Count successes
        if (log.success) successCount++;
    });

    stats.successRate = auditLogs.length > 0
        ? ((successCount / auditLogs.length) * 100).toFixed(2) + "%"
        : "N/A";

    return stats;
}

// Action type constants
const ACTIONS = {
    EVIDENCE_UPLOAD: "EVIDENCE_UPLOAD",
    EVIDENCE_VERIFY: "EVIDENCE_VERIFY",
    CUSTODY_TRANSFER: "CUSTODY_TRANSFER",
    EVIDENCE_VIEW: "EVIDENCE_VIEW",
    USER_LOGIN: "USER_LOGIN",
    USER_LOGOUT: "USER_LOGOUT",
    USER_REGISTER: "USER_REGISTER",
    ACCESS_DENIED: "ACCESS_DENIED"
};

module.exports = {
    logAction,
    getLogs,
    getEvidenceHistory,
    getStats,
    ACTIONS
};

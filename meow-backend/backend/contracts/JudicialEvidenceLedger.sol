// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title JudicialEvidenceLedger
 * @dev Smart contract for storing judicial evidence with chain of custody tracking
 * @notice Deploy this contract on Sepolia testnet using Remix IDE
 */
contract JudicialEvidenceLedger {
    
    // ============ State Variables ============
    
    address public admin;
    mapping(address => bool) public authorizedUsers;
    
    struct Evidence {
        string evidenceId;
        string caseId;
        string hash;
        string ownerRole;
        uint256 timestamp;
        bool exists;
    }

    struct CustodyRecord {
        string role;
        uint256 timestamp;
        string action; // "CREATED", "TRANSFERRED"
    }

    mapping(string => Evidence) private evidences;
    mapping(string => CustodyRecord[]) private custodyTrails;
    string[] private evidenceIds; // Track all evidence IDs

    // ============ Events ============

    event EvidenceAdded(
        string indexed evidenceId,
        string caseId,
        string hash,
        string ownerRole,
        uint256 timestamp
    );

    event CustodyTransferred(
        string indexed evidenceId,
        string fromRole,
        string toRole,
        uint256 timestamp
    );

    event UserAuthorized(address indexed user);
    event UserRevoked(address indexed user);

    // ============ Modifiers ============

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyAuthorized() {
        require(
            authorizedUsers[msg.sender] || msg.sender == admin,
            "Not authorized to perform this action"
        );
        _;
    }

    // ============ Constructor ============

    constructor() {
        admin = msg.sender;
        authorizedUsers[msg.sender] = true;
    }

    // ============ Admin Functions ============

    /**
     * @dev Authorize a user to add/transfer evidence
     * @param user Address to authorize
     */
    function authorizeUser(address user) external onlyAdmin {
        authorizedUsers[user] = true;
        emit UserAuthorized(user);
    }

    /**
     * @dev Revoke user authorization
     * @param user Address to revoke
     */
    function revokeUser(address user) external onlyAdmin {
        require(user != admin, "Cannot revoke admin");
        authorizedUsers[user] = false;
        emit UserRevoked(user);
    }

    /**
     * @dev Transfer admin role to new address
     * @param newAdmin New admin address
     */
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid address");
        admin = newAdmin;
        authorizedUsers[newAdmin] = true;
    }

    // ============ Evidence Functions ============

    /**
     * @dev Add new evidence to the ledger
     * @param evidenceId Unique identifier for the evidence
     * @param caseId Case this evidence belongs to
     * @param hash SHA-256 hash of the evidence file
     * @param ownerRole Current custodian role (e.g., "Police", "Forensics")
     */
    function addEvidence(
        string calldata evidenceId,
        string calldata caseId,
        string calldata hash,
        string calldata ownerRole
    ) external onlyAuthorized {
        require(!evidences[evidenceId].exists, "Evidence already exists");
        require(bytes(evidenceId).length > 0, "Evidence ID cannot be empty");
        require(bytes(hash).length > 0, "Hash cannot be empty");

        evidences[evidenceId] = Evidence({
            evidenceId: evidenceId,
            caseId: caseId,
            hash: hash,
            ownerRole: ownerRole,
            timestamp: block.timestamp,
            exists: true
        });

        // Add initial custody record with timestamp
        custodyTrails[evidenceId].push(CustodyRecord({
            role: ownerRole,
            timestamp: block.timestamp,
            action: "CREATED"
        }));

        // Track evidence ID
        evidenceIds.push(evidenceId);

        emit EvidenceAdded(evidenceId, caseId, hash, ownerRole, block.timestamp);
    }

    /**
     * @dev Transfer custody of evidence to new role
     * @param evidenceId Evidence to transfer
     * @param toRole New custodian role
     */
    function transferCustody(
        string calldata evidenceId,
        string calldata toRole
    ) external onlyAuthorized {
        require(evidences[evidenceId].exists, "Evidence does not exist");
        require(bytes(toRole).length > 0, "Role cannot be empty");

        string memory fromRole = evidences[evidenceId].ownerRole;
        evidences[evidenceId].ownerRole = toRole;
        
        custodyTrails[evidenceId].push(CustodyRecord({
            role: toRole,
            timestamp: block.timestamp,
            action: "TRANSFERRED"
        }));

        emit CustodyTransferred(evidenceId, fromRole, toRole, block.timestamp);
    }

    // ============ View Functions ============

    /**
     * @dev Get evidence details
     * @param evidenceId Evidence to retrieve
     * @return evidenceId, caseId, hash, ownerRole, timestamp
     */
    function getEvidence(
        string calldata evidenceId
    )
        external
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            uint256
        )
    {
        require(evidences[evidenceId].exists, "Evidence does not exist");

        Evidence storage e = evidences[evidenceId];
        return (e.evidenceId, e.caseId, e.hash, e.ownerRole, e.timestamp);
    }

    /**
     * @dev Get custody trail for evidence (roles only - for backward compatibility)
     * @param evidenceId Evidence to get trail for
     * @return Array of custodian roles
     */
    function getCustodyTrail(
        string calldata evidenceId
    ) external view returns (string[] memory) {
        require(evidences[evidenceId].exists, "Evidence does not exist");
        
        CustodyRecord[] storage records = custodyTrails[evidenceId];
        string[] memory roles = new string[](records.length);
        
        for (uint i = 0; i < records.length; i++) {
            roles[i] = records[i].role;
        }
        
        return roles;
    }

    /**
     * @dev Get detailed custody trail with timestamps
     * @param evidenceId Evidence to get trail for
     * @return roles Array of custodian roles
     * @return timestamps Array of transfer timestamps
     * @return actions Array of actions (CREATED/TRANSFERRED)
     */
    function getCustodyTrailDetailed(
        string calldata evidenceId
    ) external view returns (
        string[] memory roles,
        uint256[] memory timestamps,
        string[] memory actions
    ) {
        require(evidences[evidenceId].exists, "Evidence does not exist");
        
        CustodyRecord[] storage records = custodyTrails[evidenceId];
        uint256 len = records.length;
        
        roles = new string[](len);
        timestamps = new uint256[](len);
        actions = new string[](len);
        
        for (uint i = 0; i < len; i++) {
            roles[i] = records[i].role;
            timestamps[i] = records[i].timestamp;
            actions[i] = records[i].action;
        }
        
        return (roles, timestamps, actions);
    }

    /**
     * @dev Verify if a hash matches stored evidence hash
     * @param evidenceId Evidence to verify
     * @param hash Hash to compare
     * @return True if hashes match
     */
    function verifyHash(
        string calldata evidenceId,
        string calldata hash
    ) external view returns (bool) {
        require(evidences[evidenceId].exists, "Evidence does not exist");
        return keccak256(bytes(evidences[evidenceId].hash)) == keccak256(bytes(hash));
    }

    /**
     * @dev Check if evidence exists
     * @param evidenceId Evidence to check
     * @return True if evidence exists
     */
    function evidenceExists(string calldata evidenceId) external view returns (bool) {
        return evidences[evidenceId].exists;
    }

    /**
     * @dev Get total number of evidence records
     * @return Count of all evidence
     */
    function getEvidenceCount() external view returns (uint256) {
        return evidenceIds.length;
    }

    /**
     * @dev Get all evidence IDs (use with caution - gas intensive for large datasets)
     * @return Array of all evidence IDs
     */
    function getAllEvidenceIds() external view returns (string[] memory) {
        return evidenceIds;
    }

    /**
     * @dev Check if an address is authorized
     * @param user Address to check
     * @return True if authorized
     */
    function isAuthorized(address user) external view returns (bool) {
        return authorizedUsers[user] || user == admin;
    }
}

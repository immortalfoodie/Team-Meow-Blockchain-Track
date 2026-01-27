// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract JudicialEvidenceLedger {
    struct Evidence {
        string evidenceId;
        string caseId;
        string hash;
        string ownerRole;
        uint256 timestamp;
        bool exists;
    }

    mapping(string => Evidence) private evidences;
    mapping(string => string[]) private custodyTrails;

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

    function addEvidence(
        string calldata evidenceId,
        string calldata caseId,
        string calldata hash,
        string calldata ownerRole
    ) external {
        require(!evidences[evidenceId].exists, "Evidence already exists");

        evidences[evidenceId] = Evidence({
            evidenceId: evidenceId,
            caseId: caseId,
            hash: hash,
            ownerRole: ownerRole,
            timestamp: block.timestamp,
            exists: true
        });

        custodyTrails[evidenceId].push(ownerRole);

        emit EvidenceAdded(evidenceId, caseId, hash, ownerRole, block.timestamp);
    }

    function transferCustody(
        string calldata evidenceId,
        string calldata toRole
    ) external {
        require(evidences[evidenceId].exists, "Evidence does not exist");

        string memory fromRole = evidences[evidenceId].ownerRole;
        evidences[evidenceId].ownerRole = toRole;
        custodyTrails[evidenceId].push(toRole);

        emit CustodyTransferred(evidenceId, fromRole, toRole, block.timestamp);
    }

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

    function getCustodyTrail(
        string calldata evidenceId
    ) external view returns (string[] memory) {
        require(evidences[evidenceId].exists, "Evidence does not exist");
        return custodyTrails[evidenceId];
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ProofMarket
 * @notice Skin-in-the-Game Signal Market on Shardeum.
 *         Experts stake SHM to post predictions. Followers copy-stake.
 *         Losers' stakes are distributed proportionally to winners.
 */
contract ProofMarket {
    // ─── Structs ────────────────────────────────────────────────────────────

    struct Prediction {
        uint256 id;
        address creator;
        string  question;
        string  category;
        uint256 deadline;
        uint256 totalYesStake;
        uint256 totalNoStake;
        bool    resolved;
        bool    outcome;          // true = YES won
        bool    creatorStakedOn;  // true = creator staked YES
    }

    struct ExpertProfile {
        uint256 totalPredictions;
        uint256 correctPredictions;
        uint256 totalStaked;
        uint256 totalEarned;
    }

    // ─── State ───────────────────────────────────────────────────────────────

    address public owner;
    uint256 public predictionCount;

    uint256 public constant MIN_EXPERT_STAKE = 0.01 ether; // 0.01 SHM
    uint256 public constant MIN_FOLLOWER_STAKE = 0.001 ether; // 0.001 SHM

    mapping(uint256 => Prediction)                              public predictions;
    mapping(address => ExpertProfile)                          public expertProfiles;
    // predictionId => staker => side(true=YES) => amount
    mapping(uint256 => mapping(address => mapping(bool => uint256))) public userStakes;
    // predictionId => staker => claimed?
    mapping(uint256 => mapping(address => bool))               public hasClaimed;

    // Track stakers per prediction for iteration in getStakers view
    mapping(uint256 => address[]) private _stakers;
    mapping(uint256 => mapping(address => bool)) private _isStaker;

    // ─── Events ──────────────────────────────────────────────────────────────

    event PredictionCreated(uint256 indexed id, address indexed creator, string question, uint256 deadline);
    event PredictionFollowed(uint256 indexed predictionId, address indexed follower, uint256 amount, bool side);
    event Staked(uint256 indexed predictionId, address indexed user, uint256 amount, bool side);
    event Resolved(uint256 indexed predictionId, bool outcome);
    event RewardClaimed(uint256 indexed predictionId, address indexed user, uint256 amount);

    // ─── Modifiers ───────────────────────────────────────────────────────────

    modifier onlyOwner() {
        require(msg.sender == owner, "ProofMarket: caller is not owner");
        _;
    }

    modifier predictionExists(uint256 id) {
        require(id > 0 && id <= predictionCount, "ProofMarket: prediction does not exist");
        _;
    }

    // ─── Constructor ─────────────────────────────────────────────────────────

    constructor() {
        owner = msg.sender;
    }

    // ─── Core Functions ───────────────────────────────────────────────────────

    /**
     * @notice Create a new prediction. Expert must stake >= 0.01 SHM.
     * @param question      The prediction question text
     * @param category      Category string (Crypto / Sports / Politics / Other)
     * @param deadline      Unix timestamp of resolution deadline
     * @param stakeOnYes    true if expert stakes on YES, false for NO
     */
    function createPrediction(
        string calldata question,
        string calldata category,
        uint256 deadline,
        bool stakeOnYes
    ) external payable {
        require(msg.value >= MIN_EXPERT_STAKE, "ProofMarket: minimum stake is 0.01 SHM");
        require(deadline > block.timestamp,    "ProofMarket: deadline must be in future");
        require(bytes(question).length > 0,    "ProofMarket: question cannot be empty");
        require(bytes(category).length > 0,    "ProofMarket: category cannot be empty");

        predictionCount++;
        uint256 id = predictionCount;

        Prediction storage p = predictions[id];
        p.id              = id;
        p.creator         = msg.sender;
        p.question        = question;
        p.category        = category;
        p.deadline        = deadline;
        p.creatorStakedOn = stakeOnYes;

        // Record expert's own stake
        if (stakeOnYes) {
            p.totalYesStake += msg.value;
        } else {
            p.totalNoStake  += msg.value;
        }
        userStakes[id][msg.sender][stakeOnYes] += msg.value;

        // Track staker
        if (!_isStaker[id][msg.sender]) {
            _stakers[id].push(msg.sender);
            _isStaker[id][msg.sender] = true;
        }

        // Update expert profile
        ExpertProfile storage ep = expertProfiles[msg.sender];
        ep.totalPredictions++;
        ep.totalStaked += msg.value;

        emit PredictionCreated(id, msg.sender, question, deadline);
        emit Staked(id, msg.sender, msg.value, stakeOnYes);
    }

    /**
     * @notice Copy-stake SHM on an existing prediction before deadline.
     * @param predictionId  The prediction to stake on
     * @param stakeOnYes    true for YES, false for NO
     */
    function followPrediction(uint256 predictionId, bool stakeOnYes)
        public
        payable
        predictionExists(predictionId)
    {
        Prediction storage p = predictions[predictionId];
        require(!p.resolved,                    "ProofMarket: prediction already resolved");
        require(block.timestamp < p.deadline,   "ProofMarket: deadline has passed");
        require(msg.value >= MIN_FOLLOWER_STAKE, "ProofMarket: follower stake too low");
        // Experts must keep skin-in-the-game on one side only.
        if (msg.sender == p.creator) {
            require(stakeOnYes == p.creatorStakedOn, "ProofMarket: creator cannot switch side");
        }

        if (stakeOnYes) {
            p.totalYesStake += msg.value;
        } else {
            p.totalNoStake  += msg.value;
        }
        userStakes[predictionId][msg.sender][stakeOnYes] += msg.value;

        if (!_isStaker[predictionId][msg.sender]) {
            _stakers[predictionId].push(msg.sender);
            _isStaker[predictionId][msg.sender] = true;
        }

        // Update profile for non-experts staking
        expertProfiles[msg.sender].totalStaked += msg.value;

        emit Staked(predictionId, msg.sender, msg.value, stakeOnYes);
        emit PredictionFollowed(predictionId, msg.sender, msg.value, stakeOnYes);
    }

    /**
     * @notice Backward-compatible alias for older scripts/frontends.
     */
    function stakePrediction(uint256 predictionId, bool stakeOnYes)
        external
        payable
    {
        followPrediction(predictionId, stakeOnYes);
    }

    /**
     * @notice Resolve a prediction (admin only).
     * @param predictionId  The prediction to resolve
     * @param outcome       true = YES won, false = NO won
     */
    function resolvePrediction(uint256 predictionId, bool outcome)
        external
        onlyOwner
        predictionExists(predictionId)
    {
        Prediction storage p = predictions[predictionId];
        require(!p.resolved, "ProofMarket: already resolved");
        require(block.timestamp >= p.deadline, "ProofMarket: deadline not reached");

        p.resolved = true;
        p.outcome  = outcome;

        // Update expert profile
        ExpertProfile storage ep = expertProfiles[p.creator];
        if (p.creatorStakedOn == outcome) {
            ep.correctPredictions++;
        }

        emit Resolved(predictionId, outcome);
    }

    /**
     * @notice Claim proportional reward from the losing pool.
     * @param predictionId  The resolved prediction to claim from
     */
    function claimReward(uint256 predictionId)
        external
        predictionExists(predictionId)
    {
        Prediction storage p = predictions[predictionId];
        require(p.resolved,                           "ProofMarket: not resolved yet");
        require(!hasClaimed[predictionId][msg.sender], "ProofMarket: already claimed");

        bool winningSide = p.outcome;
        uint256 myStake  = userStakes[predictionId][msg.sender][winningSide];
        require(myStake > 0, "ProofMarket: no winning stake");

        hasClaimed[predictionId][msg.sender] = true;

        uint256 winPool  = winningSide ? p.totalYesStake : p.totalNoStake;
        uint256 losePool = winningSide ? p.totalNoStake  : p.totalYesStake;

        // Proportional share of losing pool + own stake back
        uint256 winnings = (myStake * losePool) / winPool;
        uint256 payout   = myStake + winnings;

        expertProfiles[msg.sender].totalEarned += winnings;

        (bool sent, ) = msg.sender.call{value: payout}("");
        require(sent, "ProofMarket: transfer failed");

        emit RewardClaimed(predictionId, msg.sender, payout);
    }

    // ─── View Functions ───────────────────────────────────────────────────────

    function getExpertProfile(address expert)
        external
        view
        returns (ExpertProfile memory)
    {
        return expertProfiles[expert];
    }

    function getPrediction(uint256 id)
        external
        view
        predictionExists(id)
        returns (Prediction memory)
    {
        return predictions[id];
    }

    /**
     * @notice Returns accuracy in basis-percent (0–100).
     *         Returns 0 if the expert has no predictions.
     */
    function getAccuracyPercent(address expert)
        external
        view
        returns (uint256)
    {
        ExpertProfile storage ep = expertProfiles[expert];
        if (ep.totalPredictions == 0) return 0;
        return (ep.correctPredictions * 100) / ep.totalPredictions;
    }

    /**
     * @notice Returns all prediction IDs (for frontend enumeration).
     */
    function getAllPredictionIds()
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory ids = new uint256[](predictionCount);
        for (uint256 i = 0; i < predictionCount; i++) {
            ids[i] = i + 1;
        }
        return ids;
    }

    /**
     * @notice Returns list of addresses that staked on a prediction.
     */
    function getStakers(uint256 predictionId)
        external
        view
        predictionExists(predictionId)
        returns (address[] memory)
    {
        return _stakers[predictionId];
    }

    // ─── Fallback ─────────────────────────────────────────────────────────────

    receive() external payable {}
}

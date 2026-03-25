const hre = require("hardhat");

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ABI = [
  "function createPrediction(string,string,uint256,bool) payable",
  "function stakePrediction(uint256,bool) payable",
  "function predictionCount() view returns (uint256)",
];

async function main() {
  const signers = await hre.ethers.getSigners();
  const deployer = signers[0];
  const alice    = signers[1];
  const bob      = signers[2];
  const carol    = signers[3];

  console.log("Seeding ProofMarket with demo predictions...");

  const pm = new hre.ethers.Contract(CONTRACT_ADDRESS, ABI, deployer);

  const now = Math.floor(Date.now() / 1000);
  const day = 86400;

  // Prediction 1 — deployer (expert)
  let tx = await pm.connect(deployer).createPrediction(
    "Will ETH cross $5000 by June 30, 2026?",
    "Crypto",
    now + day * 97,
    true, // staking YES
    { value: hre.ethers.parseEther("0.5") }
  );
  await tx.wait();
  console.log("  [1/4] ETH $5000 prediction created");

  // Prediction 2 — alice
  tx = await pm.connect(alice).createPrediction(
    "Will Bitcoin reach $150,000 before end of 2026?",
    "Crypto",
    now + day * 280,
    true,
    { value: hre.ethers.parseEther("1.0") }
  );
  await tx.wait();
  console.log("  [2/4] BTC $150k prediction created");

  // Prediction 3 — bob
  tx = await pm.connect(bob).createPrediction(
    "Will the US Federal Reserve cut rates 3+ times in 2026?",
    "Politics",
    now + day * 200,
    false, // staking NO
    { value: hre.ethers.parseEther("0.3") }
  );
  await tx.wait();
  console.log("  [3/4] Fed cuts prediction created");

  // Prediction 4 — carol
  tx = await pm.connect(carol).createPrediction(
    "Will Real Madrid win Champions League 2025-26 season?",
    "Sports",
    now + day * 60,
    true,
    { value: hre.ethers.parseEther("0.2") }
  );
  await tx.wait();
  console.log("  [4/4] Champions League prediction created");

  // Add some follower stakes so pools look active
  const pm2 = new hre.ethers.Contract(CONTRACT_ADDRESS, ABI, carol);
  tx = await pm2.stakePrediction(1, false, { value: hre.ethers.parseEther("0.4") });
  await tx.wait();
  tx = await pm2.stakePrediction(2, true, { value: hre.ethers.parseEther("0.8") });
  await tx.wait();

  const pmc3 = new hre.ethers.Contract(CONTRACT_ADDRESS, ABI, signers[4]);
  tx = await pmc3.stakePrediction(1, true, { value: hre.ethers.parseEther("0.6") });
  await tx.wait();
  tx = await pmc3.stakePrediction(3, true, { value: hre.ethers.parseEther("0.25") });
  await tx.wait();
  tx = await pmc3.stakePrediction(4, false, { value: hre.ethers.parseEther("0.15") });
  await tx.wait();

  const count = await pm.predictionCount();
  console.log(`\nDone! ${count} predictions live on http://localhost:3000/proofmarket.html`);

  console.log("\n=== MetaMask Setup ===");
  console.log("Network Name: Hardhat Local");
  console.log("RPC URL:      http://127.0.0.1:8545");
  console.log("Chain ID:     31337");
  console.log("Currency:     ETH");
  console.log("\nTest Account (import private key into MetaMask):");
  console.log("Address:     ", deployer.address);
  console.log("Private Key:  0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
  console.log("Balance:      ~9996 ETH");
}

main().catch(console.error);

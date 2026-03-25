const hre = require("hardhat");

const CONTRACT_ADDRESS = "0xEaAA32CA5CF0B24c95DF9f96Ba45b22e2D52c93F";
const ABI = [
  "function createPrediction(string,string,uint256,bool) payable",
  "function stakePrediction(uint256,bool) payable",
  "function predictionCount() view returns (uint256)",
];

async function main() {
  const signers = await hre.ethers.getSigners();
  const deployer = signers[0]; // The only wallet we have funded with SHM on testnet!

  console.log("Seeding ProofMarket on Shardeum Testnet...");

  const pm = new hre.ethers.Contract(CONTRACT_ADDRESS, ABI, deployer);

  const now = Math.floor(Date.now() / 1000);
  const day = 86400;

  console.log("Creating Prediction 1...");
  // Prediction 1
  let tx = await pm.connect(deployer).createPrediction(
    "Will ETH cross $10,000 by End of 2026?",
    "Crypto",
    now + day * 97,
    true, // staking YES
    { value: hre.ethers.parseEther("0.05") }
  );
  await tx.wait();
  console.log("  [1/4] ETH $10k prediction created");

  console.log("Creating Prediction 2...");
  // Prediction 2
  tx = await pm.connect(deployer).createPrediction(
    "Will Bitcoin reach $150,000 before end of 2026?",
    "Crypto",
    now + day * 280,
    true,
    { value: hre.ethers.parseEther("0.08") }
  );
  await tx.wait();
  console.log("  [2/4] BTC $150k prediction created");

  console.log("Creating Prediction 3...");
  // Prediction 3
  tx = await pm.connect(deployer).createPrediction(
    "Will the US Federal Reserve cut rates 3+ times in 2026?",
    "Politics",
    now + day * 200,
    false, // staking NO
    { value: hre.ethers.parseEther("0.03") }
  );
  await tx.wait();
  console.log("  [3/4] Fed cuts prediction created");

  console.log("Creating Prediction 4...");
  // Prediction 4 
  tx = await pm.connect(deployer).createPrediction(
    "Will Real Madrid win Champions League 2025-26 season?",
    "Sports",
    now + day * 60,
    true,
    { value: hre.ethers.parseEther("0.02") }
  );
  await tx.wait();
  console.log("  [4/4] Champions League prediction created");

  // Add some follower stakes so pools look active
  console.log("Adding some mock stakes to the pools...");
  tx = await pm.connect(deployer).stakePrediction(1, false, { value: hre.ethers.parseEther("0.04") });
  await tx.wait();
  tx = await pm.connect(deployer).stakePrediction(2, true, { value: hre.ethers.parseEther("0.08") });
  await tx.wait();
  
  tx = await pm.connect(deployer).stakePrediction(3, true, { value: hre.ethers.parseEther("0.12") });
  await tx.wait();

  const count = await pm.predictionCount();
  console.log(`\nDone! ${count} predictions live! Go check your Vercel/Local app.`);
}

main().catch(console.error);

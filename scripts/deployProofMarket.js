const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;

  console.log("=".repeat(55));
  console.log("  ProofMarket — Deployment Script");
  console.log("=".repeat(55));
  console.log(`Network:  ${network}`);
  console.log(`Deployer: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Balance:  ${hre.ethers.formatEther(balance)} SHM`);
  console.log("=".repeat(55));

  // ── Deploy ProofMarket ────────────────────────────────────────────────────
  console.log("\n[1/1] Deploying ProofMarket...");

  // Fetch the node's current gasPrice dynamically
  const feeData  = await hre.ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice;
  console.log(`  gasPrice: ${hre.ethers.formatUnits(gasPrice, "gwei")} gwei`);
  // Contract uses ~1,564,019 gas (tested locally). 2_000_000 = 28% headroom.
  const gasLimit = 2_000_000n;
  const feeSHM   = hre.ethers.formatEther(gasPrice * gasLimit);
  console.log(`  Est. fee: ${feeSHM} SHM (limit=${gasLimit}, price=${hre.ethers.formatUnits(gasPrice,"gwei")} gwei)`);

  const ProofMarket = await hre.ethers.getContractFactory("ProofMarket");
  const proofMarket = await ProofMarket.deploy({ gasLimit, gasPrice });
  await proofMarket.waitForDeployment();
  const pmAddress = await proofMarket.getAddress();
  console.log(`  ProofMarket deployed to: ${pmAddress}`);

  // ── Explorer link ─────────────────────────────────────────────────────────
  const explorerBase =
    network === "shardeum_mainnet"
      ? "https://explorer.shardeum.org"
      : "https://explorer-mezame.shardeum.org"; // shardeum_testnet (Mezame, 8119)

  console.log("\n" + "=".repeat(55));
  console.log("  Deployment complete!");
  console.log(`  ProofMarket: ${explorerBase}/address/${pmAddress}`);
  console.log("\n  ⚠️  Add the following to your .env file:");
  console.log(`  CONTRACT_ADDRESS=${pmAddress}`);
  console.log("=".repeat(55));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

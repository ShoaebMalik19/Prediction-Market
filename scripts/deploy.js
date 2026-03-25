const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;

  console.log("=".repeat(50));
  console.log(`Network:  ${network}`);
  console.log(`Deployer: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Balance:  ${hre.ethers.formatEther(balance)} SHM`);
  console.log("=".repeat(50));

  // ── Deploy SimpleStorage ─────────────────────────────────────────────────
  console.log("\n[1/2] Deploying SimpleStorage...");
  const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.deploy(42);
  await simpleStorage.waitForDeployment();
  const ssAddress = await simpleStorage.getAddress();
  console.log(`  SimpleStorage deployed to: ${ssAddress}`);

  // ── Deploy ShardeumToken ─────────────────────────────────────────────────
  console.log("\n[2/2] Deploying ShardeumToken...");
  const ShardeumToken = await hre.ethers.getContractFactory("ShardeumToken");
  const token = await ShardeumToken.deploy("Shardeum Token", "SHT", 1_000_000);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log(`  ShardeumToken deployed to: ${tokenAddress}`);

  // ── Summary ──────────────────────────────────────────────────────────────
  const explorerBase =
    network === "shardeum_mainnet"
      ? "https://explorer.shardeum.org"
      : "https://explorer-mezame.shardeum.org";

  console.log("\n" + "=".repeat(50));
  console.log("Deployment complete!");
  console.log(`  SimpleStorage: ${explorerBase}/address/${ssAddress}`);
  console.log(`  ShardeumToken: ${explorerBase}/address/${tokenAddress}`);
  console.log("=".repeat(50));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

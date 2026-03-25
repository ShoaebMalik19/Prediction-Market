const hre = require("hardhat");

// ── Fill in your deployed contract addresses ──────────────────────────────
const SIMPLE_STORAGE_ADDRESS = ""; // e.g. "0xAbc123..."
const TOKEN_ADDRESS = "";          // e.g. "0xDef456..."

async function main() {
  if (!SIMPLE_STORAGE_ADDRESS || !TOKEN_ADDRESS) {
    console.error("Set SIMPLE_STORAGE_ADDRESS and TOKEN_ADDRESS in this script first.");
    process.exit(1);
  }

  const [signer] = await hre.ethers.getSigners();
  console.log(`Using account: ${signer.address}`);

  // ── Interact with SimpleStorage ──────────────────────────────────────────
  console.log("\n── SimpleStorage ──────────────────────────────────");
  const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
  const storage = SimpleStorage.attach(SIMPLE_STORAGE_ADDRESS);

  const currentValue = await storage.value();
  console.log(`Current value: ${currentValue}`);

  console.log("Setting value to 100...");
  const tx1 = await storage.setValue(100);
  await tx1.wait();
  console.log(`New value: ${await storage.value()}`);

  // ── Interact with ShardeumToken ──────────────────────────────────────────
  console.log("\n── ShardeumToken ──────────────────────────────────");
  const ShardeumToken = await hre.ethers.getContractFactory("ShardeumToken");
  const token = ShardeumToken.attach(TOKEN_ADDRESS);

  const name = await token.name();
  const symbol = await token.symbol();
  const totalSupply = await token.totalSupply();
  const myBalance = await token.balanceOf(signer.address);

  console.log(`Token: ${name} (${symbol})`);
  console.log(`Total Supply: ${hre.ethers.formatEther(totalSupply)} ${symbol}`);
  console.log(`My Balance:   ${hre.ethers.formatEther(myBalance)} ${symbol}`);

  // Transfer 100 tokens to a burn address as a demo
  const recipient = "0x000000000000000000000000000000000000dEaD";
  console.log(`\nTransferring 100 ${symbol} to ${recipient}...`);
  const tx2 = await token.transfer(recipient, hre.ethers.parseEther("100"));
  await tx2.wait();
  console.log(`Transfer complete. New balance: ${hre.ethers.formatEther(await token.balanceOf(signer.address))} ${symbol}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

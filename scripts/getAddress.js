const hre = require("hardhat");
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  // Hardhat's deterministic address for nonce=0
  const nonce = await hre.ethers.provider.getTransactionCount(deployer.address);
  console.log("Current nonce:", nonce.toString());
  // The contract at nonce=0 from deployer 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  const addr = hre.ethers.getCreateAddress({ from: deployer.address, nonce: 0 });
  console.log("CONTRACT_ADDRESS=" + addr);
}
main().catch(console.error);

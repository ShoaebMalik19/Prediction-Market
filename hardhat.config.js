require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Shardeum Testnet 8083 — Active public testnet (ProofMarket deploy target)
    shardeumTestnet: {
      url: process.env.SHARDEUM_TESTNET_8083_RPC || "https://api-testnet.shardeum.org/",
      chainId: 8083,
      accounts: [PRIVATE_KEY],
    },
    // Shardeum Mezame EVM Testnet (older, also active)
    shardeum_testnet: {
      url: process.env.SHARDEUM_TESTNET_RPC || "https://api-mezame.shardeum.org",
      chainId: 8119,
      accounts: [PRIVATE_KEY],
    },
    // Shardeum Mainnet
    shardeum_mainnet: {
      url: process.env.SHARDEUM_MAINNET_RPC || "https://api.shardeum.org",
      chainId: 8118,
      accounts: [PRIVATE_KEY],
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

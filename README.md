# Shardeum Starter Kit

Get your environment ready to build and deploy smart contracts on **Shardeum** — an EVM-compatible Layer 1 blockchain.

---

## Step 1 — Install Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or v20 recommended)
- [Git](https://git-scm.com/)
- [MetaMask](https://metamask.io/) browser extension

---

## Step 2 — Add Shardeum Testnet to MetaMask

**Option A — Add automatically via the docs (easiest):**

Go to [https://docs.shardeum.org/docs/overview/endpoints](https://docs.shardeum.org/docs/overview/endpoints) and click **"Add to Wallet"** next to the testnet.

**Option B — Add manually in MetaMask:**

1. Open MetaMask → click the network dropdown → **"Add a custom network"**
2. Fill in the details below and click **Save**

| Field | Value |
|---|---|
| Network Name | `Shardeum EVM Testnet` |
| New RPC URL | `https://api-mezame.shardeum.org` |
| Chain ID | `8119` |
| Currency Symbol | `SHM` |
| Block Explorer URL | `https://explorer-mezame.shardeum.org` |

---

## Step 3 — Get Testnet SHM (Faucet)

You need testnet SHM to pay for gas fees.

1. Join the Shardeum Discord: [https://discord.com/invite/shardeum](https://discord.com/invite/shardeum)
2. Verify your account by clicking the **Shardeum emoji logo** in the server
3. Go to the `#evm-faucet` channel: [https://discord.com/channels/933959587462254612/1423751569454661632](https://discord.com/channels/933959587462254612/1423751569454661632)
4. Type the following command (a black box with your address will appear after you type `/faucet`):

```
/faucet [address: YOUR_METAMASK_WALLET_ADDRESS]
```

SHM will be sent to your wallet shortly after.

---

## Step 4 — Set Up the Project

```bash
# Install dependencies
npm install

# Copy the environment file
cp .env.example .env
```

Open `.env` and add your wallet private key:

```
PRIVATE_KEY=your_private_key_here
```

> **How to export your private key from MetaMask:**
> MetaMask → Account Details → **"Show private key"** → enter your password → copy the key

> **Never share your private key with anyone.**

---

## Step 5 — Compile & Deploy

```bash
# Compile the contracts
npm run compile

# Deploy to Shardeum testnet
npm run deploy
```

If successful, you'll see your contract addresses and links to the block explorer printed in the terminal.

---

## Useful Links

| Resource | Link |
|---|---|
| Shardeum Docs | https://docs.shardeum.org |
| Testnet Explorer | https://explorer-mezame.shardeum.org |
| Faucet (Discord) | https://discord.com/channels/933959587462254612/1423751569454661632 |
| Shardeum Discord | https://discord.com/invite/shardeum |
| Hardhat Docs | https://hardhat.org/docs |

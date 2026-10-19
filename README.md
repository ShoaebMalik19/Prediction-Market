<div align="center">

# 🔮 ProofMarket

### Bet on experts, not the crowd. An on-chain prediction market where experts stake their own SHM.

<p>
  <a href="https://prediction-market-ochre-eta.vercel.app"><img src="https://img.shields.io/badge/Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" /></a>
  <img src="https://img.shields.io/badge/Solidity-1E1E1E?style=for-the-badge&logo=solidity&logoColor=white" alt="Solidity" />
  <img src="https://img.shields.io/badge/Hardhat-1A1A1A?style=for-the-badge&logo=hardhat&logoColor=FFF100" alt="Hardhat" />
  <img src="https://img.shields.io/badge/Ethers.js_v6-1E293B?style=for-the-badge&logo=ethereum&logoColor=white" alt="Ethers.js" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-1B1B1F?style=for-the-badge&logo=vite&logoColor=646CFF" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-0F172A?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8" alt="Tailwind CSS" />
</p>

</div>

---

## ✨ Overview

**ProofMarket** is a decentralized prediction market on the **Shardeum** EVM, built for the Shardeum Hackathon. It tackles the noise problem in prediction markets: **anyone can post a prediction, but they must stake their own SHM to do it.** If they are wrong, their stake goes to the winners.

Every prediction, stake and result is stored on-chain, so an expert's track record cannot be faked.

## 🚀 Features

- **Skin in the game**: creating a prediction needs a minimum stake of **0.01 SHM** on YES or NO.
- **Copy-staking**: followers can stake alongside an expert (minimum **0.001 SHM**) or take the opposite side.
- **Proportional payouts**: winners get their stake back plus a proportional share of the losing pool through `claimReward()`.
- **On-chain expert profiles**: total predictions, correct calls, total staked and total earned per address, plus `getAccuracyPercent()`.
- **Leaderboard**: ranks experts from on-chain data, with no backend server.
- **Dark glass UI**: an animated React landing page (canvas flow-field background) that links to the Ethers.js dApp with Home, Expert, Create, My Stakes and Leaderboard views.

## 🌍 Testnet Deployment

| | |
| --- | --- |
| **Network** | Shardeum Mezame Testnet |
| **Chain ID** | 8119 |
| **RPC** | `https://api-mezame.shardeum.org` |
| **Currency** | SHM |
| **ProofMarket contract** | `0xEaAA32CA5CF0B24c95DF9f96Ba45b22e2D52c93F` |

### Contract API (`contracts/ProofMarket.sol`)

| Function | Description |
| --- | --- |
| `createPrediction(question, category, deadline, stakeOnYes)` *payable* | Post a prediction with the expert's stake |
| `followPrediction(id, stakeOnYes)` *payable* | Copy-stake with or against an expert |
| `stakePrediction(id, stakeOnYes)` *payable* | Stake on either side |
| `resolvePrediction(id, outcome)` *owner only* | Settle after the deadline |
| `claimReward(id)` | Withdraw your stake plus winnings |
| `getPrediction`, `getExpertProfile`, `getAccuracyPercent`, `getAllPredictionIds`, `getStakers` | Read-only views |

## 🧱 Tech Stack

- **Smart contracts:** Solidity, Hardhat, Ethers v6
- **dApp:** HTML, CSS and vanilla JavaScript with Ethers.js v6 (`frontend-react/public/proofmarket.html`)
- **Landing page:** React 19, Vite, TypeScript, Tailwind CSS v4, Lucide icons
- **Network:** Shardeum Mezame Testnet (8119)
- **Hosting:** Vercel

## 🗂️ Project Structure

```
Prediction-Market/
├── contracts/
│   └── ProofMarket.sol         # core market contract
├── scripts/
│   ├── deployProofMarket.js    # deploy ProofMarket
│   ├── seed.js                 # seed sample predictions
│   └── interact.js
├── frontend-react/             # Vercel root
│   ├── src/pages/LandingPage.tsx
│   └── public/proofmarket.html # Ethers.js dApp
├── frontend/                   # standalone copy of the HTML dApp
└── hardhat.config.js
```

## ⚡ Getting Started

**Run the frontend:**

```bash
git clone https://github.com/ShoaebMalik19/Prediction-Market.git
cd Prediction-Market/frontend-react
npm install
npm run dev
```

Open `http://localhost:5173`, then connect MetaMask on Shardeum Mezame (8119).

**Contracts (optional).** From the repo root, copy `.env.example` to `.env` and set:

- `PRIVATE_KEY`: the deployer key
- `CONTRACT_ADDRESS`: filled in after deployment
- `SHARDEUM_TESTNET_RPC`, `SHARDEUM_TESTNET_8083_RPC`, `SHARDEUM_MAINNET_RPC`: optional RPC overrides

```bash
npm install
npm run compile
npx hardhat run scripts/deployProofMarket.js --network shardeum_testnet   # Mezame (8119)
```

> `npm run deploy:proofmarket` targets the `shardeumTestnet` network (chain 8083). The hosted dApp expects chain 8119, so use the command above or update `CONTRACT_ADDRESS` and the chain ID in `proofmarket.html` to match.

## ☁️ Deploying to Vercel

1. Import the repository into Vercel.
2. Set the **Root Directory** to `frontend-react`.
3. Vercel runs `npm run build` and serves both the React landing page and the HTML dApp from `public/`.

## 👤 Author

**Mohammed Shoaeb Malik** · AI & full-stack developer, Bengaluru
GitHub: [@ShoaebMalik19](https://github.com/ShoaebMalik19)

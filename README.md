# 🔮 ProofMarket — Bet on Experts, Not the Crowd

**ProofMarket** is a decentralized prediction market built on the **Shardeum** Layer 1 EVM. It radically changes the dynamics of prediction markets by solving the "noise" problem: **Experts must stake their own SHM to post a prediction.**

No more fake gurus. Complete on-chain transparency. True skin in the game.

---

## 🚀 Key Features

*   **Skin in the Game:** Anyone can create a prediction, but it costs a minimum stake of SHM to do so. If they're wrong, their stake goes to the winners.
*   **Copy-Staking:** Users can follow top experts and stake alongside them.
*   **Immutable Track Record:** Every win, loss, and stat is cryptographically stored on-chain.
*   **Dynamic Leaderboard:** Auto-aggregates expert credentialing points and ranks top predictors without a backend server.
*   **Dark Glass UI:** Sleek, animated Web3 native frontend using React & Ethers.js.

---

## 🛠 Tech Stack

*   **Smart Contracts:** Solidity, Hardhat
*   **Frontend:** React, HTML, CSS, JavaScript (Vanilla ES6 + Ethers.js v6)
*   **Blockchain Network:** Shardeum Mezame (Chain ID: 8119)
*   **Hosting:** Vercel

---

## 🌍 Testnet Contract Information

The core logic has been deployed and verified on the **Shardeum Mezame Testnet**.

*   **Network:** Shardeum Mezame Testnet (8119)
*   **RPC Endpoint:** `https://api-mezame.shardeum.org`
*   **Currency:** SHM
*   **ProofMarket Contract:** `0xEaAA32CA5CF0B24c95DF9f96Ba45b22e2D52c93F`

---

## 💻 Running the App Locally

To run the React node locally and test the dApp:

```bash
# 1. Clone the repository
git clone https://github.com/ShoaebMalik19/Prediction-Market.git
cd Prediction-Market

# 2. Navigate to the frontend-react folder
cd frontend-react

# 3. Install dependencies
npm install

# 4. Start the Vite server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🤝 Build & Deployment (Vercel)

The ProofMarket app is uniquely structured to seamlessly deploy to Vercel without configuring a custom proxy!

1. Import the repository into Vercel.
2. Under **Project Settings**, change the `Root Directory` to `frontend-react`.
3. Vercel automatically runs `npm run build` and serves both the React animated Hero and the nested HTML Web3 components natively.

*Built for the Shardeum Hackathon.* 🚀

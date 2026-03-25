// import React from "react";
import NeuralBackground from "@/components/ui/flow-field-background";
import { ArrowRight, Sparkles, ShieldCheck, TrendingUp, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative w-full min-h-screen">
      {/* ── Neural flow-field background ── */}
      <div className="fixed inset-0 z-0">
        <NeuralBackground
          color="#818cf8"
          trailOpacity={0.1}
          speed={0.8}
          particleCount={600}
        />
      </div>

      {/* ── Overlay gradient so text is readable ── */}
      <div className="fixed inset-0 z-10 bg-gradient-to-b from-black/60 via-black/30 to-black/80 pointer-events-none" />

      {/* ── Content ── */}
      <div className="relative z-20 flex flex-col min-h-screen">

        {/* Navbar */}
        <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10 backdrop-blur-sm">
          <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            ProofMarket
          </span>
          <div className="flex items-center gap-4">
            <a href="/proofmarket.html"
               className="text-sm text-white/60 hover:text-white transition-colors">
              Launch App
            </a>
            <a href="/proofmarket.html#connect"
               className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 hover:scale-105 transition-all">
              Connect Wallet <ArrowRight size={14} />
            </a>
          </div>
        </nav>

        {/* Hero */}
        <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-8">
            <Sparkles size={14} /> Built on Shardeum · Skin in the Game
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white leading-none mb-6">
            Bet on{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Experts
            </span>
            ,<br />Not the Crowd.
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-white/60 mb-12 leading-relaxed">
            ProofMarket is a decentralized prediction market where experts must
            stake their own SHM to post predictions. Their entire win/loss history
            lives on‑chain — forever. Copy-stake experts you trust, or prove yourself.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/proofmarket.html"
               className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-indigo-500/30">
              Open Markets <ArrowRight size={18} />
            </a>
            <a href="/proofmarket.html#create"
               className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/20 text-white/80 font-semibold text-lg hover:border-white/40 hover:text-white transition-all backdrop-blur-sm">
              Create Prediction
            </a>
          </div>
        </section>

        {/* Feature cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 pb-20 max-w-5xl mx-auto w-full">
          {[
            {
              icon: <ShieldCheck size={28} className="text-indigo-400" />,
              title: "Skin in the Game",
              desc: "Experts stake their own SHM on every prediction. Wrong = they lose real money.",
            },
            {
              icon: <TrendingUp size={28} className="text-purple-400" />,
              title: "On-Chain Track Record",
              desc: "Every prediction, every stake, every outcome permanently stored. No hiding.",
            },
            {
              icon: <Users size={28} className="text-pink-400" />,
              title: "Copy-Stake Experts",
              desc: "Follow any expert and stake alongside them. Winners split the losing pool.",
            },
          ].map((f) => (
            <div key={f.title}
                 className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:border-indigo-500/40 transition-all">
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-6 text-center text-white/30 text-sm">
          ProofMarket · Built on Shardeum EVM · {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}

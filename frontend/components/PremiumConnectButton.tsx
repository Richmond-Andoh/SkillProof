"use client";

import { motion } from "framer-motion";
import { Wallet, Zap } from "lucide-react";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

export default function PremiumConnectButton() {
  const account = useCurrentAccount();

  if (account) {
    return (
      <motion.div
        className="glass-card px-4 py-2 rounded-xl neon-glow hover-lift"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--gradient-accent)' }}
          >
            <Zap className="w-4 h-4" style={{ color: 'var(--accent-foreground)' }} />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>
              Connected
            </p>
            <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
              {account.address.slice(0, 6)}...{account.address.slice(-4)}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.button
        className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 neon-glow transition-all duration-300 group relative"
        style={{ 
          background: 'var(--gradient-primary)',
          color: 'var(--primary-foreground)'
        }}
      >
        <div className="shimmer absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Wallet className="w-4 h-4" />
        <span className="hidden sm:inline">Connect Wallet</span>
        <span className="sm:hidden">Connect</span>
      </motion.button>
      
      {/* Hidden ConnectButton for functionality */}
      <div className="absolute inset-0 opacity-0">
        <ConnectButton />
      </div>
    </motion.div>
  );
}

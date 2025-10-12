"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

export default function NetworkBackground() {
  const networkNodes = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      color: ['var(--primary)', 'var(--secondary)', 'var(--accent)'][Math.floor(Math.random() * 3)],
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5,
    }));
  }, []);

  const connections = useMemo(() => {
    const lines = [];
    for (let i = 0; i < networkNodes.length; i++) {
      for (let j = i + 1; j < networkNodes.length; j++) {
        const distance = Math.sqrt(
          Math.pow(networkNodes[i].x - networkNodes[j].x, 2) + 
          Math.pow(networkNodes[i].y - networkNodes[j].y, 2)
        );
        if (distance < 25 && Math.random() > 0.7) {
          lines.push({
            id: `${i}-${j}`,
            x1: networkNodes[i].x,
            y1: networkNodes[i].y,
            x2: networkNodes[j].x,
            y2: networkNodes[j].y,
            opacity: Math.random() * 0.3 + 0.1,
          });
        }
      }
    }
    return lines;
  }, [networkNodes]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Base gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(0, 191, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(22, 242, 179, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #0A0B0F 0%, #13141A 50%, #1A1B23 100%)
          `
        }}
      />
      
      {/* SVG Network Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-40">
        {/* Connection Lines */}
        {connections.map((line) => (
          <motion.line
            key={line.id}
            x1={`${line.x1}%`}
            y1={`${line.y1}%`}
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            stroke="url(#lineGradient)"
            strokeWidth="1"
            opacity={line.opacity}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              delay: Math.random() * 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Network Nodes */}
        {networkNodes.map((node) => (
          <motion.circle
            key={node.id}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r={node.size}
            fill={node.color}
            opacity={0.6}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: node.duration,
              delay: node.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 191, 255, 0.5)" />
            <stop offset="50%" stopColor="rgba(124, 58, 237, 0.5)" />
            <stop offset="100%" stopColor="rgba(22, 242, 179, 0.5)" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Additional glow effects */}
      <div className="absolute inset-0">
        {Array.from({ length: 5 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 200 + 100,
              height: Math.random() * 200 + 100,
              background: `radial-gradient(circle, ${
                ['rgba(0, 191, 255, 0.1)', 'rgba(124, 58, 237, 0.1)', 'rgba(22, 242, 179, 0.1)'][i % 3]
              } 0%, transparent 70%)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 8 + 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </div>
  );
}

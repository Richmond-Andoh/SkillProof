"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";

interface StatusIndicatorProps {
  status: "success" | "error" | "warning" | "pending";
  message: string;
  description?: string;
}

export default function StatusIndicator({ status, message, description }: StatusIndicatorProps) {
  const statusConfig = {
    success: {
      icon: CheckCircle2,
      color: "var(--success)",
      bgColor: "rgba(16, 185, 129, 0.1)",
      borderColor: "rgba(16, 185, 129, 0.3)",
    },
    error: {
      icon: XCircle,
      color: "var(--destructive)",
      bgColor: "rgba(239, 68, 68, 0.1)",
      borderColor: "rgba(239, 68, 68, 0.3)",
    },
    warning: {
      icon: AlertTriangle,
      color: "var(--warning)",
      bgColor: "rgba(245, 158, 11, 0.1)",
      borderColor: "rgba(245, 158, 11, 0.3)",
    },
    pending: {
      icon: Clock,
      color: "var(--primary)",
      bgColor: "rgba(0, 191, 255, 0.1)",
      borderColor: "rgba(0, 191, 255, 0.3)",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      className="glass-card rounded-2xl p-6 max-w-md mx-auto"
      style={{
        backgroundColor: config.bgColor,
        border: `1px solid ${config.borderColor}`,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-4">
        <motion.div
          className="flex-shrink-0"
          animate={status === "pending" ? { rotate: 360 } : {}}
          transition={status === "pending" ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: config.bgColor }}
          >
            <Icon className="w-6 h-6" style={{ color: config.color }} />
          </div>
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <motion.h3
            className="text-lg font-semibold mb-1"
            style={{ color: config.color }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {message}
          </motion.h3>
          
          {description && (
            <motion.p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--foreground-muted)' }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {description}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, QrCode, ShieldCheck, Award, CheckCircle2, Sparkles, ArrowRight, Building2, GraduationCap, TrendingUp } from "lucide-react";
import { verifyCertificate } from "@/lib/blockchain";
import CertificateCard from "@/components/CertificateCard";
import type { CertificateVerificationResult } from "@/lib/types";

export default function Home() {
  const [certificateId, setCertificateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CertificateVerificationResult | null>(null);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!certificateId.trim()) {
      setError("Please enter a certificate ID");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const verificationResult = await verifyCertificate(certificateId.trim());
      setResult(verificationResult);
    } catch (err) {
      setError("An error occurred while verifying the certificate. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--gradient-bg)' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl neon-glow animate-float"
          style={{ background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)' }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/2 -left-40 w-96 h-96 rounded-full blur-3xl neon-glow-secondary animate-float"
          style={{ background: 'radial-gradient(circle, var(--secondary-glow) 0%, transparent 70%)' }}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute -bottom-40 right-1/3 w-80 h-80 rounded-full blur-3xl neon-glow-accent animate-float"
          style={{ background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)' }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-6 shimmer"
            style={{ border: '1px solid var(--glass-border)' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" style={{ color: 'var(--primary)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
              Blockchain-Powered Verification
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            style={{ color: 'var(--foreground)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Verify Certificates
            <br />
            <span className="gradient-text">
              Instantly & Securely
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            className="text-lg sm:text-xl max-w-3xl mx-auto mb-8 leading-relaxed"
            style={{ color: 'var(--foreground-muted)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Enter a certificate ID to instantly verify its authenticity on the Sui blockchain.
            Tamper-proof, transparent, and trustworthy verification in seconds.
          </motion.p>

          {/* Stats */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mb-12 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.div 
              className="flex items-center gap-2 sm:gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center neon-glow"
                style={{ backgroundColor: 'var(--primary-glow)' }}
              >
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--primary)' }} />
              </div>
              <div className="text-left">
                <p className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--foreground)' }}>100%</p>
                <p className="text-xs sm:text-sm" style={{ color: 'var(--foreground-muted)' }}>Secure</p>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 sm:gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center neon-glow-accent"
                style={{ backgroundColor: 'var(--accent-glow)' }}
              >
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--accent)' }} />
              </div>
              <div className="text-left">
                <p className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Instant</p>
                <p className="text-xs sm:text-sm" style={{ color: 'var(--foreground-muted)' }}>Verification</p>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 sm:gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center neon-glow-secondary"
                style={{ backgroundColor: 'var(--secondary-glow)' }}
              >
                <Award className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--secondary)' }} />
              </div>
              <div className="text-left">
                <p className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Immutable</p>
                <p className="text-xs sm:text-sm" style={{ color: 'var(--foreground-muted)' }}>Records</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Search Section */}
        <motion.div 
          className="max-w-4xl mx-auto mb-16 px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="glass-card rounded-2xl p-6 sm:p-8 hover:neon-glow transition-all duration-300 group">
            <motion.div 
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 neon-glow group-hover:animate-pulse-glow transition-all duration-300"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--primary-foreground)' }} />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                  Verify Certificate
                </h3>
                <p className="text-xs sm:text-sm truncate" style={{ color: 'var(--foreground-muted)' }}>
                  Enter the certificate ID to begin verification
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div>
                <label 
                  htmlFor="certificateId" 
                  className="block text-sm font-semibold mb-3"
                  style={{ color: 'var(--foreground)' }}
                >
                  Certificate ID (Sui Object ID)
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      id="certificateId"
                      type="text"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="0x..."
                      className="w-full px-5 py-4 rounded-xl outline-none transition-all font-mono text-sm glass-card focus:neon-glow"
                      style={{ 
                        color: 'var(--foreground)',
                        backgroundColor: 'var(--input)',
                        border: '1px solid var(--border)'
                      }}
                      disabled={loading}
                    />
                  </div>
                  <motion.button
                    onClick={handleVerify}
                    disabled={loading}
                    className="px-8 py-4 rounded-xl disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-semibold neon-glow group relative overflow-hidden"
                    style={{ 
                      background: loading ? 'var(--muted)' : 'var(--gradient-primary)',
                      color: loading ? 'var(--foreground-muted)' : 'var(--primary-foreground)'
                    }}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    <div className="shimmer absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        <span>Verify Now</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {error && (
                <motion.div 
                  className="p-4 rounded-xl glass-card"
                  style={{ 
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)'
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm font-medium" style={{ color: 'var(--destructive)' }}>{error}</p>
                </motion.div>
              )}

              {/* Quick Info */}
              <motion.div 
                className="p-5 rounded-xl glass-card"
                style={{ backgroundColor: 'rgba(0, 191, 255, 0.05)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'var(--primary-glow)' }}
                    >
                      <Sparkles className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--primary)' }}>
                      How to find your Certificate ID
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                      The certificate ID can be found in your Sui wallet or provided by the certificate issuer. 
                      It starts with "0x" followed by a 64-character hexadecimal string.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Results Section */}
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {result.exists && result.certificate ? (
              <CertificateCard
                certificate={result.certificate}
                isValid={result.isValid}
                validationMessage={result.validationMessage}
              />
            ) : (
              <div className="max-w-3xl mx-auto glass-card rounded-2xl p-8 text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                >
                  <Search className="w-8 h-8" style={{ color: 'var(--destructive)' }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                  Certificate Not Found
                </h3>
                <p style={{ color: 'var(--foreground-muted)' }}>{result.validationMessage}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Features Section */}
        {!result && (
          <motion.div 
            className="mt-16 sm:mt-20 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {/* Section Header */}
            <motion.div 
              className="text-center mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4" style={{ color: 'var(--foreground)' }}>
                Why Choose <span className="gradient-text">SkillProof</span>?
              </h2>
              <p className="text-base sm:text-lg max-w-2xl mx-auto px-4" style={{ color: 'var(--foreground-muted)' }}>
                Built on cutting-edge blockchain technology to ensure trust and transparency
              </p>
            </motion.div>

            {/* Features Grid */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              {/* Feature 1 */}
              <motion.div 
                className="group glass-card rounded-2xl p-6 sm:p-8 hover:neon-glow transition-all duration-300"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div 
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform neon-glow"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: 'var(--primary-foreground)' }} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3" style={{ color: 'var(--foreground)' }}>
                  Tamper-Proof Security
                </h3>
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                  Certificates are immutably stored on the Sui blockchain, making them impossible to forge, alter, or counterfeit.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Instant Verification
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Verify any certificate in seconds by entering its unique ID. No waiting, no paperwork, just instant results.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <QrCode className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  QR Code Support
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Scan QR codes from physical or digital certificates for quick and convenient verification on any device.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Trusted Institutions
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Only verified educational institutions can issue certificates, ensuring authenticity and credibility.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Student Ownership
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Students own their certificates as non-transferable NFTs, ensuring permanent proof of achievement.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Future-Proof Technology
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Built on Sui blockchain, leveraging cutting-edge technology for scalability and performance.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative mt-24 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">SkillProof</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Blockchain-powered certificate verification platform built on Sui. Secure, transparent, and trustworthy.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/institution" className="text-sm text-gray-600 hover:text-primary transition-colors">
                    For Institutions
                  </a>
                </li>
                <li>
                  <a href="/student" className="text-sm text-gray-600 hover:text-primary transition-colors">
                    For Students
                  </a>
                </li>
                <li>
                  <a href="https://docs.sui.io" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-primary transition-colors">
                    Sui Documentation
                  </a>
                </li>
              </ul>
            </div>

            {/* Technology */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Built With</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  Sui Blockchain
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                  Next.js 15
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                  TypeScript
                </span>
                <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-medium rounded-full">
                  Tailwind CSS
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600">
                © 2025 SkillProof. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Powered by</span>
                <a 
                  href="https://sui.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Sui Network
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

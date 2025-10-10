"use client";

import { useState } from "react";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fadeIn">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary/20 shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Blockchain-Powered Verification</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Verify Certificates
            <br />
            <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Instantly & Securely
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Enter a certificate ID to instantly verify its authenticity on the Sui blockchain.
            Tamper-proof, transparent, and trustworthy verification in seconds.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-sm text-gray-600">Secure</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-gray-900">Instant</p>
                <p className="text-sm text-gray-600">Verification</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-gray-900">Immutable</p>
                <p className="text-sm text-gray-600">Records</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="max-w-4xl mx-auto mb-16 animate-slideIn">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 p-8 hover:shadow-3xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Verify Certificate</h3>
                <p className="text-sm text-gray-600">Enter the certificate ID to begin verification</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="certificateId" className="block text-sm font-semibold text-gray-700 mb-3">
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
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-gray-900 placeholder:text-gray-400 font-mono text-sm"
                      disabled={loading}
                    />
                  </div>
                  <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="px-8 py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:from-primary/90 hover:to-blue-600/90 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl group"
                  >
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
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl animate-fadeIn">
                  <p className="text-sm text-red-800 font-medium">{error}</p>
                </div>
              )}

              {/* Quick Info */}
              <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">How to find your Certificate ID</p>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      The certificate ID can be found in your Sui wallet or provided by the certificate issuer. 
                      It starts with "0x" followed by a 64-character hexadecimal string.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="animate-fadeIn">
            {result.exists && result.certificate ? (
              <CertificateCard
                certificate={result.certificate}
                isValid={result.isValid}
                validationMessage={result.validationMessage}
              />
            ) : (
              <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Certificate Not Found
                </h3>
                <p className="text-gray-600">{result.validationMessage}</p>
              </div>
            )}
          </div>
        )}

        {/* Features Section */}
        {!result && (
          <div className="mt-20">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Choose SkillProof?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Built on cutting-edge blockchain technology to ensure trust and transparency
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Tamper-Proof Security
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Certificates are immutably stored on the Sui blockchain, making them impossible to forge, alter, or counterfeit.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Instant Verification
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Verify any certificate in seconds by entering its unique ID. No waiting, no paperwork, just instant results.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <QrCode className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  QR Code Support
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Scan QR codes from physical or digital certificates for quick and convenient verification on any device.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Trusted Institutions
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Only verified educational institutions can issue certificates, ensuring authenticity and credibility.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Student Ownership
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Students own their certificates as non-transferable NFTs, ensuring permanent proof of achievement.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Future-Proof Technology
                </h3>
                <p className="text-gray-600 leading-relaxed">
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

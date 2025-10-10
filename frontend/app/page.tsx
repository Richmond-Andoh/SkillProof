"use client";

import { useState } from "react";
import { Search, Loader2, QrCode, ShieldCheck } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Verify Educational Certificates
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter a certificate ID to instantly verify its authenticity on the Sui blockchain.
            Tamper-proof, transparent, and trustworthy.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label htmlFor="certificateId" className="block text-sm font-medium text-gray-700 mb-2">
              Certificate ID (Sui Object ID)
            </label>
            <div className="flex gap-3">
              <input
                id="certificateId"
                type="text"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="0x..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={loading}
              />
              <button
                onClick={handleVerify}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Verify
                  </>
                )}
              </button>
            </div>

            {error && (
              <p className="mt-3 text-sm text-red-600">{error}</p>
            )}

            {/* Quick Info */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> You can find the certificate ID in your Sui wallet or from the
                certificate issuer. It starts with "0x" followed by a long hexadecimal string.
              </p>
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
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tamper-Proof
              </h3>
              <p className="text-gray-600">
                Certificates are stored on the Sui blockchain, making them impossible to forge or alter.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Instant Verification
              </h3>
              <p className="text-gray-600">
                Verify any certificate in seconds by simply entering its unique ID.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                QR Code Support
              </h3>
              <p className="text-gray-600">
                Scan QR codes from certificates for quick and easy verification.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 text-sm">
            Powered by Sui Blockchain • Built with Next.js & TypeScript
          </p>
        </div>
      </footer>
    </div>
  );
}

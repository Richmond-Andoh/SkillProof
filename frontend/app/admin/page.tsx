"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, XCircle, Search, Loader2, Building2, Calendar, MapPin, Mail, Users, Award, AlertTriangle } from "lucide-react";
import { getInstitutions, verifyInstitution, unverifyInstitution } from "@/lib/admin-blockchain";
import type { Institution } from "@/lib/types";

export default function AdminPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadInstitutions();
  }, []);

  const loadInstitutions = async () => {
    try {
      setLoading(true);
      const data = await getInstitutions();
      setInstitutions(data);
    } catch (err) {
      setError("Failed to load institutions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyInstitution = async (address: string, isVerified: boolean) => {
    try {
      setVerifyingId(address);
      setError("");
      
      if (isVerified) {
        await unverifyInstitution(address);
      } else {
        await verifyInstitution(address);
      }
      
      // Reload institutions to get updated status
      await loadInstitutions();
    } catch (err) {
      setError(`Failed to ${isVerified ? 'unverify' : 'verify'} institution`);
      console.error(err);
    } finally {
      setVerifyingId(null);
    }
  };

  const filteredInstitutions = institutions.filter(institution =>
    institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    institution.contactInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    institution.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const verifiedCount = institutions.filter(inst => inst.verified).length;
  const pendingCount = institutions.filter(inst => !inst.verified).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-300">Manage institution verification</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div 
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{institutions.length}</p>
                  <p className="text-sm text-slate-300">Total Institutions</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{verifiedCount}</p>
                  <p className="text-sm text-slate-300">Verified</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{pendingCount}</p>
                  <p className="text-sm text-slate-300">Pending Verification</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search institutions by name, contact, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div 
            className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-red-300 font-medium">{error}</p>
          </motion.div>
        )}

        {/* Institutions List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            <span className="ml-3 text-slate-300">Loading institutions...</span>
          </div>
        ) : (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {filteredInstitutions.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No institutions found</h3>
                <p className="text-slate-400">
                  {searchTerm ? "Try adjusting your search terms" : "No institutions have registered yet"}
                </p>
              </div>
            ) : (
              filteredInstitutions.map((institution, index) => (
                <motion.div
                  key={institution.address}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Institution Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          institution.verified 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {institution.verified ? (
                            <CheckCircle2 className="w-6 h-6" />
                          ) : (
                            <AlertTriangle className="w-6 h-6" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white truncate">
                              {institution.name}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              institution.verified
                                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            }`}>
                              {institution.verified ? 'Verified' : 'Pending'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-slate-300">
                              <Mail className="w-4 h-4 text-slate-400" />
                              <span className="truncate">{institution.contactInfo}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              <span className="font-mono text-xs truncate">{institution.address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              <span>Registered {new Date(institution.registeredAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <Award className="w-4 h-4 text-slate-400" />
                              <span>{institution.certificatesIssued} certificates issued</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      <motion.button
                        onClick={() => handleVerifyInstitution(institution.address, institution.verified)}
                        disabled={verifyingId === institution.address}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                          institution.verified
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                            : 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        whileHover={{ scale: verifyingId === institution.address ? 1 : 1.05 }}
                        whileTap={{ scale: verifyingId === institution.address ? 1 : 0.95 }}
                      >
                        {verifyingId === institution.address ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : institution.verified ? (
                          <>
                            <XCircle className="w-4 h-4" />
                            <span>Unverify</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Verify</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

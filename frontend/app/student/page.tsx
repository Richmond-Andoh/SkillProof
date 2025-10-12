"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Award, AlertCircle, GraduationCap, Sparkles, BookOpen, Trophy, Star, Target } from "lucide-react";
import MyCertificatesList from "@/components/student/MyCertificatesList";
import StudentProfile from "@/components/student/StudentProfile";
import ParticleBackground from "@/components/ParticleBackground";

export default function StudentDashboard() {
  const currentAccount = useCurrentAccount();
  const [activeTab, setActiveTab] = useState("certificates");

  if (!currentAccount) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Particle Background */}
        <ParticleBackground />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl neon-glow animate-float"
            style={{ background: 'radial-gradient(circle, var(--secondary-glow) 0%, transparent 70%)' }}
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
            className="absolute top-1/2 -left-40 w-96 h-96 rounded-full blur-3xl neon-glow animate-float"
            style={{ background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)' }}
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div 
            className="max-w-2xl mx-auto glass-card rounded-2xl neon-glow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center p-8">
              <motion.div 
                className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-6 neon-glow"
                style={{ background: 'var(--gradient-accent)' }}
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <GraduationCap className="h-10 w-10" style={{ color: 'var(--primary-foreground)' }} />
              </motion.div>
              <motion.h1 
                className="text-3xl font-display mb-4 gradient-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Student Dashboard
              </motion.h1>
              <motion.p 
                className="text-lg font-body mb-8"
                style={{ color: 'var(--foreground-muted)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                View and manage your blockchain-verified certificates
              </motion.p>
              <motion.div 
                className="glass-card rounded-xl p-6"
                style={{ 
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)'
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5" style={{ color: 'var(--warning)' }} />
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                    Please connect your Sui wallet to access your student dashboard and view your certificates.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl neon-glow animate-float"
          style={{ background: 'radial-gradient(circle, var(--secondary-glow) 0%, transparent 70%)' }}
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
          className="absolute top-1/2 -left-40 w-96 h-96 rounded-full blur-3xl neon-glow animate-float"
          style={{ background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)' }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute -bottom-40 right-1/3 w-80 h-80 rounded-full blur-3xl neon-glow animate-float"
          style={{ background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)' }}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Header */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
            <motion.div 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center neon-glow"
              style={{ background: 'var(--gradient-accent)' }}
              whileHover={{ scale: 1.05, rotate: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10" style={{ color: 'var(--primary-foreground)' }} />
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <motion.h1 
                  className="text-3xl sm:text-4xl lg:text-5xl font-display gradient-text"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Student Dashboard
                </motion.h1>
                <motion.div
                  animate={{ 
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Star className="h-6 w-6" style={{ color: 'var(--accent)' }} />
                </motion.div>
              </div>
              <motion.p 
                className="font-body text-base sm:text-lg"
                style={{ color: 'var(--foreground-muted)' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                View and manage your blockchain-verified certificates
              </motion.p>
            </div>
          </div>

          {/* Quick Stats */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div 
              className="glass-card rounded-2xl p-6 neon-glow hover-lift"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--secondary) 0%, var(--accent) 100%)' }}
                >
                  <Award className="h-6 w-6" style={{ color: 'var(--primary-foreground)' }} />
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>0</p>
                  <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Total Certificates</p>
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="glass-card rounded-2xl p-6 neon-glow hover-lift"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)' }}
                >
                  <BookOpen className="h-6 w-6" style={{ color: 'var(--primary-foreground)' }} />
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>0</p>
                  <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Courses Completed</p>
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="glass-card rounded-2xl p-6 neon-glow hover-lift"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}
                >
                  <Trophy className="h-6 w-6" style={{ color: 'var(--primary-foreground)' }} />
                </div>
                <div>
                  <p className="text-2xl font-bold gradient-text">Active</p>
                  <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Student Status</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="glass-card rounded-2xl p-2 neon-glow">
              <TabsList className="grid w-full grid-cols-2 bg-transparent gap-2">
                <TabsTrigger 
                  value="certificates" 
                  className="flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-semibold data-[state=active]:neon-glow"
                  style={{
                    background: activeTab === 'certificates' ? 'var(--gradient-accent)' : 'transparent',
                    color: activeTab === 'certificates' ? 'var(--primary-foreground)' : 'var(--foreground-muted)'
                  }}
                >
                  <Award className="h-4 w-4" />
                  <span className="hidden sm:inline">My Certificates</span>
                  <span className="sm:hidden">Certificates</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="profile" 
                  className="flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-semibold data-[state=active]:neon-glow"
                  style={{
                    background: activeTab === 'profile' ? 'var(--gradient-accent)' : 'transparent',
                    color: activeTab === 'profile' ? 'var(--primary-foreground)' : 'var(--foreground-muted)'
                  }}
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                  <span className="sm:hidden">Profile</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="certificates" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <MyCertificatesList />
              </motion.div>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <StudentProfile />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

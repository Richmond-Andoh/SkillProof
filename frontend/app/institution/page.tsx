"use client";

import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Award, Settings, AlertCircle, Sparkles, FileText, Users } from "lucide-react";
import MintCertificateForm from "@/components/institution/MintCertificateForm";
import IssuedCertificatesList from "@/components/institution/IssuedCertificatesList";
import InstitutionProfile from "@/components/institution/InstitutionProfile";
import RegisterInstitutionForm from "@/components/institution/RegisterInstitutionForm";

export default function InstitutionDashboard() {
  const currentAccount = useCurrentAccount();
  const [activeTab, setActiveTab] = useState("mint");

  if (!currentAccount) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto border-2 border-primary/20 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Institution Dashboard
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Manage your institution profile and issue certificates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <AlertDescription className="text-amber-900 font-medium">
                  Please connect your Sui wallet to access the institution dashboard and start issuing certificates.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative container mx-auto px-4 py-8 sm:py-12">
        {/* Hero Header */}
        <div className="mb-10 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                  Institution Dashboard
                </h1>
                <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <p className="text-gray-600 text-base sm:text-lg">
                Issue and manage certificates for your students on the blockchain
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <Card className="bg-white/80 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-600">Certificates Issued</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-600">Active Students</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">Active</p>
                    <p className="text-sm text-gray-600">Institution Status</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8 animate-slideIn">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200/50">
            <TabsList className="grid w-full grid-cols-3 bg-transparent gap-2">
              <TabsTrigger 
                value="mint" 
                className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg py-3 rounded-xl transition-all"
              >
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline font-semibold">Mint Certificate</span>
                <span className="sm:hidden font-semibold">Mint</span>
              </TabsTrigger>
              <TabsTrigger 
                value="certificates" 
                className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg py-3 rounded-xl transition-all"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline font-semibold">My Certificates</span>
                <span className="sm:hidden font-semibold">Certs</span>
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg py-3 rounded-xl transition-all"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline font-semibold">Profile</span>
                <span className="sm:hidden font-semibold">Profile</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="mint" className="space-y-6 animate-fadeIn">
            <Card className="border-2 border-primary/20 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-600/5 border-b border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Issue New Certificate</CardTitle>
                    <CardDescription className="text-base">
                      Create and mint a new certificate for a student
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <MintCertificateForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6 animate-fadeIn">
            <Card className="border-2 border-primary/20 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-600/5 border-b border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Issued Certificates</CardTitle>
                    <CardDescription className="text-base">
                      View and manage all certificates issued by your institution
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <IssuedCertificatesList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6 animate-fadeIn">
            <InstitutionProfile />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

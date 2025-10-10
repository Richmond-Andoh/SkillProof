"use client";

import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Award, AlertCircle, GraduationCap } from "lucide-react";
import MyCertificatesList from "@/components/student/MyCertificatesList";
import StudentProfile from "@/components/student/StudentProfile";

export default function StudentDashboard() {
  const currentAccount = useCurrentAccount();
  const [activeTab, setActiveTab] = useState("certificates");

  if (!currentAccount) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto border-2">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              Student Dashboard
            </CardTitle>
            <CardDescription className="text-base">
              View and manage your certificates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="border-amber-200 bg-amber-50/50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900">
                Please connect your wallet to access the student dashboard.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Header */}
      <div className="mb-8 pb-6 border-b">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">
              Student Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              View and manage your certificates
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid h-auto p-1">
          <TabsTrigger value="certificates" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5">
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">My Certificates</span>
            <span className="sm:hidden">Certificates</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2.5">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
            <span className="sm:hidden">Profile</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="certificates" className="space-y-6">
          <MyCertificatesList />
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <StudentProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
}

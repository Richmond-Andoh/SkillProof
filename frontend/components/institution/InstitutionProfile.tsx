"use client";

import { useState, useEffect } from "react";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Building2, CheckCircle2, XCircle, AlertCircle, TrendingUp, Calendar, Award, Sparkles } from "lucide-react";
import { REGISTRY_ID, PACKAGE_ID } from "@/lib/config";
import RegisterInstitutionForm from "@/components/institution/RegisterInstitutionForm";

interface InstitutionData {
  name: string;
  contactInfo: string;
  verified: boolean;
  registeredAt: string;
  certificatesIssued: string;
}

export default function InstitutionProfile() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const [institutionData, setInstitutionData] = useState<InstitutionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const checkInstitutionStatus = async () => {
    if (!currentAccount) return;

    setIsLoading(true);
    setError(null);

    try {
      // Query for InstitutionRegistered event to check if institution exists
      const events = await suiClient.queryEvents({
        query: {
          MoveEventType: `${PACKAGE_ID}::skillproof::InstitutionRegistered`,
        },
        limit: 50,
      });

      // Find event for current account
      const institutionEvent = events.data.find(
        (event: any) => event.parsedJson?.institution_address === currentAccount.address
      );

      if (institutionEvent) {
        // Institution is registered, now check verification status
        // We'll query for verification events
        const verifyEvents = await suiClient.queryEvents({
          query: {
            MoveEventType: `${PACKAGE_ID}::skillproof::InstitutionVerified`,
          },
          limit: 50,
        });

        const isVerified = verifyEvents.data.some(
          (event: any) => event.parsedJson?.institution_address === currentAccount.address
        );

        // Count certificates issued by this institution
        const certEvents = await suiClient.queryEvents({
          query: {
            MoveEventType: `${PACKAGE_ID}::skillproof::CertificateMinted`,
          },
          limit: 100,
        });

        const certificatesIssued = certEvents.data.filter(
          (event: any) => event.parsedJson?.institution_address === currentAccount.address
        ).length;

        const eventData = institutionEvent.parsedJson as any;
        
        setInstitutionData({
          name: eventData?.name || "Unknown",
          contactInfo: "", // Not available in event
          verified: isVerified,
          registeredAt: institutionEvent.timestampMs || "0",
          certificatesIssued: certificatesIssued.toString(),
        });
        setIsRegistered(true);
      } else {
        setIsRegistered(false);
      }
    } catch (err: any) {
      console.error("Error checking institution status:", err);
      setIsRegistered(false);
      // Don't set error for not found, just show registration form
      if (!err.message?.includes("not found")) {
        setError(err.message || "Failed to fetch institution data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentAccount) {
      checkInstitutionStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount]);

  const formatDate = (timestamp: string) => {
    if (timestamp === "0") return "N/A";
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading institution profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!isRegistered) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              Register Your Institution
            </CardTitle>
            <CardDescription className="text-base">
              Join SkillProof to start issuing blockchain-verified certificates to your students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterInstitutionForm onSuccess={checkInstitutionStatus} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Card with Institution Info */}
      <Card className="bg-gradient-to-br from-primary/5 via-primary/3 to-background border-primary/20">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl mb-2">
                  {institutionData?.name || "Institution Profile"}
                </CardTitle>
                <CardDescription className="text-base">
                  Registered on {formatDate(institutionData?.registeredAt || "0")}
                </CardDescription>
              </div>
            </div>
            {institutionData?.verified ? (
              <Badge variant="default" className="flex items-center gap-1.5 px-3 py-1.5 text-sm w-fit">
                <CheckCircle2 className="h-4 w-4" />
                Verified Institution
              </Badge>
            ) : (
              <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5 text-sm w-fit">
                <AlertCircle className="h-4 w-4" />
                Pending Verification
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Wallet Address */}
          <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border">
            <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Wallet Address
            </p>
            <p className="text-sm font-mono bg-muted/50 p-3 rounded border break-all">
              {currentAccount?.address}
            </p>
          </div>

          {!institutionData?.verified && (
            <Alert className="border-amber-200 bg-amber-50/50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900">
                <strong>Verification Pending:</strong> Your institution is registered but not yet verified. 
                Please contact the platform administrator to complete verification and start issuing certificates.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold mb-1">{institutionData?.certificatesIssued || "0"}</p>
            <p className="text-sm text-muted-foreground">Certificates Issued</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">
              {institutionData?.verified ? "Active" : "Pending"}
            </p>
            <p className="text-sm text-muted-foreground">Verification Status</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">
              {institutionData?.registeredAt
                ? Math.floor(
                    (Date.now() - parseInt(institutionData.registeredAt)) /
                      (1000 * 60 * 60 * 24)
                  )
                : "0"}
            </p>
            <p className="text-sm text-muted-foreground">Days Active</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Card */}
      {institutionData?.verified && (
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Ready to Issue Certificates</p>
                <p className="text-sm text-muted-foreground">
                  Your institution is verified and ready to mint certificates on the blockchain
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

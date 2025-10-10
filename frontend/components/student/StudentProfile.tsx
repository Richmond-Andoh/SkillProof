"use client";

import { useState, useEffect } from "react";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User, Award, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

export default function StudentProfile() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const [stats, setStats] = useState({
    totalCertificates: 0,
    validCertificates: 0,
    expiredCertificates: 0,
    revokedCertificates: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentAccount) {
      fetchStudentStats();
    }
  }, [currentAccount]);

  const fetchStudentStats = async () => {
    if (!currentAccount) return;

    setIsLoading(true);

    try {
      // Get all owned Certificate objects
      const ownedObjects = await suiClient.getOwnedObjects({
        owner: currentAccount.address,
        options: {
          showContent: true,
          showType: true,
        },
      });

      // Filter for Certificate objects
      const certificateObjects = ownedObjects.data.filter((obj) =>
        obj.data?.type?.includes("::skillproof::Certificate")
      );

      let valid = 0;
      let expired = 0;
      let revoked = 0;

      certificateObjects.forEach((obj) => {
        if (obj.data?.content?.dataType === "moveObject") {
          const fields = obj.data.content.fields as any;
          const isRevoked = fields.revoked || false;
          const expirationDate = fields.expiration_date || "0";
          const isExpired =
            expirationDate !== "0" && Date.now() > parseInt(expirationDate);

          if (isRevoked) {
            revoked++;
          } else if (isExpired) {
            expired++;
          } else {
            valid++;
          }
        }
      });

      setStats({
        totalCertificates: certificateObjects.length,
        validCertificates: valid,
        expiredCertificates: expired,
        revokedCertificates: revoked,
      });
    } catch (err) {
      console.error("Error fetching student stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-6 w-6" />
            Student Profile
          </CardTitle>
          <CardDescription>Your wallet information and certificate statistics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Wallet Address</p>
              <p className="text-sm font-mono bg-muted p-2 rounded break-all mt-1">
                {currentAccount?.address}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Certificates</p>
              <p className="text-3xl font-bold mt-1">{stats.totalCertificates}</p>
            </div>
          </div>

          {stats.totalCertificates > 0 && (
            <Alert>
              <Award className="h-4 w-4" />
              <AlertDescription>
                You have {stats.validCertificates} valid certificate
                {stats.validCertificates !== 1 ? "s" : ""} in your wallet.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Certificate Statistics</CardTitle>
          <CardDescription>Breakdown of your certificates by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Award className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-3xl font-bold">{stats.totalCertificates}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.validCertificates}
              </p>
              <p className="text-sm text-muted-foreground">Valid</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-600 dark:text-yellow-400" />
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.expiredCertificates}
              </p>
              <p className="text-sm text-muted-foreground">Expired</p>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <XCircle className="h-8 w-8 mx-auto mb-2 text-red-600 dark:text-red-400" />
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {stats.revokedCertificates}
              </p>
              <p className="text-sm text-muted-foreground">Revoked</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Use Your Certificates</CardTitle>
          <CardDescription>Tips for managing and sharing your certificates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">1</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">View Certificate Details</h4>
                <p className="text-sm text-muted-foreground">
                  Click on any certificate to see complete information including institution details,
                  issue date, and verification status.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">2</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Verify on Blockchain</h4>
                <p className="text-sm text-muted-foreground">
                  Use the "Blockchain" button to view your certificate on the Sui blockchain explorer
                  for complete transparency.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">3</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Share with Employers</h4>
                <p className="text-sm text-muted-foreground">
                  Share your certificate ID with potential employers or verifiers. They can verify it
                  instantly on the home page.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">4</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Keep Your Wallet Secure</h4>
                <p className="text-sm text-muted-foreground">
                  Your certificates are stored in your Sui wallet. Keep your wallet credentials safe
                  to maintain control of your certificates.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

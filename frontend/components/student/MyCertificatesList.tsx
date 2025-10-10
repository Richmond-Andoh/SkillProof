"use client";

import { useState, useEffect } from "react";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Award, ExternalLink, AlertCircle, Download, Share2, QrCode as QrCodeIcon, RefreshCw, Building2, Calendar, Sparkles } from "lucide-react";
import CertificateDetailModal from "./CertificateDetailModal";

interface Certificate {
  id: string;
  studentName: string;
  courseName: string;
  institutionName: string;
  institutionAddress: string;
  issueDate: string;
  expirationDate: string;
  ipfsLink: string;
  certificateHash: string;
  revoked: boolean;
  metadata: string;
}

export default function MyCertificatesList() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    if (currentAccount) {
      fetchMyCertificates();
    }
  }, [currentAccount]);

  const fetchMyCertificates = async () => {
    if (!currentAccount) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get all owned objects of Certificate type
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

      // Parse certificate data
      const parsedCertificates: Certificate[] = certificateObjects
        .map((obj) => {
          if (obj.data?.content?.dataType === "moveObject") {
            const fields = obj.data.content.fields as any;
            return {
              id: obj.data.objectId,
              studentName: fields.student_name || "",
              courseName: fields.course_name || "",
              institutionName: fields.institution_name || "",
              institutionAddress: fields.institution_address || "",
              issueDate: fields.issue_date || "0",
              expirationDate: fields.expiration_date || "0",
              ipfsLink: fields.ipfs_link || "",
              certificateHash: fields.certificate_hash || "",
              revoked: fields.revoked || false,
              metadata: fields.metadata || "",
            };
          }
          return null;
        })
        .filter((cert): cert is Certificate => cert !== null);

      setCertificates(parsedCertificates);
    } catch (err: any) {
      console.error("Error fetching certificates:", err);
      setError(err.message || "Failed to fetch certificates");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    if (timestamp === "0") return "No expiration";
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString();
  };

  const isExpired = (expirationDate: string) => {
    if (expirationDate === "0") return false;
    return Date.now() > parseInt(expirationDate);
  };

  const getCertificateStatus = (cert: Certificate) => {
    if (cert.revoked) return { label: "Revoked", variant: "destructive" as const };
    if (isExpired(cert.expirationDate)) return { label: "Expired", variant: "secondary" as const };
    return { label: "Valid", variant: "default" as const };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading your certificates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (certificates.length === 0) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Award className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-2xl font-semibold mb-3">No Certificates Yet</h3>
          <p className="text-muted-foreground mb-2 max-w-md">
            You don't have any certificates in your wallet yet.
          </p>
          <p className="text-sm text-muted-foreground max-w-md">
            Certificates will appear here once an institution issues one to your wallet address.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header Stats */}
        <Card className="bg-gradient-to-br from-primary/5 via-primary/3 to-background border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Award className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{certificates.length}</p>
                  <p className="text-sm text-muted-foreground">
                    {certificates.length === 1 ? 'Certificate' : 'Certificates'} in Wallet
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={fetchMyCertificates} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Certificates Grid */}
        <div className="grid gap-4">
          {certificates.map((cert) => {
            const status = getCertificateStatus(cert);
            
            return (
              <Card
                key={cert.id}
                className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01] overflow-hidden"
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Award className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold leading-tight">{cert.courseName}</h3>
                          <p className="text-base text-muted-foreground mt-1">{cert.studentName}</p>
                        </div>
                      </div>
                    </div>
                    <Badge variant={status.variant} className="text-sm px-3 py-1">
                      {status.label}
                    </Badge>
                  </div>

                  {/* Details Grid */}
                  <div className="grid gap-3 mb-6">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Institution
                      </span>
                      <span className="font-medium text-sm">{cert.institutionName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col p-3 bg-muted/50 rounded-lg">
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Issue Date
                        </span>
                        <span className="font-medium text-sm">{formatDate(cert.issueDate)}</span>
                      </div>
                      <div className="flex flex-col p-3 bg-muted/50 rounded-lg">
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Expiration
                        </span>
                        <span className="font-medium text-sm">{formatDate(cert.expirationDate)}</span>
                      </div>
                    </div>
                    {cert.metadata && (
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Details
                        </span>
                        <span className="font-medium text-sm">{cert.metadata}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setSelectedCertificate(cert)}
                      className="gap-2"
                    >
                      <Award className="h-4 w-4" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `https://devnet.suivision.xyz/object/${cert.id}`,
                          "_blank"
                        )
                      }
                      className="gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Explorer
                    </Button>
                    <Button variant="outline" size="sm" disabled className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" disabled className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" disabled className="gap-2">
                      <QrCodeIcon className="h-4 w-4" />
                      QR Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {selectedCertificate && (
        <CertificateDetailModal
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </>
  );
}

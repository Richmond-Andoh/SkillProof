"use client";

import { useState, useEffect } from "react";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Award, ExternalLink, AlertCircle, Ban, Edit } from "lucide-react";
import { PACKAGE_ID } from "@/lib/config";

interface Certificate {
  id: string;
  studentName: string;
  courseName: string;
  issueDate: string;
  expirationDate: string;
  revoked: boolean;
  metadata: string;
}

export default function IssuedCertificatesList() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentAccount) {
      fetchIssuedCertificates();
    }
  }, [currentAccount]);

  const fetchIssuedCertificates = async () => {
    if (!currentAccount) return;

    setIsLoading(true);
    setError(null);

    try {
      // Query for CertificateMinted events from this institution
      const events = await suiClient.queryEvents({
        query: {
          MoveEventType: `${PACKAGE_ID}::skillproof::CertificateMinted`,
        },
        limit: 50,
      });

      // Filter events by institution address
      const institutionEvents = events.data.filter(
        (event: any) => event.parsedJson?.institution_address === currentAccount.address
      );

      // Fetch certificate details for each event
      const certificatePromises = institutionEvents.map(async (event: any) => {
        const certId = event.parsedJson?.certificate_id;
        if (!certId) return null;

        try {
          const certObject = await suiClient.getObject({
            id: certId,
            options: { showContent: true },
          });

          if (certObject.data?.content?.dataType === "moveObject") {
            const fields = certObject.data.content.fields as any;
            return {
              id: certId,
              studentName: fields.student_name || "",
              courseName: fields.course_name || "",
              issueDate: fields.issue_date || "0",
              expirationDate: fields.expiration_date || "0",
              revoked: fields.revoked || false,
              metadata: fields.metadata || "",
            };
          }
        } catch (err) {
          console.error(`Error fetching certificate ${certId}:`, err);
          return null;
        }
        return null;
      });

      const fetchedCertificates = (await Promise.all(certificatePromises)).filter(
        (cert): cert is Certificate => cert !== null
      );

      setCertificates(fetchedCertificates);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
      <div className="text-center py-12">
        <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Certificates Issued Yet</h3>
        <p className="text-muted-foreground mb-4">
          Start by minting your first certificate in the "Mint Certificate" tab.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Total certificates issued: <span className="font-semibold">{certificates.length}</span>
        </p>
        <Button variant="outline" size="sm" onClick={fetchIssuedCertificates}>
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {certificates.map((cert) => (
          <Card key={cert.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    {cert.studentName}
                  </CardTitle>
                  <CardDescription>{cert.courseName}</CardDescription>
                </div>
                <div className="flex gap-2">
                  {cert.revoked ? (
                    <Badge variant="destructive">Revoked</Badge>
                  ) : (
                    <Badge variant="default">Active</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issue Date:</span>
                  <span className="font-medium">{formatDate(cert.issueDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expiration:</span>
                  <span className="font-medium">{formatDate(cert.expirationDate)}</span>
                </div>
                {cert.metadata && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Metadata:</span>
                    <span className="font-medium">{cert.metadata}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-muted-foreground text-xs">
                    ID: {cert.id.slice(0, 8)}...{cert.id.slice(-6)}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `https://devnet.suivision.xyz/object/${cert.id}`,
                          "_blank"
                        )
                      }
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {!cert.revoked && (
                      <>
                        <Button variant="outline" size="sm" disabled>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" disabled>
                          <Ban className="h-4 w-4 mr-1" />
                          Revoke
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

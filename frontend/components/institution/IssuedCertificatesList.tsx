"use client";

import { useState, useEffect } from "react";
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Award, ExternalLink, AlertCircle, Ban, Edit, RefreshCw } from "lucide-react";
import { PACKAGE_ID, REGISTRY_ID } from "@/lib/config";

interface Certificate {
  id: string;
  studentName: string;
  courseName: string;
  issueDate: string;
  expirationDate: string;
  revoked: boolean;
  metadata: string;
  ipfsLink: string;
}

export default function IssuedCertificatesList() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newMetadata, setNewMetadata] = useState("");
  const [newIpfsLink, setNewIpfsLink] = useState("");

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
              ipfsLink: fields.ipfs_link || "",
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

  const handleRevoke = async () => {
    if (!selectedCert || !currentAccount) return;

    setIsProcessing(true);
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::skillproof::revoke_certificate`,
        arguments: [
          tx.object(REGISTRY_ID),
          tx.object(selectedCert.id),
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            setShowRevokeDialog(false);
            setSelectedCert(null);
            fetchIssuedCertificates();
          },
          onError: (error) => {
            console.error("Revoke failed:", error);
            setError(error.message || "Failed to revoke certificate");
          },
        }
      );
    } catch (err: any) {
      console.error("Error revoking certificate:", err);
      setError(err.message || "Failed to revoke certificate");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateMetadata = async () => {
    if (!selectedCert || !currentAccount || !newMetadata.trim()) return;

    setIsProcessing(true);
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::skillproof::update_certificate_metadata`,
        arguments: [
          tx.object(REGISTRY_ID),
          tx.object(selectedCert.id),
          tx.pure.string(newMetadata),
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            setShowEditDialog(false);
            setSelectedCert(null);
            setNewMetadata("");
            setNewIpfsLink("");
            fetchIssuedCertificates();
          },
          onError: (error) => {
            console.error("Update failed:", error);
            setError(error.message || "Failed to update certificate");
          },
        }
      );
    } catch (err: any) {
      console.error("Error updating certificate:", err);
      setError(err.message || "Failed to update certificate");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateIpfs = async () => {
    if (!selectedCert || !currentAccount || !newIpfsLink.trim()) return;

    setIsProcessing(true);
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::skillproof::update_certificate_ipfs`,
        arguments: [
          tx.object(REGISTRY_ID),
          tx.object(selectedCert.id),
          tx.pure.string(newIpfsLink),
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            setShowEditDialog(false);
            setSelectedCert(null);
            setNewMetadata("");
            setNewIpfsLink("");
            fetchIssuedCertificates();
          },
          onError: (error) => {
            console.error("Update failed:", error);
            setError(error.message || "Failed to update IPFS link");
          },
        }
      );
    } catch (err: any) {
      console.error("Error updating IPFS link:", err);
      setError(err.message || "Failed to update IPFS link");
    } finally {
      setIsProcessing(false);
    }
  };

  const openEditDialog = (cert: Certificate) => {
    setSelectedCert(cert);
    setNewMetadata(cert.metadata);
    setNewIpfsLink(cert.ipfsLink);
    setShowEditDialog(true);
  };

  const openRevokeDialog = (cert: Certificate) => {
    setSelectedCert(cert);
    setShowRevokeDialog(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading issued certificates...</p>
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
          <h3 className="text-2xl font-semibold mb-3">No Certificates Issued Yet</h3>
          <p className="text-muted-foreground max-w-md">
            Start by minting your first certificate in the "Mint Certificate" tab.
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
                    {certificates.length === 1 ? 'Certificate' : 'Certificates'} Issued
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={fetchIssuedCertificates} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditDialog(cert)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => openRevokeDialog(cert)}
                        >
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

      {/* Revoke Dialog */}
      <Dialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Certificate</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke this certificate? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedCert && (
            <div className="space-y-3 py-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Student: {selectedCert.studentName}</p>
                <p className="text-sm text-muted-foreground">Course: {selectedCert.courseName}</p>
              </div>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Once revoked, this certificate will be marked as invalid on the blockchain.
                </AlertDescription>
              </Alert>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRevokeDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRevoke} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Revoking...
                </>
              ) : (
                'Revoke Certificate'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Certificate</DialogTitle>
            <DialogDescription>
              Update the metadata or IPFS link for this certificate. Core fields cannot be changed.
            </DialogDescription>
          </DialogHeader>
          {selectedCert && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Student: {selectedCert.studentName}</p>
                <p className="text-sm text-muted-foreground">Course: {selectedCert.courseName}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="metadata">Metadata</Label>
                <Textarea
                  id="metadata"
                  placeholder="Additional information, honors, grades, etc."
                  value={newMetadata}
                  onChange={(e) => setNewMetadata(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Update additional details about the certificate
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ipfs">IPFS Link</Label>
                <Input
                  id="ipfs"
                  placeholder="ipfs://..."
                  value={newIpfsLink}
                  onChange={(e) => setNewIpfsLink(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Update the link to the certificate file on IPFS
                </p>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Note: Student name, course name, and issue date cannot be modified. If these need to be changed, revoke this certificate and issue a new one.
                </AlertDescription>
              </Alert>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateIpfs} 
              disabled={isProcessing || !newIpfsLink.trim()}
              variant="outline"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update IPFS'
              )}
            </Button>
            <Button 
              onClick={handleUpdateMetadata} 
              disabled={isProcessing || !newMetadata.trim()}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Metadata'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

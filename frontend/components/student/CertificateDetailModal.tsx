"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Building2, Calendar, Hash, Link as LinkIcon, FileText, CheckCircle2, XCircle, AlertTriangle, ExternalLink } from "lucide-react";

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

interface CertificateDetailModalProps {
  certificate: Certificate;
  onClose: () => void;
}

export default function CertificateDetailModal({ certificate, onClose }: CertificateDetailModalProps) {
  const formatDate = (timestamp: string) => {
    if (timestamp === "0") return "No expiration";
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString();
  };

  const isExpired = (expirationDate: string) => {
    if (expirationDate === "0") return false;
    return Date.now() > parseInt(expirationDate);
  };

  const getStatusIcon = () => {
    if (certificate.revoked) {
      return <XCircle className="h-6 w-6 text-destructive" />;
    }
    if (isExpired(certificate.expirationDate)) {
      return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    }
    return <CheckCircle2 className="h-6 w-6 text-green-500" />;
  };

  const getStatusText = () => {
    if (certificate.revoked) return "This certificate has been revoked";
    if (isExpired(certificate.expirationDate)) return "This certificate has expired";
    return "This certificate is valid";
  };

  const getStatusVariant = (): "default" | "destructive" | "secondary" => {
    if (certificate.revoked) return "destructive";
    if (isExpired(certificate.expirationDate)) return "secondary";
    return "default";
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">
                Certificate Details
              </DialogTitle>
              <DialogDescription className="text-base">
                Complete information about this certificate
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Banner */}
          <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
            <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center flex-shrink-0">
              {getStatusIcon()}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-lg">{getStatusText()}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Issued on {formatDate(certificate.issueDate)}
              </p>
            </div>
            <Badge variant={getStatusVariant()} className="text-sm px-3 py-1.5">
              {certificate.revoked ? "Revoked" : isExpired(certificate.expirationDate) ? "Expired" : "Valid"}
            </Badge>
          </div>

          {/* Student Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Award className="h-4 w-4 text-primary" />
              </div>
              Student Information
            </h3>
            <div className="grid gap-3">
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg border">
                <span className="text-sm text-muted-foreground">Student Name</span>
                <span className="font-semibold">{certificate.studentName}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg border">
                <span className="text-sm text-muted-foreground">Course/Program</span>
                <span className="font-semibold">{certificate.courseName}</span>
              </div>
              {certificate.metadata && (
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg border">
                  <span className="text-sm text-muted-foreground">Additional Details</span>
                  <span className="font-semibold">{certificate.metadata}</span>
                </div>
              )}
            </div>
          </div>

          {/* Institution Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              Issuing Institution
            </h3>
            <div className="grid gap-3">
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg border">
                <span className="text-sm text-muted-foreground">Institution Name</span>
                <span className="font-semibold">{certificate.institutionName}</span>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg border">
                <span className="text-sm text-muted-foreground block mb-2">Institution Address</span>
                <span className="font-mono text-xs break-all text-foreground/80">{certificate.institutionAddress}</span>
              </div>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              Certificate Details
            </h3>
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-2">
                    <Calendar className="h-3.5 w-3.5" />
                    Issue Date
                  </span>
                  <span className="font-semibold text-sm">{formatDate(certificate.issueDate)}</span>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-2">
                    <Calendar className="h-3.5 w-3.5" />
                    Expiration Date
                  </span>
                  <span className="font-semibold text-sm">{formatDate(certificate.expirationDate)}</span>
                </div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg border">
                <span className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                  <Hash className="h-4 w-4" />
                  Certificate ID
                </span>
                <span className="font-mono text-xs break-all text-foreground/80">{certificate.id}</span>
              </div>
              {certificate.certificateHash && (
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <span className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                    <Hash className="h-4 w-4" />
                    Document Hash
                  </span>
                  <span className="font-mono text-xs break-all text-foreground/80">{certificate.certificateHash}</span>
                </div>
              )}
              {certificate.ipfsLink && (
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <span className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                    <LinkIcon className="h-4 w-4" />
                    IPFS Link
                  </span>
                  <a
                    href={certificate.ipfsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs break-all text-primary hover:underline"
                  >
                    {certificate.ipfsLink}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="default"
              onClick={() =>
                window.open(
                  `https://devnet.suivision.xyz/object/${certificate.id}`,
                  "_blank"
                )
              }
              className="flex-1 gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View on Blockchain Explorer
            </Button>
            <Button variant="outline" onClick={onClose} className="px-6">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

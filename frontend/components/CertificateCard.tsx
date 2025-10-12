"use client";

import { Certificate } from "@/lib/types";
import { formatDate, shortenAddress } from "@/lib/blockchain";
import { CheckCircle2, XCircle, Calendar, Building2, User, GraduationCap, ExternalLink, FileText } from "lucide-react";

interface CertificateCardProps {
  certificate: Certificate;
  isValid: boolean;
  validationMessage: string;
}

export default function CertificateCard({
  certificate,
  isValid,
  validationMessage,
}: CertificateCardProps) {
  return (
    <div className="w-full max-w-3xl mx-auto glass-card rounded-2xl overflow-hidden neon-glow">
      {/* Status Banner */}
      <div
        className="px-6 py-4"
        style={{
          backgroundColor: isValid 
            ? 'rgba(16, 185, 129, 0.1)' 
            : 'rgba(239, 68, 68, 0.1)',
          borderBottom: `1px solid ${isValid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
        }}
      >
        <div className="flex items-center gap-3">
          {isValid ? (
            <CheckCircle2 className="w-6 h-6" style={{ color: 'var(--success)' }} />
          ) : (
            <XCircle className="w-6 h-6" style={{ color: 'var(--destructive)' }} />
          )}
          <p
            className="text-lg font-semibold"
            style={{ color: isValid ? 'var(--success)' : 'var(--destructive)' }}
          >
            {validationMessage}
          </p>
        </div>
      </div>

      {/* Certificate Details */}
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-3xl font-bold mb-2 gradient-text">
            Certificate of Completion
          </h2>
          <p style={{ color: 'var(--foreground-muted)' }}>Verified on Sui Blockchain</p>
        </div>

        {/* Student Info */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 mt-1" style={{ color: 'var(--primary)' }} />
            <div>
              <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Student Name</p>
              <p className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                {certificate.studentName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <GraduationCap className="w-5 h-5 mt-1" style={{ color: 'var(--primary)' }} />
            <div>
              <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Course / Program</p>
              <p className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                {certificate.courseName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 mt-1" style={{ color: 'var(--primary)' }} />
            <div>
              <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Issued By</p>
              <p className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                {certificate.institutionName}
              </p>
              <p className="text-xs font-mono mt-1" style={{ color: 'var(--foreground-subtle)' }}>
                {shortenAddress(certificate.institutionAddress)}
              </p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 mt-1" style={{ color: 'var(--foreground-muted)' }} />
            <div>
              <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Issue Date</p>
              <p className="text-base font-medium" style={{ color: 'var(--foreground)' }}>
                {formatDate(certificate.issueDate)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 mt-1" style={{ color: 'var(--foreground-muted)' }} />
            <div>
              <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Expiration Date</p>
              <p className="text-base font-medium" style={{ color: 'var(--foreground)' }}>
                {formatDate(certificate.expirationDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Metadata */}
        {certificate.metadata && (
          <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 mt-1" style={{ color: 'var(--foreground-muted)' }} />
              <div>
                <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Additional Information</p>
                <p className="text-base mt-1" style={{ color: 'var(--foreground)' }}>
                  {certificate.metadata}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Hash */}
        <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-sm mb-1" style={{ color: 'var(--foreground-muted)' }}>Certificate Hash</p>
          <p className="text-xs font-mono p-2 rounded break-all glass-card" style={{ color: 'var(--foreground)' }}>
            {certificate.certificateHash}
          </p>
        </div>

        {/* IPFS Link */}
        {certificate.ipfsLink && (
          <div className="pt-4">
            <a
              href={certificate.ipfsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors neon-glow"
              style={{ background: 'var(--gradient-primary)', color: 'var(--primary-foreground)' }}
            >
              <ExternalLink className="w-4 h-4" />
              View Certificate Document
            </a>
          </div>
        )}

        {/* Blockchain Info */}
        <div className="pt-4 -mx-6 -mb-6 px-6 py-4 glass-card" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--foreground-muted)' }}>Certificate ID (Sui Object)</p>
          <p className="text-xs font-mono break-all" style={{ color: 'var(--foreground-subtle)' }}>
            {certificate.id}
          </p>
        </div>
      </div>
    </div>
  );
}

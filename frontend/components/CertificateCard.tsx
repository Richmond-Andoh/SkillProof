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
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Status Banner */}
      <div
        className={`px-6 py-4 ${
          isValid
            ? "bg-green-50 border-b border-green-200"
            : "bg-red-50 border-b border-red-200"
        }`}
      >
        <div className="flex items-center gap-3">
          {isValid ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : (
            <XCircle className="w-6 h-6 text-red-600" />
          )}
          <p
            className={`text-lg font-semibold ${
              isValid ? "text-green-800" : "text-red-800"
            }`}
          >
            {validationMessage}
          </p>
        </div>
      </div>

      {/* Certificate Details */}
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center border-b pb-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Certificate of Completion
          </h2>
          <p className="text-gray-600">Verified on Sui Blockchain</p>
        </div>

        {/* Student Info */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="text-sm text-gray-600">Student Name</p>
              <p className="text-lg font-semibold text-gray-900">
                {certificate.studentName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <GraduationCap className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="text-sm text-gray-600">Course / Program</p>
              <p className="text-lg font-semibold text-gray-900">
                {certificate.courseName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="text-sm text-gray-600">Issued By</p>
              <p className="text-lg font-semibold text-gray-900">
                {certificate.institutionName}
              </p>
              <p className="text-xs text-gray-500 font-mono mt-1">
                {shortenAddress(certificate.institutionAddress)}
              </p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <p className="text-sm text-gray-600">Issue Date</p>
              <p className="text-base font-medium text-gray-900">
                {formatDate(certificate.issueDate)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <p className="text-sm text-gray-600">Expiration Date</p>
              <p className="text-base font-medium text-gray-900">
                {formatDate(certificate.expirationDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Metadata */}
        {certificate.metadata && (
          <div className="pt-4 border-t">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Additional Information</p>
                <p className="text-base text-gray-900 mt-1">
                  {certificate.metadata}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Hash */}
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600 mb-1">Certificate Hash</p>
          <p className="text-xs font-mono text-gray-700 bg-gray-50 p-2 rounded break-all">
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Certificate Document
            </a>
          </div>
        )}

        {/* Blockchain Info */}
        <div className="pt-4 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-4">
          <p className="text-xs text-gray-600 mb-1">Certificate ID (Sui Object)</p>
          <p className="text-xs font-mono text-gray-700 break-all">
            {certificate.id}
          </p>
        </div>
      </div>
    </div>
  );
}

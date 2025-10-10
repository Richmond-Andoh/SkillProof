/**
 * Blockchain interaction functions
 * Functions to read certificate data from Sui blockchain
 */

import { getSuiClient } from "./sui-client";
import { PACKAGE_ID } from "./config";
import type { Certificate, CertificateVerificationResult } from "./types";

/**
 * Fetch certificate details by object ID
 * @param certificateId - The Sui object ID of the certificate
 * @returns Certificate data or null if not found
 */
export async function getCertificateById(
  certificateId: string
): Promise<Certificate | null> {
  try {
    const client = getSuiClient();

    // Fetch the certificate object from Sui
    const response = await client.getObject({
      id: certificateId,
      options: {
        showContent: true,
        showType: true,
      },
    });

    // Check if object exists
    if (response.data?.content?.dataType !== "moveObject") {
      return null;
    }

    const fields = response.data.content.fields as any;

    // Parse and return certificate data
    return {
      id: certificateId,
      studentName: fields.student_name,
      courseName: fields.course_name,
      institutionName: fields.institution_name,
      institutionAddress: fields.institution_address,
      issueDate: Number(fields.issue_date),
      expirationDate: Number(fields.expiration_date),
      ipfsLink: fields.ipfs_link,
      certificateHash: fields.certificate_hash,
      revoked: fields.revoked,
      metadata: fields.metadata,
    };
  } catch (error) {
    console.error("Error fetching certificate:", error);
    return null;
  }
}

/**
 * Verify a certificate's validity
 * Checks if certificate exists, is not revoked, and not expired
 * @param certificateId - The Sui object ID of the certificate
 * @returns Verification result with validity status
 */
export async function verifyCertificate(
  certificateId: string
): Promise<CertificateVerificationResult> {
  try {
    const certificate = await getCertificateById(certificateId);

    if (!certificate) {
      return {
        exists: false,
        isValid: false,
        validationMessage: "Certificate not found. Please check the ID and try again.",
      };
    }

    // Check if revoked
    if (certificate.revoked) {
      return {
        exists: true,
        certificate,
        isValid: false,
        validationMessage: "This certificate has been revoked by the issuing institution.",
      };
    }

    // Check if expired (0 means no expiration)
    const currentTime = Date.now();
    if (certificate.expirationDate !== 0 && currentTime > certificate.expirationDate) {
      return {
        exists: true,
        certificate,
        isValid: false,
        validationMessage: `This certificate expired on ${new Date(certificate.expirationDate).toLocaleDateString()}.`,
      };
    }

    // Certificate is valid
    return {
      exists: true,
      certificate,
      isValid: true,
      validationMessage: "✓ This certificate is valid and authentic.",
    };
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return {
      exists: false,
      isValid: false,
      validationMessage: "An error occurred while verifying the certificate. Please try again.",
    };
  }
}

/**
 * Get institution details by address
 * @param institutionAddress - The Sui address of the institution
 * @returns Institution data or null if not found
 */
export async function getInstitutionByAddress(
  institutionAddress: string
): Promise<any | null> {
  try {
    const client = getSuiClient();

    // Note: This requires calling a view function on the smart contract
    // For now, we'll return null and implement this when we have the registry ID
    // In production, you would call the get_institution view function

    return null;
  } catch (error) {
    console.error("Error fetching institution:", error);
    return null;
  }
}

/**
 * Format timestamp to readable date
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string
 */
export function formatDate(timestamp: number): string {
  if (timestamp === 0) return "No expiration";
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Shorten Sui address for display
 * @param address - Full Sui address
 * @returns Shortened address (e.g., 0x1234...5678)
 */
export function shortenAddress(address: string): string {
  if (address.length < 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

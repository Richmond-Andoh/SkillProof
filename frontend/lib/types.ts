/**
 * TypeScript types for SkillProof
 */

export interface Certificate {
  id: string;
  studentName: string;
  courseName: string;
  institutionName: string;
  institutionAddress: string;
  issueDate: number;
  expirationDate: number;
  ipfsLink: string;
  certificateHash: string;
  revoked: boolean;
  metadata: string;
}

export interface Institution {
  address: string;
  name: string;
  contactInfo: string;
  verified: boolean;
  registeredAt: number;
  certificatesIssued: number;
}

export interface CertificateVerificationResult {
  exists: boolean;
  certificate?: Certificate;
  isValid: boolean;
  validationMessage: string;
}

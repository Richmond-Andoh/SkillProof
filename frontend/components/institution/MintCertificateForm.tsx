"use client";

import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { PACKAGE_ID, REGISTRY_ID } from "@/lib/config";

export default function MintCertificateForm() {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const [formData, setFormData] = useState({
    studentName: "",
    courseName: "",
    recipientAddress: "",
    expirationDate: "",
    ipfsLink: "",
    certificateHash: "",
    metadata: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentAccount) {
      setTxStatus({
        type: "error",
        message: "Please connect your wallet first",
      });
      return;
    }

    setIsLoading(true);
    setTxStatus({ type: null, message: "" });

    try {
      // Convert expiration date to timestamp (0 means no expiration)
      let expirationTimestamp = 0;
      if (formData.expirationDate) {
        expirationTimestamp = new Date(formData.expirationDate).getTime();
      }

      const tx = new Transaction();

      tx.moveCall({
        target: `${PACKAGE_ID}::skillproof::mint_certificate`,
        arguments: [
          tx.object(REGISTRY_ID),
          tx.pure.string(formData.studentName),
          tx.pure.string(formData.courseName),
          tx.pure.address(formData.recipientAddress),
          tx.pure.u64(expirationTimestamp),
          tx.pure.string(formData.ipfsLink || ""),
          tx.pure.string(formData.certificateHash || ""),
          tx.pure.string(formData.metadata || ""),
        ],
      });

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            console.log("Certificate minted successfully:", result);
            setTxStatus({
              type: "success",
              message: `Certificate minted successfully! Digest: ${result.digest}`,
            });
            // Reset form
            setFormData({
              studentName: "",
              courseName: "",
              recipientAddress: "",
              expirationDate: "",
              ipfsLink: "",
              certificateHash: "",
              metadata: "",
            });
          },
          onError: (error) => {
            console.error("Error minting certificate:", error);
            setTxStatus({
              type: "error",
              message: `Failed to mint certificate: ${error.message}`,
            });
          },
        }
      );
    } catch (error: any) {
      console.error("Error:", error);
      setTxStatus({
        type: "error",
        message: `Error: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="studentName">Student Name *</Label>
          <Input
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleInputChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="courseName">Course/Program Name *</Label>
          <Input
            id="courseName"
            name="courseName"
            value={formData.courseName}
            onChange={handleInputChange}
            placeholder="Computer Science Degree"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="recipientAddress">Recipient Wallet Address *</Label>
          <Input
            id="recipientAddress"
            name="recipientAddress"
            value={formData.recipientAddress}
            onChange={handleInputChange}
            placeholder="0x..."
            required
          />
          <p className="text-sm text-muted-foreground">
            The Sui wallet address of the student receiving this certificate
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expirationDate">Expiration Date (Optional)</Label>
          <Input
            id="expirationDate"
            name="expirationDate"
            type="date"
            value={formData.expirationDate}
            onChange={handleInputChange}
          />
          <p className="text-sm text-muted-foreground">
            Leave empty for no expiration
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ipfsLink">IPFS Link (Optional)</Label>
          <Input
            id="ipfsLink"
            name="ipfsLink"
            value={formData.ipfsLink}
            onChange={handleInputChange}
            placeholder="ipfs://QmHash..."
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="certificateHash">Certificate Hash (Optional)</Label>
          <Input
            id="certificateHash"
            name="certificateHash"
            value={formData.certificateHash}
            onChange={handleInputChange}
            placeholder="sha256:..."
          />
          <p className="text-sm text-muted-foreground">
            Hash of the certificate document for verification
          </p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="metadata">Additional Metadata (Optional)</Label>
          <Textarea
            id="metadata"
            name="metadata"
            value={formData.metadata}
            onChange={handleInputChange}
            placeholder="GPA: 4.0, Honors: Summa Cum Laude"
            rows={3}
          />
          <p className="text-sm text-muted-foreground">
            Any additional information (grades, honors, etc.)
          </p>
        </div>
      </div>

      {txStatus.type && (
        <Alert variant={txStatus.type === "error" ? "destructive" : "default"}>
          {txStatus.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{txStatus.message}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Minting Certificate...
          </>
        ) : (
          "Mint Certificate"
        )}
      </Button>
    </form>
  );
}

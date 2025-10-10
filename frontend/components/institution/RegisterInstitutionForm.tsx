"use client";

import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { PACKAGE_ID, REGISTRY_ID } from "@/lib/config";

interface RegisterInstitutionFormProps {
  onSuccess?: () => void;
}

export default function RegisterInstitutionForm({ onSuccess }: RegisterInstitutionFormProps) {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const [formData, setFormData] = useState({
    name: "",
    contactInfo: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const tx = new Transaction();

      tx.moveCall({
        target: `${PACKAGE_ID}::skillproof::register_institution`,
        arguments: [
          tx.object(REGISTRY_ID),
          tx.pure.string(formData.name),
          tx.pure.string(formData.contactInfo),
        ],
      });

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            console.log("Institution registered successfully:", result);
            setTxStatus({
              type: "success",
              message: `Institution registered successfully! Your institution is now pending verification. Digest: ${result.digest}`,
            });
            // Reset form
            setFormData({
              name: "",
              contactInfo: "",
            });
            // Call onSuccess callback after a delay
            setTimeout(() => {
              if (onSuccess) onSuccess();
            }, 2000);
          },
          onError: (error) => {
            console.error("Error registering institution:", error);
            setTxStatus({
              type: "error",
              message: `Failed to register institution: ${error.message}`,
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
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Institution Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Massachusetts Institute of Technology"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactInfo">Contact Information *</Label>
          <Input
            id="contactInfo"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleInputChange}
            placeholder="e.g., admin@institution.edu or https://institution.edu"
            required
          />
          <p className="text-sm text-muted-foreground">
            Email address or website for verification purposes
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

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          After registration, your institution will need to be verified by the platform
          administrator before you can issue certificates.
        </AlertDescription>
      </Alert>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Registering...
          </>
        ) : (
          "Register Institution"
        )}
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import QrScanner from "qr-scanner";
import { Button } from "@repo/ui/button";

export function QrImageScanner({
  onScan,
  onClose,
}: {
  onScan: (result: string) => void;
  onClose: () => void;
}) {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setScanResult(null);
    setIsProcessing(true);

    try {
     
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file.');
      }

   
      const result = await QrScanner.scanImage(file);
      setScanResult(result);
      onScan(result);
    } catch (err: any) {
      console.error('QR Scan Error:', err);
      setError("No QR code found in image or invalid image format.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <div className=" relative bg-yellow-500 p-8 rounded-lg cursor-pointer hover:bg-yellow-400 transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        <p className="text-center font-small">
          {isProcessing ? "Processing..." : "Click to upload "}
        </p>
      </div>

      {scanResult && (
        <div className="text-green-600 font-semibold text-wrap text-sm p-4 bg-green-50 rounded-lg">
          ✅ Scan Successful: {scanResult}
        </div>
      )}

      {error && (
        <div className="text-red-500 p-4 bg-red-50 rounded-lg">
          ❌ {error}
        </div>
      )}

      <Button onClick={onClose} variant="outline">
        Close
      </Button>
    </div>
  );
}

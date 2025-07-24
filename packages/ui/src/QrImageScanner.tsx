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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageDataUrl = URL.createObjectURL(file);
      const result = await QrScanner.scanImage(imageDataUrl, {
        returnDetailedScanResult: true,
      });
      setScanResult(result.data);
      onScan(result.data);
    } catch (err: any) {
      setError("No QR code found in image.");
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="bg-yellow-500">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="mb-4 opacity-0 w-full h-full absolute"
        />

        <p>Click to upload</p>
      </div>
      {scanResult && (
        <div className="text-green-600 font-semibold animate-bounce">
          ✅ Scan Successful: {scanResult}
        </div>
      )}
      {error && <div className="text-red-500">{error}</div>}
      <Button onClick={onClose}>Close</Button>
    </div>
  );
}

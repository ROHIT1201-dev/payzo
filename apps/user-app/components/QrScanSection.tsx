"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Button } from "@repo/ui/button";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  X,
  Upload,
  Camera,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";

const QrImageScanner = dynamic(
  () => import("@repo/ui/QrImageScanner").then((m) => m.QrImageScanner),
  { ssr: false }
);

interface QrResult {
  value: string;
  timestamp: Date;
  type: "url" | "text" | "phone" | "email" | "unknown";
}

export function QrScanSection() {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedResult, setScannedResult] = useState<QrResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [scanHistory, setScanHistory] = useState<QrResult[]>([]);
  const router = useRouter();

  // Detect QR content type
  const detectQrType = useCallback((value: string): QrResult["type"] => {
    if (value.startsWith("http://") || value.startsWith("https://"))
      return "url";
    if (value.startsWith("tel:") || /^\+?[\d\s\-()]+$/.test(value))
      return "phone";
    if (value.includes("@") && value.includes(".")) return "email";
    return "text";
  }, []);

  // Handle QR scan result
  const handleScanResult = useCallback(
    (value: string) => {
      try {
        // Handle error cases
        if (!value || value.trim().length === 0) {
          setError("Invalid QR code - no data found");
          setShowScanner(false);
          setIsScanning(false);
          return;
        }

        const result: QrResult = {
          value: value.trim(),
          timestamp: new Date(),
          type: detectQrType(value.trim()),
        };

        setScannedResult(result);
        setScanHistory((prev) => [result, ...prev.slice(0, 4)]); // Keep last 5 scans
        setShowScanner(false);
        setError(null);

        // Navigate with the scanned value
        router.push(`?number=${encodeURIComponent(result.value)}`);
      } catch (err) {
        setError("Failed to process QR code");
        setShowScanner(false);
        setIsScanning(false);
      }
    },
    [detectQrType, router]
  );

  // Copy to clipboard
  const copyToClipboard = useCallback(async () => {
    if (!scannedResult) return;

    try {
      await navigator.clipboard.writeText(scannedResult.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  }, [scannedResult]);

  // Clear current scan
  const clearScan = useCallback(() => {
    setScannedResult(null);
    setError(null);
    setCopied(false);
  }, []);

  // Get display text based on QR type
  const getDisplayText = useCallback((result: QrResult) => {
    switch (result.type) {
      case "url":
        return result.value.length > 50
          ? `${result.value.substring(0, 47)}...`
          : result.value;
      case "phone":
        return result.value.replace("tel:", "");
      default:
        return result.value.length > 60
          ? `${result.value.substring(0, 57)}...`
          : result.value;
    }
  }, []);

  // Get icon based on QR type
  const getTypeIcon = useCallback((type: QrResult["type"]) => {
    switch (type) {
      case "url":
        return "🌐";
      case "phone":
        return "📞";
      case "email":
        return "📧";
      default:
        return "📄";
    }
  }, []);

  // Dynamic class helpers
  const getGradientClass = () => {
    return scannedResult
      ? "bg-gradient-to-r from-green-400 via-emerald-300 to-teal-400"
      : "bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300";
  };

  return (
    <div className="h-auto bg-white w-80 mt-3 rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-purple-600 to-purple-700 h-16 flex justify-center items-center text-2xl font-bold text-white relative">
        <Camera className="w-6 h-6 mr-2" />
        QR Scanner
        {scannedResult && (
          <button
            onClick={clearScan}
            className="absolute right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center px-6 py-6 gap-4">
        {/* QR Display Area */}
        <div
          className={`rounded-xl p-1 shadow-md transition-all duration-300 ${getGradientClass()}`}
        >
          <div className="bg-white h-40 w-40 flex flex-col items-center justify-center rounded-lg p-3">
            {error ? (
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <span className="text-xs text-red-600 font-medium">
                  {error}
                </span>
              </div>
            ) : scannedResult ? (
              <div className="text-center w-full">
                <div className="text-2xl mb-2">
                  {getTypeIcon(scannedResult.type)}
                </div>
                <div className="text-xs text-gray-700 font-medium break-words leading-tight">
                  {getDisplayText(scannedResult)}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {scannedResult.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-gray-400 text-sm text-center">
                  Scan or upload QR code
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full">
          <Button
            onClick={() => {
              setShowScanner(true);
              setIsScanning(true);
              setError(null);
            }}
            disabled={isScanning}
            variant={isScanning ? "ghost" : "default"}
            className="flex-1"
          >
            <Camera className="w-4 h-4 mr-2" />
            {scannedResult ? "Rescan" : isScanning ? "Scanning..." : "Scan QR"}
          </Button>

          {scannedResult && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyToClipboard}
                className="px-3"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearScan}
                className="px-3 text-gray-500 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {/* Scanner Component - FIXED */}
        {showScanner && (
          <div className="mt-2 w-full bg-gray-50 rounded-lg p-3">
            <QrImageScanner
              onScan={(val: string) => {
                handleScanResult(val);
                setIsScanning(false);
              }}
              onClose={() => {
                setShowScanner(false);
                setIsScanning(false);
              }}
            />
          </div>
        )}

        {/* Success Feedback */}
        {scannedResult && !error && (
          <div className="flex items-center gap-2 text-green-600 font-semibold animate-fade-in">
            <CheckCircle className="w-5 h-5" />
            <span>Scan Successful!</span>
            {copied && <span className="text-sm text-gray-500">(Copied!)</span>}
          </div>
        )}

        {/* Recent Scans History */}
        {scanHistory.length > 1 && (
          <div className="w-full mt-2">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">
              Recent Scans
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {scanHistory.slice(1, 4).map((scan, index) => (
                <button
                  key={`${scan.timestamp.getTime()}-${index}`}
                  onClick={() => handleScanResult(scan.value)}
                  className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>{getTypeIcon(scan.type)}</span>
                    <span className="truncate flex-1">
                      {getDisplayText(scan)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
  
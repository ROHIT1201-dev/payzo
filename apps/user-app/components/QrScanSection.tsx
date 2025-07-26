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
  () => import("@repo/ui/QrImageScanner").then((mod) => ({
    default: mod.QrImageScanner
  })),
  { 
    ssr: false,
    loading: () => (
      <div className="text-center py-4 text-gray-500">
        <Camera className="w-6 h-6 mx-auto mb-2 animate-pulse" />
        Loading scanner...
      </div>
    )
  }
);

interface QrResult {
  value: string;
  timestamp: Date;
  type: "url" | "text" | "phone" | "email" | "unknown";
}

type Props = {
  onScanSuccess?: (encodedValue: string) => void; 
};

export function QrScanSection({ onScanSuccess }: Props) {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedResult, setScannedResult] = useState<QrResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [scanHistory, setScanHistory] = useState<QrResult[]>([]);
  const router = useRouter();

  
  const detectQrType = useCallback((value: string): QrResult["type"] => {
    if (value.startsWith("http://") || value.startsWith("https://"))
      return "url";
    if (value.startsWith("tel:") || /^\+?[\d\s\-()]+$/.test(value))
      return "phone";
    if (value.includes("@") && value.includes(".")) return "email";
    return "text";
  }, []);


  const handleScanResult = useCallback(
    (value: string) => {
      try {
       
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
        setScanHistory((prev) => [result, ...prev.slice(0, 4)]);
        setShowScanner(false);
        setError(null);
        setIsScanning(false); 

   
        try {
          if (typeof onScanSuccess === 'function') {
            onScanSuccess(encodeURIComponent(result.value));
          } else {
           
            console.log('QR Scan Success:', result.value);
          }
        } catch (callbackError) {
          console.error('Error calling onScanSuccess:', callbackError);
        }

        
        try {
          router.push(`?number=${encodeURIComponent(result.value)}`);
        } catch (navigationError) {
          console.error('Navigation error:', navigationError);
        }
      } catch (err) {
        console.error("QR Processing Error:", err);
        setError("Failed to process QR code");
        setShowScanner(false);
        setIsScanning(false);
      }
    },
    [detectQrType, router, onScanSuccess]
  );


  const copyToClipboard = useCallback(async () => {
    if (!scannedResult) return;

    try {
      await navigator.clipboard.writeText(scannedResult.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
      setError("Failed to copy to clipboard");
    }
  }, [scannedResult]);

 
  const clearScan = useCallback(() => {
    setScannedResult(null);
    setError(null);
    setCopied(false);
  }, []);

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

  const getGradientClass = () => {
    return scannedResult
      ? "bg-gradient-to-r from-green-400 via-emerald-300 to-teal-400"
      : "bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300";
  };

  return (
    <div className="h-auto bg-white w-80 mt-3 rounded-xl shadow-lg w-full border border-gray-100 border-b-white">
      <div className="flex  items-center px-6 py-6 gap-4 w-full ">
        
        <div
          className={`rounded-xl p-1 transition-all duration-300 ${getGradientClass()} my-12`}
        >
          <div className="bg-white h-40 w-40 flex  items-center justify-center rounded-lg p-3">
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
        <div className="flex gap-1 w-full">
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
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <div className="flex">
                <Button
                variant="ghost"
                size="sm"
                onClick={clearScan}
                className="px-3 text-gray-500 hover:text-red-500"
                title="Clear scan"
              >
                <X className="w-4 h-4" />

              </Button>
              </div>
              
            </>
          )}
        </div>

 
        {showScanner && (
          <div className="w-full bg-gray-50 rounded-lg p-3">
            <QrImageScanner
              onScan={(val: string) => {
                handleScanResult(val);
              }}
              onClose={() => {
                setShowScanner(false);
                setIsScanning(false);
              }}
            />
          </div>
        )}

       
        {scannedResult && !error && (
          <div className="flex items-center gap-1 text-green-600 font-semibold animate-fade-in ">
            <CheckCircle className="w-5 h-5" />
            <span>Scan Successful!</span>
            {copied && <span className="text-sm text-gray-500">(Copied!)</span>}
          </div>
        )}

        {scanHistory.length > 1 && (
          <div className="w-full">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">
              Recent Scans
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {scanHistory.slice(1, 4).map((scan, index) => (
                <button
                  key={`${scan.timestamp.getTime()}-${index}`}
                  onClick={() => handleScanResult(scan.value)}
                  className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border transition-colors"
                  title={`Rescan: ${scan.value}`}
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

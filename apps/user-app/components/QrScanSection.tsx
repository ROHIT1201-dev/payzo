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
import { get } from "http";

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
      
        setShowScanner(false);
        setError(null);
        setIsScanning(false); 

   
        try {
        
           
            console.log('QR Scan Success:', result.value);
         
        } catch (callbackError) {
          console.error('Error calling onScanSuccess:', callbackError);
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
        localStorage.setItem("result",result.value)
        window.dispatchEvent(new Event("storage"))
       result.value.length > 50
          ? `${result.value.substring(0, 47)}...`
          : result.value;
      case "phone":
        localStorage.setItem("result",result.value)
        window.dispatchEvent(new Event("storage"))
       result.value.replace("tel:", "");
      default:
        localStorage.setItem("result",result.value)
        window.dispatchEvent(new Event("storage"))
       result.value.length > 60
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
      <div className="flex  items-center px-6 py-6 gap-2 w-full ">
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
                <div className="inline-flex items-center gap-2 rounded-md bg-green-50 text-green-700 px-2.5 py-1.5 shadow-sm ring-1 ring-inset ring-green-200 animate-in fade-in zoom-in-95 duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                    />
                  </svg>
                  <span className="text-xs font-medium leading-tight">
                    {getDisplayText(scannedResult )}
                    Done:✨
                  </span>
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
      </div>
    </div>
  );
}

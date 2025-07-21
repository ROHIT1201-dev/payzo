// components/PayzoQRCode.js
"use client";
import { useQRCode } from "next-qrcode";
import { Card } from "./card";

export default function qrCode() {
  const { SVG } = useQRCode();

  return (
    <div >
      
        <SVG
          text="upi://pay?pa=yourupiid@bank&pn=Payzo&am=150&cu=INR"
          options={{
            errorCorrectionLevel: "H", // High error correction for logo overlays
            margin: 1,
            scale: 1,
            color: {
              dark: "#1A237E",
              light: "#FFFFFF",
            },
          }}
        />
     
    </div>
  );
}

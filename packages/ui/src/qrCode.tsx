
"use client";
import { useQRCode } from "next-qrcode";


export default function qrCode({value}:any) {
  const { SVG } = useQRCode();

  return (
    <div >
      
        <SVG
          text={value}
          options={{
            errorCorrectionLevel: "H", 
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

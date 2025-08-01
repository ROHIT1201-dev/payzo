import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import twilio from "twilio";

export async function POST(request: NextRequest) {
  const { phone, code } = await request.json();
  const accountSid = process.env.TWILIO_ACCOUNT_SID!;
  const authToken = process.env.TWILIO_AUTH_TOKEN!;
  const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID!;
  const client = twilio(accountSid, authToken);

  try {
    const verification_check = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: phone, code });
    return NextResponse.json({ status: verification_check.status }); // approved or error
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

/**
 * Legacy Payments API - Disabled in Flipping-Only Version
 */
export async function GET() {
  return NextResponse.json(
    { error: "Payment management is disabled in this version" },
    { status: 501 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "Payment management is disabled in this version" },
    { status: 501 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Payment management is disabled in this version" },
    { status: 501 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Payment management is disabled in this version" },
    { status: 501 }
  );
}

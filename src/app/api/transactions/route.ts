import { NextRequest, NextResponse } from "next/server";

/**
 * Legacy Transactions API - Disabled in Flipping-Only Version
 */
export async function GET() {
  return NextResponse.json(
    { error: "Transaction management is disabled in this version" },
    { status: 501 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "Transaction management is disabled in this version" },
    { status: 501 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Transaction management is disabled in this version" },
    { status: 501 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Transaction management is disabled in this version" },
    { status: 501 }
  );
}

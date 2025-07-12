import { NextResponse } from "next/server";

export async function GET() {
  try {
    throw new Error("Error");
  } catch (error) {
    console.error("Dashboard stats API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}

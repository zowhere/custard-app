import { NextResponse } from "next/server";
import client from "@/lib/mongo";
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware";

async function getHandler(request: AuthenticatedRequest) {
  const db = client.db(`${process.env.DATABASE}`);
  try {
    const { user } = request;
    const { userID } = user;

    const businessResponse = await db.collection("business").findOne({
      userID,
    });

    const response = await db.collection("transactions").find({
      businessID: businessResponse?.businessID,
    });

    const data = await response.toArray();

    return NextResponse.json({
      success: true,
      transactions: data,
    });
  } catch (error) {
    console.error("User profile API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 },
    );
  }
}

export const GET = withAuth(getHandler);

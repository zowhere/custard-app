import { NextResponse } from "next/server";
import client from "@/lib/mongo";
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware";

async function putHandler(request: AuthenticatedRequest) {
  const db = client.db(`${process.env.DATABASE}`);
  try {
    const { user } = request;
    const { userID } = user;
    const body = await request.json();

    const response = await db.collection("business").findOneAndUpdate(
      {
        userID: userID,
      },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    return NextResponse.json({
      success: true,
      business: {
        ...response,
        _id: null,
      },
    });
  } catch (error) {
    console.error("User profile API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 },
    );
  }
}

async function getHandler(request: AuthenticatedRequest) {
  const db = client.db(`${process.env.DATABASE}`);
  try {
    const { user } = request;
    const { userID } = user;

    const response = await db.collection("business").findOne({
      userID: userID,
    });

    return NextResponse.json({
      success: true,
      business: {
        ...response,
      },
    });
  } catch (error) {
    console.error("User profile API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 },
    );
  }
}

export const PUT = withAuth(putHandler);
export const GET = withAuth(getHandler);

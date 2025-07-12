import { NextResponse } from "next/server";
import client from "@/lib/mongo";
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware";
import { nanoid } from "nanoid";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const db = client.db(`${process.env.DATABASE}`);

async function postHandler(request: AuthenticatedRequest) {
  const { user } = request;
  const { userID } = user;

  try {
    const response = await db.collection("business").findOne({
      userID,
    });

    if (!response) throw new Error("user does not exist");

    const { businessID, address } = response;

    const data = await request.json();

    const { tokenName, tokenSymbol, description } = data;

    if (!tokenName || tokenName === "" || !tokenSymbol || tokenSymbol === "")
      throw new Error(
        "Token creation failed: 'name' and 'symbol' are required and cannot be empty.",
      );

    await db.collection("points").insertOne({
      businessID,
      pointsID: nanoid(),
      address,
      name: tokenName,
      symbol: tokenSymbol,
      onchain: false,
      description,
      totalSupply: 1000000,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      succes: true,
    });
  } catch (error) {
    return NextResponse.json({ error: `${error}` });
  } finally {
    console.log("Done: creating token");
  }
}

async function getHandler(request: AuthenticatedRequest) {
  const { user } = request;
  const { userID } = user;

  try {
    const businessDetails = await db.collection("business").findOne({
      userID,
    });

    const tokenDetails = await db.collection("points").findOne({
      businessID: businessDetails?.businessID,
    });

    return NextResponse.json({ succes: true, loyalty: { ...tokenDetails } });
  } catch (error) {
    return NextResponse.json({ error: `${error}` });
  } finally {
    console.log("Done: getting token details");
  }
}

export const POST = withAuth(postHandler);
export const GET = withAuth(getHandler);

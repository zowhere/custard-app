import client from "@/lib/mongo";
import { NextResponse } from "next/server";

async function getHandler(request: Request) {
  const db = client.db(`${process.env.DATABASE}`);
  let total = 0;

  try {
    const url = new URL(request.url);
    const customerID = url.searchParams.get("customer");
    const businessID = url.searchParams.get("business");

    const business = await db.collection("business").findOne({
      businessID,
    });

    const points = await db.collection("points").findOne({
      businessID,
    });

    const transactions = await db
      .collection("transactions")
      .find({
        customerID,
        businessID,
      })
      .toArray();

    const totalTransactionsSent = await db
      .collection("transactions")
      .aggregate([
        {
          $match: {
            type: "send",
            customerID,
            businessID,
          },
        },
        {
          $group: {
            _id: null,
            totalSentAmount: { $sum: "$amount" },
          },
        },
      ])
      .toArray();

    if (totalTransactionsSent.length > 0) {
      total = totalTransactionsSent[0].totalSentAmount;
    }

    return NextResponse.json({
      success: true,
      customerID,
      total,
      transactions,
      business,
      rewards: [],
      points,
    });
  } catch (error) {
    return NextResponse.json({
      error: `${error}`,
    });
  } finally {
    console.log("Done: creating token");
  }
}

export const GET = getHandler;

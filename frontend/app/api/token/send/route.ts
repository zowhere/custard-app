import { NextResponse } from "next/server";
import client from "@/lib/mongo";
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware";
import { Resend } from "resend";
import { Wallet } from "ethers";
import { nanoid } from "nanoid";
import { createLoyaltyPointsEmailTemplate } from "@/lib/email";

const db = client.db(`${process.env.DATABASE}`);
const resend = new Resend(`${process.env.RESEND_API}`);

async function handler(request: AuthenticatedRequest) {
  const { user } = request;
  const { userID } = user;

  try {
    const transactionData = await request.json();
    const { email, amount } = transactionData;

    const response = await db.collection("business").findOne({
      userID,
    });

    if (!response) throw new Error("user does not exist");

    const wallet = Wallet.createRandom();
    const privateKey = wallet.privateKey;
    const mnemonic = wallet.mnemonic;
    const address = await wallet.getAddress();

    const updateCustomer = await db.collection("customers").findOneAndUpdate(
      {
        email,
      },
      {
        $setOnInsert: {
          customerID: nanoid(),
          email,
          isActive: true,
          wallet,
          privateKey,
          mnemonic,
          address,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    await db.collection("transactions").insertOne({
      ...transactionData,
      businessID: response?.businessID,
      customerID: updateCustomer?.customerID,
    });

    const templatEmail = createLoyaltyPointsEmailTemplate({
      userName: "there",
      pointsEarned: amount,
      redemptionLink: `${process.env.LINK}/rewards/${updateCustomer?.customerID}/${response?.businessID}`,
    });

    const { error } = await resend.emails.send({
      from: "Abakcus <no-reply@api.abakcus.xyz>",
      to: [email],
      subject: `🎉 You earned ${amount} Points`,
      html: templatEmail,
    });

    if (error) throw new Error("sending email failed");

    return NextResponse.json({
      succes: true,
    });
  } catch (error) {
    return NextResponse.json({ error: `${error}` });
  } finally {
    console.log("Done: creating token");
  }
}

export const POST = withAuth(handler);

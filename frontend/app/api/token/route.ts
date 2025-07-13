import { NextResponse } from "next/server";
import client from "@/lib/mongo";
import factory from "@/artifacts/contracts/TokenFactory.sol/TokenFactory.json";
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware";
import { nanoid } from "nanoid";
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(process.env.GNOSIS_RPC_URL);
const wallet = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, provider);
const factoryAbi = factory.abi;
const factoryAddress = `${process.env.GNOSIS_FACTORY_CONTRACT_ADDRESS}`;
const factoryContract = new ethers.Contract(factoryAddress, factoryAbi, wallet);

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

      const tx = await factoryContract.createToken(tokenName, tokenSymbol);
      console.log("Transaction sent, waiting for confirmation...", tx);
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      const tokenAddress = receipt.logs[0].address;
      console.log("Token created at address:", tokenAddress);

      await db.collection("points").insertOne({
        businessID,
        pointsID: nanoid(),
        address,
        name: tokenName,
        symbol: tokenSymbol,
        onchain: true,
        description,
        tokenAddress,
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
    console.error("Error getting token details:", error);
    return NextResponse.json({ error: `${error}` });
  } finally {
    console.log("Done: getting token details");
  }
}

export const POST = withAuth(postHandler);
export const GET = withAuth(getHandler);

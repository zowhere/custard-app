import { NextResponse } from "next/server";

async function getHandler(request: Request) {
  try {
    const url = new URL(request.url);
    const customerID = url.searchParams.get("customer");

    console.log(customerID);

    return NextResponse.json({
      success: true,
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

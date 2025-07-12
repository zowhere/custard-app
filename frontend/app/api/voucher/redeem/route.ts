import { NextResponse } from "next/server";
import { withAuth, type AuthenticatedRequest } from "@/lib/middleware";

async function postHandler(request: AuthenticatedRequest) {
  console.log(request);
  try {
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
  console.log(request);
  try {
    return NextResponse.json({
      succes: true,
    });
  } catch (error) {
    return NextResponse.json({ error: `${error}` });
  } finally {
    console.log("Done: creating token");
  }
}

export const POST = withAuth(postHandler);
export const GET = withAuth(getHandler);

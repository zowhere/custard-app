import { type NextRequest, NextResponse } from "next/server";
import { verifyJWT, type JWTPayload } from "./jwt";

export interface AuthenticatedRequest extends NextRequest {
  user: JWTPayload;
}

export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
) {
  return async (request: NextRequest) => {
    try {
      const authHeader = request.headers.get("authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
          { error: "Missing or invalid authorization header" },
          { status: 401 },
        );
      }

      const token = authHeader.substring(7);

      try {
        const payload = await verifyJWT(token);
        const authenticatedRequest = request as AuthenticatedRequest;
        authenticatedRequest.user = payload;

        return handler(authenticatedRequest);
      } catch (jwtError) {
        console.error("JWT verification failed:", jwtError);
        return NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 401 },
        );
      }
    } catch (error) {
      console.error("Auth middleware error:", error);
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 },
      );
    }
  };
}

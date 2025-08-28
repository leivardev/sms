import NextAuth, { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (...args: Parameters<typeof NextAuth>) => {
  const options = await getAuthOptions();
  return NextAuth(options)(...args);
};

// Only exists to avoid problems with nextJS REST API structure
export const POST = (request: NextRequest) => {
  return NextResponse.json({message: 'Not a valid API route.', status: 403});
};
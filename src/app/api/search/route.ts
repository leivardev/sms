"use server";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthOptions } from "@/lib/auth";

export async function POST ( request: NextRequest) {

  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  const searchData = await request.json();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  };

  const requester = await prisma.user.findUnique({
    where: { email: session.user?.email ?? ""}
  });

  if (!requester) {
    return NextResponse.json({ message: "User could not be found" }, { status: 404 })
  };

  if (!searchData.content) {
    return NextResponse.json({ message: "You've left empty fields" }, { status: 403 })
  };


  const results = await prisma.user.findMany({
    where: {
      name: {
        contains: searchData.content
      }
    }
  })
  
  return NextResponse.json({ results }, { status: 200 });
};
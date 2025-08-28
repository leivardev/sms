"use server";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthOptions } from "@/lib/auth";

export async function GET (request:NextRequest) {

  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  };

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? "" }
  });

  if (!user) {
    return NextResponse.json({ message: "User could not be found" }, { status: 404 })
  };

  return NextResponse.json(user, { status: 200 });
};
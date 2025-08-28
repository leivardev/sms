"use server";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthOptions } from "@/lib/auth";

export async function GET ( request: NextRequest, { params }: { params: {userId: string}}) {

  const userId = (await params).userId; // Await is not really needed with params like this, but this avoids conflict with turbopack
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  };

  const requester = await prisma.user.findUnique({
    where: { email: session.user?.email ?? ""},
    include: { followed: true, following: true}
  });

  if(!requester) {
    return NextResponse.json({ message: "User could not be found"}, { status: 404 });
  };

  const user = await prisma.user.findUnique({
    where: {id: userId},
    include: { followed: true, following: true}
  });

  if(!user){
    return NextResponse.json({message: "User could note be found"}, { status: 404 })
  }

  const follow = await prisma.follow.findFirst({
    where: { followedId: user.id, followingId: requester.id },
  });

  let userWithFollowing;

  if(follow) {
    userWithFollowing = {
      ...user,
      isFollowing: true
    }
  } else {
    userWithFollowing = {
      ...user,
      isFollowing: false
    }
  };

  return NextResponse.json(userWithFollowing, { status: 200 });

};

export async function Post ( request:NextRequest ) {
  return NextResponse.json({ message: "Not a valid API route"}, {status: 403});
};
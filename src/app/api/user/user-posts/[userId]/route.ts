"use server";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthOptions } from "@/lib/auth";

export async function GET ( request: NextRequest, { params }: { params: { userId: string }}) {

  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  const userId = (await params).userId; // Await is not really needed with params like this, but this avoids conflict with turbopack

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  };

  const user = await prisma.user.findUnique({
    where: { id: userId}
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const requester = await prisma.user.findUnique({
    where: { email: session.user?.email ?? ""},
    include: { followed: true, following: true}
  });

  if(!requester) {
    return NextResponse.json({ message: "User could not be found"}, { status: 404 });
  };

  const posts = await prisma.post.findMany({
    where: { userId: userId },
    include: { user: true, likes: true, replies: true },
    orderBy: {
      created_at: 'desc'
    },
  });

  const postsWithLikeStatus = posts.map(post => {
    const hasUserLiked = post.likes.some(like => like.userId === requester.id);
    return {
      ...post,
      likeStatus: hasUserLiked,
    };
  });
  
  return NextResponse.json( postsWithLikeStatus, { status: 200 });
};

export async function POST ( request:NextRequest ) {
  return NextResponse.json({ message: "Not a valid API route"}, {status: 403});
};
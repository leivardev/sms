"use server";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthOptions } from "@/lib/auth";

export async function GET ( request:NextRequest, { params }: { params: Promise<{ postId: string }>}) {

  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  const postId = (await params).postId; // Await is not really needed with params like this, but this avoids conflict with turbopack

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  };

  const requester = await prisma.user.findUnique({
    where: { email: session.user?.email ?? "" }
  });

  if (!requester) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  };

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { 
      user: true, 
      likes: true, 
      replies: {
        include: { 
          user: true 
        },
        orderBy: {
          created_at: 'desc'
        },
      },
    },
  });

  if(!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 })
  }

  const hasUserLiked = post.likes.some(like => like.userId === requester.id);

  const postWithLikeStatus = {
    ...post,
   likeStatus: hasUserLiked,
  };

  return NextResponse.json( postWithLikeStatus, { status: 200 });
};

export async function Post ( request:NextRequest ) {
  return NextResponse.json({ message: "Not a valid API route"}, {status: 403});
};
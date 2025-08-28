"use server";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthOptions } from "@/lib/auth";

export async function GET ( request:NextRequest ) {
  
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  };

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? "" },
    include: { following: true }
  });

  if (!user) {
    return NextResponse.json({ message: "User could not be found" }, { status: 404 })
  };

// Implemented a prisma logic that filters in the query instead of after so it doesn't query the server for every single post before filtering through them.
  const followedIds = user.following.map(user => user.followedId);
  followedIds.push(user.id);

  let followedPosts = await prisma.post.findMany({
    where: {
      userId: {
        in: followedIds,
      },
    },
    include: {
      user: true,
      likes: true,
      replies: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  const postsWithLikeStatus = followedPosts.map(post => {
    const hasUserLiked = post.likes.some(like => like.userId === user.id);
    return {
      ...post,
      likeStatus: hasUserLiked,
    };
  });

  return NextResponse.json(postsWithLikeStatus, { status: 200 });
};

export async function Post ( request:NextRequest ) {
  return NextResponse.json({ message: "Not a valid API route"}, {status: 403});
};
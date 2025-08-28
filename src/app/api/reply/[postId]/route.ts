"use server";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthOptions } from "@/lib/auth";

export async function POST ( request: NextRequest, { params }: { params: {postId: string}}) {

  const postId = (await params).postId;  // Await is not really needed with params like this, but this avoids conflict with turbopack
  const postData = await request.json();
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  };

  const post = await prisma.post.findUnique({
    where: { id: postId}
  });

  if (!post) {
    return NextResponse.json({ message: "Post could not be found" }, { status: 404 })
  };

  const requester = await prisma.user.findUnique({
    where: { email: session.user?.email ?? ""}
  });

  if (!requester) {
    return NextResponse.json({message: "User could not be found" }, { status: 404 })
  };

  if (!postData.content) {
    return NextResponse.json({ message: "You've left empty fields"}, { status: 403 })
  }

  await prisma.reply.create({
    data: {
      post: {
        connect: {
          id: postId
        },
      },
      user: {
        connect: {
          id: requester.id
        },
      },
      content: postData.content
    },
  });

  if (post.userId !== requester.id) {
      await prisma.notification.create({
        data: {
          user: {
            connect: { 
              id: post.userId 
            }
          },
          content: requester.name + " has replied to your post!"
        }
      });
    };

  return NextResponse.json({ message: "Reply sent" }, { status: 200 });

};

export async function GET ( request:NextRequest ) {
  return NextResponse.json({ message: "Not a valid API route"}, {status: 403});
};
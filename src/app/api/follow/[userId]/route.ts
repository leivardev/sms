"use server";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthOptions } from "@/lib/auth";

export async function POST ( request: NextRequest, { params }: { params: {userId: string}}) {

  const userId = (await params).userId;  // Await is not really needed with params like this, but this avoids conflict with turbopack
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  };

  const user = await prisma.user.findUnique({
    where: { id: userId},
  });

  if (!user) {
    return NextResponse.json({ message: "User could not be found" }, { status: 404 });
  };

  const requester = await prisma.user.findUnique({
    where: { email: session.user?.email ?? ""},
  });

  if (!requester) {
    return NextResponse.json({message: "User could not be found" }, { status: 404 });
  };

  if (user.email === requester.id) {
    return NextResponse.json({ message: "You cannot follow yourself"}, { status: 403 });
  }

  const follow = await prisma.follow.findFirst({
    where: { followedId: user.id, followingId: requester.id },
  });

  if (follow) {
    await prisma.follow.delete({
      where: { id: follow.id },
    });

    return NextResponse.json({ message: "Unfollowed user" }, { status: 200 });
  } else {

    const follow = await prisma.follow.create({
      data: {
        followed: {
          connect: {
            id: user.id
          },
        },
        following: {
          connect: {
            id: requester.id
          },
        },
      },
    });

    if (user.id !== requester.id) {
      await prisma.notification.create({
        data: {
          user: {
            connect: { 
              id: user.id
            }
          },
          content: requester.name + " has followed you!"
        }
      });
    };

    return NextResponse.json({ message: "Followed user" }, { status: 200 });
  };

  

};

export async function GET ( request:NextRequest ) {
  return NextResponse.json({ message: "Not a valid API route"}, {status: 403});
};
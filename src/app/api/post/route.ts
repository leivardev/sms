"use server";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthOptions } from "@/lib/auth";

export async function POST ( request: NextRequest) {

  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  const postData = await request.json();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  };

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? ""}
  });

  if (!user) {
    return NextResponse.json({ message: "User could not be found" }, { status: 404 })
  };

  if (!postData.content) {
    return NextResponse.json({ message: "You've left empty fields" }, { status: 403 })
  };

  if(user.premium){
    if (postData.content.length > 2500) {
      return NextResponse.json({ message: "The post is too long, it can not be longer than 2500 chars"})
    };
  }else {
    if (postData.content.length > 280) {
      return NextResponse.json({ message: "The post is too long, it can not be longer than 280 chars. Buy premium to expand this to 2500 chars"}, { status: 403 })
    };
  };

  await prisma.post.create({
    data: {
      content: postData.content,
      user: {
        connect: {
          id: user.id
        },
      },
    },
  });
  
  return NextResponse.json({ message: "Succesully created post"}, { status: 200 });
};
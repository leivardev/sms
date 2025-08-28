"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useParams } from "next/navigation";
import Post from "@/components/Post";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import PageTitle from "@/components/PageTitle";

export default function PostPage() {

  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const params = useParams();
  const [ postData, setPostData ] = useState("");

  const post = useQuery({
    queryKey: ['post', params.postId],
    queryFn: () => api.getPost(params.postId as string)
  });

  const replyToPost = useMutation({
    mutationFn: () => api.replyPost(params.postId as string, { content: postData }),
    onSuccess: () => {
      queryClient.invalidateQueries();
      setPostData("")
    },
  });

  return (
    <>
      {post.isSuccess ? (
      <>
        <PageTitle pageTitle="Post" />
        <Post post={post.data} />
        <section className="flex gap-2 p-4 items-center border-b-2 border-gray-300">
          <section>
            <img src={session?.user?.image ?? ""} className="w-16 rounded-full" />
          </section>
          <section className="w-full p-2">
            <textarea value={postData} onChange={(e) => setPostData(e.target.value)} placeholder="Reply to post?" className="h-40 md:h-auto outline-none p-2 w-full resize-none"/>
          </section>
          <section>
            <button onClick={() => replyToPost.mutate()} className="bg-blue-400 hover:bg-blue-500 text-center hover:cursor-pointer text-white rounded-full py-2 px-4">Reply</button>
          </section>
        </section>
        <section>
          {post.data.replies.map((reply: any, index: any) => (
            <section key={index} className="flex flex-col p-4 gap-2 border-b-2 border-gray-300">
              <section className="flex gap-2">
                <img src={reply.user.image} className="w-14 h-14 rounded-full"/>
                <section className="flex flex-col">
                  <Link href={"/app/profile/" + reply.userId} className="font-semibold text-lg">{reply.user.name}</Link>
                  <h4 className="text-sm text-gray-600">{reply.user.email}</h4>
                </section>
              </section>
              <section>
                <p>{reply.content}</p>
              </section>
            </section>
          ))}
        </section>
      </>
      ):null}
    </>
  );
};
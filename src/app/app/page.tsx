"use client";

import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "@/lib/axios";
import Post from "@/components/Post";
import PageTitle from "@/components/PageTitle";

export default function App() {

  const queryClient = useQueryClient();

  const { data: session } = useSession();
  const [ postData, setPostData ] = useState("");

  const posts = useQuery({
    queryKey: ['posts'],
    queryFn: api.getPosts
  });

  function createPostSuccess(){
    setPostData("");
    queryClient.invalidateQueries();
  }

  const createPost = useMutation({
    mutationFn: () => api.createPost({ content: postData}),
    onSuccess: () => createPostSuccess(),
  });

  return (
    <>
      <PageTitle pageTitle={"Home"}/>
      <section className="flex gap-2 p-4 items-center border-b-2 border-gray-300">
        <section>
          <img src={session?.user?.image ?? ""} className="w-16 rounded-full" />
        </section>
        <section className="w-full p-2">
          <textarea value={postData} onChange={(e) => setPostData(e.target.value)} placeholder="What's happening?" className="outline-none md:p-2 w-full text-wrap h-40 md:h-auto resize-none"/>
        </section>
        <section>
          <button onClick={() => createPost.mutate()} className="bg-blue-400 hover:bg-blue-500 text-center hover:cursor-pointer text-white rounded-full py-2 px-4">Tweet</button>
        </section>
      </section>
      <section className="flex flex-col">
        {posts.isSuccess ? (
          <section>
            {posts.data.map((post:any, index:any) => (
              <Post key={index} post={post} />
            ))}
          </section>
        ): null}
      </section>
    </>
  );
};
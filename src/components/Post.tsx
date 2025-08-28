import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCopyToClipboard } from "usehooks-ts";
import Link from "next/link";
import api from "@/lib/axios";

export default function Post({ post }: any) {

  const queryClient = useQueryClient();
  const [ value, copy ] = useCopyToClipboard();
  const likePost = useMutation({
    mutationFn: () => api.likePost(post.id as string),
    onSuccess: () => queryClient.invalidateQueries(),
  });

  return (
    <section className="flex flex-col gap-2 border-b-2 border-gray-300">
      <section className="flex gap-2 p-2">
        <img src={post.user.image} className="w-14 h-14 rounded-full"/>
        <section className="flex flex-col">
          <Link href={"/app/profile/"+post.user.id} className="font-semibold text-lg">{post.user.name}</Link>
          <h4 className="text-sm text-gray-600">{post.user.email}</h4>
        </section>
      </section>
      <section className="px-4">
        <p>{post.content}</p>
      </section>
      <section className="flex justify-between items-center text-center mt-2">
        <Link href={"/app/post/" + post.id} className="w-full p-2 border-t-2 border-gray-300">{post.replies.length} Replies</Link>
        <button 
          onClick={() => likePost.mutate()} 
          className={post.likeStatus ?
            "text-blue-500 font-semibold w-full p-2 border-t-2 border-x-2 border-gray-300 hover:cursor-pointer"
            : "w-full p-2 border-t-2 border-x-2 border-gray-300 hover:cursor-pointer"
            }>
          {post.likes.length} Likes
        </button>
        <button onClick={() => copy(process.env.NEXT_PUBLIC_BASE_URL + '/app/post/'+post.id)} className="w-full p-2 border-t-2 border-gray-300">{value ? "Copied to clipboard!": "Share"}</button>
      </section>
    </section> 
  );
};
"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useParams, redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Post from "@/components/Post";
import PageTitle from "@/components/PageTitle";

export default function Profile() {

  const { data: session } = useSession();
  const params = useParams();

  const user = useQuery({
    queryKey: ['user', params.userId],
    queryFn: () => api.getUser(params.userId as string)
  });

  const posts = useQuery({
    queryKey: ['posts', params.userId],
    queryFn: () => api.getUserPosts(params.userId as string)
  });

  const followUser = useMutation({
    mutationFn: () => api.followUser(params.userId as string),
    onSuccess: user.refetch
  });

  if (user.isError) {
    return redirect('/app')
  };

  if (user.isSuccess){

    const profilePicture = user.data.image;

    return (
      <>
        <PageTitle pageTitle={"Profile"}/>
        <section id="profile-container">
          <section id="profile-loading-container">
            {user.isLoading ? 
              <p>Loading...</p> 
              : null
            }
          </section>
          {user.isError ? (
            <section id="profile-loading-error-container">
              <p className="bg-red-500 rounded-xl p-2">Failed to load, please refresh the page or try again later.</p>
            </section>
          ) : null}
          {user.isSuccess ? (
            <section id="profile-data-main-container" className="flex justify-between md:gap-4 p-2">
              <section id="profile-data-left-container" className="flex flex-col">
                <section id="profile-picture-container">
                  <img src={profilePicture} className="w-24 rounded-full" />
                </section>
                <section id="profile-user-data" className="flex flex-col gap-2">
                  <h2 id="profile-user-username" className="text-xl font-semibold">{user.data.name}</h2>
                  <h4>{user.data.email}</h4>
                </section>
              </section>
              <section id="profile-information-right-container"className="flex self-end">
                <section id="profile-follow-container" className="flex flex-col gap-4">
                  <section id="profile-follow-data"className="flex gap-4 flex-col md:flex-row">
                    <section id="profile-followers" className="text-center">
                      <h3 className="font-semibold">{user.data.followed.length ?? "-"}</h3>
                      <h4>Followers</h4>
                    </section>
                    <section id="profile-following"className="text-center">
                      <h3 className="font-semibold">{user.data.following.length ?? "-"}</h3>
                      <h4>Following</h4>
                    </section>
                  </section>
                  <section id="profile-interact-button" className="flex justify-center">
                    {user.data.email === session?.user?.email ? (
                      <section id="profile-interact-button-owner">
                      </section>
                    ) : (
                      <section id="profile-interact-button-guest">
                          <button onClick={() => followUser.mutate()} id="unfollow-button" className="bg-blue-400 p-1 text-white rounded-full hover:bg-blue-500 w-24">
                            {user.data.isFollowing ? "Unfollow" : "Follow"}
                          </button>
                      </section>
                    )}
                  </section>
                </section>
              </section>
            </section>
          ) : null}
        </section>
        {posts.isSuccess ? (
          <section>
            {posts.data.map((post: any, index: any) => (
              <Post post={post} key={index}/>
            ))}
          </section>
        ) : null }
      </>
    );
  };
};
"use client";
import Link from "next/link";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { useEffect } from "react";
import Search from "./Search";

export default function Navigation() {

  const unreadNotifications = useQuery({
    queryKey: ['unreadNotifications'],
    queryFn: api.getUnreadNotifications,
  });

  const user = useQuery({
    queryKey: ['user'],
    queryFn: api.getCurrentUser,
  });


  return (
    <nav id="navigation" className="md:p-8 flex flex-col gap-6 justify-center items-center">
      <img 
        src="https://cdn.pixabay.com/photo/2014/04/02/10/15/bluebird-303230_1280.png" 
        className="w-16"
        alt="logo"
        id="navigation-logo"
      />
      <Link href="/app" className="text-xl font-semibold hover:underline">Home</Link>
      <Link href={user.isSuccess ? "/app/profile/" + user.data.id : "/app"} className="text-xl font-semibold hover:underline">Profile</Link>
      <Link href="/app/notifications" className="text-xl font-semibold hover:underline">
        <section className="flex flex-col md:flex-row"><p>Notifications({unreadNotifications.isSuccess ? unreadNotifications.data.notifications : 0})</p></section>
      </Link>
      <section id="navigation-sign-out">
        <button onClick={() => signOut({redirect: false})} className="text-xl font-semibold hover:underline hover:cursor-pointer">Sign Out</button>
      </section>
      <Link href="/app" className="bg-blue-400 p-2 text-white text-center rounded-full hover:bg-blue-500 w-30 md:w-auto">New Tweet</Link>
      <section className="md:hidden">
        <Search />
      </section>
    </nav>
  )
};
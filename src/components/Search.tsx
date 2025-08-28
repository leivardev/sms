"use client";
import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";

export default function Search(this: any) {

  const [ searchData, setSearchData ] = useState("");

  const searchUsers = useMutation({
    mutationFn: () => api.searchUsers({content: searchData}),
  });

  function continuesSearch(value: string) {
    setSearchData(value);
    if(value !== ""){
      searchUsers.mutate();
    } else {
      searchUsers.reset();
    }
  };

  return (
    <section className="flex flex-col md:p-4 gap-4">
      <section className="flex flex-col md:flex-row gap-2">
        <input value={searchData} onChange={(e) => continuesSearch(e.target.value)} className="bg-gray-200 p-1 md:p-2 rounded-full outline-none w-30 md:w-full" placeholder="Search for users" type="text"/>
      </section>
      <section>
        {searchUsers.isSuccess ? (
          (
            <section>
              {searchUsers.data.results.length ? (
                <section className="flex flex-col gap-4">
                <p className="font-semibold">Profiles</p>
                {searchUsers.data.results.map((user:any, index:any) => (
                  <Link href={"/app/profile/" + user.id } key={ index } className="flex items-center gap-4">
                  <img src={user.image} className="w-8 h-8 rounded-full" />
                  <p className="textl-lg">{user.name}</p>
                  </Link>
                ))}
                </section>
              ):(
                <p>No results</p>
              )}
            </section>
          )
        ):(null)}
      </section>
    </section>
  )
};
"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useEffect } from "react";
import PageTitle from "@/components/PageTitle";

export default function Notifcations() {

  const queryClient = useQueryClient();

  const getNotifications = useQuery({
    queryKey: ['notifications'],
    queryFn: api.getNotifications
  });

  const readNotifications = useMutation({
    mutationFn: api.readNotifications,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['unreadNotifications']})
  });

  useEffect(() => {
    readNotifications.mutate();
  },[])

  return (
    <>
      <PageTitle pageTitle={"Notifications"}/>
      {getNotifications.isSuccess ? (
        <section>
          {getNotifications.data.map((notification:any, index:any) => (
            <section className="p-4 border-b-2 border-gray-300" key={index}>
              {notification.content}
            </section>
          ))}
        </section>
      ): null}
    </>
  )
};
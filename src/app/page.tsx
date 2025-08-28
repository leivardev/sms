"use client";
import { useSession, signIn } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {

  const { data: session } = useSession();

  if (session) {
    return redirect('/app');
    /*(
      <section className="flex flex-col w-[120px] p-2">
        <p>Name: {session.user?.name}</p>
        <img className="w-[40px] self-center" src={session.user?.image ?? ""} />
        <p><button className="self-center"onClick={() => signOut()}>Sign out</button></p>
      </section>
    )*/
    
  }
  /* or <button onClick={() => signIn('google')}>Google</button> */ /*add the following line and uncomment in .env for google auth */
  return (
    <section className="flex flex-col mt-20">
      <section className="flex flex-col gap-4 self-center text-center">
        <img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiHIZuDb--IJ-q5d97gWm1W2eyLj7BePcWnQ&s" 
          className="w-12 self-center"
        />
        <h1 className="text-2xl">Happening now</h1>
        <h2 className="text-xl">Join today</h2>
        <button 
          onClick={() => signIn('github')}
          className="bg-blue-400 p-2 text-white rounded-full hover:bg-blue-500"
        >Sign in with GitHub</button>
        <p className="text-sm">Don't have a GitHub account yet? Sign up <a href="https://github.com" target="_blank" className="underline">here</a></p>
      </section>

    </section>
  );
};
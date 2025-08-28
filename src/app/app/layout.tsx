import Navigation from "@/components/Navigation";
import Search from "@/components/Search";
import { getAuthOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AppLayout ({
  children,
}: {
  children: React.ReactNode
}) {

  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect('/');
  };

  return (
    <section className="sm:grid sm:grid-cols-4 md:grid-cols-4 relative">
      <section id="nav-col" className="sm:col-span-1 justify-center">
        <nav className="sm:fixed sm:top-0 sm:left-0">
          <Navigation />
        </nav>
      </section>
      <main className="sm:col-span-3 md:col-span-2 border-x-2 border-gray-300 mb-20 min-h-screen">
        {children}
      </main>
      <section id="search-field-md" className="hidden col-span-0 md:block md:col-span-1">
        <Search />
      </section>
      <footer className="fixed h-20 w-full bottom-0 bg-blue-500 flex flex-col justify-center items-center">
        <p>This is a private project to display development skills. </p>
      </footer>
    </section>
  )

};
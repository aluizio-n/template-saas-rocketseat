import { handleAuth } from "@/app/actions/handle-auth";
import { auth } from "@/app/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const session = await auth();
    if(!session){
        redirect("/login");
    }
    return (
        <div className="flex flex-col gap-10 items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Protected Dashboard</h1>
        <p>{session?.user?.email ? session?.user?.email : "Usuário não está logado"}</p>
        {session?.user?.image && (
            <form action={handleAuth}>
                <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
                    Logout
                </button>
            </form>
        )}
        <Link href="/pagamentos">Pagamentos</Link>
        </div>
    );
}
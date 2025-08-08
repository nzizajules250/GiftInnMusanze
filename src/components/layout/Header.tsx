// This parent component remains a server component to fetch server-side data
import { getSession } from "@/lib/auth";
import { HeaderClient } from "./HeaderClient";

export default async function Header() {
    const session = await getSession();

    return <HeaderClient session={session} />
}

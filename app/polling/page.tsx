import PollingClient from "../components/polling/PollingClient";
import PollingServer from "../components/polling/PollingServer";
import { checkAuth } from "../actions/auth/actions";
import { NEXT_PUBLIC_BASE_URL } from "@/consts";

export const revalidate = 5; // revalidate every 5 seconds


export default async function Page() {
    const session = await checkAuth()
    const res = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/protected`)
    const data = await res.json()

    console.log('data', data)
    if (!session) {
        console.log('no session')
    } else {
        console.log('session', session)
    }
    return (
        <div>
            <PollingClient />
            <PollingServer />
        </div>
    );
}
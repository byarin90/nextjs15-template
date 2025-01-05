import { signIn, signOut } from "@/auth"
import { redirect } from 'next/navigation';

export function SignIn({
    provider,
    className,
}: { provider?: string , className?: string}) {
    return (
        <form
            action={async () => {
                "use server"
                await signIn(provider)
            }}
        >
            <button className={className}>Sign In</button>
        </form>
    )
}

export function SignOut({
    className,
}:{
    className?: string
}) {
    return (
        <form
            action={async () => {
                "use server"
                await signOut()
            }}
            className="w-full"
        >
            <button  className={className}>
                Sign Out
            </button>
        </form>
    )
}


const SignUp = ({
    className,
}:{
    className?: string
}) => {
    return (
        <form
            action={async () => {
                "use server"
                redirect('/sign-up')
            }}
        >
            <button  className={className}>
                Sign Up
            </button>
        </form>
    )
}

export default SignUp
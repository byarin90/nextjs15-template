"use client";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function SignIn({
    provider,
    className,
}: { provider?: string, className?: string }) {
    const t = useTranslations();
    return (
        <button
            onClick={() => signIn(provider)}
            className={className}
        >
            {t('sign_in')}
        </button>
    );
}

export function SignOut({
    className,
}: {
    className?: string
}) {
    const t = useTranslations();
    return (
        <button
            onClick={() => signOut()}
            className={className}
        >
            {t('sign_out')}
        </button>
    );
}

export function SignUp({
    className,
}: {
    className?: string
}) {
    const t = useTranslations();
    return (
        <Link
            href="/sign-up"
            className={className}
        >
            {t('sign_up')}
        </Link>
    );
}
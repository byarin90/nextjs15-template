"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const SwitchLanguage = () => {

    const [locale, setLocale] = useState<string>('en')
    const router = useRouter()

    const changeLocale = (locale: string) => {
        setLocale(locale)
        document.cookie = `locale=${locale};`;
        router.refresh()
    }

    useEffect(() => {
        const cookieLocale = document.cookie.split('; ').find((row) => row.startsWith('locale='))?.split('=')[1]
        if (cookieLocale) { setLocale(cookieLocale) }
        else {
            const browserLocale = navigator.language.split('-')[0]
            setLocale(browserLocale)
            document.cookie = `locale=${browserLocale}; path=/; max-age=31536000`;
        }
    }, [router])
    return (
        <div className="flex items-center space-x-2">
            <button className={`border p-2 font-bold rounded-md text-sm ${locale === 'en' ? 'bg-colors-secondary text-colors-primary' : 'text-colors-secondary'}`} onClick={() => changeLocale('en')}>EN</button>
            <button className={`border p-2 font-bold rounded-md text-sm ${locale === 'he' ? 'bg-colors-secondary text-colors-primary' : 'text-colors-secondary'}`} onClick={() => changeLocale('he')}>HE</button>
        </div>
    )
}

export default SwitchLanguage
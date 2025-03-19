"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "use-intl"

const SwitchLanguage = ({ currentLocale }: { currentLocale: string }) => {

    const [locale, setLocale] = useState<string>(currentLocale)
    const router = useRouter()
    const t = useTranslations()

    const changeLocale = (locale: string) => {
        setLocale(locale)
        document.cookie = `locale=${locale}; path=/; max-age=31536000`;

        // כאשר אנחנו בדף login, אנחנו צריכים לטעון מחדש את הדף במלואו
        if (window.location.pathname.includes('/auth/login') || window.location.pathname.includes('/auth/register')) {
            window.location.href = window.location.href; // גורם לטעינה מחדש מלאה של הדף
        } else {
            router.refresh();
        }
    }

    useEffect(() => {
        const cookieLocale = document.cookie.split('; ').find((row) => row.startsWith('locale='))?.split('=')[1]
        if (cookieLocale) { setLocale(cookieLocale) }
        else {
            const browserLocale = navigator.language.split('-')[0]
            setLocale(browserLocale)
            document.cookie = `locale=${browserLocale}; path=/; max-age=31536000`;
        }
    }, [])
    return (
        <div className="flex items-center ">
            {locale == 'he' ?
                <button className={`border p-2 font-bold rounded-md text-sm `} onClick={() => changeLocale('en')}>{t('en')}</button>
                : <button className={`border p-2 font-bold rounded-md text-sm`} onClick={() => changeLocale('he')}>{t('he')}</button>

            }

        </div>
    )
}

export default SwitchLanguage
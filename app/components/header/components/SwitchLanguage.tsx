
import { changeLocaleToggle } from "@/app/actions/auth/actions"
import { useTranslations } from "next-intl";

const SwitchLanguage = ({currentLocale}: {currentLocale: string}) => {
    const t = useTranslations()
    return (
        <div className="flex items-center ">
            <form action={changeLocaleToggle}>
                <input type="hidden" name="mode" value={currentLocale === 'he' ? 'en' : 'he'} />
                <button type="submit">
                    {currentLocale === 'he' ? t('en') : t('he')}
                </button>
            </form>
        </div>
    )
}

export default SwitchLanguage
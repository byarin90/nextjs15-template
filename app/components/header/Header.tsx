import Image from "next/image";
import DropDown from "./components/DropDown";
import todoLogo from "@/assets/todoLogo.png";
import Avatar from "./components/Avatar";
import { SignIn, SignOut, SignUp } from "./components/AuthComponents";
import Link from "next/link";
import SwitchLanguage from "./components/SwitchLanguage";
import { useTranslations } from "next-intl";
import DarkModeToggle from "./components/DarkModeToggle";




const Header = ({ session, isDarkMode }: { session: any, isDarkMode?: string }) => {
    const t = useTranslations()
    return (
        <header
            className="
            bg-colors-primary 
            text-colors-secondary 
            shadow-lg 
            border-b 
            border-colors-secondary
            flex
            h-[5rem]
            items-center
            justify-between
            w-full
            py-4
            transition
            "
        >
            <div className=" mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex justify-between   ">
                    <div className="flex items-center gap-6">
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <Image
                                width={40}
                                height={40}
                                className="h-8 w-8 rounded-full"
                                src={todoLogo}
                                alt="Logo"
                            />
                            <span className="font-bold text-xl">{t('TodoList')}</span>
                        </div>


                        <nav className="hidden md:flex items-center gap-4">
                            <Link
                                href="/"
                                className="
                                  hover:text-colors-accent 
                                  transition
                                "
                            >
                                Home
                            </Link>
                            {session?.user && (
                                <DropDown
                                    label="Services"
                                    items={[
                                        { href: "/todos-local", label: "Todos-Local" },

                                    ]}
                                />

                            )}
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">

                        <DarkModeToggle isDarkMode={isDarkMode} />
                        <SwitchLanguage />

                        {!session?.user ? (
                            <>
                                <SignIn

                                    className="
                                      hidden sm:block 
                                      px-4 py-2 
                                      border 
                                      shadow-sm
                                      border-colors-secondary/20 
                                      rounded-md 
                                      hover:bg-black/10
                                      transition
                                    dark:hover:bg-white/10"
                                />
                                <SignUp
                                    className="
                                      hidden sm:block 
                                      shadow-sm
                                      bg-colors-secondary 
                                      text-colors-primary
                                      px-4 py-2 rounded-md
                                      hover:bg-black/70
                                      transition
                                      dark:hover:bg-white/70
                                      "
                                />
                            </>
                        ) : (
                            <>
                                <SignOut
                                    className="
                                      hidden sm:block 
                                      bg-colors-secondary 
                                      text-colors-primary
                                      px-4 py-2 rounded-md
                                      hover:bg-colors-secondary/90 
                                      transition-colors
                                    "
                                />
                            </>
                        )}
                        <div className="relative">
                            <Avatar src={session?.user?.image || ""} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
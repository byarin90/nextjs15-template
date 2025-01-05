import Image from "next/image";
import DarkModeToggle from "./components/DarkModeToggle";
import DropDown from "./components/DropDown";
import todoLogo from "@/assets/todoLogo.png";
import Avatar from "./components/Avatar";
import SignUp, { SignIn, SignOut } from "./components/AuthComponents";
import Link from "next/link";
import { auth } from "@/auth";

const Header = async () => {
    const session = await auth();
    console.log(session);

    return (
        <header
            className="
            bg-colors-primary 
            text-colors-secondary 
            shadow-lg 
            border-b 
            border-colors-secondary/20
transition"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <div className="flex-shrink-0 flex items-center space-x-2">
                            <Image
                                width={40}
                                height={40}
                                className="h-8 w-8 rounded-full"
                                src={todoLogo}
                                alt="Logo"
                            />
                            <span className="font-bold text-xl">TodoList</span>
                        </div>

                        {/* תפריט */}
                        <nav className="hidden md:flex items-center space-x-4">
                            <Link
                                href="#"
                                className="
                                  hover:text-colors-accent 
                                  transition
                                "
                            >
                                Home
                            </Link>

                            <DropDown
                                label="Services"
                                items={[
                                    { href: "#", label: "Service 1" },
                                    { href: "#", label: "Service 2" },
                                    { href: "#", label: "Service 3" },
                                ]}
                            />
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <DarkModeToggle />

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
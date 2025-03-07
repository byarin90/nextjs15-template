import { updateDarkMode } from "@/app/actions/auth/actions";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

const DarkModeIcon = ({ isDarkMode }: { isDarkMode: boolean }) => {
    return <div className="">
        {isDarkMode ? (
            <SunIcon className="h-6 w-6 text-yellow-400" />
        ) : (
            <MoonIcon className="h-6 w-6 text-primary" />
        )}
    </div>;
};

const DarkModeToggle = ({ isDarkMode }: { isDarkMode?: string }) => {
    return (
        <div className="flex items-center space-x-4">

            <form action={updateDarkMode}>
                <input type="hidden" name="mode" value={isDarkMode === "true" ? "true" : "false"} />
                
                <button>
                    <DarkModeIcon isDarkMode={isDarkMode === "true"} />
                </button>
            </form>

        </div>)
}

export default DarkModeToggle
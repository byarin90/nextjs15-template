import { SignIn } from "@/app/components/header/components/AuthComponents";
import RegisterForm from "@/app/components/sign-up/RegisterForm";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className=" bg-colors-primary text-colors-secondary p-4">
      <div>
        <section className="bg-primary">
          <div className="flex flex-col items-center  px-6 py-8 w-full ">
            <Link href="#" className="flex items-center mb-6 text-2xl font-semibold text-primary">
              <Image width={100} height={100} className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
              TodoList App Registeration
            </Link>
            <div className="w-full bg-secondary rounded-lg shadow dark:border md:mt-0 sm:max-w-xl xl:max-w-4xl xl:p-0 bg-primary dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-primary md:text-2xl">
                  Create an account
                </h1>

                <RegisterForm />

                <div className="text-sm font-light text-gray-500 dark:text-gray-400 flex">
                  Already have an account?{" "}
                  <span className="font-medium ml-1 text-primary-600 hover:underline dark:text-primary-500">
                    <SignIn />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
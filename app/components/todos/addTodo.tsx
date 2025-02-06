"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { userRegistrationSchema } from "@/app/validations/auth/schema-sign-up";
import { UserRegistrationForm } from "@/app/types";
import { signUp } from "@/app/actions/auth/actions";
import { useRouter } from "next/navigation";



export default function AddTodo() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserRegistrationForm>({
        resolver: joiResolver(userRegistrationSchema),
    });
    const [error, setError] = React.useState<string | null>(null);
    const errorsKeys = Object.keys(errors);
    const router = useRouter();
    useEffect(() => {
        if (errorsKeys.length) {
            setError(null);
        }
    }, [errorsKeys]);

    const onSubmit = async (data: UserRegistrationForm) => {
        try {
            const response = await signUp(data);
            if (response.success) {
                router.push("/");
            } else {
                setError(response.message as string);
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            setError("Something went wrong. Please try again later.");
        }
    };
    return (

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6" action="#">
            <div>
                <label className="block mb-2 text-sm font-medium text-primary">Your email</label>
                <input {...register("email")} type="email" name="email" id="email" className="bg-primary border border-gray-300 text-primary text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
                    <p className="text-sm text-colors-error mt-1">
                        {errors?.email?.message || ' '}
                    </p>
               
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-primary">Image URL</label>
                <input {...register('image')} type="text" name="image" id="image" placeholder="http://image-url.ai.com" className="bg-gray-50 border border-gray-300 text-primary text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    <p className="text-sm text-colors-error mt-1">
                        {errors?.image?.message || ' '}
                    </p>
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-primary">Password</label>
                <input {...register('password')} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-primary text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    <p className="text-sm text-colors-error mt-1">
                        {errors?.password?.message || ' '}
                    </p>
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-primary">Confirm password</label>
                <input {...register('confirmPassword')} type="password" name="confirmPassword" id="confirmPassword" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-primary text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    <p className="text-sm text-colors-error mt-1">
                        {errors?.confirmPassword?.message || ' '}
                    </p>
            </div>
            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input
                        id="terms"
                        type="checkbox"
                        {...register("terms")}
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50
                 focus:ring-3 focus:ring-primary-300
                 dark:bg-gray-700 dark:border-gray-600
                 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label
                        htmlFor="terms"
                        className="font-light text-gray-500 dark:text-gray-300"
                    >
                        I accept the{" "}
                        <a
                            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                            href="#"
                        >
                            Terms and Conditions
                        </a>
                    </label>
                </div>
            </div>
            {errors.terms && (
                <p className="text-sm text-colors-error mt-1">
                    {errors.terms.message}
                </p>
            )}
            {error && (
                <p className="text-sm text-colors-error mt-1">
                    {error}
                </p>
            )}
            <button type="submit" className="w-full text-colors-secondary dark:text-white text-slate-800 dark:bg-slate-800 bg-slate-300 py-2.5 px-4 text-sm font-medium text-primary rounded-lg hover:bg-slate-400 dark:hover:bg-slate-700 transition-colors   
                                ">Create an account</button>
      
        </form>

    );
}
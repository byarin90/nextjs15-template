"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { userRegistrationSchema } from "@/app/validations/auth/schema-sign-up";
import { UserRegistrationForm } from "@/app/types";
import { signUp } from "@/app/actions/auth/actions";
import { useRouter } from "next/navigation";



export default function RegisterForm() {
    // react-hook-form setup
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
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
                console.log("User registered successfully:");
                router.push("/");
            } else {
                console.error("Registration error:", response.message);
                console.log(response.message);
                setError(response.message);
            }
        } catch (error) {
            setError("Something went wrong. Please try again later.");
            console.error("Unexpected error:", error);
            console.log("Something went wrong. Please try again later.");
        }
    };
    return (
        <div
            className="
        max-w-xl
        mx-auto 
        mt-10 
        bg-colors-primary 
        text-colors-secondary 
        p-6 
        rounded-md 
        border 
        border-colors-secondary/10
      "
        >
            <h2 className="text-xl font-bold mb-4">Register</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                <div className="flex flex-col">
                    <label htmlFor="email" className="mb-1 font-semibold">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="
                        px-3 py-2 
                        bg-colors-primary 
                        text-colors-secondary 
                        border border-colors-secondary/20 
                        rounded-md 
                        focus:outline-none 
                        focus:ring-2 
                        focus:ring-colors-accent 
                        transition-colors
                      "
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-sm text-colors-error mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className="flex flex-col">
                    <label htmlFor="image" className="mb-1 font-semibold">
                        Image URL
                    </label>
                    <input
                        id="image"
                        type="text"
                        className="
              px-3 py-2 
              bg-colors-primary 
              text-colors-secondary 
              border border-colors-secondary/20 
              rounded-md 
              focus:outline-none 
              focus:ring-2 
              focus:ring-colors-accent 
              transition-colors
            "
                        {...register("image")}
                    />
                    {errors.image && (
                        <p className="text-sm text-colors-error mt-1">
                            {errors.image.message}
                        </p>
                    )}
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password" className="mb-1 font-semibold">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="
              px-3 py-2 
              bg-colors-primary 
              text-colors-secondary 
              border border-colors-secondary/20 
              rounded-md 
              focus:outline-none 
              focus:ring-2 
              focus:ring-colors-accent 
              transition-colors
            "
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className="text-sm text-colors-error mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <div className="flex flex-col">
                    <label htmlFor="confirmPassword" className="mb-1 font-semibold">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        className="
              px-3 py-2 
              bg-colors-primary 
              text-colors-secondary 
              border border-colors-secondary/20 
              rounded-md 
              focus:outline-none 
              focus:ring-2 
              focus:ring-colors-accent 
              transition-colors
            "
                        {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                        <p className="text-sm text-colors-error mt-1">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                {error && (
                    <p className="text-sm text-colors-error mt-1">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
            mt-2 
            bg-colors-accent
            text-colors-primary
            dark:bg-colors-secondary 
            dark:text-black 
            rounded-md 
            py-2 
            hover:bg-colors-accent/90 
            transition-colors
            disabled:bg-colors-secondary/40
          "
                >
                    {isSubmitting ? "Submitting..." : "Register"}
                </button>
            </form>
        </div>
    );
}
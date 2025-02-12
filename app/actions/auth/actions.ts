"use server";
import { cookies } from "next/headers";
import { UserRegistrationForm } from "@/app/types";
import { userRegistrationSchema } from "@/app/validations/auth/schema-sign-up";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

export const signUp = async (data: UserRegistrationForm): Promise<{ success: boolean, message?: string }> => {
    try {
        await userRegistrationSchema.validateAsync(data);

        const isExist = await db.user.findFirst({
            where: {
                OR: [
                    { email: { equals: data.email } },
                    { username: { equals: data.email } },
                ],
            },
        });

        if (isExist) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        await db.user.create({
            data: {
                email: data.email,
                username: data.email,
                password: hashedPassword,
                image: data.image,
            },
        })

        return { success: true, message: "Registration successful" };
    } catch (error: any) {
        return { success: false, message: error.message || "Registration failed" };
    }
};


export async function updateDarkMode(isDark: boolean) {
    (await cookies()).set("dark", isDark ? "true" : "false", { path: "/" });
  }
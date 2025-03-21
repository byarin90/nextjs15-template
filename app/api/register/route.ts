import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "חסרים פרטים נדרשים" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUserByEmail = await db.user.findUnique({
      where: { email },
    });

    const existingUserByUsername = await db.user.findUnique({
      where: { username },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { message: "האימייל כבר קיים במערכת" },
        { status: 400 }
      );
    }

    if (existingUserByUsername) {
      return NextResponse.json(
        { message: "שם המשתמש כבר קיים במערכת" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: Role.USER,
      },
    });

    // Don't return the password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        message: "משתמש נוצר בהצלחה",
        user: userWithoutPassword 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json(
      { message: "אירעה שגיאה פנימית" },
      { status: 500 }
    );
  }
}

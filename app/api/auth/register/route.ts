/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";
import bcrypt from "bcrypt";

// סכמת ולידציה
const RegisterUserSchema = z.object({
  name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים"),
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z
    .string()
    .min(8, "הסיסמה חייבת להכיל לפחות 8 תווים")
    .regex(/[A-Z]/, "הסיסמה חייבת להכיל לפחות אות גדולה אחת באנגלית")
    .regex(/[a-z]/, "הסיסמה חייבת להכיל לפחות אות קטנה אחת באנגלית")
    .regex(/[0-9]/, "הסיסמה חייבת להכיל לפחות ספרה אחת"),
});

export async function POST(request: Request) {
  try {
    // בדיקה שהמשתמש מחובר והוא מנהל
    const session = await auth();
    
    // אם רוצים שרק מנהלים יוכלו להוסיף משתמשים חדשים
    if (session?.user.role !== "ADMIN") {
      return Response.json({ error: "אין הרשאה לבצע פעולה זו" }, { status: 403 });
    }
    
    // פענוח הבקשה
    const body = await request.json();
    
    // ולידציה של הפרמטרים
    const validationResult = RegisterUserSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(error => error.message);
      return Response.json({ error: "נתונים לא תקינים", details: errors }, { status: 400 });
    }

    const { name, email, password } = validationResult.data;

    // בדיקה אם המשתמש כבר קיים
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return Response.json({ error: "משתמש עם כתובת אימייל זו כבר קיים" }, { status: 400 });
    }

    // הצפנת הסיסמה
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // יצירת משתמש חדש
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER", // תפקיד ברירת מחדל
      }
    });

    // החזרת תשובה מוצלחת (ללא הסיסמה)
    const { password: _, ...userWithoutPassword } = newUser;
    return Response.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("שגיאה ביצירת משתמש:", error);
    return Response.json({ error: "שגיאה ביצירת המשתמש" }, { status: 500 });
  }
}

// ניתן להוסיף גם את הפונקציה GET לקבלת רשימת המשתמשים
export async function GET() {
  try {
    // בדיקה שהמשתמש מחובר והוא מנהל
    const session = await auth();
    
    if (!session) {
      return Response.json({ error: "לא מחובר" }, { status: 401 });
    }
    
    if (session.user.role !== "ADMIN") {
      return Response.json({ error: "אין הרשאה לבצע פעולה זו" }, { status: 403 });
    }

    // קבלת רשימת משתמשים ללא הסיסמאות
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return Response.json(users);
  } catch (error) {
    console.error("שגיאה בקבלת רשימת המשתמשים:", error);
    return Response.json({ error: "שגיאה בקבלת רשימת המשתמשים" }, { status: 500 });
  }
}

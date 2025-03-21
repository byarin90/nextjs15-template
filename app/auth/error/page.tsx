"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const error = searchParams.error as string;

  const errors: { [key: string]: { title: string; message: string } } = {
    Configuration: {
      title: "שגיאת תצורה",
      message: "ישנה בעיה בהגדרות האימות של המערכת.",
    },
    AccessDenied: {
      title: "הגישה נדחתה",
      message: "אין לך הרשאה לגשת לדף זה.",
    },
    Verification: {
      title: "הקישור פג תוקף",
      message: "קישור האימות פג תוקף או כבר נעשה בו שימוש.",
    },
    OAuthAccountNotLinked: {
      title: "חשבון לא מקושר",
      message: "כתובת האימייל כבר משויכת לחשבון אחר. אנא התחבר באמצעות החשבון המקורי או נסה להשתמש בכתובת אימייל אחרת.",
    },
    OAuthSignin: {
      title: "שגיאת התחברות",
      message: "אירעה שגיאה בתהליך ההתחברות עם הספק החיצוני.",
    },
    OAuthCallback: {
      title: "שגיאת תגובה",
      message: "אירעה שגיאה בעת קבלת התגובה מהספק החיצוני.",
    },
    AdapterError: {
      title: "שגיאת חיבור לבסיס נתונים",
      message: "התרחשה שגיאה בעת חיבור לבסיס הנתונים. אנא נסה שוב מאוחר יותר.",
    },
    CredentialsSignin: {
      title: "שגיאת התחברות",
      message: "שם המשתמש או הסיסמה שגויים. אנא ודא את הפרטים ונסה שוב.",
    },
    Default: {
      title: "שגיאת אימות",
      message: "התרחשה שגיאה לא ידועה בתהליך האימות.",
    },
  };

  const errorData = error && errors[error] ? errors[error] : errors.Default;

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">{errorData.title}</CardTitle>
          <CardDescription className="text-center">
            {errorData.message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground text-sm">
            אירעה שגיאה בתהליך האימות. אנא נסה שוב או צור קשר עם תמיכת האתר אם הבעיה ממשיכה.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/auth/login">
              חזרה להתחברות
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

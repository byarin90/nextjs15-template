"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      console.log(`Attempting to send reset email to: ${email}`);
      
      // שליחת בקשת איפוס באמצעות EmailProvider
      const result = await signIn("email", {
        email,
        redirect: false,
        // להוסיף את הנתיב המלא של האתר כולל פרוטוקול
        callbackUrl: `${window.location.origin}/auth/reset-password`,
      });

      console.log("Email signin result:", result);

      if (result?.ok) {
        setMessage({
          type: "success",
          text: "נשלח אימייל עם הוראות לאיפוס הסיסמה. אנא בדוק את תיבת הדואר שלך (כולל תיקיית ספאם).",
        });
        // Store the email address in sessionStorage for future reference
        try {
          sessionStorage.setItem("reset_email", email);
        } catch (error) {
          console.error("Failed to save email to sessionStorage:", error);
        }
      } else {
        setMessage({
          type: "error",
          text: "אירעה שגיאה בשליחת האימייל. אנא נסה שוב מאוחר יותר.",
        });
      }
    } catch (error: any) {
      console.error("Error sending reset email:", error);
      setMessage({
        type: "error",
        text: error?.message || "אירעה שגיאה בלתי צפויה. אנא נסה שוב מאוחר יותר.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex justify-center items-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">איפוס סיסמה</CardTitle>
          <CardDescription>
            הזן את כתובת האימייל שלך ואנו נשלח לך קישור לאיפוס הסיסמה.
            <br />
            <span className="text-sm text-muted-foreground mt-1">
              הערה: ייתכן שהאימייל יגיע לתיקיית הספאם. אנא בדוק גם שם אם אינך רואה את האימייל.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert 
              className={`mb-4 ${message.type === "success" ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200"}`}
            >
              <AlertDescription>{message.text}</AlertDescription>
              {message.type === "success" && (
                <div className="mt-2 text-sm">
                  <p>טיפים להמשך:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>בדוק גם את תיקיית הספאם אם האימייל לא מופיע בדואר הנכנס</li>
                    <li>כשתגיע לדף איפוס הסיסמה, ודא שהטוקן מופיע בכתובת ה-URL</li>
                    <li>אם נתקלת בבעיות, נסה להעתיק את כל הקישור מהאימייל ולהדביק אותו בדפדפן</li>
                  </ul>
                </div>
              )}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">כתובת אימייל</Label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="הזן את כתובת האימייל שלך"
                  className="w-full py-2 pr-10"
                  dir="rtl"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "שולח..." : "שלח קישור לאיפוס סיסמה"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <Link 
            href="/auth/login" 
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={16} className="ml-1" />
            חזרה להתחברות
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

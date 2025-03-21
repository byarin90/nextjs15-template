"use client";

import { CardHeader, CardContent, CardTitle, CardDescription, CardFooter, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { AlertCircle, KeyRound, ArrowLeft, InfoIcon, CheckCircle } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import TokenScript from "./token-script";

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, "הסיסמה חייבת להכיל לפחות 8 תווים")
  .regex(/[A-Z]/, "הסיסמה חייבת להכיל לפחות אות גדולה אחת באנגלית")
  .regex(/[a-z]/, "הסיסמה חייבת להכיל לפחות אות קטנה אחת באנגלית")
  .regex(/[0-9]/, "הסיסמה חייבת להכיל לפחות ספרה אחת");

// Form validation schema
const ResetSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "הסיסמאות לא תואמות",
  path: ["confirmPassword"]
});

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showRequestNewReset, setShowRequestNewReset] = useState(false);

  // Extract token from URL parameters and storage on component mount
  useEffect(() => {
    // Function to try to extract the token from various sources
    const extractToken = () => {
      // Try to get token from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      
      if (urlToken) {
        setToken(urlToken);
        return true;
      }
      // Try to get token from URL hash fragment
      const hashFragment = window.location.hash;
      if (hashFragment) {
        const tokenMatch = hashFragment.match(/token=([^&]+)/);
        if (tokenMatch && tokenMatch[1]) {
          const tokenFromHash = decodeURIComponent(tokenMatch[1]);
          setToken(tokenFromHash);
          return true;
        }
      }
      // Try to get token from sessionStorage
      const sessionToken = sessionStorage.getItem('reset_token');
      if (sessionToken) {
        setToken(sessionToken);
        return true;
      }
      // Try to get token from localStorage
      const localToken = localStorage.getItem('reset_token');
      if (localToken) {
        setToken(localToken);
        return true;
      }
      // Try to get token from meta tag
      const tokenMeta = document.querySelector('meta[name="reset-token"]');
      if (tokenMeta && tokenMeta.getAttribute('content')) {
        const metaToken = tokenMeta.getAttribute('content');
        if (metaToken) {
          setToken(metaToken);
          return true;
        }
      }
      
      return false;
    };
    
    const tokenFound = extractToken();
    if (!tokenFound) {
      setError("לא נמצא טוקן תקף. אנא בקש קישור חדש לאיפוס סיסמה.");
      setShowRequestNewReset(true);
    }
  }, [searchParams]);

  // On page load, check if there's a token in the URL hash and save it to sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Token might be in the hash fragment - Next.js doesn't parse this into searchParams
      const hashFragment = window.location.hash;
      if (hashFragment && hashFragment.includes('token=')) {
        const hashTokenMatch = hashFragment.match(/token=([^&]+)/);
        if (hashTokenMatch && hashTokenMatch[1]) {
          const tokenFromHash = decodeURIComponent(hashTokenMatch[1]);
          
          // Store in sessionStorage for the token extraction useEffect to find
          try {
            sessionStorage.setItem("resetPasswordToken", tokenFromHash);
            
            // Optionally redirect to the same page but without the hash to clean the URL
            window.location.hash = '';
          } catch {
            // Ignore storage errors
            setError("שגיאה בשמירת הטוקן.");
          }
        }
      }
    }
  }, []);

  // Clear token from localStorage when the process is completed successfully
  useEffect(() => {
    if (isSuccess) {
      localStorage.removeItem('passwordResetToken');
    }
  }, [isSuccess]);

  useEffect(() => {
    try {
      passwordSchema.parse(password);
      setValidationErrors([]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors(error.errors.map(err => err.message));
      }
    }
  }, [password]);

  const onSubmit = async () => {
    setError(undefined);
    setSuccess(undefined);
    setIsLoading(true);
    

    if (!token) {
      setError("לא נמצא טוקן תקף. אנא בקש קישור חדש לאיפוס סיסמה.");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || "אירעה שגיאה בתהליך איפוס הסיסמה.");
      } else {
        setSuccess("הסיסמה שונתה בהצלחה!");
        setIsSuccess(true);
        
        // Clear token from storage after successful reset
        try {
          localStorage.removeItem("resetPasswordToken");
          sessionStorage.removeItem("reset_token");
        } catch {
          // Ignore errors in cleanup
        }
        
        // Redirect to home page after successful reset
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch {
      setError("אירעה שגיאה בחיבור לשרת.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container flex justify-center items-center min-h-screen py-10">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">הסיסמה שונתה בהצלחה!</CardTitle>
            <CardDescription className="text-emerald-600 mt-1">
              מחובר למערכת אוטומטית
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center my-4">
              <CheckCircle className="h-16 w-16 text-emerald-500" />
            </div>
            <p className="text-center text-muted-foreground mb-6">
              {success || "הסיסמה שלך שונתה בהצלחה. מפנה אותך לדף הבית..."}
            </p>
            <div className="flex justify-center">
              <Button 
                onClick={() => router.push("/")} 
                className="w-full max-w-xs"
              >
                המשך לדף הבית
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex justify-center items-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>איפוס סיסמה</CardTitle>
          <CardDescription>
            הזן את הסיסמה החדשה שלך.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>שגיאה</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* אפשרות לבקש קישור חדש אם הטוקן לא תקף */}
          {showRequestNewReset && (
            <Alert className="mb-4">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>נראה שחסר טוקן תקף</AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-2">לא מצליח לאפס את הסיסמה? אפשר לבקש קישור חדש:</p>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/auth/forgot-password')}
                  className="mt-2"
                >
                  לבקשת קישור איפוס חדש
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="mx-auto max-w-md space-y-6">
            <TokenScript />
            <div className="space-y-2 text-center">
              <form onSubmit={(e) => {
                e.preventDefault();
                try {
                  const data = { password, confirmPassword };
                  // Validate form data with schema
                  ResetSchema.parse(data);
                  onSubmit();
                } catch (error) {
                  if (error instanceof z.ZodError) {
                    setValidationErrors(error.errors.map(err => err.message));
                  }
                }
              }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">סיסמה חדשה</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <KeyRound size={16} className="text-gray-400" />
                    </div>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="הזן סיסמה חדשה"
                      className="w-full py-2 pr-10"
                      dir="rtl"
                      required
                    />
                  </div>
                  {validationErrors.length > 0 && (
                    <ul className="text-red-500 text-sm list-disc list-inside space-y-1 mt-2">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">אימות סיסמה</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <KeyRound size={16} className="text-gray-400" />
                    </div>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="הזן שוב את הסיסמה החדשה"
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
                  {isLoading ? "מאפס סיסמה..." : "איפוס סיסמה"}
                </Button>
              </form>
            </div>
          </div>
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

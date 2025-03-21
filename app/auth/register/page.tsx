import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/register-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-muted/50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>הרשמה</CardTitle>
          <CardDescription>
            צור חשבון חדש כדי להתחיל
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <RegisterForm />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">
                  או המשך באמצעות
                </span>
              </div>
            </div>

            <OAuthButtons />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            כבר יש לך חשבון?{" "}
            <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary">
              התחבר
            </Link>
          </div>
          <Link href="/" className="w-full">
            <Button variant="ghost" className="w-full">חזרה לדף הבית</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

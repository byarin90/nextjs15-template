"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "@/auth";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { redirect } from "next/navigation";
import { Github, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LinkAccountPage() {
  const { data: session, status } = useSession();
  const [isLinking, setIsLinking] = useState(false);

  // Redirect if not logged in
  if (status === "unauthenticated") {
    redirect("/api/auth/signin");
  }

  const handleLinkProvider = async (provider: string) => {
    setIsLinking(true);
    try {
      // This will open the OAuth popup/redirect and handle the callback
      await signIn(provider, {
        callbackUrl: "/account",
        redirect: true,
      });
    } catch (error) {
      console.error("Error linking account:", error);
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted/50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>קישור חשבון</CardTitle>
          <CardDescription>
            קשר את החשבון שלך לשירותים חיצוניים כדי להתחבר בקלות
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            אתה מחובר כרגע כ: <span className="font-semibold">{session?.user?.email}</span>
          </p>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => handleLinkProvider("github")}
              disabled={isLinking}
            >
              <Github className="h-4 w-4" />
              קשר חשבון GitHub
            </Button>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => handleLinkProvider("google")}
              disabled={isLinking}
            >
              <Mail className="h-4 w-4" />
              קשר חשבון Google
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="ghost" onClick={() => redirect("/account")}>
            חזרה לחשבון
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

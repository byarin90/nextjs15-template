import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ConnectButtons } from "@/components/auth/connect-buttons";

export default async function ConnectAccountPage() {
  const session = await auth();

  // Redirect if not logged in
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

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
            אתה מחובר כרגע כ: <span className="font-semibold">{session.user.email}</span>
          </p>

          <div className="space-y-2">
            <ConnectButtons />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Link href="/account">
            <Button variant="ghost">חזרה לחשבון</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

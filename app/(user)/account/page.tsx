import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await auth();

  // Redirect if not logged in
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted/50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>פרטי חשבון</CardTitle>
          <CardDescription>נהל את החשבון שלך והחיבורים החיצוניים</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">דואר אלקטרוני:</p>
            <p className="text-sm text-muted-foreground">{session.user.email || "לא הוגדר"}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">שם משתמש:</p>
            <p className="text-sm text-muted-foreground">{session.user.username || "לא הוגדר"}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">סוג משתמש:</p>
            <p className="text-sm text-muted-foreground">{session.user.role || "רגיל"}</p>
          </div>

          <div className="mt-6 space-y-2">
            <Link href="/account/connect" className="block">
              <Button variant="outline" className="w-full">
                קישור לחשבונות חיצוניים
              </Button>
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/">
            <Button variant="ghost">חזרה לדף הבית</Button>
          </Link>
          <form action="/api/auth/signout" method="post">
            <Button variant="destructive" type="submit">
              התנתק
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

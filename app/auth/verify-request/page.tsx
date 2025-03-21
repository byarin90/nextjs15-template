"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export default function VerifyRequestPage() {
  return (
    <div className="container flex justify-center items-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-blue-50">
              <Mail size={32} className="text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">בדוק את האימייל שלך</CardTitle>
          <CardDescription>
            שלחנו לך אימייל עם קישור לאימות. אנא בדוק את תיבת הדואר שלך כדי להמשיך.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-500 mt-2">
            אם לא קיבלת אימייל, בדוק את תיקיית הספאם שלך או בקש אימייל חדש.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link href="/auth/login" passHref style={{ width: '100%' }}>
            <Button variant="outline" className="w-full">
              <ArrowLeft size={16} className="ml-2" />
              חזרה להתחברות
            </Button>
          </Link>
          <Link href="/auth/forgot-password" passHref style={{ width: '100%' }}>
            <Button variant="link" className="w-full text-sm">
              לא קיבלת אימייל? בקש שוב
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

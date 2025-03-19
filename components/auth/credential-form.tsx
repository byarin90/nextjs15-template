"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export function CredentialForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: true,
        callbackUrl,
      });

      if (!result?.ok) {
        setError("התחברות נכשלה. יתכן שפרטי ההתחברות שגויים.");
      }
    } catch {
      setError("אירעה שגיאה במהלך ההתחברות. אנא נסה שוב מאוחר יותר.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 w-full">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex flex-col space-y-1">
            <h5 className="font-medium text-sm text-red-800">שגיאה</h5>
            <div className="text-sm text-red-700">{error}</div>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="username">שם משתמש או אימייל</Label>
        <Input
          id="username"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          placeholder="הכנס שם משתמש או אימייל"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">סיסמה</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
          >
            {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <div className="pt-2">
        <Button 
          className="w-full" 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? "מתחבר..." : "התחבר"}
        </Button>
      </div>
    </form>
  );
}

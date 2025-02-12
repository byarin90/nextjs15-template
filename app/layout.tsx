import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages()
  const locale = await getLocale()
  const session = await auth()
  const darkMode = (await cookies()).get('dark')?.value === 'true';
  
  const dir = locale === 'he' ? 'rtl' : 'ltr' 

  return (
    <html lang={locale} dir={dir} className={darkMode ? 'dark' : ''}>

      <body className={'h-[100vh] bg-colors-primary text-colors-secondary flex flex-col justify-between'}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header session={session} />
          <div className="h-full">
            {children}
          </div>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

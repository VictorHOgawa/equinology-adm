import { ApiContextProvider } from "@/context/ApiContext";
import { ModalsProvider } from "@/context/ModalsContext";
import { SidebarContextProvider } from "@/context/SidebarStatus";
import type { Metadata } from "next";
import { CookiesProvider } from "next-client-cookies/server";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Equinology ADM",
  description: "",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        {/* <Script id="ms_clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "rseweqd5u7s");`}
        </Script>
        <GoogleAnalytics gaId="G-7SJBZ3S22T" /> */}
      </head>
      <CookiesProvider>
        <ApiContextProvider>
          <SidebarContextProvider>
            <ModalsProvider>
              <>
                <body className={poppins.className}>
                  <Toaster position="top-center" />
                  {children}
                </body>
              </>
            </ModalsProvider>
          </SidebarContextProvider>
        </ApiContextProvider>
      </CookiesProvider>
    </html>
  );
}

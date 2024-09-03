import type {Metadata} from "next";
import {Roboto} from "next/font/google";
import "./globals.css";
import {Drawer} from "@/components/Drawer";
import React, {ReactNode} from "react";
import {UserProvider, useUser} from "@/context/UserContext";
import {Toaster} from "griller/src/component/toaster";
import {NavigationProvider} from "@/components/NavigationItem";
import {TooltipProvider} from "@marraph/daisy/components/tooltip/TooltipProvider";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700", "900"] });

export const metadata: Metadata = {
  title: "calla",
  description: "",
};


export default function RootLayout({children}: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en">
            <body className={roboto.className}>
                <NavigationProvider>
                    <UserProvider id={1}>
                        <Toaster>
                            <TooltipProvider>
                                <div className={"w-full h-full flex flex-row bg-zinc-100 dark:bg-black-light text-zinc-800 dark:text-white"}>
                                    <Drawer/>
                                    {children}
                                </div>
                            </TooltipProvider>
                        </Toaster>
                    </UserProvider>
                </NavigationProvider>
            </body>
        </html>
    );
}

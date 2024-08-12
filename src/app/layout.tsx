import type {Metadata} from "next";
import {Roboto} from "next/font/google";
import "./globals.css";
import {Drawer} from "@/components/Drawer";
import React, {ReactNode} from "react";
import {UserProvider} from "@/context/UserContext";
import {Toaster} from "griller/src/component/toaster";
import {NavigationProvider} from "@/components/NavigationItem";

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
                        <UserProvider id={9}>
                            <Toaster>
                                <div className={"w-screen h-screen flex flex-row bg-black-light"}>
                                    <Drawer/>
                                    {children}
                                </div>
                            </Toaster>
                        </UserProvider>
                    </NavigationProvider>
            </body>
        </html>
    );
}

import type {Metadata} from "next";
import {Roboto} from "next/font/google";
import "./globals.css";
import {Drawer} from "@/components/Drawer";
import React, {ReactNode} from "react";
import {UserProvider} from "@/context/UserContext";
import {Toaster} from "griller/src/component/toaster";
import {NavigationProvider} from "@/components/NavigationItem";
import {TooltipProvider} from "@marraph/daisy/components/tooltip/TooltipProvider";
import {TaskProvider} from "@/context/TaskContext";
import {TimeProvider} from "@/context/TimeContext";

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
                        <TaskProvider id={9}>
                            <TimeProvider id={9}>
                                <Toaster>
                                    <TooltipProvider>
                                        <div className={"w-full h-full flex flex-row bg-zinc-100 dark:bg-black-light text-zinc-800 dark:text-white"}>
                                            <Drawer/>
                                            {children}
                                        </div>
                                    </TooltipProvider>
                                </Toaster>
                            </TimeProvider>
                        </TaskProvider>
                    </UserProvider>
                </NavigationProvider>
            </body>
        </html>
    );
}

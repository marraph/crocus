import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import {Drawer} from "@/components/Drawer";
import {SearchField} from "@/components/SearchField";
import React from "react";
import {Button, ButtonIcon} from "@marraph/daisy/components/button/Button";
import {Bell} from "lucide-react";

const roboto = Roboto({subsets: ["latin"], weight: ["400", "500", "700", "900"] });

export const metadata: Metadata = {
  title: "marraph",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className={roboto.className}>
            <div className={"flex flex-row"}>
                <Drawer></Drawer>
                <div className={"w-full flex flex-col space-y-4"}>
                    <div className={"w-full py-2 px-8 flex flex-row justify-end space-x-2 border-b border-white border-opacity-20"}>
                        <Button text={""} className={"w-min h-8 py-1 px-2"}>
                            <ButtonIcon icon={<Bell size={20}/>} className={"mr-0"}/>
                        </Button>
                        <SearchField></SearchField>
                    </div>
                    {children}
                </div>
            </div>
        </body>
    </html>
);
}

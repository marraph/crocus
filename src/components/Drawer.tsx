"use client";

import {NavigationIcon, NavigationItem} from "@marraph/daisy/components/navigationitem/NavigationItem";
import React from "react";
import {CalendarDays, ChevronsUpDown, ClipboardList, LayoutDashboard, Timer} from "lucide-react";
import {cn} from "@/utils/cn";
import {Avatar} from "@marraph/daisy/components/avatar/Avatar";

const path = "/image.png";

export function Drawer() {
  return (
    <div className={cn("w-min h-screen flex flex-col justify-between bg-black p-4")}>
        <div className={"space-y-2"}>
            <span className={cn("text-placeholder text-xs font-semibold px-1")}>{"MENU"}</span>
            <NavigationItem title={"Dashboard"}>
                <NavigationIcon icon={ <LayoutDashboard size={18}/> } />
            </NavigationItem>
            <NavigationItem title={"Tasks"}>
                <NavigationIcon icon={ <ClipboardList size={18}/> }/>
            </NavigationItem>
            <NavigationItem title={"Timetracking"}>
                <NavigationIcon icon={ <Timer size={18}/> } />
            </NavigationItem>
            <NavigationItem title={"Calendar"}>
                <NavigationIcon icon={ <CalendarDays size={18}/> } />
            </NavigationItem>
        </div>

        <div className={cn("flex flex-row items-center cursor-pointer bg-dark rounded-lg border border-white border-opacity-20 space-x-3")}>
            <Avatar className={cn("p-2")} img_url={path} width={60} height={60} shape={"box"}></Avatar>
            <div className={cn("flex flex-col items-start")}>
                <span className={""}>{"mvriu5"}</span>
                <span className={cn("text-gray text-xs")}>{"marraph"}</span>
            </div>
            <ChevronsUpDown className={cn("flex flex-1 justify-end")}></ChevronsUpDown>
        </div>

    </div>
  );
}
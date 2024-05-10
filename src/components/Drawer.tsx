"use client";

import {NavigationItem} from "@marraph/daisy/components/navigationitem/NavigationItem";
import React, {useState} from "react";
import {CalendarDays, ChevronsUpDown, ClipboardList, LayoutDashboard, Timer} from "lucide-react";
import {cn} from "@/utils/cn";
import {Avatar} from "@marraph/daisy/components/avatar/Avatar";
import {ProfileContext} from "@/components/contextmenus/ProfileContext";

const path = "/image.png";

export function Drawer() {
    const [showProfile, setShowProfile] = useState(false);

    const toggleProfile = () => {
        setShowProfile(!showProfile);
    }

    return (
        <div className={cn("w-min h-screen flex flex-col justify-between bg-black p-4")}>
            <div className={"space-y-2"}>
                <span className={cn("text-placeholder text-xs px-1")}>{"MENU"}</span>
                <NavigationItem title={"Dashboard"} icon={ <LayoutDashboard size={18} />} />
                <NavigationItem title={"Tasks"} icon={ <ClipboardList size={18} /> } />
                <NavigationItem title={"Timetracking"} icon={ <Timer size={18} /> } />
                <NavigationItem title={"Calendar"} icon={ <CalendarDays size={18} /> } />
            </div>

            <div className={"space-y-2"}>
                {showProfile && <ProfileContext></ProfileContext>}
                <div className={cn("group flex flex-row items-center justify-between cursor-pointer bg-dark rounded-lg border border-white border-opacity-20")} onClick={toggleProfile}>
                    <div className={cn("flex flex-row items-center space-x-2")}>
                        <Avatar className={cn("p-2")} img_url={path} width={60} height={60} shape={"box"}></Avatar>
                        <div className={cn("flex flex-col items-start")}>
                            <span className={""}>{"mvriu5"}</span>
                            <span className={cn("text-gray text-xs")}>{"marraph"}</span>
                        </div>
                    </div>
                    <ChevronsUpDown className={cn("m-4 text-gray group-hover:text-white")}></ChevronsUpDown>
                </div>
            </div>
        </div>
  );
}
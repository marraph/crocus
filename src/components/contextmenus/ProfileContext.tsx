"use client";

import {ContextMenu, ContextMenuIcon, ContextMenuItem, ContextMenuSeperator} from "@marraph/daisy/components/contextmenu/ContextMenu";
import React, {useState} from "react";
import {Briefcase, ChevronsUpDown, LogOut, Settings} from "lucide-react";
import {cn} from "@/utils/cn";
import {useOutsideClick} from "@marraph/daisy/utils/clickOutside";
import {Avatar} from "@marraph/daisy/components/avatar/Avatar";

const path = "/image.png";

export function ProfileContext() {
    const [showProfile, setShowProfile] = useState(false);

    const menuRef = useOutsideClick(() => {
        setShowProfile(false);
    });

    return (
        <div className={"space-y-2 pb-8"} ref={menuRef}>
            {showProfile &&
                <ContextMenu className={cn("font-normal text-sm")}>
                    <ContextMenuItem title={"My organisation"} className={"mx-2"}>
                        <ContextMenuIcon icon={<Briefcase size={18}/>}/>
                    </ContextMenuItem>
                    <ContextMenuItem title={"Settings"} className={"mx-2 mb-2"}>
                        <ContextMenuIcon icon={<Settings size={18}/>}/>
                    </ContextMenuItem>
                    <ContextMenuSeperator/>
                    <ContextMenuItem title={"Log out"} className={"text-lightred hover:text-lightred mx-2 mt-2"}>
                        <ContextMenuIcon icon={<LogOut size={18}/>}/>
                    </ContextMenuItem>
                </ContextMenu>
            }
            <div
                className={cn("group flex flex-row items-center justify-between cursor-pointer bg-black rounded-lg border border-white border-opacity-20")}
                onClick={() =>{setShowProfile(!showProfile)}}>
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
    );
}
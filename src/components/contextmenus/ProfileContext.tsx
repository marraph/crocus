"use client";

import {ContextMenu, ContextMenuIcon, ContextMenuItem, ContextMenuSeperator} from "@marraph/daisy/components/contextmenu/ContextMenu";
import React from "react";
import {Briefcase, LogOut, Settings} from "lucide-react";
import {cn} from "@/utils/cn";

export function ProfileContext() {
    return (
        <ContextMenu className={cn("font-normal text-sm")}>
            <ContextMenuItem title={"My organisation"} className={"mx-2"}>
                <ContextMenuIcon icon={<Briefcase size={18}/>} />
            </ContextMenuItem>
            <ContextMenuItem title={"Settings"} className={"mx-2 mb-2"}>
                <ContextMenuIcon icon={<Settings size={18}/>} />
            </ContextMenuItem>
            <ContextMenuSeperator/>
            <ContextMenuItem title={"Log out"} className={"text-lightred hover:text-lightred mx-2 mt-2"}>
                <ContextMenuIcon icon={<LogOut size={18}/>} />
            </ContextMenuItem>
        </ContextMenu>
    );
}
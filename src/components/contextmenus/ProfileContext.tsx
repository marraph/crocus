"use client";

import {ContextMenu, ContextMenuIcon, ContextMenuItem, ContextMenuSeperator} from "@marraph/daisy/components/contextmenu/ContextMenu";
import React from "react";
import {Briefcase, LogOut, Settings} from "lucide-react";
import {cn} from "@/utils/cn";

export function ProfileContext() {
    return (
        <ContextMenu className={cn("font-normal text-sm")}>
            <ContextMenuItem title={"My organisation"}>
                <ContextMenuIcon icon={<Briefcase size={18}/>} />
            </ContextMenuItem>
            <ContextMenuItem title={"Settings"}>
                <ContextMenuIcon icon={<Settings size={18}/>} />
            </ContextMenuItem>
            <ContextMenuSeperator />
            <ContextMenuItem title={"Log out"} className={"text-lightred hover:text-lightred"}>
                <ContextMenuIcon icon={<LogOut size={18}/>} />
            </ContextMenuItem>
        </ContextMenu>
    );
}
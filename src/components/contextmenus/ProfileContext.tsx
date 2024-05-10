"use client";

import {
    ContextMenu,
    ContextMenuIcon,
    ContextMenuItem,
    ContextMenuSeperator
} from "@marraph/daisy/components/contextmenu/ContextMenu";
import React from "react";
import {Briefcase, LogOut, Settings} from "lucide-react";

export function ProfileContext() {
    return (
        <ContextMenu className={"bg-black border border-white border-opacity-20"}>
            <ContextMenuItem title={"My organisation"}>
                <ContextMenuIcon icon={<Briefcase size={18}/>} />
            </ContextMenuItem>
            <ContextMenuItem title={"Settings"}>
                <ContextMenuIcon icon={<Settings size={18}/>} />
            </ContextMenuItem>
            <ContextMenuSeperator />
            <ContextMenuItem title={"Log out"}>
                <ContextMenuIcon icon={<LogOut size={18}/>} />
            </ContextMenuItem>
        </ContextMenu>
    );
}
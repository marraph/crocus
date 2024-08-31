"use client";

import React, {HTMLAttributes, RefObject} from "react";
import {ContextMenu, ContextMenuItem} from "@marraph/daisy/components/contextmenu/ContextMenu";
import {Pencil, Trash2} from "lucide-react";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";

interface TimeEntryContextProps extends HTMLAttributes<HTMLDivElement> {
    x: number;
    y: number;
    contextRef: RefObject<HTMLDivElement>;
    deleteRef: RefObject<DialogRef>;
    editRef: RefObject<DialogRef>;
}

export const TimeEntryContextMenu: React.FC<TimeEntryContextProps> = ({ contextRef, deleteRef, editRef, x, y, }) => {
    return (
        <ContextMenu xPos={x} yPos={y} ref={contextRef} size={"medium"}>
            <ContextMenuItem title={"Edit"}
                             onClick={() => editRef.current?.show()}
                             icon={<Pencil size={16}/>}
            />
            <ContextMenuItem title={"Delete"}
                             onClick={() => deleteRef.current?.show()}
                             className={"dark:text-lightred dark:hover:text-lightred dark:hover:bg-lightred dark:hover:bg-opacity-10"}
                             icon={<Trash2 size={16}/>}
            />
        </ContextMenu>
    );
}

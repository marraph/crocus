"use client";

import React, {forwardRef} from "react";
import {useRouter} from "next/navigation";
import {ContextMenu, ContextMenuContainer, ContextMenuItem} from "@marraph/daisy/components/contextmenu/ContextMenu";
import {Pencil, Trash2} from "lucide-react";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";

interface TimeEntryContextProps extends React.HTMLAttributes<HTMLDivElement> {
    x: number;
    y: number;
    contextRef: React.RefObject<HTMLDivElement>;
    deleteRef: React.RefObject<DialogRef>;
    editRef: React.RefObject<DialogRef>;
}

export const TimeEntryContextMenu: React.FC<TimeEntryContextProps> = ({ contextRef, deleteRef, editRef, x, y, }) => {
    return (
        <ContextMenu xPos={x} yPos={y} ref={contextRef}>
            <ContextMenuContainer size={"medium"}>
                <ContextMenuItem title={"Edit"}
                                 onClick={() => editRef.current?.show()}
                                 icon={<Pencil size={16}/>}
                />
                <ContextMenuItem title={"Delete"}
                                 onClick={() => deleteRef.current?.show()}
                                 className={"dark:text-lightred dark:hover:text-lightred dark:hover:bg-lightred dark:hover:bg-opacity-10"}
                                 icon={<Trash2 size={16}/>}
                />
            </ContextMenuContainer>
        </ContextMenu>
    );
}

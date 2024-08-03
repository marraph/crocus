"use client";

import React, {forwardRef} from "react";
import {useRouter} from "next/navigation";
import {ContextMenu, ContextMenuContainer, ContextMenuItem} from "@marraph/daisy/components/contextmenu/ContextMenu";
import {Pencil, Trash2} from "lucide-react";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";

interface TimeEntryContextProps extends React.HTMLAttributes<HTMLDivElement> {
    x: number;
    y: number;
    deleteRef: React.RefObject<DialogRef>;
    editRef: React.RefObject<DialogRef>;
}

export const TimeEntryContextMenu: React.FC<TimeEntryContextProps> = ({ deleteRef, editRef, x, y, }) => {
    return (
        <ContextMenu>
            <ContextMenuContainer>
                <ContextMenuItem title={"Edit"}
                                 onClick={() => editRef.current?.show()}
                                 icon={<Pencil size={16}/>}
                />
                <ContextMenuItem title={"Delete"}
                                 onClick={() => deleteRef.current?.show()}
                                 className={"text-lightred hover:text-lightred hover:bg-lightred hover:bg-opacity-10"}
                                 icon={<Trash2 size={16}/>}
                />
            </ContextMenuContainer>
        </ContextMenu>
    );
}

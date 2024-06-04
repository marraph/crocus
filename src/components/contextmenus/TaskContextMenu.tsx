"use client";

import {
    ContextMenu,
    ContextMenuIcon,
    ContextMenuItem,
    ContextMenuSeperator
} from "@marraph/daisy/components/contextmenu/ContextMenu";
import {CheckCheck, ExternalLink, Pencil, Trash2} from "lucide-react";
import React, {forwardRef} from "react";
import {useRouter} from "next/navigation";

interface TaskContextProps extends React.HTMLAttributes<HTMLDivElement> {
    taskId: number;
    x: number;
    y: number;
    deleteRef?: React.RefObject<HTMLDialogElement>;
    editRef?: React.RefObject<HTMLDialogElement>;
    closeRef?: React.RefObject<HTMLDialogElement>;
}

export const TaskContextMenu = forwardRef<HTMLDivElement, TaskContextProps>(({ deleteRef, editRef, closeRef, taskId, x, y, className, ...props }, ref) => {
    const router = useRouter();

    return (
        <ContextMenu className={"absolute z-50 text-xs w-max py-1 shadow-2xl"} style={{top: y, left: x}} {...props} ref={ref}>
            <ContextMenuItem title={"Open"} className={"mx-1 mb-1"} onClick={() => router.push(`/tasks/${taskId}`)}>
                <ContextMenuIcon icon={<ExternalLink size={16}/>}/>
            </ContextMenuItem>
            <ContextMenuSeperator/>
            <ContextMenuItem title={"Edit"} className={"mx-1 mt-1"} onClick={() => editRef?.current?.showModal()}>
                <ContextMenuIcon icon={<Pencil size={16}/>}/>
            </ContextMenuItem>
            <ContextMenuItem title={"Close"} className={"mx-1"} onClick={() => closeRef?.current?.showModal()}>
                <ContextMenuIcon icon={<CheckCheck size={16}/>}/>
            </ContextMenuItem>
            <ContextMenuItem title={"Delete"} onClick={() => deleteRef?.current?.showModal()}
                             className={"mx-1 text-lightred hover:text-lightred hover:bg-lightred hover:bg-opacity-10"}>
                <ContextMenuIcon icon={<Trash2 size={16}/>}/>
            </ContextMenuItem>
        </ContextMenu>
    );
});
TaskContextMenu.displayName = "TaskContextMenu";

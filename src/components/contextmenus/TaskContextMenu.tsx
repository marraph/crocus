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
import {cn} from "@/utils/cn";
import {Dialog} from "@marraph/daisy/components/dialog/Dialog";
import {Button} from "@marraph/daisy/components/button/Button";
import {DeleteTaskDialog} from "@/components/dialogs/DeleteTaskDialog";

interface TaskContextProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
    taskId: number;
    x: number;
    y: number;
}

export const TaskContextMenu = forwardRef<HTMLDialogElement, TaskContextProps>(({ taskId, x, y, className, ...props }) => {
    const router = useRouter();

    const deleteRef = React.useRef<HTMLDialogElement>(null);

    return (
        <>
            <DeleteTaskDialog buttonTrigger={false} ref={deleteRef}/>

            <ContextMenu className={"absolute z-50 text-xs w-max py-1 shadow-2xl"} style={{top: y, left: x}}>
                <ContextMenuItem title={"Open"} className={"mx-1 mb-1"} onClick={() => router.push(`/tasks/${taskId}`)}>
                    <ContextMenuIcon icon={<ExternalLink size={16}/>}/>
                </ContextMenuItem>
                <ContextMenuSeperator/>
                <ContextMenuItem title={"Edit"} className={"mx-1 mt-1"}>
                    <ContextMenuIcon icon={<Pencil size={16}/>}/>
                </ContextMenuItem>
                <ContextMenuItem title={"Close"} className={"mx-1"}>
                    <ContextMenuIcon icon={<CheckCheck size={16}/>}/>
                </ContextMenuItem>
                <ContextMenuItem title={"Delete"} onClick={() => deleteRef.current?.showModal()}
                                 className={"mx-1 text-lightred hover:text-lightred hover:bg-lightred hover:bg-opacity-10"}>
                    <ContextMenuIcon icon={<Trash2 size={16}/>}/>
                </ContextMenuItem>
            </ContextMenu>

        </>
    );
});
TaskContextMenu.displayName = "TaskContextMenu";

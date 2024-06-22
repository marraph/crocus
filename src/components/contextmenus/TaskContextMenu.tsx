"use client";

import {ContextMenu, ContextMenuItem,} from "@marraph/daisy/components/contextmenu/ContextMenu";
import {CheckCheck, ExternalLink, Pencil, Trash2} from "lucide-react";
import React, {forwardRef} from "react";
import {useRouter} from "next/navigation";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";

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
            <ContextMenuItem title={"Open"} className={"mb-1"} onClick={() => router.push(`/tasks/${taskId}`)}
                             icon={<ExternalLink size={16}/>}/>
            <Seperator/>
            <ContextMenuItem title={"Edit"} className={"mt-1"} onClick={() => editRef?.current?.showModal()}
                             icon={<Pencil size={16}/>}/>
            <ContextMenuItem title={"Close"} onClick={() => closeRef?.current?.showModal()}
                             icon={<CheckCheck size={16}/>}/>
            <ContextMenuItem title={"Delete"} onClick={() => deleteRef?.current?.showModal()}
                             className={"text-lightred hover:text-lightred hover:bg-lightred hover:bg-opacity-10"}
                             icon={<Trash2 size={16}/>}/>
        </ContextMenu>
    );
});
TaskContextMenu.displayName = "TaskContextMenu";

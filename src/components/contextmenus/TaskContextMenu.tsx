"use client";

import {ContextMenu, ContextMenuItem, ContextMenuSeperator,} from "@marraph/daisy/components/contextmenu/ContextMenu";
import {CheckCheck, ExternalLink, Pencil, Trash2} from "lucide-react";
import React, {HTMLAttributes, RefObject} from "react";
import {useRouter} from "next/navigation";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";

interface TaskContextProps extends HTMLAttributes<HTMLDivElement> {
    taskId: number;
    x: number;
    y: number;
    contextRef: RefObject<HTMLDivElement>;
    deleteRef: RefObject<DialogRef>;
    editRef: RefObject<DialogRef>;
    closeRef: RefObject<DialogRef>;
}

export const TaskContextMenu: React.FC<TaskContextProps> = ({ contextRef, deleteRef, editRef, closeRef, taskId, x, y }) => {
    const router = useRouter();

    return (
        <ContextMenu xPos={x} yPos={y} ref={contextRef} size={"medium"}>
            <ContextMenuItem title={"Open"}
                             onClick={() => router.push(`/tasks/${taskId}`)}
                             icon={<ExternalLink size={16}/>}
            />
            <ContextMenuSeperator/>
            <ContextMenuItem title={"Edit"}
                             onClick={() => editRef.current?.show()}
                             icon={<Pencil size={16}/>}/>
            <ContextMenuItem title={"Close"}
                             onClick={() => closeRef.current?.show()}
                             icon={<CheckCheck size={16}/>}/>
            <ContextMenuItem title={"Delete"}
                             onClick={() => deleteRef.current?.show()}
                             className={"dark:text-lightred dark:hover:text-lightred dark:hover:bg-lightred dark:hover:bg-opacity-10"}
                             icon={<Trash2 size={16}/>}/>
        </ContextMenu>
    );
}

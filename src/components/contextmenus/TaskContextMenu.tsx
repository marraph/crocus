"use client";

import {ContextMenu, ContextMenuContainer, ContextMenuItem,} from "@marraph/daisy/components/contextmenu/ContextMenu";
import {CheckCheck, ExternalLink, Pencil, Trash2} from "lucide-react";
import React from "react";
import {useRouter} from "next/navigation";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";

interface TaskContextProps extends React.HTMLAttributes<HTMLDivElement> {
    taskId: number;
    x: number;
    y: number;
    deleteRef: React.RefObject<DialogRef>;
    editRef: React.RefObject<DialogRef>;
    closeRef: React.RefObject<DialogRef>;
}

export const TaskContextMenu: React.FC<TaskContextProps> = ({ deleteRef, editRef, closeRef, taskId, x, y }) => {
    const router = useRouter();

    return (
        <ContextMenu xPos={x} yPos={y}>
            <ContextMenuContainer size={"medium"}>
                <ContextMenuItem title={"Open"}
                                 onClick={() => router.push(`/tasks/${taskId}`)}
                                 icon={<ExternalLink size={16}/>}
                />
            </ContextMenuContainer>
                <Seperator/>
            <ContextMenuContainer size={"medium"}>
                <ContextMenuItem title={"Edit"}
                                 onClick={() => editRef.current?.show()}
                                 icon={<Pencil size={16}/>}/>
                <ContextMenuItem title={"Close"}
                                 onClick={() => closeRef.current?.show()}
                                 icon={<CheckCheck size={16}/>}/>
                <ContextMenuItem title={"Delete"}
                                 onClick={() => deleteRef.current?.show()}
                                 className={"text-lightred hover:text-lightred hover:bg-lightred hover:bg-opacity-10"}
                                 icon={<Trash2 size={16}/>}/>
            </ContextMenuContainer>
        </ContextMenu>
    );
}

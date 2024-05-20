"use client";

import {ContextMenu, ContextMenuIcon, ContextMenuItem} from "@marraph/daisy/components/contextmenu/ContextMenu";
import {Pencil, Trash2} from "lucide-react";
import React from "react";
import {useRouter} from "next/navigation";
import {cn} from "@/utils/cn";
import {Dialog} from "@marraph/daisy/components/dialog/Dialog";
import {Button} from "@marraph/daisy/components/button/Button";

interface TaskContextProps extends React.HTMLAttributes<HTMLDivElement> {
    taskId: number;
    x: number;
    y: number;
}

export const TaskContext = React.forwardRef<HTMLDivElement, TaskContextProps>(({ taskId, x, y, className, ...props }, ref) => {
    const router = useRouter();

    const dialogRef = React.useRef<HTMLDialogElement>(null);

    const deleteTask = () => {
        dialogRef.current?.close();
    }

    return (
        <>
            <ContextMenu className={"absolute z-50 text-sm w-max p-2 shadow-2xl"} style={{top: y, left: x}}
                         ref={ref} {...props}>
                <ContextMenuItem title={"Edit"} onClick={() => router.push(`/tasks/${taskId}`)}>
                    <ContextMenuIcon icon={<Pencil size={16}/>}/>
                </ContextMenuItem>
                <ContextMenuItem title={"Delete"}
                                 className={"text-lightred hover:text-lightred hover:bg-lightred hover:bg-opacity-10"}>
                    <ContextMenuIcon icon={<Trash2 size={16}/>}/>
                </ContextMenuItem>
            </ContextMenu>

            <div className={cn("flex items-center justify-center")}>
                <Dialog className={cn("border border-white border-opacity-20 w-3/8 drop-shadow-2xl " +
                    "overflow-visible p-4 space-y-4")}
                        {...props} ref={dialogRef}>
                    <div className={cn("flex flex-col space-y-4")}>
                        <p className={cn("text-white")}>Are you sure you want to delete this task?</p>
                        <div className={cn("flex flex-row space-x-2 justify-end")}>
                            <Button text={"Cancel"} className={cn("h-8")} onClick={() => dialogRef.current?.close()}/>
                            <Button text={"Delete"} onClick={deleteTask}
                                    className={cn("h-8 text-lightred hover:bg-lightred hover:bg-opacity-10 hover:text-lightred")}/>
                        </div>
                    </div>
                </Dialog>
            </div>
        </>

    );
});
TaskContext.displayName = "TaskContext";

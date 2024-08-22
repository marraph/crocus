"use client";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Trash2} from "lucide-react";
import React, {forwardRef, useCallback} from "react";
import {useUser} from "@/context/UserContext";
import {mutateRef} from "@/utils/mutateRef";
import {useToast} from "griller/src/component/toaster";
import {TaskElement} from "@/context/TaskContext";
import {deleteTask} from "@/action/task";

export const DeleteTaskDialog = forwardRef<DialogRef, { taskElement: TaskElement, onClose?: () => void }>(({ taskElement, onClose }, ref) => {
    const dialogRef = mutateRef(ref);
    const { user } = useUser();
    const {addToast} = useToast();

    if (!user || !dialogRef) return null;

    const handleDeleteClick = useCallback(async () => {
        await deleteTask(taskElement.id);

        addToast({
            title: "Task deleted successfully!",
            secondTitle: "You can no longer interact with this task.",
            icon: <Trash2 color="#F55050"/>
        });

        onClose && onClose();
    }, [addToast, onClose, taskElement.id]);

    return (
        <Dialog width={600}
                ref={dialogRef}
                onClose={onClose}

        >
            <DialogHeader title={"Delete Task"}/>
            <DialogContent>
                <span className={"text-zinc-500 dark:text-gray"}>
                    Are you sure you want to delete this task?
                </span>
            </DialogContent>
            <DialogFooter saveButtonTitle={"Delete"}
                          onClick={handleDeleteClick}
            />
        </Dialog>
    )
})
DeleteTaskDialog.displayName = "DeleteTaskDialog";
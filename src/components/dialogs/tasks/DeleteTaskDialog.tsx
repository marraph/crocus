"use client";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Trash2} from "lucide-react";
import React, {forwardRef, useCallback} from "react";
import {useUser} from "@/context/UserContext";
import {mutateRef} from "@/utils/mutateRef";
import {useToast} from "griller/src/component/toaster";
import {useTasks} from "@/context/TaskContext";
import {deleteTask, Task} from "@/action/task";

export const DeleteTaskDialog = forwardRef<DialogRef, { task: Task, onClose?: () => void }>(({ task, onClose }, ref) => {
    const dialogRef = mutateRef(ref);
    const { user } = useUser();
    const { actions } = useTasks();
    const {addToast} = useToast();
    
    const handleDeleteClick = useCallback(async () => {
        if (!user) return null;
        
        const result = await deleteTask(task.id);

        addToast({
            title: "Task deleted successfully!",
            secondTitle: "You can no longer interact with this task.",
            icon: <Trash2 color="#F55050"/>
        });

        onClose && onClose();
    }, [addToast, onClose, task.id, user]);

    if (!user || !dialogRef) return null;

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
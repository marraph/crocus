"use client";

import React, {forwardRef, useCallback} from "react";
import {CheckCheck, CircleX} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {useUser} from "@/context/UserContext";
import {mutateRef} from "@/utils/mutateRef";
import {useToast} from "griller/src/component/toaster";
import {useTasks} from "@/context/TaskContext";
import {Task} from "@/action/task";
import {CompletedTask} from "@/types/types";

export const CloseTaskDialog = forwardRef<DialogRef, { task: CompletedTask, onClose?: () => void }>(({ task, onClose }, ref) => {
    const dialogRef = mutateRef(ref);
    const { user } = useUser();
    const { actions } = useTasks();
    const { addToast } = useToast();
    
    const handleCloseTaskClick = useCallback(async () => {
        if (!user) return;

        const result = await actions.updateTask(task.id, {
            ...task,
            isArchived: true,
            updatedBy: user.id,
            updatedAt: new Date()
        });

        if (result.success) {
            addToast({
                title: "Task closed successfully!",
                secondTitle: "You can no longer interact with this task.",
                icon: <CheckCheck/>
            });
        } else {
            addToast({
                title: "Failed to close task.",
                secondTitle: result.error,
                icon: <CircleX />
            });
        }

        onClose && onClose();
    }, [actions, addToast, onClose, task, user]);

    if (!user || !dialogRef) return null;

    return (
        <Dialog width={600}
                ref={dialogRef}
                onClose={onClose}
        >
            <DialogHeader title={"Close Task"}/>
            <DialogContent>
                <span className={"text-zinc-500 dark:text-gray pb-4"}>
                    Are you sure you want to close this task?
                </span>
            </DialogContent>
            <DialogFooter saveButtonTitle={"Close"}
                          onClick={handleCloseTaskClick}
            />
        </Dialog>
    );
})
CloseTaskDialog.displayName = "CloseTaskDialog";
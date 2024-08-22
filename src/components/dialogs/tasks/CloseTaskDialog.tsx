"use client";

import React, {forwardRef, useCallback, useState} from "react";
import {CheckCheck} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {useUser} from "@/context/UserContext";
import {mutateRef} from "@/utils/mutateRef";
import {useToast} from "griller/src/component/toaster";
import {TaskElement} from "@/context/TaskContext";
import {Task, updateTask} from "@/action/task";

export const CloseTaskDialog = forwardRef<DialogRef, { taskElement: TaskElement, onClose?: () => void }>(({ taskElement, onClose }, ref) => {
    const dialogRef = mutateRef(ref);
    const { user } = useUser();
    const {addToast} = useToast();

    const handleCloseTaskClick = useCallback(async () => {
        const updatedTask: Partial<Task> = {
            isArchived: true,
            lastModifiedBy: {id: user.id, name: user.name, email: user.email},
            lastModifiedDate: new Date()
        };

        await updateTask(taskElement.id, {...taskElement, ...updatedTask});

        addToast({
            title: "Task closed successfully!",
            secondTitle: "You can no longer interact with this task.",
            icon: <CheckCheck/>
        });

        onClose && onClose();
    }, [addToast, onClose, taskElement, user]);

    if (!dialogRef || !user) return null;

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
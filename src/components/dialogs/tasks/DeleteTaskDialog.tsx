"use client";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {CircleX, Trash2} from "lucide-react";
import React, {forwardRef, useCallback} from "react";
import {useUser} from "@/context/UserContext";
import {mutateRef} from "@/utils/mutateRef";
import {useToast} from "griller/src/component/toaster";
import {deleteTask, Task} from "@/action/task";
import {ActionConsumerType, CompletedTask, CompletedUser} from "@/types/types";
import {deleteTaskInCompletedUser, updateTaskInCompletedUser} from "@/utils/object-helpers";

export const DeleteTaskDialog = forwardRef<DialogRef, { task: CompletedTask, onClose?: () => void }>(({ task, onClose }, ref) => {
    const dialogRef = mutateRef(ref);
    const { user, loading, error, actionConsumer } = useUser();
    const { addToast } = useToast();
    
    const handleDeleteClick = useCallback(() => {
        if (!user) return null;

        actionConsumer({
            consumer: () => {
                return deleteTask(task.id);
            },
            handler: (currentUser: CompletedUser) => {
                return deleteTaskInCompletedUser(currentUser, task.id);
            },
            onSuccess: () => {
                addToast({
                    title: "Task deleted successfully!",
                    secondTitle: "You can no longer interact with this task.",
                    icon: <Trash2 color="#F55050"/>
                });
            },
            onError: (error: string) => {
                addToast({
                    title: "Failed to close task.",
                    secondTitle: error,
                    icon: <CircleX />
                });
            }
        });

        onClose?.();
    }, [actionConsumer, addToast, onClose, task.id, user]);

    if (!user || !dialogRef) return null;

    return (
        <Dialog width={600}
                ref={dialogRef}
                onSubmit={handleDeleteClick}
                onClose={onClose}

        >
            <DialogHeader title={"Delete Task"}/>
            <DialogContent>
                <span className={"text-zinc-500 dark:text-gray"}>
                    Are you sure you want to delete this task?
                </span>
            </DialogContent>
            <DialogFooter saveButtonTitle={"Delete"}/>
        </Dialog>
    )
})
DeleteTaskDialog.displayName = "DeleteTaskDialog";
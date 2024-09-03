"use client";

import React, {forwardRef, useCallback} from "react";
import {CheckCheck, CircleX} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {useUser} from "@/context/UserContext";
import {mutateRef} from "@/utils/mutateRef";
import {useToast} from "griller/src/component/toaster";
import {ActionConsumerType, CompletedTask, CompletedUser} from "@/types/types";
import {Task, updateTask} from "@/action/task";
import {updateTaskInCompletedUser} from "@/utils/object-helpers";

export const CloseTaskDialog = forwardRef<DialogRef, { task: CompletedTask, onClose?: () => void }>(({ task, onClose }, ref) => {
    const dialogRef = mutateRef(ref);
    const { user, loading, error, actionConsumer } = useUser();
    const { addToast } = useToast();

    const handleCloseTaskClick = useCallback(() => {
        if (!user) return;

        actionConsumer({
            consumer: () => {
                return updateTask(task.id, {
                    ...task,
                    isArchived: true,
                    updatedBy: user.id,
                    updatedAt: new Date
                });
            },
            handler: (currentUser: CompletedUser) => {
                return updateTaskInCompletedUser(currentUser, task.id);
            },
            onSuccess: () => {
                addToast({
                    title: "Task closed successfully!",
                    secondTitle: "You can no longer interact with this task.",
                    icon: <CheckCheck/>
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
    }, [actionConsumer, addToast, onClose, task, user]);

    if (!user || !dialogRef) return null;

    return (
        <Dialog width={600}
                ref={dialogRef}
                onClose={onClose}
                onSubmit={handleCloseTaskClick}
        >
            <DialogHeader title={"Close Task"}/>
            <DialogContent>
                <span className={"text-zinc-500 dark:text-gray pb-4"}>
                    Are you sure you want to close this task?
                </span>
            </DialogContent>
            <DialogFooter saveButtonTitle={"Close"}/>
        </Dialog>
    );
})
CloseTaskDialog.displayName = "CloseTaskDialog";
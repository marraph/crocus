"use client";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Trash2} from "lucide-react";
import React, {forwardRef, useCallback} from "react";
import {TaskElement} from "@/types/types";
import {useUser} from "@/context/UserContext";
import {deleteTask} from "@/service/hooks/taskHook";
import {mutateRef} from "@/utils/mutateRef";
import {useToast} from "griller/src/component/toaster";

export const DeleteTaskDialog = forwardRef<DialogRef, { taskElement: TaskElement, onClose?: () => void }>
    (({ taskElement, onClose }, ref) => {

    const dialogRef = mutateRef(ref);
    const {data:user, isLoading:userLoading, error:userError} = useUser();
    const {addToast} = useToast();


    const handleDeleteClick = useCallback(() => {
        const {isLoading, error} = deleteTask(taskElement.id);

        addToast({
            title: "Task deleted successfully!",
            secondTitle: "You can no longer interact with this task.",
            icon: <Trash2 color="#F55050" />
        });

        onClose && onClose();
    }, [addToast, onClose, taskElement.id]);

    if (!dialogRef || !user) return null;

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
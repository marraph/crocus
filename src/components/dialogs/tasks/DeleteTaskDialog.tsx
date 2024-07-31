"use client";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Trash2} from "lucide-react";
import React, {forwardRef, useState} from "react";
import {TaskElement} from "@/types/types";
import {useUser} from "@/context/UserContext";
import {deleteTask} from "@/service/hooks/taskHook";
import {mutateRef} from "@/utils/mutateRef";
import {useToast} from "griller/src/component/toaster";

interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
    taskElement: TaskElement;
}

export const DeleteTaskDialog = forwardRef<DialogRef, DialogProps>(({ taskElement }, ref) => {
    const dialogRef = mutateRef(ref);
    const [dialogKey, setDialogKey] = useState(Date.now());
    const {data:user, isLoading:userLoading, error:userError} = useUser();
    const {addToast} = useToast();

    if (!dialogRef) return null;
    if (!user) return null;

    const deleteTheTask = () => {
        const {isLoading, error} = deleteTask(taskElement.id);
        addToast({
            title: "Task deleted successfully!",
            secondTitle: "You can no longer interact with this task.",
            icon: <Trash2 color="#F55050" />
        });
    }

    const handleClose = () => {
        setDialogKey(Date.now());
    }

    return (
        <Dialog width={600}
                ref={dialogRef}
                key={dialogKey}
        >
            <DialogHeader title={"Delete Task"}
                          dialogRef={dialogRef}
                          onClose={handleClose}
            />
            <DialogContent>
                <span className={"text-gray"}>Are you sure you want to delete this task?</span>
            </DialogContent>
            <DialogFooter saveButtonTitle={"Delete"}
                          cancelButton={true}
                          switchButton={false}
                          dialogRef={dialogRef}
                          onClick={deleteTheTask}
                          onClose={handleClose}
            />
        </Dialog>
    )
})
DeleteTaskDialog.displayName = "DeleteTaskDialog";
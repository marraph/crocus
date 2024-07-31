"use client";

import React, {forwardRef, useState} from "react";
import {CheckCheck} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {updateTask} from "@/service/hooks/taskHook";
import {Task, TaskElement} from "@/types/types";
import {useUser} from "@/context/UserContext";
import {mutateRef} from "@/utils/mutateRef";
import {useToast} from "griller/src/component/toaster";

interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
    taskElement: TaskElement;
}

export const CloseTaskDialog = forwardRef<DialogRef, DialogProps>(({ taskElement }, ref) => {
    const dialogRef = mutateRef(ref);
    const [dialogKey, setDialogKey] = useState(Date.now());
    const {data:user, isLoading:userLoading, error:userError} = useUser();
    const {addToast} = useToast();

    if (!dialogRef) return null;
    if (!user) return null;

    const closeTask = () => {
        const task: Task = {
            id: taskElement.id,
            name: taskElement.name,
            description: taskElement.description,
            topic: taskElement.topic,
            isArchived: true,
            duration: taskElement.duration,
            bookedDuration: taskElement.bookedDuration,
            deadline: taskElement.deadline,
            status: taskElement.status,
            priority: taskElement.priority,
            createdBy: taskElement.createdBy,
            createdDate: taskElement.createdDate,
            lastModifiedBy: {id: user.id, name: user.name, email: user.email },
            lastModifiedDate: new Date()
        }
        const {data, isLoading, error} = updateTask(task.id, task);

        addToast({
            title: "Task closed successfully!",
            secondTitle: "You can no longer interact with this task.",
            icon: <CheckCheck />
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
            <DialogHeader title={"Close Task"}
                          dialogRef={dialogRef}
                          onClose={handleClose}
            />
            <DialogContent>
                <span className={"text-gray pb-4"}>
                    Are you sure you want to close this task?
                </span>
            </DialogContent>
            <DialogFooter saveButtonTitle={"Close"}
                          cancelButton={true}
                          switchButton={false}
                          dialogRef={dialogRef}
                          onClick={closeTask}
                          onClose={handleClose}
            />
        </Dialog>
    );
})
CloseTaskDialog.displayName = "CloseTaskDialog";
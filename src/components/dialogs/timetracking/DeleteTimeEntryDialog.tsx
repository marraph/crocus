"use client";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Trash2} from "lucide-react";
import {cn} from "@/utils/cn";
import React, {forwardRef} from "react";
import {Absence, TimeEntry} from "@/types/types";
import {useUser} from "@/context/UserContext";
import {mutateRef} from "@/utils/mutateRef";
import {deleteTimeEntry} from "@/service/hooks/timeentryHook";
import {deleteAbsence} from "@/service/hooks/absenceHook";
import {useToast} from "griller/src/component/toaster";

interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
    timeEntry?: TimeEntry;
    absence?: Absence;
}

export const DeleteTimeEntryDialog = forwardRef<DialogRef, DialogProps>(({ timeEntry, absence, className, ...props}, ref) => {
    const dialogRef = mutateRef(ref);
    const { data:user, isLoading:userLoading, error:userError } = useUser();
    const {addToast} = useToast();

    if (!timeEntry && !absence) return null;
    if (!dialogRef || user === undefined) return null;

    const deleteEntry = () => {
        if (timeEntry)  {
            const {wasSuccessful, isLoading, error} = deleteTimeEntry(timeEntry.id);
        }
        if (absence) {
            const {wasSuccessful, isLoading, error} = deleteAbsence(absence.id);
        }
        addToast({
            title: "Delete",
            secondTitle: "Deleting " + (timeEntry ? "TimeEntry" : "Absence") + "...",
            icon: <Trash2 color="#F55050" />
        })
    }

    return (
        <Dialog width={600}
                ref={dialogRef}
        >
            <DialogHeader title={"Delete " + (timeEntry ? "entry" : "absence")}
                          dialogRef={dialogRef}
            />
            <DialogContent>
                <span className={cn("text-white")}>
                    {"Are you sure you want to delete this " + (timeEntry ? "TimeEntry" : "Absence") + "?"}
                </span>
            </DialogContent>
            <DialogFooter saveButtonTitle={"Delete"}
                          cancelButton={true}
                          switchButton={false}
                          dialogRef={dialogRef}
                          onClick={deleteEntry}
            />
        </Dialog>
    )
})
DeleteTimeEntryDialog.displayName = "DeleteTimeEntryDialog";
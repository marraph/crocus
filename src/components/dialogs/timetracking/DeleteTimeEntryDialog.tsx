"use client";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Trash2} from "lucide-react";
import {cn} from "@/utils/cn";
import React, {forwardRef, useCallback} from "react";
import {Absence, TimeEntry} from "@/types/types";
import {useUser} from "@/context/UserContext";
import {mutateRef} from "@/utils/mutateRef";
import {deleteTimeEntry} from "@/service/hooks/timeentryHook";
import {deleteAbsence} from "@/service/hooks/absenceHook";
import {useToast} from "griller/src/component/toaster";


export const DeleteTimeEntryDialog = forwardRef<DialogRef, { timeEntry?: TimeEntry, absence?: Absence }>(({ timeEntry, absence }, ref) => {
    const dialogRef = mutateRef(ref);
    const { data:user, isLoading:userLoading, error:userError } = useUser();
    const {addToast} = useToast();

    const handleDeleteClick = useCallback(() => {
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
    }, [timeEntry, absence, addToast]);

    if (!timeEntry && !absence) return null;
    if (!dialogRef || user === undefined) return null;

    return (
        <Dialog width={600}
                ref={dialogRef}
        >
            <DialogHeader title={"Delete " + (timeEntry ? "entry" : "absence")}/>
            <DialogContent>
                <span className={cn("text-white")}>
                    {"Are you sure you want to delete this " + (timeEntry ? "TimeEntry" : "Absence") + "?"}
                </span>
            </DialogContent>
            <DialogFooter saveButtonTitle={"Delete"}
                          onClick={handleDeleteClick}
            />
        </Dialog>
    )
})
DeleteTimeEntryDialog.displayName = "DeleteTimeEntryDialog";
"use client";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Trash2} from "lucide-react";
import React, {forwardRef, useCallback} from "react";
import {useUser} from "@/context/UserContext";
import {mutateRef} from "@/utils/mutateRef";
import {useToast} from "griller/src/component/toaster";
import {TimeEntry} from "@/action/timeEntry";
import {Absence} from "@/action/absence";
import { useTime } from "@/context/TimeContext";


export const DeleteTimeEntryDialog = forwardRef<DialogRef, { timeEntry?: TimeEntry, absence?: Absence }>(({ timeEntry, absence }, ref) => {
    const dialogRef = mutateRef(ref);
    const { actions } = useTime();
    const {addToast} = useToast();

    const handleDeleteClick = useCallback(async () => {
        if (timeEntry)  {
            await actions.deleteTimeEntry(timeEntry.id);
        }
        if (absence) {
            await actions.deleteAbsence(absence.id);
        }
        
        addToast({
            title: "Delete",
            secondTitle: "Deleting " + (timeEntry ? "TimeEntry" : "Absence") + "...",
            icon: <Trash2 color="#F55050" />
        })
    }, [timeEntry, absence, addToast, actions]);

    if (!timeEntry && !absence) return null;
    if (!dialogRef) return null;

    return (
        <Dialog width={600}
                ref={dialogRef}
        >
            <DialogHeader title={"Delete " + (timeEntry ? "entry" : "absence")}/>
            <DialogContent>
                <span>
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
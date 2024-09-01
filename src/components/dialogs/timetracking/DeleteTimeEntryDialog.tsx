"use client";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {CircleX, Trash2} from "lucide-react";
import React, {forwardRef, useCallback} from "react";
import {mutateRef} from "@/utils/mutateRef";
import {useToast} from "griller/src/component/toaster";
import {deleteTimeEntry, TimeEntry} from "@/action/timeEntry";
import {Absence, deleteAbsence} from "@/action/absence";
import {useUser} from "@/context/UserContext";
import {CompletedUser} from "@/types/types";
import {deleteAbsenceInCompletedUser, deleteTimeEntryInCompletedUser} from "@/utils/object-helpers";


export const DeleteTimeEntryDialog = forwardRef<DialogRef, { timeEntry?: TimeEntry, absence?: Absence }>(({ timeEntry, absence }, ref) => {
    const dialogRef = mutateRef(ref);
    const { addToast } = useToast();
    const { user, loading, error, actionConsumer } = useUser();

    const handleDeleteClick = useCallback(async () => {
        if (!user) return;

        if (timeEntry) {
            actionConsumer({
                consumer: async () => {
                    return await deleteTimeEntry(timeEntry.id);
                },
                handler: (currentUser: CompletedUser) => {
                    return deleteTimeEntryInCompletedUser(currentUser, timeEntry.id);
                },
                onSuccess: async () => {
                    addToast({
                        title: "TimeEntry deleted",
                        icon: <Trash2 color="#F55050" />
                    });
                },
                onError: (error: string) => {
                    addToast({
                        title: "An error occurred!",
                        secondTitle: error,
                        icon: <CircleX/>
                    });
                }
            });
        } 
        if (absence) {
            actionConsumer({
                consumer: async () => {
                    return await deleteAbsence(absence.id);
                },
                handler: (currentUser: CompletedUser) => {
                    return deleteAbsenceInCompletedUser(currentUser, absence.id);
                },
                onSuccess: async () => {
                    addToast({
                        title: "Absence deleted",
                        icon: <Trash2 color="#F55050" />
                    });
                },
                onError: (error: string) => {
                    addToast({
                        title: "An error occurred!",
                        secondTitle: error,
                        icon: <CircleX/>
                    });
                }
            });
        }
    }, [user, timeEntry, absence, actionConsumer, addToast]);

    if (!timeEntry && !absence) return null;
    if (!dialogRef) return null;

    return (
        <Dialog width={600}
                onSubmit={handleDeleteClick}
                ref={dialogRef}
        >
            <DialogHeader title={"Delete " + (timeEntry ? "entry" : "absence")}/>
            <DialogContent>
                <span>
                    {"Are you sure you want to delete this " + (timeEntry ? "TimeEntry" : "Absence") + "?"}
                </span>
            </DialogContent>
            <DialogFooter saveButtonTitle={"Delete"}/>
        </Dialog>
    )
})
DeleteTimeEntryDialog.displayName = "DeleteTimeEntryDialog";
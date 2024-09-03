"use client";

import React, {forwardRef, useCallback, useMemo, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {mutateRef} from "@/utils/mutateRef";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import {useUser} from "@/context/UserContext";
import {AlarmClockPlus, CircleAlert, CircleX, Save, TreePalm} from "lucide-react";
import {DateRangePicker} from "@marraph/daisy/components/daterangepicker/DateRangePicker";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";
import {useToast} from "griller/src/component/toaster";
import {Absence, updateAbsence} from "@/action/absence";
import {AbsenceReason, ActionConsumerType, CompletedUser} from "@/types/types";
import {createTimeEntry} from "@/action/timeEntry";
import {createAbsenceInCompletedUser, getTaskFromId, updateAbsenceInCompletedUser} from "@/utils/object-helpers";
import {Task, updateTask} from "@/action/task";

type EditProps = Pick<Absence, "comment" | "reason" | "start" | "end">;

export const EditAbsenceDialog = forwardRef<DialogRef, { absence: Absence }>(({ absence }, ref) => {
    const dialogRef = mutateRef(ref);
    const [values, setValues] = useState<EditProps>({
        comment: absence.comment ?? "",
        reason: absence.reason,
        start: absence.start,
        end: absence.end,
    });
    const initialValues = values;
    const [dialogKey, setDialogKey] = useState(Date.now());
    const absenceTypes = useMemo(() => ["vacation", "sick"], []);
    const { user, loading, error, actionConsumer } = useUser();
    const { addToast } = useToast();

    const fields = {};
    
    const handleCloseClick = useCallback(() => {
        setDialogKey(Date.now());
        setValues(initialValues);
    }, [initialValues]);

    const handleEditClick = useCallback(() => {
        if (!user) return;

        actionConsumer({
            consumer: () => {
                return updateAbsence(absence.id, {
                    ...absence,
                    start: values.start ?? new Date(),
                    end: values.end ?? new Date(),
                    comment: values.comment,
                    reason: values.reason,
                    updatedAt: new Date(),
                });
            },
            handler: (currentUser: CompletedUser, input: ActionConsumerType) => {
                return updateAbsenceInCompletedUser(currentUser, absence.id, input as Absence);
            },
            onSuccess: () => {
                addToast({
                    title: "Saved changes",
                    secondTitle: "You successfully saved your absence changes.",
                    icon: <Save/>,
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

        handleCloseClick();
    }, [user, actionConsumer, handleCloseClick, absence, values, addToast]);

    if (!dialogRef || user === undefined) return null;

    return (
        <Dialog width={800}
                onClose={handleCloseClick}
                onSubmit={handleEditClick}
                fields={fields}
                ref={dialogRef}
                key={dialogKey}
        >
            <DialogHeader title={"Edit absence"}/>
            <DialogContent>
                <Textarea placeholder={"Comment"}
                          label={"Comment"}
                          className={"px-2 h-12 w-full bg-zinc-200 dark:bg-black placeholder-zinc-400 dark:placeholder-marcador focus:text-gray"}
                          spellCheck={false}
                          onChange={(e) => setValues((prevValues) => ({ ...prevValues, comment: e.target.value }))}
                          value={values.comment ?? ""}
                />

                <div className={"flex flex-row items-center space-x-2 py-4"}>
                    <DateRangePicker
                        text={"Select a date"}
                        label={"Date Range"}
                        size={"medium"}
                        closeButton={false}
                        dayFormat={"long"}
                        preSelectedRange={{ from: values.start ?? undefined, to: values.end ?? undefined }}
                        onRangeChange={(range) => setValues((prevValues) => ({ ...prevValues, dateRange: range ?? { from: new Date(), to: new Date() } }))}
                    />
                    <Combobox buttonTitle={"Absence Type"}
                              label={"Absence Type"}
                              icon={<TreePalm size={16} className={"mr-2"}/>}
                              preSelectedValue={values.reason}
                              getItemTitle={(item) => item as string}
                              onValueChange={(value) => setValues((prevValues) => ({ ...prevValues, absenceType: value as AbsenceReason }))}
                    >
                        {absenceTypes.map((type) => (
                            <ComboboxItem key={type} title={type} value={type}/>
                        ))}
                    </Combobox>
                </div>
            </DialogContent>
            <DialogFooter saveButtonTitle={"Save changes"}/>
        </Dialog>
    );
});
EditAbsenceDialog.displayName = "EditAbsenceDialog";
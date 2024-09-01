"use client";

import React, {forwardRef, useCallback, useEffect, useMemo, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import {useUser} from "@/context/UserContext";
import {CheckCheck, CircleAlert, CircleOff, CircleX, TreePalm} from "lucide-react";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";
import {DateRangePicker} from "@marraph/daisy/components/daterangepicker/DateRangePicker";
import {mutateRef} from "@/utils/mutateRef";
import {useToast} from "griller/src/component/toaster";
import {Absence, createAbsence} from "@/action/absence";
import {AbsenceReason, ActionConsumerType, CompletedUser} from "@/types/types";
import {updateTask} from "@/action/task";
import {createAbsenceInCompletedUser, updateTaskInCompletedUser} from "@/utils/object-helpers";
import {DateRange} from "react-day-picker";

type CreateProps = Pick<Absence, 'comment' | 'reason' | 'start' | 'end'>;

export const CreateAbsenceDialog = forwardRef<DialogRef, { onClose: () => void }>(({onClose}, ref) => {
    const dialogRef = mutateRef(ref);
    const [values, setValues] = useState<CreateProps>({
        comment: "",
        reason: "sick",
        start: new Date(),
        end: new Date()
    });
    const [dialogKey, setDialogKey] = useState(Date.now());
    const { user, loading, error, actionConsumer } = useUser();
    const { addToast } = useToast();

    const absenceTypes = useMemo(() => ["vacation", "sick"], []);

    const fields = {
        reason: {
            initialValue: '',
            validate: (value: AbsenceReason) => ({
                isValid: value !== 'sick' && value !== 'vacation',
                message: "Absence Reason can't be empty"
            })
        },
        range: {
            initialValue: '',
            validate: (value: DateRange) => ({
                isValid: value.from !== null && value.to !== null,
                message: "Date range can't be empty"
            })
        }
    }

    const handleCloseClick = useCallback(() => {
        setValues({comment: "", reason: "vacation", start: new Date(), end: new Date()});
        setDialogKey(Date.now());
        onClose();
    }, [onClose]);

    const handleCreateClick = useCallback(async () => {
        if (!user) return;

        actionConsumer({
            consumer: async () => {
                return await createAbsence({
                    start: values.start ?? new Date(),
                    end: values.end ?? new Date(),
                    comment: values.comment,
                    reason: values.reason,
                    createdBy: user.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            },
            handler: (currentUser: CompletedUser, input: ActionConsumerType) => {
                return createAbsenceInCompletedUser(currentUser, input as Absence);
            },
            onSuccess: () => {
                addToast({
                    title: "Absence created successfully!",
                    icon: <TreePalm/>,
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
    }, [user, actionConsumer, handleCloseClick, values, addToast]);

    if (!dialogRef || user === undefined) return null;

    return (
        <Dialog width={600}
                onClose={handleCloseClick}
                onSubmit={handleCreateClick}
                fields={fields}
                ref={dialogRef}
                key={dialogKey}
        >
            <DialogHeader title={"New absence"}/>
            <DialogContent>
                <Textarea placeholder={"Comment"}
                          className={"h-12 w-full bg-zinc-100 dark:bg-black placeholder-zinc-400 dark:placeholder-marcador focus:text-zinc-800 dark:focus:text-white"}
                          spellCheck={false}
                          onChange={(e) => setValues((prevValues) => ({ ...prevValues, comment: e.target.value }))}
                          value={values.comment ?? ""}
                />
                <div className={"flex flex-row items-center space-x-2 py-2"}>
                    <Combobox
                        id={"reason"}
                        buttonTitle={"Absence Type"}
                        icon={<CircleOff size={14} className={"mr-2"}/>}
                        getItemTitle={(item) => item as string}
                        onValueChange={(value) => setValues((prevValues) => ({ ...prevValues, reason: value as AbsenceReason }))}
                    >
                        {absenceTypes.map(((absence, index) =>
                                <ComboboxItem key={index} title={absence} value={absence}/>
                        ))}
                    </Combobox>
                    <DateRangePicker
                        id={"range"}
                        text={"Select your absence time"}
                        closeButton={false}
                        dayFormat={"long"}
                        onRangeChange={(value) => setValues((prevValues) => ({ ...prevValues, start: value?.from ?? new Date(), end: value?.to ?? new Date()}))}
                    />
                </div>
            </DialogContent>
            <DialogFooter saveButtonTitle={"Create"}/>
        </Dialog>
    );
})
CreateAbsenceDialog.displayName = "CreateAbsenceDialog";
"use client";

import React, {forwardRef, useCallback, useEffect, useMemo, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import {useUser} from "@/context/UserContext";
import {CircleAlert, CircleOff, TreePalm} from "lucide-react";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";
import {DateRangePicker} from "@marraph/daisy/components/daterangepicker/DateRangePicker";
import {mutateRef} from "@/utils/mutateRef";
import {useToast} from "griller/src/component/toaster";
import {Absence} from "@/action/absence";
import {useTime} from "@/context/TimeContext";
import {AbsenceReason} from "@/types/types";

type CreateProps = Pick<Absence, 'comment' | 'reason' | 'start' | 'end'>;

export const CreateAbsenceDialog = forwardRef<DialogRef, { onClose: () => void }>(({onClose}, ref) => {
    const dialogRef = mutateRef(ref);
    const [values, setValues] = useState<CreateProps>({
        comment: "",
        reason: "sick",
        start: new Date(),
        end: new Date()
    });
    const [valid, setValid] = useState<boolean>(false);
    const [dialogKey, setDialogKey] = useState(Date.now());
    const { user } = useUser();
    const { absences, loading, error, actions } = useTime();
    const { addToast } = useToast();

    const absenceTypes = useMemo(() => ["vacation", "sick"], []);

    const validateInput = useCallback(() => {
        setValid(values.reason === "vacation" || values.reason === "sick");
    }, [values.reason]);

    useEffect(() => {
        validateInput();
    }, [validateInput, values.reason]);

    const handleCloseClick = useCallback(() => {
        setValues({comment: "", reason: "vacation", start: new Date(), end: new Date()});
        setValid(false);
        setDialogKey(Date.now());
        onClose();
    }, [onClose]);

    const handleCreateClick = useCallback(async () => {
        if (!user) return;

        const result = await actions.createAbsence({
            start: values.start ?? new Date(),
            end: values.end ?? new Date(),
            comment: values.comment,
            reason: values.reason,
            createdBy: user.id,
            createdAt: new Date(),
            updatedBy: user.id,
            updatedAt: new Date(),
        })

        if (result.success) {
            addToast({
                title: "Absence created successfully!",
                icon: <TreePalm/>,
            });
        } else {
            addToast({
                title: "An error occurred!",
                secondTitle: "The absence could not be created. Please try again later.",
                icon: <CircleAlert/>
            });
        }

        handleCloseClick();
    }, [user, actions, values.start, values.end, values.comment, values.reason, handleCloseClick, addToast]);

    if (!dialogRef || user === undefined) return null;

    return (
        <Dialog width={600}
                onClose={handleCloseClick}
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
                >
                </Textarea>
                <div className={"flex flex-row items-center space-x-2 py-2"}>
                    <Combobox
                        buttonTitle={"Absence Type"}
                        icon={<CircleOff size={14} className={"mr-2"}/>}
                        getItemTitle={(item) => item as string}
                        onValueChange={(value) => setValues((prevValues) => ({ ...prevValues, reason: value as AbsenceReason }))}
                    >
                        {absenceTypes.map(((absence, index) =>
                                <ComboboxItem key={index} title={absence} value={absence}/>
                        ))}
                    </Combobox>
                    <DateRangePicker text={"Select your absence time"}
                                     closeButton={false}
                                     dayFormat={"long"}
                                     onRangeChange={(value) =>
                                         setValues((prevValues) => ({ ...prevValues,
                                             start: value?.from ?? new Date(),
                                             end: value?.to ?? new Date()
                                         }))}
                    />
                </div>
            </DialogContent>
            <DialogFooter saveButtonTitle={"Create"}
                          disabledButton={!valid}
                          onClick={handleCreateClick}
            />
        </Dialog>
    );
})
CreateAbsenceDialog.displayName = "CreateAbsenceDialog";
"use client";

import React, {ChangeEvent, forwardRef, useCallback, useEffect, useMemo, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import {useUser} from "@/context/UserContext";
import {CircleOff, TreePalm} from "lucide-react";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";
import {DateRangePicker} from "@marraph/daisy/components/daterangepicker/DateRangePicker";
import {Absence, AbsenceType} from "@/types/types";
import {createAbsence} from "@/service/hooks/absenceHook";
import {mutateRef} from "@/utils/mutateRef";
import {useToast} from "griller/src/component/toaster";

type CreateProps = Pick<Absence, 'comment' | 'absenceType' | 'startDate' | 'endDate'>;

export const CreateAbsenceDialog = forwardRef<DialogRef, { onClose: () => void }>(({onClose}, ref) => {
    const dialogRef = mutateRef(ref);
    const [values, setValues] = useState<CreateProps>({
        comment: "",
        absenceType: "VACATION",
        startDate: new Date(),
        endDate: new Date()
    });
    const [valid, setValid] = useState<boolean>(false);
    const [dialogKey, setDialogKey] = useState(Date.now());
    const {data:user, isLoading:userLoading, error:userError} = useUser();
    const {addToast} = useToast();

    const absenceTypes = useMemo(() => ["VACATION", "SICK"], []);

    const validateInput = useCallback(() => {
        setValid(values.absenceType === "VACATION" || values.absenceType === "SICK");
    }, [values.absenceType]);

    useEffect(() => {
        validateInput();
    }, [validateInput, values.absenceType]);

    const handleCloseClick = useCallback(() => {
        setValues({comment: "", absenceType: "VACATION", startDate: new Date(), endDate: new Date()});
        setValid(false);
        setDialogKey(Date.now());
        onClose();
    }, [onClose]);

    const handleCreateClick = useCallback(() => {
        if (!user) return;

        const newAbsence: Absence = {
            id: 0,
            startDate: values.startDate ?? new Date(),
            endDate: values.endDate ?? new Date(),
            comment: values.comment,
            absenceType: values.absenceType as AbsenceType,
            createdBy: {id: user.id, name: user.name, email: user.email},
            createdDate: new Date(),
            lastModifiedBy: {id: user.id, name: user.name, email: user.email},
            lastModifiedDate: new Date(),
        }

        const { data, isLoading, error } = createAbsence(newAbsence);

        addToast({
            title: "Absence created successfully!",
            icon: <TreePalm/>,
        })

        handleCloseClick();
    }, [user, values.startDate, values.endDate, values.comment, values.absenceType, handleCloseClick, addToast]);

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
                          className={"h-12 w-full bg-black placeholder-marcador focus:text-gray"}
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
                        onValueChange={(value) => setValues((prevValues) => ({ ...prevValues, absenceType: value as AbsenceType }))}
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
                                             startDate: value?.from ?? new Date(),
                                             endDate: value?.to ?? new Date()
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
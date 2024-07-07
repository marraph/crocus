"use client";

import React, {ChangeEvent, forwardRef, useEffect, useMemo, useRef, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Alert, AlertContent, AlertIcon, AlertRef, AlertTitle} from "@marraph/daisy/components/alert/Alert";
import {Textarea, TextareaRef} from "@marraph/daisy/components/textarea/Textarea";
import {useUser} from "@/context/UserContext";
import {Button} from "@marraph/daisy/components/button/Button";
import {CircleOff, TreePalm} from "lucide-react";
import {cn} from "@/utils/cn";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {Combobox, ComboboxItem, ComboboxRef} from "@marraph/daisy/components/combobox/Combobox";
import {DateRangePicker, DateRangePickerRef} from "@marraph/daisy/components/daterangepicker/DateRangePicker";
import {Absence, AbsenceType, PreviewUser} from "@/types/types";
import {createAbsence} from "@/service/hooks/absenceHook";
import {DateRange} from "react-day-picker";
import {mutateRef} from "@/utils/mutateRef";

type InitialValues = {
    comment: string,
    absenceType: string,
    dateRange: DateRange,
}

export const CreateAbsenceDialog = forwardRef<DialogRef, React.DialogHTMLAttributes<HTMLDialogElement>>(({ className, ...props}, ref) => {
    const dialogRef = mutateRef(ref);
    const alertRef = useRef<AlertRef>(null);
    const initialValues: InitialValues = {
        comment: "",
        absenceType: "",
        dateRange: {
            from: new Date(),
            to: new Date()
        }
    };
    const [values, setValues] = useState(initialValues);
    const [valid, setValid] = useState<boolean>(false);
    const [dialogKey, setDialogKey] = useState(Date.now());
    const absenceTypes = useMemo(() => ["VACATION", "SICK"], []);
    const {data:user, isLoading:userLoading, error:userError} = useUser();

    useEffect(() => {
        validateInput();
    }, [values.absenceType]);

    if (!dialogRef || user === undefined) return null;

    const validateInput = () => {
        setValid(values.absenceType === "VACATION" || values.absenceType === "SICK");
    }

    const createNewAbsence = () => {
        const newAbsence: Absence = {
            id: 0,
            startDate: values.dateRange.from ?? new Date(),
            endDate: values.dateRange.to ?? new Date(),
            comment: values.comment,
            absenceType: values.absenceType as AbsenceType,
            createdBy: {id: user.id, name: user.name, email: user.email},
            createdDate: new Date(),
            lastModifiedBy: {id: user.id, name: user.name, email: user.email},
            lastModifiedDate: new Date(),
        }
        const { data, isLoading, error } = createAbsence(newAbsence);
        handleCloseClick();
    }

    const handleCloseClick = () => {
        setValues(initialValues);
        setValid(false);
        setDialogKey(Date.now());
    }

    const handleInputChange = (field: keyof InitialValues, setValues: React.Dispatch<React.SetStateAction<InitialValues>>) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setValues((prevValues) => ({
            ...prevValues,
            [field]: e.target.value
        }));
    };

    return (
        <>
            <Dialog width={600}
                    ref={dialogRef}
                    key={dialogKey}
            >
                <DialogHeader title={"New absence"}
                              dialogRef={dialogRef}
                              onClose={handleCloseClick}
                />
                <DialogContent>
                    <Textarea placeholder={"Comment"}
                              className={"px-4 h-12 w-full bg-black placeholder-placeholder focus:text-gray"}
                              spellCheck={false}
                              onChange={handleInputChange("comment", setValues)}
                              value={values.comment}
                    >
                    </Textarea>
                    <div className={"flex flex-row items-center space-x-2 px-4 py-2"}>
                        <Combobox buttonTitle={"Absence Type"}
                                  icon={<CircleOff size={14} className={"mr-2"}/>}
                                  onValueChange={(value) =>
                                      setValues((prevValues) => ({ ...prevValues, absenceType: value ?? "" }))}
                        >
                            {absenceTypes.map(((absence, index) =>
                                    <ComboboxItem key={index}
                                                  title={absence}
                                    />
                            ))}
                        </Combobox>
                        <DateRangePicker text={"Select your absence time"}
                                         iconSize={16}
                                         closeButton={false}
                                         dayFormat={"long"}
                                         onRangeChange={(value) =>
                                             setValues((prevValues) => ({ ...prevValues, dateRange: value ?? {from: new Date(), to: new Date()} }))}
                        />
                    </div>
                </DialogContent>
                <DialogFooter saveButtonTitle={"Create"}
                              cancelButton={true}
                              switchButton={false}
                              dialogRef={dialogRef}
                              disabledButton={!valid}
                              onClose={handleCloseClick}
                              onClick={createNewAbsence}
                />
            </Dialog>

            <Alert duration={3000} ref={alertRef} closeButton={false}>
                <AlertIcon icon={<TreePalm/>}/>
                <AlertContent>
                    <AlertTitle title={"Time Entry created successfully!"}></AlertTitle>
                </AlertContent>
            </Alert>
        </>
    );
})
CreateAbsenceDialog.displayName = "CreateAbsenceDialog";
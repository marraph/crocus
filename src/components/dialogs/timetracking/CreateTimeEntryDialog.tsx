"use client";

import React, {ChangeEvent, forwardRef, useEffect, useMemo, useRef, useState} from "react";
import {Button} from "@marraph/daisy/components/button/Button";
import {cn} from "@/utils/cn";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Alert, AlertContent, AlertIcon, AlertRef, AlertTitle} from "@marraph/daisy/components/alert/Alert";
import {AlarmClockPlus, BookCopy, ClipboardList, Clock2, Clock8} from "lucide-react";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import { useUser } from "@/context/UserContext";
import {PreviewUser, Project, Task, TimeEntry} from "@/types/types";
import {SearchSelect, SearchSelectItem, SearchSelectRef} from "@marraph/daisy/components/searchselect/SearchSelect";
import {Textarea, TextareaRef} from "@marraph/daisy/components/textarea/Textarea";
import {Switch, SwitchRef} from "@marraph/daisy/components/switch/Switch";
import {DatePicker, DatepickerRef} from "@marraph/daisy/components/datepicker/DatePicker";
import {getAllProjects, getAllTasks, getProjectFromTask, getTasksFromProject} from "@/utils/getTypes";
import {createTimeEntry} from "@/service/hooks/timeentryHook";
import {mutateRef} from "@/utils/mutateRef";

type InitialValues = {
    comment: string,
    project: Project | null,
    task: Task | null,
    timeFrom: string,
    timeTo: string,

}

export const CreateTimeEntryDialog = forwardRef<DialogRef, React.DialogHTMLAttributes<HTMLDialogElement>>(({ className, ...props}, ref) => {
    const dialogRef = mutateRef(ref);
    const alertRef = useRef<AlertRef>(null);
    const switchRef = useRef<SwitchRef>(null);

    const initialValues: InitialValues = {
        comment: "",
        project: null,
        task: null,
        timeFrom: "",
        timeTo: "",
    }

    const [values, setValues] = useState(initialValues);
    const [valid, setValid] = useState<boolean>(false);
    const [dialogKey, setDialogKey] = useState(Date.now());
    const {data:user, isLoading:userLoading, error:userError} = useUser();

    const times = useMemo(() => [
        "12:00AM", "12:15AM", "12:30AM", "12:45AM",
        "01:00AM", "01:15AM", "01:30AM", "01:45AM",
        "02:00AM", "02:15AM", "02:30AM", "02:45AM",
        "03:00AM", "03:15AM", "03:30AM", "03:45AM",
        "04:00AM", "04:15AM", "04:30AM", "04:45AM",
        "05:00AM", "05:15AM", "05:30AM", "05:45AM",
        "06:00AM", "06:15AM", "06:30AM", "06:45AM",
        "07:00AM", "07:15AM", "07:30AM", "07:45AM",
        "08:00AM", "08:15AM", "08:30AM", "08:45AM",
        "09:00AM", "09:15AM", "09:30AM", "09:45AM",
        "10:00AM", "10:15AM", "10:30AM", "10:45AM",
        "11:00AM", "11:15AM", "11:30AM", "11:45AM",
        "12:00PM", "12:15PM", "12:30PM", "12:45PM",
        "01:00PM", "01:15PM", "01:30PM", "01:45PM",
        "02:00PM", "02:15PM", "02:30PM", "02:45PM",
        "03:00PM", "03:15PM", "03:30PM", "03:45PM",
        "04:00PM", "04:15PM", "04:30PM", "04:45PM",
        "05:00PM", "05:15PM", "05:30PM", "05:45PM",
        "06:00PM", "06:15PM", "06:30PM", "06:45PM",
        "07:00PM", "07:15PM", "07:30PM", "07:45PM",
        "08:00PM", "08:15PM", "08:30PM", "08:45PM",
        "09:00PM", "09:15PM", "09:30PM", "09:45PM",
        "10:00PM", "10:15PM", "10:30PM", "10:45PM",
        "11:00PM", "11:15PM", "11:30PM", "11:45PM"
    ], []);

    useEffect(() => {
        validateInput();
    }, [values.comment, values.project, values.task, values.timeFrom, values.timeTo]);

    if (!dialogRef) return null;
    if (!user) return null;

    const validateInput = () => {

        if (comment.trim() === "" && !projectSelected && !taskSelected) {
            setValid(false);
            return;
        }

        if (!times.includes(timeFrom as string) || !times.includes(timeTo as string) ||
            times.indexOf(timeFrom as string) >= times.indexOf(timeTo as string)) {
            setValid(false);
            return;
        }
        setValid(true);
    }

    const createEntry = () => {
        const newEntry: TimeEntry = {
            id: 0,
            comment: values.comment,
            project: values.project ?? null,
            task: values.task ?? null,
            startDate: new Date(values.timeFrom),
            endDate: new Date(values.timeTo),
            createdBy: {id: user.id, name: user.name, email: user.email},
            createdDate: new Date(),
            lastModifiedBy: {id: user.id, name: user.name, email: user.email},
            lastModifiedDate: new Date(),
        }
        const { data, isLoading, error } = createTimeEntry(newEntry);

        handleCloseClick();
        alertRef.current?.show();
    }

    const handleCloseClick = () => {
        setValues(initialValues);
        setValid(false);
        setDialogKey(Date.now());
        switchRef.current?.setValue(false);
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
                <DialogHeader title={"New entry"}
                              dialogRef={dialogRef}
                              onClose={handleCloseClick}
                />
                <DialogContent>
                    <Textarea placeholder={"Comment"}
                              className={"px-4 h-12 w-full bg-black placeholder-placeholder focus:text-gray"}
                              spellCheck={false}
                              onChange={handleInputChange("comment", setValues)}
                              value={values.comment}
                    />
                    <div className={"flex flex-row items-center space-x-2 px-4 py-2"}>
                        <SearchSelect buttonTitle={"Project"}
                                      icon={<BookCopy size={16}/>}
                                      size={"medium"}
                                      className={"z-50"}
                                      onValueChange={(value) =>
                                          setValues((prevValues) => ({ ...prevValues, project: values.task ? value : getProjectFromTask(user, values.task)}))}
                        >
                            {!values.task && getAllProjects(user).map((project) => (
                                <SearchSelectItem key={project.id} title={project.name}/>
                            ))}
                            {values.task && getProjectFromTask(user, values.task) &&
                                <SearchSelectItem title={getProjectFromTask(user, values.task)?.name as string}/>
                            }
                        </SearchSelect>

                        <SearchSelect buttonTitle={"Task"}
                                      icon={<ClipboardList size={16}/>}
                                      size={"medium"}
                                      className={"z-50"}
                                        onValueChange={(value) =>
                                            setValues((prevValues) => ({ ...prevValues, task: value }))}
                        >
                            {!values.project && getAllTasks(user).map((task) => (
                                <SearchSelectItem key={task.id} title={task.name}/>
                            ))}
                            {values.project && getTasksFromProject(user, values.project).map((task) => (
                                <SearchSelectItem key={task.id} title={task.name}/>
                            ))}
                        </SearchSelect>
                    </div>

                    <div className={"flex flex-row items-center space-x-2 px-4 pb-2"}>
                        <DatePicker text={"Select a date"}
                                    iconSize={16}
                                    preSelectedValue={new Date()}
                                    size={"medium"}
                                    closeButton={false}
                                    dayFormat={"short"}
                                    onValueChange={}
                        />
                        <SearchSelect buttonTitle={"From"}
                                      preSelectedValue={"09:00AM"}
                                      icon={<Clock2 size={16}/>}
                                      size={"medium"}
                                      className={"z-40"}
                                      onValueChange={}
                        >
                            {times.map((time) => (
                                <SearchSelectItem key={time}
                                                  title={time}
                                />
                            ))}
                        </SearchSelect>
                        <SearchSelect buttonTitle={"To"}
                                      preSelectedValue={"09:00AM"}
                                      icon={<Clock8 size={16}/>}
                                      size={"medium"}
                                      className={"z-40"}
                                      onValueChange={}
                        >
                            {times.map((time) => (
                                <SearchSelectItem key={time}
                                                  title={time}
                                />
                            ))}
                        </SearchSelect>
                    </div>
                </DialogContent>
                <DialogFooter saveButtonTitle={"Create"}
                              cancelButton={true}
                              switchButton={true}
                              dialogRef={dialogRef}
                              onClose={handleCloseClick}
                              onClick={createEntry}
                              disabledButton={!valid}
                />
            </Dialog>

            <Alert duration={3000} ref={alertRef} closeButton={false}>
                <AlertIcon icon={<AlarmClockPlus/>}/>
                <AlertContent>
                    <AlertTitle title={"Time Entry created successfully!"}></AlertTitle>
                </AlertContent>
            </Alert>
        </>
    );
})
CreateTimeEntryDialog.displayName = "CreateTimeEntryDialog";
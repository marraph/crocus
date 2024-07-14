"use client";

import React, {ChangeEvent, forwardRef, useEffect, useMemo, useRef, useState} from "react";
import {BookCopy, ClipboardList, Clock2, Clock8, Save,} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Alert, AlertRef} from "@marraph/daisy/components/alert/Alert";
import {TimeEntry} from "@/types/types";
import {useUser} from "@/context/UserContext";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import {mutateRef} from "@/utils/mutateRef";
import {SearchSelect, SearchSelectItem} from "@marraph/daisy/components/searchselect/SearchSelect";
import {formatTimeAMPM} from "@/utils/format";
import {getAllProjects, getAllTasks, getProjectFromTask, getTasksFromProject} from "@/utils/getTypes";
import {updateTimEntry} from "@/service/hooks/timeentryHook";

type InitialValues = {
    comment: string,
    project: string,
    task: string,
    timeFrom: string,
    timeTo: string,
}

interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
    timeEntry: TimeEntry;
}

export const EditTimeEntryDialog = forwardRef<DialogRef, DialogProps>(({ timeEntry, className, ...props}, ref) => {
    const dialogRef = mutateRef(ref);
    const alertRef = useRef<AlertRef>(null);

    const initialValues: InitialValues = {
        comment: timeEntry.comment ?? "",
        project: timeEntry.project?.name ?? null,
        task: timeEntry.task?.name ?? null,
        timeFrom: formatTimeAMPM(timeEntry.startDate),
        timeTo: formatTimeAMPM(timeEntry.endDate),
    }

    const [values, setValues] = useState(initialValues);
    const [dialogKey, setDialogKey] = useState(Date.now());
    const [valid, setValid] = useState<boolean>(true);
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
    }, [values]);

    if (!dialogRef || user === undefined) return null;

    const validateTime = (date: Date) => {
        const time = formatTimeAMPM(date);
        if (times.includes(time)) return time;
    }

    const validateInput = () => {
        let timeFrom = timeFromRef.current?.getSelectedValue();
        let timeTo = timeToRef.current?.getSelectedValue();

        if (comment?.trim() === "" && !projectSelected && !taskSelected) {
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

    const editTimeEntry = () => {
        const entry: TimeEntry = {
            id: timeEntry.id,
            comment: values.comment,
            project: values.project ?? null,
            task: values.task ?? null,
            startDate: new Date(values.timeFrom),
            endDate: new Date(values.timeTo),
            createdBy: timeEntry.createdBy,
            createdDate: timeEntry.createdDate,
            lastModifiedBy: { id: user.id, name: user.name, email: user.email },
            lastModifiedDate: new Date(),
        }
        const { data, isLoading, error } = updateTimEntry(timeEntry.id, entry);
        alertRef.current?.show();
    };

    const handleCloseClick = () => {
        setValid(true);
        setValues(initialValues);
        setDialogKey(Date.now());
    };

    const handleInputChange = (field: keyof InitialValues, setValues: React.Dispatch<React.SetStateAction<InitialValues>>) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setValues((prevValues) => ({
            ...prevValues,
            [field]: e.target.value
        }));
    };

    return (
        <>
            <Dialog width={800}
                    ref={dialogRef}
                    key={dialogKey}
            >
                <DialogHeader title={"Edit entry"}
                              dialogRef={dialogRef}
                              onClose={handleCloseClick}
                />
                <DialogContent>
                    <Textarea placeholder={"Comment"}
                              label={"Comment"}
                              className={"px-4 h-12 w-full bg-black placeholder-placeholder focus:text-gray"}
                              spellCheck={false}
                              onChange={handleInputChange("comment", setValues)}
                              value={values.comment}
                    />
                    <div className={"flex flex-row items-center space-x-2 px-4 py-2"}>
                        <SearchSelect buttonTitle={"Project"}
                                      label={"Project"}
                                      preSelectedValue={timeEntry.project?.name}
                                      icon={<BookCopy size={16}/>}
                                      size={"medium"}
                                      className={"z-50"}
                                      onValueChange={(value) =>
                                          setValues((prevValues) => ({ ...prevValues, project: value }))}
                        >
                            {!values.task && getAllProjects(user).map((project) => (
                                <SearchSelectItem key={project.id} title={project.name}/>
                            ))}
                            {values.task && getProjectFromTask(user, values.task) &&
                                <SearchSelectItem title={getProjectFromTask(user, taskSelected)?.name as string}/>
                            }
                        </SearchSelect>

                        <SearchSelect buttonTitle={"Task"}
                                      label={"Task"}
                                      preSelectedValue={timeEntry.task?.name}
                                      icon={<ClipboardList size={16}/>}
                                      size={"medium"}
                                      className={"z-50"}
                                      onValueChange={(value) =>
                                          setValues((prevValues) => ({ ...prevValues, task: value }))}
                        >
                            {!values.project && getAllTasks(user).map((task) => (
                                <SearchSelectItem key={task.id} title={task.name}/>
                            ))}
                            {values.project && getTasksFromProject(user, projectSelected).map((task) => (
                                <SearchSelectItem key={task.id} title={task.name}/>
                            ))}
                        </SearchSelect>
                    </div>

                    <div className={"flex flex-row items-center space-x-2 px-4 pb-2"}>
                        <SearchSelect buttonTitle={"From"}
                                      preSelectedValue={validateTime(values.timeFrom)}
                                      icon={<Clock2 size={16}/>}
                                      label={"Date From"}
                                      size={"medium"}
                                      className={"z-40"}
                                      onValueChange={(value) =>
                                          setValues((prevValues) => ({ ...prevValues, timeFrom: value }))}
                        >
                            {times.map((time) => (
                                <SearchSelectItem key={time} title={time}/>
                            ))}
                        </SearchSelect>
                        <SearchSelect buttonTitle={"To"}
                                      preSelectedValue={validateTime(values.timeTo)}
                                      icon={<Clock8 size={16}/>}
                                      label={"Date To"}
                                      size={"medium"}
                                      className={"z-40"}
                                      onValueChange={(value) =>
                                          setValues((prevValues) => ({ ...prevValues, timeTo: value }))}
                        >
                            {times.map((time) => (
                                <SearchSelectItem key={time} title={time}/>
                            ))}
                        </SearchSelect>
                    </div>

                </DialogContent>
                <DialogFooter saveButtonTitle={"Save changes"}
                              cancelButton={true}
                              switchButton={false}
                              dialogRef={dialogRef}
                              onClick={editTimeEntry}
                              onClose={handleCloseClick}
                              disabledButton={!valid}
                />
            </Dialog>

            <Alert title={"Saved changes"}
                   description={"You successfully saved your entry changes."}
                   icon={<Save/>}
                   duration={3000}
                   ref={alertRef}
                   closeButton={false}
            />
        </>
    );
});
EditTimeEntryDialog.displayName = "EditTimeEntryDialog";
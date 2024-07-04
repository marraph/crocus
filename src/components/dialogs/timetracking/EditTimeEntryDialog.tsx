"use client";

import React, {forwardRef, useEffect, useRef, useState} from "react";
import {
    BookCopy,
    CircleAlert,
    ClipboardList,
    Clock2, Clock8,
    Hourglass,
    LineChart,
    Pencil,
    Save,
    Tag,
    Users
} from "lucide-react";
import {Button} from "@marraph/daisy/components/button/Button";
import {Dialog, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {cn} from "@/utils/cn";
import {Combobox, ComboboxItem, ComboboxRef} from "@marraph/daisy/components/combobox/Combobox";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {DatePicker, DatepickerRef} from "@marraph/daisy/components/datepicker/DatePicker";
import {
    Alert,
    AlertContent,
    AlertDescription,
    AlertIcon,
    AlertRef,
    AlertTitle
} from "@marraph/daisy/components/alert/Alert";
import {Absence, Priority, Project, Status, Task, TaskElement, Team, TimeEntry} from "@/types/types";
import {useUser} from "@/context/UserContext";
import {Textarea, TextareaRef} from "@marraph/daisy/components/textarea/Textarea";
import {mutateRef} from "@/utils/mutateRef";
import {SearchSelect, SearchSelectItem, SearchSelectRef} from "@marraph/daisy/components/searchselect/SearchSelect";
import {formatTimeAMPM} from "@/utils/format";
import {getAllProjects, getAllTasks, getProjectFromTask, getTasksFromProject} from "@/utils/getTypes";
import {updateTimEntry} from "@/service/hooks/timeentryHook";

interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
    timeEntry: TimeEntry;
}

export const EditTimeEntryDialog = forwardRef<DialogRef, DialogProps>(({ timeEntry, className, ...props}, ref) => {
    const dialogRef = mutateRef(ref);
    const alertRef = useRef<AlertRef>(null);
    const commentRef = useRef<TextareaRef>(null);
    const taskRef = useRef<SearchSelectRef>(null);
    const projectRef = useRef<SearchSelectRef>(null);
    const datepickerRef = useRef<DatepickerRef>(null);
    const timeFromRef = useRef<SearchSelectRef>(null);
    const timeToRef = useRef<SearchSelectRef>(null);
    const [comment, setComment] = useState<string | null>(timeEntry.comment);
    const [projectSelected, setProjectSelected] = useState<Project | null>(timeEntry.project ?? null);
    const [taskSelected, setTaskSelected] = useState<Task | null>(timeEntry.task ?? null);
    const [timeFrom, setTimeFrom] = useState<string>(timeEntry.startDate.toString());
    const [timeTo, setTimeTo] = useState<string>(timeEntry.endDate.toString());
    const [valid, setValid] = useState<boolean>(true);
    const {data:user, isLoading:userLoading, error:userError} = useUser();

    useEffect(() => {
        validateInput();
    }, [comment, projectSelected, taskSelected, timeFrom, timeTo]);

    if (!user) return null;
    if (!dialogRef) return null;

    const times = [
        "12:00AM", "12:15AM", "12:30AM", "12:45AM",
        "1:00AM", "1:15AM", "1:30AM", "1:45AM",
        "2:00AM", "2:15AM", "2:30AM", "2:45AM",
        "3:00AM", "3:15AM", "3:30AM", "3:45AM",
        "4:00AM", "4:15AM", "4:30AM", "4:45AM",
        "5:00AM", "5:15AM", "5:30AM", "5:45AM",
        "6:00AM", "6:15AM", "6:30AM", "6:45AM",
        "7:00AM", "7:15AM", "7:30AM", "7:45AM",
        "8:00AM", "8:15AM", "8:30AM", "8:45AM",
        "9:00AM", "9:15AM", "9:30AM", "9:45AM",
        "10:00AM", "10:15AM", "10:30AM", "10:45AM",
        "11:00AM", "11:15AM", "11:30AM", "11:45AM",
        "12:00PM", "12:15PM", "12:30PM", "12:45PM",
        "1:00PM", "1:15PM", "1:30PM", "1:45PM",
        "2:00PM", "2:15PM", "2:30PM", "2:45PM",
        "3:00PM", "3:15PM", "3:30PM", "3:45PM",
        "4:00PM", "4:15PM", "4:30PM", "4:45PM",
        "5:00PM", "5:15PM", "5:30PM", "5:45PM",
        "6:00PM", "6:15PM", "6:30PM", "6:45PM",
        "7:00PM", "7:15PM", "7:30PM", "7:45PM",
        "8:00PM", "8:15PM", "8:30PM", "8:45PM",
        "9:00PM", "9:15PM", "9:30PM", "9:45PM",
        "10:00PM", "10:15PM", "10:30PM", "10:45PM",
        "11:00PM", "11:15PM", "11:30PM", "11:45PM"
    ];

    const validateTime = (date: Date) => {
        const time = formatTimeAMPM(date);
        if (times.includes(time)) return time;
    }

    const handleProjectChange = (project: Project | null) => {
        if (project === projectSelected){
            setProjectSelected(null);
            projectRef.current?.setValue(null);
            setProjectSelected(null);
        } else {
            setProjectSelected(project);
            projectRef.current?.setValue(project?.name);
        }
    };

    const handleTaskChange = (task: Task) => {
        if (task === taskSelected){
            setTaskSelected(null);
            taskRef.current?.setValue(null);
        } else {
            setTaskSelected(task);
            taskRef.current?.setValue(task.name);
        }
    };

    const handleTimeFromChange = (time: string) => {
        if (time === timeFrom){
            setTimeFrom("");
            timeFromRef.current?.setValue(null);
        } else {
            setTimeFrom(time);
            timeFromRef.current?.setValue(time);
        }
    }

    const handleTimeToChange = (time: string) => {
        if (time === timeTo){
            setTimeTo("");
            timeToRef.current?.setValue(null);
        } else {
            setTimeTo(time);
            timeToRef.current?.setValue(time);
        }
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
            comment: comment ?? null,
            project: projectSelected ?? null,
            task: taskSelected ?? null,
            startDate: new Date(timeFrom),
            endDate: new Date(timeTo),
            createdBy: timeEntry.createdBy,
            createdDate: timeEntry.createdDate,
            lastModifiedBy: { id: user.id, name: user.name, email: user.email },
            lastModifiedDate: new Date(),
        }
        const { data, isLoading, error } = updateTimEntry(timeEntry.id, entry);
        dialogRef.current?.close();
        alertRef.current?.show();
    };

    const handleCloseClick = () => {
        setComment("");
        setProjectSelected(null);
        setTaskSelected(null);
        setTimeFrom("");
        setTimeTo("");
        dialogRef.current?.close();
        commentRef.current?.reset();
        taskRef.current?.setValue(timeEntry.task?.name ?? null);
        projectRef.current?.setValue(timeEntry.project?.name ?? null);
        datepickerRef.current?.setValue(timeEntry.startDate);
        timeFromRef.current?.setValue(formatTimeAMPM(timeEntry.startDate));
        timeToRef.current?.setValue(formatTimeAMPM(timeEntry.endDate));
    };

    return (
        <>
            <div className={"flex items-center justify-center"}>
                <Dialog className={"border border-white border-opacity-20 w-1/3 drop-shadow-lg overflow-visible"} {...props} ref={dialogRef}>
                    <div className={"flex flex-row justify-between px-4 pb-2"}>
                        <span className={"text-md text-white pt-4"}>Edit entry</span>
                        <CloseButton className={"h-min w-min mt-4"} onClick={() => handleCloseClick()} />
                    </div>
                    <Seperator />

                    <Textarea placeholder={"Comment"} className={"px-4 h-12 w-full bg-black placeholder-placeholder focus:text-gray"} spellCheck={false}
                              onChange={(e) => setComment(e.target.value)} value={comment ?? undefined}
                              ref={commentRef}>
                    </Textarea>

                    <div className={"flex flex-row items-center space-x-2 px-4 py-2"}>
                        <SearchSelect buttonTitle={"Project"} ref={projectRef} preSelectedValue={timeEntry.project?.name}
                                      icon={<BookCopy size={16}/>} size={"medium"} className={"z-50"}>
                            {!taskSelected && getAllProjects(user).map((project) => (
                                <SearchSelectItem key={project.id} title={project.name} onClick={() => handleProjectChange(project)}></SearchSelectItem>
                            ))}
                            {taskSelected && getProjectFromTask(user, taskSelected) &&
                                <SearchSelectItem title={getProjectFromTask(user, taskSelected)?.name as string}
                                                  onClick={() => handleProjectChange(getProjectFromTask(user, taskSelected))}></SearchSelectItem>
                            }
                        </SearchSelect>

                        <SearchSelect buttonTitle={"Task"} ref={taskRef} preSelectedValue={timeEntry.task?.name}
                                      icon={<ClipboardList size={16}/>} size={"medium"} className={"z-50"}>
                            {!projectSelected && getAllTasks(user).map((task) => (
                                <SearchSelectItem key={task.id} title={task.name} onClick={() => handleTaskChange(task)}></SearchSelectItem>
                            ))}
                            {projectSelected && getTasksFromProject(user, projectSelected).map((task) => (
                                <SearchSelectItem key={task.id} title={task.name} onClick={() => handleTaskChange(task)}></SearchSelectItem>
                            ))}
                        </SearchSelect>
                    </div>

                    <div className={"flex flex-row items-center space-x-2 px-4 pb-2"}>
                        <DatePicker text={"Select a date"} iconSize={16} ref={datepickerRef} dayFormat={"short"}
                                    preSelectedValue={timeEntry.startDate} size={"medium"} closeButton={false}/>
                        <SearchSelect buttonTitle={"From"} preSelectedValue={validateTime(timeEntry.startDate)} ref={timeFromRef}
                                      icon={<Clock2 size={16}/>} size={"medium"} className={"z-40"}>
                            {times.map((time) => (
                                <SearchSelectItem key={time} title={time} onClick={() => handleTimeFromChange(time)}></SearchSelectItem>
                            ))}
                        </SearchSelect>
                        <SearchSelect buttonTitle={"To"} preSelectedValue={validateTime(timeEntry.endDate)} ref={timeToRef}
                                      icon={<Clock8 size={16}/>} size={"medium"} className={"z-40"}>
                            {times.map((time) => (
                                <SearchSelectItem key={time} title={time} onClick={() => handleTimeToChange(time)}></SearchSelectItem>
                            ))}
                        </SearchSelect>
                    </div>


                    <Seperator/>
                    <div className={cn("flex flex-row space-x-2 justify-end px-4 py-2")}>
                        <Button text={"Cancel"} className={cn("h-8")} onClick={() => handleCloseClick()}/>
                        <Button text={"Save changes"} theme={"white"}
                                onClick={editTimeEntry} disabled={!valid}
                                className={"h-8"}/>
                    </div>
                </Dialog>
            </div>

            <Alert duration={3000} ref={alertRef} closeButton={false}>
                <AlertIcon icon={<Save/>}/>
                <AlertContent>
                    <AlertTitle title={"Saved changes"}></AlertTitle>
                    <AlertDescription description={"You successfully saved your entry changes."}></AlertDescription>
                </AlertContent>
            </Alert>
        </>
    );
});
EditTimeEntryDialog.displayName = "EditTimeEntryDialog";
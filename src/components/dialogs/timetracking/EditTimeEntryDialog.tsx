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
import {Priority, Project, Status, Task, TaskElement, Team, TimeEntry} from "@/types/types";
import {useUser} from "@/context/UserContext";
import {Textarea, TextareaRef} from "@marraph/daisy/components/textarea/Textarea";
import {Input, InputRef} from "@marraph/daisy/components/input/Input";
import {mutateRef} from "@/utils/mutateRef";
import {SearchSelect, SearchSelectItem, SearchSelectRef} from "@marraph/daisy/components/searchselect/SearchSelect";
import {SwitchRef} from "@marraph/daisy/components/switch/Switch";
import {formatTimeAMPM} from "@/utils/format";
import entry from "next/dist/server/typescript/rules/entry";
import {getAllProjects, getAllTasks, getProjectFromTask, getTasksFromProject} from "@/utils/getTypes";

interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
    timeEntry: TimeEntry;
}

const timeEntry: TimeEntry = {
    id: 1,
    task: {
        id: 1,
        name: "Implement new feature",
        description: "Develop and implement the new feature for the application",
        topic: {
            id: 1,
            title: "Development",
            hexCode: "#FF5733",
            createdBy: {
                id: 1,
                name: "Jane Doe",
                email: "jane.doe@example.com"
            },
            createdDate: new Date('2024-01-01T10:00:00Z'),
            lastModifiedBy: {
                id: 1,
                name: "Jane Doe",
                email: "jane.doe@example.com"
            },
            lastModifiedDate: new Date('2024-01-02T10:00:00Z')
        },
        isArchived: false,
        duration: null,
        deadline: new Date('2024-07-01T10:00:00Z'),
        status: "STARTED",
        priority: "HIGH",
        createdBy: {
            id: 1,
            name: "Jane Doe",
            email: "jane.doe@example.com"
        },
        createdDate: new Date('2024-01-01T10:00:00Z'),
        lastModifiedBy: {
            id: 1,
            name: "Jane Doe",
            email: "jane.doe@example.com"
        },
        lastModifiedDate: new Date('2024-01-02T10:00:00Z')
    },
    project: {
        id: 1,
        name: "Project Alpha",
        description: "A project to develop the new feature",
        priority: "HIGH",
        isArchived: false,
        tasks: [],
        createdBy: {
            id: 1,
            name: "Jane Doe",
            email: "jane.doe@example.com"
        },
        createdDate: new Date('2024-01-01T10:00:00Z'),
        lastModifiedBy: {
            id: 1,
            name: "Jane Doe",
            email: "jane.doe@example.com"
        },
        lastModifiedDate: new Date('2024-01-02T10:00:00Z')
    },
    comment: "Worked on initial setup and database integration.",
    startDate: new Date('2024-06-01T08:00:00Z'),
    endDate: new Date('2024-06-01T12:00:00Z'),
    dailyEntry: {
        id: 1,
        startDate: new Date('2024-06-01T08:00:00Z'),
        endDate: new Date('2024-06-01T17:00:00Z'),
        createdBy: {
            id: 1,
            name: "Jane Doe",
            email: "jane.doe@example.com"
        },
        createdDate: new Date('2024-01-01T10:00:00Z'),
        lastModifiedBy: {
            id: 1,
            name: "Jane Doe",
            email: "jane.doe@example.com"
        },
        lastModifiedDate: new Date('2024-01-02T10:00:00Z')
    },
    createdBy: {
        id: 1,
        name: "Jane Doe",
        email: "jane.doe@example.com"
    },
    createdDate: new Date('2024-01-01T10:00:00Z'),
    lastModifiedBy: {
        id: 1,
        name: "Jane Doe",
        email: "jane.doe@example.com"
    },
    lastModifiedDate: new Date('2024-01-02T10:00:00Z')
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
    const [projectSelected, setProjectSelected] = useState<string | null>(timeEntry.project?.name ?? null);
    const [taskSelected, setTaskSelected] = useState<string | null>(timeEntry.task?.name ?? null);
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
    ];

    const validateTime = (date: Date) => {
        const time = formatTimeAMPM(date);
        if (times.includes(time)) return time;
    }
    const handleProjectChange = (project: string) => {
        if (project === projectSelected){
            setProjectSelected(null);
            projectRef.current?.setValue(null);
            setProjectSelected(null);
        } else {
            setProjectSelected(project);
            projectRef.current?.setValue(project);
        }
    };

    const handleTaskChange = (task: string) => {
        if (task === taskSelected){
            setTaskSelected(null);
            taskRef.current?.setValue(null);
        } else {
            setTaskSelected(task);
            taskRef.current?.setValue(task);
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
                                <SearchSelectItem key={project} title={project} onClick={() => handleProjectChange(project)}></SearchSelectItem>
                            ))}
                            {taskSelected && getProjectFromTask(user, taskSelected) &&
                                <SearchSelectItem title={getProjectFromTask(user, taskSelected)}
                                                  onClick={() => handleProjectChange(getProjectFromTask(user, taskSelected))}></SearchSelectItem>
                            }
                        </SearchSelect>

                        <SearchSelect buttonTitle={"Task"} ref={taskRef} preSelectedValue={timeEntry.task?.name}
                                      icon={<ClipboardList size={16}/>} size={"medium"} className={"z-50"}>
                            {!projectSelected && getAllTasks(user).map((task) => (
                                <SearchSelectItem key={task} title={task} onClick={() => handleTaskChange(task)}></SearchSelectItem>
                            ))}
                            {projectSelected && getTasksFromProject(user, projectSelected).map((task) => (
                                <SearchSelectItem key={task} title={task} onClick={() => handleTaskChange(task)}></SearchSelectItem>
                            ))}
                        </SearchSelect>
                    </div>

                    <div className={"flex flex-row items-center space-x-2 px-4 pb-2"}>
                        <DatePicker text={"Select a date"} iconSize={16} ref={datepickerRef}
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

            <Alert duration={3000} ref={alertRef}>
                <AlertIcon icon={<Save/>}/>
                <AlertContent>
                    <AlertTitle title={"Saved changes"}></AlertTitle>
                    <AlertDescription description={"You successfully saved your task changes."}></AlertDescription>
                </AlertContent>
            </Alert>
        </>
    );
});
EditTimeEntryDialog.displayName = "EditTimeEntryDialog";
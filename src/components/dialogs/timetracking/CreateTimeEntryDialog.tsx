import React, {useEffect, useRef, useState} from "react";
import {Button} from "@marraph/daisy/components/button/Button";
import {cn} from "@/utils/cn";
import {Dialog, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Alert, AlertContent, AlertIcon, AlertRef, AlertTitle} from "@marraph/daisy/components/alert/Alert";
import {AlarmClockPlus, BookCopy, ClipboardList, Clock2, Clock8} from "lucide-react";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import { useUser } from "@/context/UserContext";
import {Project, Task} from "@/types/types";
import {SearchSelect, SearchSelectItem, SearchSelectRef} from "@marraph/daisy/components/searchselect/SearchSelect";
import {Textarea, TextareaRef} from "@marraph/daisy/components/textarea/Textarea";
import {Switch, SwitchRef} from "@marraph/daisy/components/switch/Switch";
import {DatePicker, DatepickerRef} from "@marraph/daisy/components/datepicker/DatePicker";
import {getAllProjects, getAllTasks, getProjectFromTask, getTasksFromProject} from "@/utils/getTypes";

export const CreateTimeEntryDialog = React.forwardRef<DialogRef, React.DialogHTMLAttributes<HTMLDialogElement>>(({ className, ...props}, ref) => {
    const dialogRef = useRef<DialogRef>(null);
    const alertRef = useRef<AlertRef>(null);
    const commentRef = useRef<TextareaRef>(null);
    const taskRef = useRef<SearchSelectRef>(null);
    const projectRef = useRef<SearchSelectRef>(null);
    const datepickerRef = useRef<DatepickerRef>(null);
    const timeFromRef = useRef<SearchSelectRef>(null);
    const timeToRef = useRef<SearchSelectRef>(null);
    const switchRef = useRef<SwitchRef>(null);
    const [comment, setComment] = useState("");
    const [projectSelected, setProjectSelected] = useState<string | null>(null);
    const [taskSelected, setTaskSelected] = useState<string | null>(null);
    const [timeFrom, setTimeFrom] = useState<string | null>(null);
    const [timeTo, setTimeTo] = useState<string | null>(null);
    const [valid, setValid] = useState<boolean>(false);
    const {data:user, isLoading:userLoading, error:userError} = useUser();

    useEffect(() => {
        if (user && dialogRef.current && commentRef.current && taskRef.current && projectRef.current && datepickerRef.current && timeFromRef.current && timeToRef.current) {
            validateInput();
        }
    }, [user, comment, projectSelected, taskSelected, timeFrom, timeTo]);

    if (!dialogRef) return null;
    if (!user) return null;

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
            setTimeFrom(null);
            timeFromRef.current?.setValue(null);
        } else {
            setTimeFrom(time);
            timeFromRef.current?.setValue(time);
        }
    }

    const handleTimeToChange = (time: string) => {
        if (time === timeTo){
            setTimeTo(null);
            timeToRef.current?.setValue(null);
        } else {
            setTimeTo(time);
            timeToRef.current?.setValue(time);
        }
    }

    const validateInput = () => {
        let timeFrom = timeFromRef.current?.getSelectedValue();
        let timeTo = timeToRef.current?.getSelectedValue();

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

    const createTimeEntry = () => {
        if (switchRef.current?.getValue() === false) {
            dialogRef.current?.close();
        }
        setComment("");
        setProjectSelected(null);
        setTaskSelected(null);
        setTimeFrom("");
        setTimeTo("");
        commentRef.current?.reset();
        taskRef.current?.reset();
        projectRef.current?.reset();
        datepickerRef.current?.setValue(datepickerRef.current.getSelectedValue());
        timeFromRef.current?.reset();
        timeToRef.current?.reset();
        alertRef.current?.show();
    }

    const handleCloseClick = () => {
        setComment("");
        setProjectSelected(null);
        setTaskSelected(null);
        setTimeFrom("");
        setTimeTo("");
        dialogRef.current?.close();
        commentRef.current?.reset();
        taskRef.current?.reset();
        projectRef.current?.reset();
        datepickerRef.current?.setValue(datepickerRef.current.getSelectedValue());
        timeFromRef.current?.reset();
        timeToRef.current?.reset();
        switchRef.current?.setValue(false);
    }

    return (
        <>
            <Button text={"New Entry"} theme={"white"} className={"w-min h-8"} onClick={() => dialogRef.current?.show()}>
                <AlarmClockPlus size={20} className={"mr-2"}/>
            </Button>

            <div className={cn("flex items-center justify-center")}>
                <Dialog className={cn("border border-white border-opacity-20 w-1/3 drop-shadow-lg overflow-visible space-y-2")} {...props} ref={dialogRef}>
                    <div className={"flex flex-row justify-between items-center space-x-4 pt-4 pb-2 px-4"}>
                        <span className={"text-white text-lg"}>{"Create a new entry"}</span>
                        <CloseButton className={cn("h-min w-min", className)} onClick={handleCloseClick}/>
                    </div>

                    <Textarea placeholder={"Comment"} className={"px-4 h-12 w-full bg-black placeholder-placeholder focus:text-gray"} spellCheck={false}
                              onChange={(e) => setComment(e.target.value)} value={comment} ref={commentRef}>
                    </Textarea>

                    <div className={"flex flex-row items-center space-x-2 px-4 py-2"}>
                        <SearchSelect buttonTitle={"Project"} ref={projectRef}
                                      icon={<BookCopy size={16}/>} size={"medium"} className={"z-50"}>
                            {!taskSelected && getAllProjects(user).map((project) => (
                                <SearchSelectItem key={project} title={project} onClick={() => handleProjectChange(project)}></SearchSelectItem>
                            ))}
                            {taskSelected && getProjectFromTask(user, taskSelected) &&
                                <SearchSelectItem title={getProjectFromTask(user, taskSelected)}
                                                  onClick={() => handleProjectChange(getProjectFromTask(user, taskSelected))}></SearchSelectItem>
                            }
                        </SearchSelect>

                        <SearchSelect buttonTitle={"Task"} ref={taskRef}
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
                                    preSelectedValue={new Date()} size={"medium"} closeButton={false}/>
                        <SearchSelect buttonTitle={"From"} preSelectedValue={"09:00AM"} ref={timeFromRef}
                                      icon={<Clock2 size={16}/>} size={"medium"} className={"z-40"}>
                            {times.map((time) => (
                                <SearchSelectItem key={time} title={time} onClick={() => handleTimeFromChange(time)}></SearchSelectItem>
                            ))}
                        </SearchSelect>
                        <SearchSelect buttonTitle={"To"} preSelectedValue={"09:00AM"} ref={timeToRef}
                                      icon={<Clock8 size={16}/>} size={"medium"} className={"z-40"}>
                            {times.map((time) => (
                                <SearchSelectItem key={time} title={time} onClick={() => handleTimeToChange(time)}></SearchSelectItem>
                            ))}
                        </SearchSelect>
                    </div>

                    <Seperator/>
                    <div className={cn("flex flex-row items-center justify-end space-x-16 px-4 py-2", className)}>
                        <div className={"flex flex-row items-center space-x-2 text-gray text-xs"}>
                            <span>{"Create more"}</span>
                            <Switch ref={switchRef}></Switch>
                        </div>
                        <Button text={"Create"} theme={"white"} onClick={createTimeEntry} disabled={!valid}
                                className={cn("w-min h-8", className)}>
                        </Button>
                    </div>
                </Dialog>
            </div>

            <Alert duration={3000} ref={alertRef}>
                <AlertIcon icon={<AlarmClockPlus/>}/>
                <AlertContent>
                    <AlertTitle title={"Time Entry created successfully!"}></AlertTitle>
                </AlertContent>
            </Alert>
        </>
    );
})
CreateTimeEntryDialog.displayName = "CreateTimeEntryDialog";
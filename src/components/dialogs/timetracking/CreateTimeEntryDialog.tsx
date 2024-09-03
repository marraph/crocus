"use client";

import React, {forwardRef, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {AlarmClockPlus, BookCopy, CircleAlert, CircleX, ClipboardList, Clock2, Clock8, TreePalm} from "lucide-react";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import {Switch, SwitchRef} from "@marraph/daisy/components/switch/Switch";
import {mutateRef} from "@/utils/mutateRef";
import moment from "moment";
import {DatePicker} from "@marraph/daisy/components/datepicker/DatePicker";
import {useToast} from "griller/src/component/toaster";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";
import {createTimeEntry, TimeEntry} from "@/action/timeEntry";
import { useUser } from "@/context/UserContext";
import {Task, updateTask} from "@/action/task";
import {Project} from "@/action/projects";
import {ActionConsumerType, CompletedProject, CompletedTask, CompletedUser} from "@/types/types";
import {
    ComplexTask,
    createAbsenceInCompletedUser,
    getProjectsFromUser, getTaskFromId,
    getTasksFromProjectId,
    getTasksFromUser
} from "@/utils/object-helpers";
import {Absence, createAbsence} from "@/action/absence";

type CreateProps = Pick<TimeEntry, "comment" | "projectId" | "taskId" | "start" | "end">;

export const CreateTimeEntryDialog = forwardRef<DialogRef, { onClose: () => void }>(({onClose}, ref) => {
    const dialogRef = mutateRef(ref);
    const switchRef = useRef<SwitchRef>(null);

    const [values, setValues] = useState<CreateProps>({
        comment: "",
        projectId: null,
        taskId: null,
        start: moment().hour(9).minute(0).toDate(),
        end:  moment().hour(9).minute(0).toDate()
    });
    const [projects, setProjects] = useState<CompletedProject[]>([]);
    const [tasks, setTasks] = useState<ComplexTask[]>([]);
    const [dialogKey, setDialogKey] = useState(Date.now());
    const { user, loading, error, actionConsumer } = useUser();
    const { addToast } = useToast();
    
    const fields = {
        
    }

    useEffect(() => {
        if (!user) return;
        setProjects(getProjectsFromUser(user));
        
        if (values.projectId) setTasks(getTasksFromProjectId(user, values.projectId));
        else setTasks(getTasksFromUser(user));
    }, [user, values.projectId]);

    const times = useMemo(() => {
        const timesArray = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const hourString = hour.toString().padStart(2, '0');
                const minuteString = minute.toString().padStart(2, '0');
                timesArray.push(`${hourString}:${minuteString}`);
            }
        }
        return timesArray;
    }, []);

    const getDuration = useCallback(() => {
        return moment.duration(moment(values.start)
            .diff(moment(values.end)))
            .asHours();
    }, [values]);

    const handleCloseClick = useCallback(() => {
        setValues({
            comment: "", 
            projectId: null, 
            taskId: null, 
            start: moment().hour(9).minute(0).toDate(), 
            end: moment().hour(9).minute(0).toDate()
        });
        setDialogKey(Date.now());
        switchRef.current?.setValue(false);
        onClose();
    }, [onClose]);

    const handleCreateClick = useCallback(() => {
        if (!user) return;

        actionConsumer({
            consumer: () => {
                return createTimeEntry({
                    comment: values.comment,
                    projectId: values.projectId ?? null,
                    taskId: values.taskId ?? null,
                    start: values.start,
                    end: values.end,
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
                    title: "Time Entry created successfully!",
                    icon: <AlarmClockPlus/>,
                });

                if (values.taskId != null) {
                    const task = getTaskFromId(user, values.taskId);
                    if (task.task) {
                        const taskUpdate: Partial<Task> = {
                            bookedDuration: task?.task?.bookedDuration ? task?.task?.bookedDuration + getDuration() : null,
                            updatedBy: user.id,
                            updatedAt: new Date(),
                            createdBy: task?.task?.createdBy.id,
                        }
                        updateTask(values.taskId, taskUpdate);
                    }
                }
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
    }, [user, actionConsumer, handleCloseClick, values, addToast, getDuration]);

    const projectSelect = useMemo(() => (
        <Combobox
            buttonTitle={"Project"}
            icon={<BookCopy size={16} />}
            size={"medium"}
            searchField={true}
            getItemTitle={(item) => (item as Project).name}
            onValueChange={(value) => setValues((prevValues) => ({ ...prevValues, projectId: (value as Project).id || null }))}
        >
            {projects?.map((project) =>
                <ComboboxItem key={project.id} title={project.name} value={project}/>
            )}
        </Combobox>
    ), [projects]);

    const taskSelect = useMemo(() => (
        <Combobox
            buttonTitle={"Task"}
            icon={<ClipboardList size={16} />}
            size={"medium"}
            searchField={true}
            getItemTitle={(item) => (item as Task).name}
            onValueChange={(value) => setValues((prevValues) => ({ ...prevValues, taskId: (value as Task).id || null }))}
        >
            {tasks.map((task) =>
                <ComboboxItem key={task.task.id} title={task.task.name} value={task}/>
            )}
        </Combobox>
    ), [tasks]);

    const handleDateChange = useCallback((date: Date | null) => {
        setValues(prevValues => ({
            ...prevValues,
            start: moment(date).hour(moment(prevValues.start).hour()).minute(moment(prevValues.start).minute()).toDate(),
            end: moment(date).hour(moment(prevValues.end).hour()).minute(moment(prevValues.end).minute()).toDate()
        }));
    }, []);

    const handleTimeChange = useCallback((field: 'start' | 'end', time: string) => {
        setValues(prevValues => ({
            ...prevValues,
            [field]: moment(prevValues[field]).hour(parseInt(time.split(':')[0])).minute(parseInt(time.split(':')[1])).toDate()
        }));
    }, []);

    if (!dialogRef || user === undefined) return null;

    return (
        <Dialog width={600}
                onClose={handleCloseClick}
                onSubmit={handleCreateClick}
                fields={fields}
                ref={dialogRef}
                key={dialogKey}
        >
            <DialogHeader title={"New entry"}/>
            <DialogContent>
                <Textarea placeholder={"Comment"}
                          className={"h-12 px-1 w-full bg-zinc-100 dark:bg-black placeholder-zinc-400 dark:placeholder-marcador focus:text-zinc-800 dark:focus:text-white"}
                          spellCheck={false}
                          onChange={(e) => setValues((prevValues) => ({...prevValues, comment: e.target.value}))}
                          value={values.comment ?? ""}
                />
                <div className={"flex flex-row items-center space-x-2 py-2"}>
                    {projectSelect}
                    {taskSelect}
                </div>

                <div className={"flex flex-row items-center space-x-2 pb-2"}>
                    <DatePicker
                        text={"Date"}
                        preSelectedValue={new Date()}
                        closeButton={false}
                        dayFormat={"long"}
                        className={"z-40"}
                        onValueChange={handleDateChange}
                    />
                    <Combobox
                        buttonTitle={"From"}
                        preSelectedValue={moment(values.start).format('HH:mm')}
                        icon={<Clock2 size={16}/>}
                        size={"medium"}
                        searchField={true}
                        getItemTitle={(item) => item as string}
                        onValueChange={(value) => handleTimeChange('start', value as string)}
                    >
                        {times.map((time) =>
                            <ComboboxItem key={time} title={time} value={time}/>
                        )}
                    </Combobox>
                    <Combobox
                        buttonTitle={"To"}
                        preSelectedValue={moment(values.end).format('HH:mm')}
                        icon={<Clock8 size={16}/>}
                        size={"medium"}
                        searchField={true}
                        getItemTitle={(item) => item as string}
                        onValueChange={(value) => handleTimeChange('end', value as string)}
                    >
                        {times.map((time) =>
                            <ComboboxItem key={time} title={time} value={time}/>
                        )}
                    </Combobox>
                </div>
            </DialogContent>
            <DialogFooter saveButtonTitle={"Create"}>
                <div className={"flex flex-row items-center space-x-2 text-zinc-700 dark:text-gray text-xs mr-16"}>
                    <span>{"Create more"}</span>
                    <Switch ref={switchRef}/>
                </div>
            </DialogFooter>
        </Dialog>
);
})
CreateTimeEntryDialog.displayName = "CreateTimeEntryDialog";
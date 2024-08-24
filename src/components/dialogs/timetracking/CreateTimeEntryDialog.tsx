"use client";

import React, {forwardRef, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {AlarmClockPlus, BookCopy, CircleAlert, ClipboardList, Clock2, Clock8} from "lucide-react";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import {Switch, SwitchRef} from "@marraph/daisy/components/switch/Switch";
import {mutateRef} from "@/utils/mutateRef";
import moment from "moment";
import {DatePicker} from "@marraph/daisy/components/datepicker/DatePicker";
import {useToast} from "griller/src/component/toaster";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";
import {TimeEntry} from "@/action/timeEntry";
import { useUser } from "@/context/UserContext";
import {getProjectsFromUser, Project} from "@/action/projects";
import {getTasksFromProject, getTasksFromUser, Task} from "@/action/task";
import { useTime } from "@/context/TimeContext";
import {useTasks} from "@/context/TaskContext";

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
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [valid, setValid] = useState<boolean>(false);
    const [dialogKey, setDialogKey] = useState(Date.now());
    const { user } = useUser();
    const { tasks:userTasks, actions:taskActions } = useTasks();
    const { entries, actions: entryActions } = useTime();
    const { addToast } = useToast();

    useEffect(() => {
        if (!user) return;
        
        getProjectsFromUser(user.id).then(result => {
            if (result.success) setProjects(result.data);
        });
        
        if (values.projectId) {
            getTasksFromProject(values.projectId).then(result => {
                if (result.success) setTasks(result.data);
            })
        } else {
            getTasksFromUser(user.id).then(result => {
                if (result.success) setTasks(result.data);
            })
        }
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

    const validateInput = useCallback(() => {
        if (values.comment?.trim() === "" && !values.projectId && !values.taskId) {
            setValid(false);
            return;
        }

        let start = moment(values.start).format('HH:mm');
        let end = moment(values.end).format('HH:mm');

        if (!times.includes(start)) {
            setValid(false);
            return;
        }
        if (!times.includes(end)) {
            setValid(false);
            return;
        }
        if (times.indexOf(start) >= times.indexOf(end)) {
            setValid(false);
            return;
        }

        setValid(true);
        return;
    }, [times, values]);

    useEffect(() => {
        validateInput();
    }, [validateInput, values]);

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
        setValid(false);
        setDialogKey(Date.now());
        switchRef.current?.setValue(false);
        onClose();
    }, [onClose]);

    const handleCreateClick = useCallback(async () => {
        if (!user) return;

        const result = await entryActions.createTimeEntry({
            comment: values.comment,
            projectId: values.projectId ?? null,
            taskId: values.taskId ?? null,
            start: values.start,
            end: values.end,
            createdBy: user.id,
            createdAt: new Date(),
            updatedBy: user.id,
            updatedAt: new Date(),
        });

        if (values.taskId != null) {
            const task = userTasks.find(t => t.task?.id === values.taskId);
            if (task) {
                const taskUpdate: Partial<Task> = {
                    bookedDuration: task?.task?.bookedDuration ? task?.task?.bookedDuration + getDuration() : null,
                    updatedBy: user.id,
                    updatedAt: new Date(),
                }
                await taskActions.updateTask(values.taskId, {...task.task, ...taskUpdate});
            }
        }
        
        if (result.success) {
            addToast({
                title: "Time Entry created successfully!",
                icon: <AlarmClockPlus/>,
            });
        } else {
            addToast({
                title: "An error occurred!",
                secondTitle: "The entry could not be created. Please try again later.",
                icon: <CircleAlert/>
            });
        }

        handleCloseClick();
    }, [user, entryActions, values.comment, values.projectId, values.taskId, values.start, values.end, handleCloseClick, userTasks, getDuration, taskActions, addToast]);

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
                <ComboboxItem key={task.id} title={task.name} value={task}/>
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
            <DialogFooter saveButtonTitle={"Create"}
                          onClick={handleCreateClick}
                          disabledButton={!valid}
            >
                <div className={"flex flex-row items-center space-x-2 text-zinc-700 dark:text-gray text-xs mr-16"}>
                    <span>{"Create more"}</span>
                    <Switch ref={switchRef}/>
                </div>
            </DialogFooter>
        </Dialog>
);
})
CreateTimeEntryDialog.displayName = "CreateTimeEntryDialog";
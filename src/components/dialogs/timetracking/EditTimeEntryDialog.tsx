"use client";

import React, {forwardRef, useCallback, useEffect, useMemo, useState} from "react";
import {BookCopy, CircleAlert, ClipboardList, Clock2, Clock8, Save,} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {useUser} from "@/context/UserContext";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import {mutateRef} from "@/utils/mutateRef";
import moment from "moment/moment";
import {DatePicker} from "@marraph/daisy/components/datepicker/DatePicker";
import {useToast} from "griller/src/component/toaster";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";
import {TimeEntry} from "@/action/timeEntry";
import {getProjectsFromUser, Project} from "@/action/projects";
import {getTasksFromProject, getTasksFromUser, Task} from "@/action/task";
import {useTime} from "@/context/TimeContext";
import {useTasks} from "@/context/TaskContext";

type EditProps = Pick<TimeEntry, "comment" | "projectId" | "taskId" | "start" | "end">;

export const EditTimeEntryDialog = forwardRef<DialogRef, { timeEntry: TimeEntry }>(({ timeEntry }, ref) => {
    const dialogRef = mutateRef(ref);
    const [values, setValues] = useState<EditProps>({
        comment: timeEntry.comment ?? "",
        projectId: timeEntry.projectId ?? null,
        taskId: timeEntry.taskId ?? null,
        start: timeEntry.start,
        end: timeEntry.end
    });
    const initialValues = values;
    const [dialogKey, setDialogKey] = useState(Date.now());
    const [valid, setValid] = useState<boolean>(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const { user } = useUser();
    const { tasks:userTasks, actions:taskActions } = useTasks();
    const { actions:timeActions } = useTime();
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
    }, [times, values]);

    useEffect(() => {
        validateInput();
    }, [validateInput, values]);

    const handleCloseClick = useCallback(() => {
        setValid(true);
        setValues(initialValues);
        setDialogKey(Date.now());
    }, [initialValues]);

    const handleEditClick = useCallback(async () => {
        if (!user) return;

        const currentDuration = moment.duration(moment(values.start).diff(moment(values.end))).asHours();
        const oldDuration = moment.duration(moment(timeEntry.start).diff(moment(timeEntry.end))).asHours();
        const durationDifference = currentDuration - oldDuration;

        //update entry
        const entry: Omit<TimeEntry, "id" | "createdBy" | "createdAt"> = {
            comment: values.comment,
            projectId: values.projectId ?? null,
            taskId: values.taskId ?? null,
            start: values.start,
            end: values.end,
            updatedBy: user.id,
            updatedAt: new Date(),
        }
        
        const result = await timeActions.updateTimeEntry(timeEntry.id, { ...timeEntry, ...entry });

        //update task duration
        if (timeEntry.taskId && values.taskId != timeEntry.taskId) {
            const task = userTasks.find(t => t.task?.id === timeEntry.taskId);
            
            if (task?.task?.duration) {
                const oldTask: Partial<Task> = {
                    duration: Number(task.task.duration + durationDifference) ?? null,
                    updatedBy: user.id,
                    updatedAt: new Date()
                }

                await taskActions.updateTask(timeEntry.taskId, { ...task.task, ...oldTask });
            }
        }
        
        if (result.success) {
            addToast({
                title: "Saved changes",
                secondTitle: "You successfully saved your entry changes.",
                icon: <Save/>,
            });
        } else {
            addToast({
                title: "An error occurred!",
                secondTitle: "The entry could not be saved. Please try again later.",
                icon: <CircleAlert/>
            });
        }
        
        handleCloseClick();
    }, [user, values.start, values.end, values.comment, values.projectId, values.taskId, timeEntry, timeActions, handleCloseClick, userTasks, taskActions, addToast]);

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

    const projectSelect = useMemo(() => (
        <Combobox buttonTitle={"Project"}
                  label={"Project"}
                  preSelectedValue={projects.find(p => values.projectId = p.id)?.name}
                  icon={<BookCopy size={16}/>}
                  size={"medium"}
                  searchField={true}
                  getItemTitle={(item) => (item as Project).name}
                  onValueChange={(value) => setValues((prevValues) => ({ ...prevValues, projectId: (value as Project).id || null }))}
        >
            {projects.map((project) => ( project &&
                <ComboboxItem key={project.id} title={project.name} value={project}/>
            ))}
        </Combobox>
    ), [projects, values]);

    const taskSelect = useMemo(() => (
        <Combobox buttonTitle={"Task"}
                  label={"Task"}
                  preSelectedValue={tasks.find(t => values.taskId = t.id)?.name}
                  icon={<ClipboardList size={16}/>}
                  size={"medium"}
                  searchField={true}
                  getItemTitle={(item) => (item as Task).name}
                  onValueChange={(value) => setValues((prevValues) => ({ ...prevValues, taskId: (value as Task).id  || null }))}
        >
            {tasks.map((task) => (
                <ComboboxItem key={task.id} title={task.name} value={task}/>
            ))}
        </Combobox>
    ), [tasks, values]);

    if (!dialogRef || user === undefined) return null;

    return (
        <Dialog width={800}
                onClose={handleCloseClick}
                ref={dialogRef}
                key={dialogKey}
        >
            <DialogHeader title={"Edit entry"}/>
            <DialogContent>
                <Textarea placeholder={"Comment"}
                          label={"Comment"}
                          className={"h-12 px-1 w-full bg-zinc-200 dark:bg-black placeholder-zinc-400 dark:placeholder-marcador focus:text-gray"}
                          spellCheck={false}
                          onChange={(e) => setValues((prevValues) => ({ ...prevValues, comment: e.target.value }))}
                          value={values.comment ?? ""}
                />
                <div className={"flex flex-row items-center space-x-2 py-2"}>
                    {projectSelect}
                    {taskSelect}
                </div>
                <div className={"flex flex-row items-center space-x-2 pb-2"}>
                    <DatePicker text={"Date"}
                                preSelectedValue={moment(timeEntry.start).toDate()}
                                closeButton={false}
                                dayFormat={"long"}
                                label={"Date"}
                                className={"z-40"}
                                onValueChange={handleDateChange}
                    />
                    <Combobox buttonTitle={"From"}
                              preSelectedValue={moment(values.start).format('HH:mm')}
                              icon={<Clock2 size={16}/>}
                              label={"Date From"}
                              size={"medium"}
                              searchField={true}
                              getItemTitle={(item) => item as string}
                              onValueChange={(value) => handleTimeChange('start', value as string)}
                    >
                        {times.map((time) => (
                            <ComboboxItem key={time} title={time} value={time}/>
                        ))}
                    </Combobox>
                    <Combobox buttonTitle={"To"}
                              preSelectedValue={moment(values.end).format('HH:mm')}
                              icon={<Clock8 size={16}/>}
                              label={"Date To"}
                              size={"medium"}
                              searchField={true}
                              getItemTitle={(item) => item as string}
                              onValueChange={(value) => handleTimeChange('end', value as string)}
                    >
                        {times.map((time) => (
                            <ComboboxItem key={time} title={time} value={time}/>
                        ))}
                    </Combobox>
                </div>

            </DialogContent>
            <DialogFooter saveButtonTitle={"Save changes"}
                          onClick={handleEditClick}
                          disabledButton={!valid}
            />
        </Dialog>
    );
});
EditTimeEntryDialog.displayName = "EditTimeEntryDialog";
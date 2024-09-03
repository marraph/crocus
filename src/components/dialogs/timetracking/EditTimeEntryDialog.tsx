"use client";

import React, {forwardRef, useCallback, useEffect, useMemo, useState} from "react";
import {AlarmClockPlus, BookCopy, CircleAlert, CircleX, ClipboardList, Clock2, Clock8, Save,} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {useUser} from "@/context/UserContext";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import {mutateRef} from "@/utils/mutateRef";
import moment from "moment/moment";
import {DatePicker} from "@marraph/daisy/components/datepicker/DatePicker";
import {useToast} from "griller/src/component/toaster";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";
import {createTimeEntry, TimeEntry, updateTimeEntry} from "@/action/timeEntry";
import {
    ComplexTask,
    createAbsenceInCompletedUser,
    getProjectsFromUser, getTaskFromId,
    getTasksFromProjectId,
    getTasksFromUser, updateTimeEntryInCompletedUser
} from "@/utils/object-helpers";
import {ActionConsumerType, CompletedProject, CompletedUser} from "@/types/types";
import {Absence} from "@/action/absence";
import {Task, updateTask} from "@/action/task";

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
    const [projects, setProjects] = useState<CompletedProject[]>([]);
    const [tasks, setTasks] = useState<ComplexTask[]>([]);
    const { user, loading, error, actionConsumer } = useUser();
    const { addToast } = useToast();

    const fields = {};

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

    const handleCloseClick = useCallback(() => {
        setValues(initialValues);
        setDialogKey(Date.now());
    }, [initialValues]);

    const handleEditClick = useCallback(() => {
        if (!user) return;
        
        const currentDuration = moment.duration(moment(values.start).diff(moment(values.end))).asHours();
        const oldDuration = moment.duration(moment(timeEntry.start).diff(moment(timeEntry.end))).asHours();
        const durationDifference = currentDuration - oldDuration;

        const entry: Omit<TimeEntry, "id" | "createdBy" | "createdAt"> = {
            comment: values.comment,
            projectId: values.projectId ?? null,
            taskId: values.taskId ?? null,
            start: values.start,
            end: values.end,
            updatedAt: new Date(),
        }
        
        actionConsumer({
            consumer: () => {
                return updateTimeEntry(timeEntry.id, { ...timeEntry, ...entry });
            },
            handler: (currentUser: CompletedUser, input: ActionConsumerType) => {
                return updateTimeEntryInCompletedUser(currentUser, timeEntry.id, input as TimeEntry);
            },
            onSuccess: () => {
                addToast({
                    title: "Saved changes",
                    secondTitle: "You successfully saved your entry changes.",
                    icon: <Save/>,
                });

                //update task duration
                if (timeEntry.taskId && values.taskId != timeEntry.taskId) {
                    const task = getTaskFromId(user, timeEntry.taskId);

                    if (task?.task?.duration) {
                        const oldTask: Partial<Task> = {
                            duration: Number(task.task.duration + durationDifference) ?? null,
                            updatedBy: user.id,
                            updatedAt: new Date()
                        }

                        updateTask(timeEntry.taskId, { ...oldTask });
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
    }, [user, values, timeEntry, actionConsumer, handleCloseClick, addToast]);

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
                  getItemTitle={(item) => (item as CompletedProject).name}
                  onValueChange={(value) => setValues((prevValues) => ({ ...prevValues, projectId: (value as CompletedProject).id || null }))}
        >
            {projects.map((project) => ( project &&
                <ComboboxItem key={project.id} title={project.name} value={project}/>
            ))}
        </Combobox>
    ), [projects, values]);

    const taskSelect = useMemo(() => (
        <Combobox buttonTitle={"Task"}
                  label={"Task"}
                  preSelectedValue={tasks.find(t => values.taskId = t.task.id)?.task.name}
                  icon={<ClipboardList size={16}/>}
                  size={"medium"}
                  searchField={true}
                  getItemTitle={(item) => (item as Task).name}
                  onValueChange={(value) => setValues((prevValues) => ({ ...prevValues, taskId: (value as Task).id  || null }))}
        >
            {tasks.map((task) => (
                <ComboboxItem key={task.task.id} title={task.task.name} value={task}/>
            ))}
        </Combobox>
    ), [tasks, values]);

    if (!dialogRef || user === undefined) return null;

    return (
        <Dialog width={800}
                onClose={handleCloseClick}
                onSubmit={handleEditClick}
                fields={fields}
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
            <DialogFooter saveButtonTitle={"Save changes"}/>
        </Dialog>
    );
});
EditTimeEntryDialog.displayName = "EditTimeEntryDialog";
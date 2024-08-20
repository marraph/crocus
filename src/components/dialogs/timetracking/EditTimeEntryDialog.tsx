"use client";

import React, {ChangeEvent, forwardRef, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {BookCopy, ClipboardList, Clock2, Clock8, Save,} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Priority, Project, State, Task, TimeEntry} from "@/types/types";
import {useUser} from "@/context/UserContext";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import {mutateRef} from "@/utils/mutateRef";
import {SearchSelect, SearchSelectItem} from "@marraph/daisy/components/searchselect/SearchSelect";
import {getAllProjects, getAllTasks, getProjectFromTask, getTasksFromProject, getTopicItem} from "@/utils/getTypes";
import {updateTimEntry} from "@/service/hooks/timeentryHook";
import moment from "moment/moment";
import {DatePicker} from "@marraph/daisy/components/datepicker/DatePicker";
import {useToast} from "griller/src/component/toaster";
import {updateTask} from "@/service/hooks/taskHook";

type InitialValues = {
    comment: string,
    project: Project | null,
    task: Task | null,
    date: Date,
    timeFrom: string,
    timeTo: string,
}

type EditProps = Pick<TimeEntry, "comment" | "project" | "task" | "startDate" | "endDate">;

export const EditTimeEntryDialog = forwardRef<DialogRef, { timeEntry: TimeEntry }>(({ timeEntry }, ref) => {
    const dialogRef = mutateRef(ref);
    const [values, setValues] = useState<EditProps>({
        comment: timeEntry.comment ?? "",
        project: timeEntry.project ?? null,
        task: timeEntry.task ?? null,
        startDate: timeEntry.startDate,
        endDate: timeEntry.endDate
    });
    const initialValues = values;
    const [dialogKey, setDialogKey] = useState(Date.now());
    const [valid, setValid] = useState<boolean>(true);
    const {data:user, isLoading:userLoading, error:userError} = useUser();
    const {addToast} = useToast();

    const tasks = useMemo(() => !user ? [] : values.project ? getTasksFromProject(user, values.project) : getAllTasks(user), [user, values.project]);
    const projects = useMemo(() => !user ? [] : values.task ? [getProjectFromTask(user, values.task) as Project] : getAllProjects(user), [user, values.task]);
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
        let start = moment(values.startDate).format('HH:mm');
        let end = moment(values.endDate).format('HH:mm');

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

    const handleEditClick = useCallback(() => {
        if (!user) return;

        const currentDuration = moment.duration(moment(values.startDate).diff(moment(values.endDate))).asHours();
        const oldDuration = moment.duration(moment(timeEntry.startDate).diff(moment(timeEntry.endDate))).asHours();
        const durationDifference = currentDuration - oldDuration;

        //update entry
        const entry: Omit<TimeEntry, "id" | "createdBy" | "createdDate"> = {
            comment: values.comment,
            project: values.project ?? null,
            task: values.task ?? null,
            startDate: values.startDate,
            endDate: values.endDate,
            lastModifiedBy: { id: user.id, name: user.name, email: user.email },
            lastModifiedDate: new Date(),
        }
        
        const { data, isLoading, error } = updateTimEntry(timeEntry.id, { ...timeEntry, ...entry });

        //update task duration
        if (timeEntry.task && timeEntry.task.duration && values.task != timeEntry.task) {
            const oldTask: Partial<Task> = {
                duration: Number(timeEntry.task.duration + durationDifference) ?? null,
                lastModifiedBy: { id: user.id, name: user.name, email: user.email },
                lastModifiedDate: new Date(),
            }
            
            const { data, isLoading, error } = updateTask(timeEntry.task.id, { ...timeEntry.task, ...oldTask });
        }

        addToast({
            title: "Saved changes",
            secondTitle: "You successfully saved your entry changes.",
            icon: <Save/>,
        });
        
        handleCloseClick();
    }, [user, values.startDate, values.endDate, values.comment, values.project, values.task, timeEntry, addToast, handleCloseClick]);

    const handleDateChange = useCallback((date: Date | null) => {
        setValues(prevValues => ({
            ...prevValues,
            startDate: moment(date).hour(moment(prevValues.startDate).hour()).minute(moment(prevValues.startDate).minute()).toDate(),
            endDate: moment(date).hour(moment(prevValues.endDate).hour()).minute(moment(prevValues.endDate).minute()).toDate()
        }));
    }, []);

    const handleTimeChange = useCallback((field: 'startDate' | 'endDate', time: string) => {
        setValues(prevValues => ({
            ...prevValues,
            [field]: moment(prevValues[field]).hour(parseInt(time.split(':')[0])).minute(parseInt(time.split(':')[1])).toDate()
        }));
    }, []);

    const projectSelect = useMemo(() => (
        <SearchSelect buttonTitle={"Project"}
                      label={"Project"}
                      preSelectedValue={values?.project?.name}
                      icon={<BookCopy size={16}/>}
                      size={"medium"}
                      getItemTitle={(item) => (item as Project).name}
                      onValueChange={(value) => setValues((prevValues) => ({ ...prevValues, project: value as Project || null }))}
        >
            {projects.map((project) => ( project &&
                <SearchSelectItem key={project.id} title={project.name} value={project}/>
            ))}
        </SearchSelect>
    ), [projects, values?.project?.name]);

    const taskSelect = useMemo(() => (
        <SearchSelect buttonTitle={"Task"}
                      label={"Task"}
                      preSelectedValue={values.task?.name}
                      icon={<ClipboardList size={16}/>}
                      size={"medium"}
                      getItemTitle={(item) => (item as Task).name}
                      onValueChange={(value) => setValues((prevValues) => ({ ...prevValues, task: value as Task || null }))}
        >
            {tasks.map((task) => (
                <SearchSelectItem key={task.id} title={task.name} value={task}/>
            ))}
        </SearchSelect>
    ), [tasks, values.task?.name]);

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
                                preSelectedValue={new Date(timeEntry.startDate)}
                                closeButton={false}
                                dayFormat={"long"}
                                label={"Date"}
                                className={"z-40"}
                                onValueChange={handleDateChange}
                    />
                    <SearchSelect buttonTitle={"From"}
                                  preSelectedValue={moment(values.startDate).format('HH:mm')}
                                  icon={<Clock2 size={16}/>}
                                  label={"Date From"}
                                  size={"medium"}
                                  getItemTitle={(item) => item as string}
                                  onValueChange={(value) => handleTimeChange('startDate', value as string)}
                    >
                        {times.map((time) => (
                            <SearchSelectItem key={time} title={time} value={time}/>
                        ))}
                    </SearchSelect>
                    <SearchSelect buttonTitle={"To"}
                                  preSelectedValue={moment(values.endDate).format('HH:mm')}
                                  icon={<Clock8 size={16}/>}
                                  label={"Date To"}
                                  size={"medium"}
                                  getItemTitle={(item) => item as string}
                                  onValueChange={(value) => handleTimeChange('endDate', value as string)}
                    >
                        {times.map((time) => (
                            <SearchSelectItem key={time} title={time} value={time}/>
                        ))}
                    </SearchSelect>
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
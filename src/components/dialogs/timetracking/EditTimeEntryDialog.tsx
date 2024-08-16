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

export const EditTimeEntryDialog = forwardRef<DialogRef, { timeEntry: TimeEntry }>(({ timeEntry }, ref) => {
    const dialogRef = mutateRef(ref);

    const initialValues: InitialValues = useMemo(() => ({
        comment: timeEntry.comment ?? "",
        project: timeEntry.project ?? null,
        task: timeEntry.task ?? null,
        date: timeEntry.startDate,
        timeFrom: moment(timeEntry.startDate).format('HH:mm'),
        timeTo: moment(timeEntry.endDate).format('HH:mm'),
    }), [timeEntry]);

    const [values, setValues] = useState(initialValues);
    const [dialogKey, setDialogKey] = useState(Date.now());
    const [valid, setValid] = useState<boolean>(true);
    const {data:user, isLoading:userLoading, error:userError} = useUser();
    const {addToast} = useToast();

    const tasks = useMemo(() => {
        if (!user) return [];
        if (values.project) return getTasksFromProject(user, values.project);
        else return getAllTasks(user);
    }, [user, values.project]);

    const projects = useMemo(() => {
        if (!user) return [];
        if (values.task) {
            const projectArray = [];
            projectArray.push(getProjectFromTask(user, values.task) ?? null);
            return projectArray;
        }
        else return getAllProjects(user);
    }, [user, values.task]);

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
        if (values === initialValues) {
            setValid(false);
            return;
        }
        
        if (values.comment.trim() === "" && !values.project && !values.task) {
            setValid(false);
            return;
        }

        if (!times.includes(values.timeFrom as string) || !times.includes(values.timeTo as string) ||
            times.indexOf(values.timeFrom as string) >= times.indexOf(values.timeTo as string)) {
            setValid(false);
            return;
        }
        setValid(true);
    }, [initialValues, times, values]);

    useEffect(() => {
        validateInput();
    }, [validateInput, values]);

    const handleEditClick = useCallback(() => {
        if (!user) return;

        const currentDuration = moment.duration(moment(values.timeFrom).diff(moment(values.timeTo))).asHours();
        const oldDuration = moment.duration(moment(timeEntry.startDate).diff(moment(timeEntry.endDate))).asHours();
        const durationDifference = currentDuration - oldDuration;

        //update entry
        const entry: TimeEntry = {
            id: timeEntry.id,
            comment: values.comment,
            project: values.project ?? null,
            task: values.task ?? null,
            startDate: moment(values.date).add(values.timeFrom).toDate(),
            endDate: moment(values.date).add(values.timeTo).toDate(),
            createdBy: timeEntry.createdBy,
            createdDate: timeEntry.createdDate,
            lastModifiedBy: { id: user.id, name: user.name, email: user.email },
            lastModifiedDate: new Date(),
        }
        const { data, isLoading, error } = updateTimEntry(timeEntry.id, entry);

        //update task duration
        if (timeEntry.task && timeEntry.task.duration && values.task != timeEntry.task) {
            const oldTask: Task = {
                id: timeEntry.task.id,
                name: timeEntry.task.name,
                description: timeEntry.task.description,
                topic: getTopicItem(user, timeEntry.task.topic?.title as string) ?? null,
                status: timeEntry.task.status as State ?? null,
                priority: timeEntry.task.priority as Priority ?? null,
                deadline: timeEntry.task.deadline ?? null,
                isArchived: false,
                duration: Number(timeEntry.task.duration + durationDifference) ?? null,
                bookedDuration: timeEntry.task.bookedDuration,
                createdBy: timeEntry.task.createdBy,
                createdDate: timeEntry.task.createdDate,
                lastModifiedBy: { id: user.id, name: user.name, email: user.email },
                lastModifiedDate: new Date(),
            }
            const { data, isLoading, error } = updateTask(timeEntry.task.id, oldTask);
        }

        addToast({
            title: "Saved changes",
            secondTitle: "You successfully saved your entry changes.",
            icon: <Save/>,
        });
    }, [user, values.timeFrom, values.timeTo, values.comment, values.project, values.task, values.date, timeEntry.startDate, timeEntry.endDate, timeEntry.id, timeEntry.createdBy, timeEntry.createdDate, timeEntry.task, addToast]);

    const handleCloseClick = useCallback(() => {
        setValid(true);
        setValues(initialValues);
        setDialogKey(Date.now());
    }, [initialValues]);

    const handleInputChange = useCallback((field: keyof InitialValues, setValues: React.Dispatch<React.SetStateAction<InitialValues>>) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setValues((prevValues) => ({
            ...prevValues,
            [field]: e.target.value
        }));
    }, []);

    const projectSelect = useMemo(() => (
        <SearchSelect buttonTitle={"Project"}
                      label={"Project"}
                      preSelectedValue={values?.project?.name}
                      icon={<BookCopy size={16}/>}
                      size={"medium"}
                      onValueChange={(value) =>
                          setValues((prevValues) => ({ ...prevValues, project: projects.find(item => item?.name === value) ?? null }))}
        >
            {projects.map((project) => ( project &&
                <SearchSelectItem key={project.id} title={project.name}/>
            ))}
        </SearchSelect>
    ), [projects, values?.project?.name]);

    const taskSelect = useMemo(() => (
        <SearchSelect buttonTitle={"Task"}
                      label={"Task"}
                      preSelectedValue={values.task?.name}
                      icon={<ClipboardList size={16}/>}
                      size={"medium"}
                      onValueChange={(value) =>
                          setValues((prevValues) => ({ ...prevValues, task: tasks.find(item => item.name === value) ?? null }))}
        >
            {tasks.map((task) => (
                <SearchSelectItem key={task.id} title={task.name}/>
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
                          className={"h-12 px-1 w-full bg-black placeholder-placeholder focus:text-gray"}
                          spellCheck={false}
                          onChange={handleInputChange("comment", setValues)}
                          value={values.comment}
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
                                onValueChange={(value) =>
                                    setValues((prevValues) => ({ ...prevValues, date: value ?? new Date() }))}
                    />
                    <SearchSelect buttonTitle={"From"}
                                  preSelectedValue={values.timeFrom}
                                  icon={<Clock2 size={16}/>}
                                  label={"Date From"}
                                  size={"medium"}
                                  onValueChange={(value) =>
                                      setValues((prevValues) => ({ ...prevValues, timeFrom: value }))}
                    >
                        {times.map((time) => (
                            <SearchSelectItem key={time} title={time}/>
                        ))}
                    </SearchSelect>
                    <SearchSelect buttonTitle={"To"}
                                  preSelectedValue={values.timeTo}
                                  icon={<Clock8 size={16}/>}
                                  label={"Date To"}
                                  size={"medium"}
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
                          onClick={handleEditClick}
                          disabledButton={!valid}
            />
        </Dialog>
    );
});
EditTimeEntryDialog.displayName = "EditTimeEntryDialog";
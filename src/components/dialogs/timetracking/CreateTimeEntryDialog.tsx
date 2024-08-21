"use client";

import React, {forwardRef, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {AlarmClockPlus, BookCopy, ClipboardList, Clock2, Clock8} from "lucide-react";
import {useUser} from "@/context/UserContext";
import {Project, Task, TimeEntry} from "@/types/types";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import {Switch, SwitchRef} from "@marraph/daisy/components/switch/Switch";
import {getAllProjects, getAllTasks, getProjectFromTask, getTasksFromProject} from "@/utils/getTypes";
import {createTimeEntry} from "@/service/hooks/timeentryHook";
import {mutateRef} from "@/utils/mutateRef";
import {updateTask} from "@/service/hooks/taskHook";
import moment from "moment";
import {DatePicker} from "@marraph/daisy/components/datepicker/DatePicker";
import {useToast} from "griller/src/component/toaster";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";

type CreateProps = Pick<TimeEntry, "comment" | "project" | "task" | "startDate" | "endDate">;

export const CreateTimeEntryDialog = forwardRef<DialogRef, { onClose: () => void }>(({onClose}, ref) => {
    const dialogRef = mutateRef(ref);
    const switchRef = useRef<SwitchRef>(null);

    const [values, setValues] = useState<CreateProps>({
        comment: "",
        project: null,
        task: null,
        startDate: moment().hour(9).minute(0).toDate(),
        endDate:  moment().hour(9).minute(0).toDate()
    });
    const [valid, setValid] = useState<boolean>(false);
    const [dialogKey, setDialogKey] = useState(Date.now());
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
        if (values.comment?.trim() === "" && !values.project && !values.task) {
            setValid(false);
            return;
        }

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
        return;
    }, [times, values]);

    useEffect(() => {
        validateInput();
    }, [validateInput, values]);

    const getDuration = useCallback(() => {
        return moment.duration(moment(values.startDate)
            .diff(moment(values.endDate)))
            .asHours();
    }, [values]);

    const handleCloseClick = useCallback(() => {
        setValues({comment: "", project: null, task: null, startDate: moment().hour(9).minute(0).toDate(), endDate:  moment().hour(9).minute(0).toDate()});
        setValid(false);
        setDialogKey(Date.now());
        switchRef.current?.setValue(false);
        onClose();
    }, [onClose]);

    const handleCreateClick = useCallback(() => {
        if (!user) return;
        
        const newEntry: TimeEntry = {
            id: 0,
            comment: values.comment,
            project: values.project ?? null,
            task: values.task ?? null,
            startDate: values.startDate,
            endDate: values.endDate,
            createdBy: {id: user.id, name: user.name, email: user.email},
            createdDate: new Date(),
            lastModifiedBy: {id: user.id, name: user.name, email: user.email},
            lastModifiedDate: new Date(),
        }
        const { data, isLoading, error } = createTimeEntry(newEntry);

        if (values.task != null) {
            const taskUpdate: Partial<Task> = {
                bookedDuration: values.task.bookedDuration + getDuration(),
                lastModifiedBy: {id: user.id, name: user.name, email: user.email},
                lastModifiedDate: new Date(),
            }
            const { data, isLoading, error } = updateTask(values.task.id, { ...values.task, ...taskUpdate });
        }

        handleCloseClick();
        addToast({
            title: "Time Entry created successfully!",
            icon: <AlarmClockPlus/>,
        })
    }, [user, values.comment, values.project, values.task, values.startDate, values.endDate, handleCloseClick, addToast, getDuration]);

    const projectSelect = useMemo(() => (
        <Combobox
            buttonTitle={"Project"}
            icon={<BookCopy size={16} />}
            size={"medium"}
            searchField={true}
            getItemTitle={(item) => (item as Project).name}
            onValueChange={(value) => setValues((prevValues) => ({ ...prevValues, project: value as Project || null }))}
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
            onValueChange={(value) => setValues((prevValues) => ({ ...prevValues, task: value as Task || null }))}
        >
            {tasks.map((task) =>
                <ComboboxItem key={task.id} title={task.name} value={task}/>
            )}
        </Combobox>
    ), [tasks]);

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
                        preSelectedValue={moment(values.startDate).format('HH:mm')}
                        icon={<Clock2 size={16}/>}
                        size={"medium"}
                        searchField={true}
                        getItemTitle={(item) => item as string}
                        onValueChange={(value) => handleTimeChange('startDate', value as string)}
                    >
                        {times.map((time) =>
                            <ComboboxItem key={time} title={time} value={time}/>
                        )}
                    </Combobox>
                    <Combobox
                        buttonTitle={"To"}
                        preSelectedValue={moment(values.endDate).format('HH:mm')}
                        icon={<Clock8 size={16}/>}
                        size={"medium"}
                        searchField={true}
                        getItemTitle={(item) => item as string}
                        onValueChange={(value) => handleTimeChange('endDate', value as string)}
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
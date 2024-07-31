"use client";

import React, {ChangeEvent, forwardRef, useEffect, useMemo, useRef, useState} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {AlarmClockPlus, BookCopy, ClipboardList, Clock2, Clock8} from "lucide-react";
import {useUser} from "@/context/UserContext";
import {Project, Task, TimeEntry} from "@/types/types";
import {SearchSelect, SearchSelectItem} from "@marraph/daisy/components/searchselect/SearchSelect";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import {SwitchRef} from "@marraph/daisy/components/switch/Switch";
import {getAllProjects, getAllTasks, getProjectFromTask, getTasksFromProject} from "@/utils/getTypes";
import {createTimeEntry} from "@/service/hooks/timeentryHook";
import {mutateRef} from "@/utils/mutateRef";
import {updateTask} from "@/service/hooks/taskHook";
import moment, {duration} from "moment";
import {DatePicker} from "@marraph/daisy/components/datepicker/DatePicker";
import {useToast} from "griller/src/component/toaster";

type InitialValues = {
    comment: string,
    project: Project | null,
    task: Task | null,
    date: Date,
    timeFrom: string,
    timeTo: string,
}

export const CreateTimeEntryDialog = forwardRef<DialogRef, React.DialogHTMLAttributes<HTMLDialogElement>>(({ className, ...props}, ref) => {
    const dialogRef = mutateRef(ref);
    const switchRef = useRef<SwitchRef>(null);

    const initialValues: InitialValues = {
        comment: "",
        project: null,
        task: null,
        date: new Date(),
        timeFrom: "",
        timeTo: "",
    }

    const [values, setValues] = useState(initialValues);
    const [valid, setValid] = useState<boolean>(false);
    const [dialogKey, setDialogKey] = useState(Date.now());
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
            projectArray.push(getProjectFromTask(user, values.task) as Project);
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

    useEffect(() => {
        validateInput();
    }, [values]);

    if (!dialogRef || user === undefined) return null;

    const validateInput = () => {
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
    }

    const getDuration = () => {
        const durationFrom = moment.duration(values.timeFrom);
        const durationTo = moment.duration(values.timeTo);
        const date = moment(values.date)

        const dateFrom = date.add(durationFrom);
        const dateTo = date.add(durationTo);

        return moment.duration(dateFrom.diff(dateTo)).asHours();
    }

    const createEntry = () => {
        const newEntry: TimeEntry = {
            id: 0,
            comment: values.comment,
            project: values.project ?? null,
            task: values.task ?? null,
            startDate: moment(values.date).add(values.timeFrom).toDate(),
            endDate: moment(values.date).add(values.timeTo).toDate(),
            createdBy: {id: user.id, name: user.name, email: user.email},
            createdDate: new Date(),
            lastModifiedBy: {id: user.id, name: user.name, email: user.email},
            lastModifiedDate: new Date(),
        }
        const { data, isLoading, error } = createTimeEntry(newEntry);

        if (values.task != null) {
            const taskUpdate: Task = {
                id: 0,
                name: values.task.name,
                description: values.task.description,
                topic: values.task.topic,
                status: values.task.status,
                priority: values.task.priority,
                deadline: values.task.deadline,
                isArchived: false,
                duration: values.task.duration,
                bookedDuration: values.task.bookedDuration + getDuration(),
                createdBy: values.task.createdBy,
                createdDate: values.task.createdDate,
                lastModifiedBy: {id: user.id, name: user.name, email: user.email},
                lastModifiedDate: new Date(),
            }
            const { data, isLoading, error } = updateTask(values.task.id, taskUpdate);
        }

        handleCloseClick();
        addToast({
            title: "Time Entry created successfully!",
            icon: <AlarmClockPlus/>,
        })
    }

    const handleCloseClick = () => {
        setValues(initialValues);
        setValid(false);
        setDialogKey(Date.now());
        switchRef.current?.setValue(false);
    }

    const handleInputChange = (field: keyof InitialValues, setValues: React.Dispatch<React.SetStateAction<InitialValues>>) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setValues((prevValues) => ({
            ...prevValues,
            [field]: e.target.value
        }));
    };

    return (
        <Dialog width={600}
                ref={dialogRef}
                key={dialogKey}
        >
            <DialogHeader title={"New entry"}
                          dialogRef={dialogRef}
                          onClose={handleCloseClick}
            />
            <DialogContent>
                <Textarea placeholder={"Comment"}
                          className={"h-12 px-1 w-full bg-black placeholder-marcador focus:text-gray"}
                          spellCheck={false}
                          onChange={handleInputChange("comment", setValues)}
                          value={values.comment}
                />
                <div className={"flex flex-row items-center space-x-2 py-2"}>
                    <SearchSelect buttonTitle={"Project"}
                                  icon={<BookCopy size={16}/>}
                                  size={"medium"}
                                  className={"z-50"}
                                  onValueChange={(value) =>
                                      setValues((prevValues) => ({ ...prevValues, project: projects.find(item => item.name === value) ?? null}))}
                    >
                        {projects?.map((project) => (
                            <SearchSelectItem key={project.id} title={project.name}/>
                        ))}
                    </SearchSelect>

                    <SearchSelect buttonTitle={"Task"}
                                  icon={<ClipboardList size={16}/>}
                                  size={"medium"}
                                  className={"z-50"}
                                    onValueChange={(value) =>
                                        setValues((prevValues) => ({ ...prevValues, task: tasks.find(item => item.name === value) ?? null}))}
                    >
                        {tasks.map((task) => (
                            <SearchSelectItem key={task.id} title={task.name}/>
                        ))}
                    </SearchSelect>
                </div>

                <div className={"flex flex-row items-center space-x-2 pb-2"}>
                    <DatePicker text={"Date"}
                                preSelectedValue={new Date()}
                                closeButton={false}
                                dayFormat={"long"}
                                className={"z-40"}
                                onValueChange={(value) =>
                                    setValues((prevValues) => ({ ...prevValues, date: value ?? new Date() }))}
                    />
                    <SearchSelect buttonTitle={"From"}
                                  preSelectedValue={"09:00"}
                                  icon={<Clock2 size={16}/>}
                                  size={"medium"}
                                  className={"z-40"}
                                  onValueChange={(value) =>
                                      setValues((prevValues) => ({ ...prevValues, timeFrom: value }))}
                    >
                        {times.map((time) => (
                            <SearchSelectItem key={time}
                                              title={time}
                            />
                        ))}
                    </SearchSelect>
                    <SearchSelect buttonTitle={"To"}
                                  preSelectedValue={"09:00"}
                                  icon={<Clock8 size={16}/>}
                                  size={"medium"}
                                  className={"z-40"}
                                  onValueChange={(value) =>
                                      setValues((prevValues) => ({ ...prevValues, timeTo: value }))}
                    >
                        {times.map((time) => (
                            <SearchSelectItem key={time}
                                              title={time}
                            />
                        ))}
                    </SearchSelect>
                </div>
            </DialogContent>
            <DialogFooter saveButtonTitle={"Create"}
                          cancelButton={true}
                          switchButton={true}
                          dialogRef={dialogRef}
                          onClose={handleCloseClick}
                          onClick={createEntry}
                          disabledButton={!valid}
            />
        </Dialog>
    );
})
CreateTimeEntryDialog.displayName = "CreateTimeEntryDialog";
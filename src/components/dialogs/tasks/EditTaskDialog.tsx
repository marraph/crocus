"use client";

import React, {ChangeEvent, forwardRef, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {BookCopy, CircleAlert, Hourglass, LineChart, Save, Tag, Users} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";
import {DatePicker} from "@marraph/daisy/components/datepicker/DatePicker";
import {Priority, Status, Task, TaskElement} from "@/types/types";
import {useUser} from "@/context/UserContext";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import {Input} from "@marraph/daisy/components/input/Input";
import {mutateRef} from "@/utils/mutateRef";
import {getAllTeams, getProjects, getTopicItem, getTopicsFromTeam} from "@/utils/getTypes";
import {updateTask} from "@/service/hooks/taskHook";
import {useToast} from "griller/src/component/toaster";


type InitialValues = {
    title: string;
    description: string | null;
    team: string | null;
    project: string | null;
    topic: string | null;
    status: string | null;
    priority: string | null;
    deadline: Date | null;
    duration: string | null;
}

export const EditTaskDialog = forwardRef<DialogRef, { taskElement: TaskElement }>(({ taskElement }, ref) => {
    const dialogRef = mutateRef(ref);

    const initialValues: InitialValues = {
        title: taskElement.name,
        description: taskElement.description ?? null,
        team: taskElement.team?.name ?? null,
        project: taskElement.project?.name ?? null,
        topic: taskElement.topic?.title ?? null,
        status: taskElement.status ?? null,
        priority: taskElement.priority ?? null,
        deadline: taskElement.deadline ?? null,
        duration: taskElement.duration?.toString() ?? null,
    }
    const [values, setValues] = useState(initialValues);
    const [team, setTeam] = useState<string | null>(taskElement.team?.name ?? null);
    const [valid, setValid] = useState(true);
    const [dialogKey, setDialogKey] = useState(Date.now());
    const { data:user, isLoading:userLoading, error:userError } = useUser();
    const { addToast } = useToast();

    const statuses = useMemo(() => ["PENDING", "PLANING", "STARTED", "TESTED", "FINISHED"], []);
    const priorities = useMemo(() => ["LOW", "MEDIUM", "HIGH"], []);
    const teams = useMemo(() => user ? getAllTeams(user) : [], [user]);
    const projects = useMemo(() => (user && team) ? getProjects(user, team) : [], [user, team]);
    const topics = useMemo(() => (user && team) ? getTopicsFromTeam(user, team) : [], [user, team]);

    useEffect(() => {
        validateInput();
    }, [values.title]);

    if (!dialogRef || user === undefined) return null;

    const handleEditClick = useCallback(() => {
        const task: Task = {
            id: taskElement.id,
            name: values.title,
            description: values.description,
            topic: getTopicItem(user, values.topic as string) ?? null,
            status: values.status as Status ?? null,
            priority: values.priority as Priority ?? null,
            deadline: values.deadline ?? null,
            isArchived: false,
            duration: Number(values.duration) ?? null,
            bookedDuration: taskElement.bookedDuration,
            createdBy: taskElement.createdBy,
            createdDate: taskElement.createdDate,
            lastModifiedBy: { id: user.id, name: user.name, email: user.email },
            lastModifiedDate: new Date(),
        };
        const { data, isLoading, error } = updateTask(taskElement.id, task);
        handleCloseClick();
        addToast({
            title: "Task saved",
            secondTitle: "You successfully saved your task changes.",
            icon: <Save/>
        });

    }, [values, taskElement]);

    const handleCloseClick = useCallback(() => {
        setDialogKey(Date.now());
        setValid(true);
        setValues(initialValues);
        setTeam(taskElement.team?.name ?? null);
    }, []);

    const validateInput = useCallback(() => {
        setValid(values.title.trim() !== "");
    }, [values.title]);

    const handleInputChange = useCallback((field: keyof InitialValues, setValues: React.Dispatch<React.SetStateAction<InitialValues>>) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setValues((prevValues) => ({
            ...prevValues,
            [field]: e.target.value
        }));
    }, []);

    const handleNumberInput = useCallback((e: React.KeyboardEvent) => {
        if (!/\d/.test(e.key) && e.key !== 'Backspace') {
            e.preventDefault();
        }
    }, []);


    const teamCombobox = useMemo(() => (
        <Combobox
            buttonTitle={"Team"}
            label={"Team"}
            icon={<Users size={16} className={"mr-2"} />}
            preSelectedValue={values.team}
            onValueChange={(value) => {
                setValues((prevValues) => ({
                    ...prevValues,
                    team: value,
                    project: null,
                    topic: null
                }));
                setTeam(value);
            }}
        >
            {teams.map((team) => (
                <ComboboxItem key={team} title={team} />
            ))}
        </Combobox>
    ), [values.team, teams]);

    const projectCombobox = useMemo(() => team && (
        <Combobox
            buttonTitle={"Project"}
            label={"Project"}
            key={`project-${team}`}
            icon={<BookCopy size={16} className={"mr-2"} />}
            preSelectedValue={values.project}
            onValueChange={(value) =>
                setValues((prevValues) => ({ ...prevValues, project: value }))}
        >
            {projects.map((project) => (
                <ComboboxItem key={project} title={project} />
            ))}
        </Combobox>
    ), [team, values.project, projects]);

    const topicCombobox = useMemo(() => team && (
        <Combobox
            buttonTitle={"Topic"}
            label={"Topic"}
            key={`topic-${team}`}
            icon={<Tag size={16} className={"mr-2"} />}
            preSelectedValue={values.topic}
            onValueChange={(value) =>
                setValues((prevValues) => ({ ...prevValues, topic: value }))}
        >
            {topics.map((topic) => (
                <ComboboxItem key={topic} title={topic} />
            ))}
        </Combobox>
    ), [team, values.topic, topics]);

    const statusCombobox = useMemo(() => (
        <Combobox
            buttonTitle={"Status"}
            label={"Status"}
            icon={<CircleAlert size={16} className={"mr-2"} />}
            preSelectedValue={values.status}
            onValueChange={(value) =>
                setValues((prevValues) => ({ ...prevValues, status: value }))}
        >
            {statuses.map((status) => (
                <ComboboxItem key={status} title={status} />
            ))}
        </Combobox>
    ), [values.status, statuses]);

    const priorityCombobox = useMemo(() => (
        <Combobox
            buttonTitle={"Priority"}
            label={"Priority"}
            icon={<LineChart size={16} className={"mr-2"} />}
            preSelectedValue={values.priority}
            onValueChange={(value) =>
                setValues((prevValues) => ({ ...prevValues, priority: value }))}
        >
            {priorities.map((priority) => (
                <ComboboxItem key={priority} title={priority} />
            ))}
        </Combobox>
    ), [values.priority, priorities]);


    return (
        <Dialog width={1000}
                ref={dialogRef}
                key={dialogKey}
        >
            <DialogHeader title={"Edit Task"}
                          dialogRef={dialogRef}
                          onClose={handleCloseClick}
            />
            <DialogContent>
                <div className={"flex flex-col space-y-4 pb-2"}>
                    <Input placeholder={"Task Title"}
                           label={"Title"}
                           value={values.title}
                           onChange={handleInputChange("title", setValues)}
                           className={"w-full"}
                    />
                    <Textarea placeholder={"Add Description..."}
                              label={"Description"}
                              onChange={handleInputChange("description", setValues)}
                              spellCheck={false}
                              value={values.description ?? ""}
                              className={"h-20 py-2 text-sm bg-dark placeholder-marcador border-1 border-edge focus:text-gray"}
                    />
                </div>
                <div className={"flex flex-row space-x-2 pt-2 z-50"}>
                    {teamCombobox}
                    {team && (
                        <>
                            {projectCombobox}
                            {topicCombobox}
                        </>
                    )}
                </div>
                <div className={"flex flex-row space-x-2 py-4 z-40"}>
                    <DatePicker size={"medium"}
                                text={"Deadline"}
                                label={"Deadline"}
                                preSelectedValue={values.deadline}
                                onValueChange={(value) =>
                                    setValues((prevValues) => ({...prevValues, deadline: value}))}
                                closeButton={true}
                                dayFormat={"short"}
                    />
                    {statusCombobox}
                    {priorityCombobox}
                    <Input placeholder={"Duration in hours"}
                           label={"Duration"}
                           value={values.duration?.toString()}
                           elementSize={"medium"}
                           icon={<Hourglass size={16}/>}
                           onChange={handleInputChange("duration", setValues)}
                           onKeyDown={(e) => handleNumberInput(e)}
                    />
                </div>
            </DialogContent>
            <DialogFooter saveButtonTitle={"Save changes"}
                          cancelButton={true}
                          switchButton={false}
                          dialogRef={dialogRef}
                          onClick={handleEditClick}
                          onClose={handleCloseClick}
                          disabledButton={!valid}
            />
        </Dialog>
    );
});
EditTaskDialog.displayName = "EditTaskDialog";


"use client";

import React, {forwardRef, useCallback, useEffect, useMemo, useState} from "react";
import {BookCopy, CheckCheck, CircleAlert, CircleX, Hourglass, LineChart, Save, Tag, Users} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";
import {DatePicker} from "@marraph/daisy/components/datepicker/DatePicker";
import {useUser} from "@/context/UserContext";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import {Input} from "@marraph/daisy/components/input/Input";
import {mutateRef} from "@/utils/mutateRef";
import {useToast} from "griller/src/component/toaster";
import {Team} from "@/action/team";
import {CompletedProject, CompletedTeam, CompletedUser, Priority, State} from "@/types/types";
import {
    ComplexTask,
    getProjectsFromTeamId,
    getTopicsFromTeamId,
    updateTaskInCompletedUser
} from "@/utils/object-helpers";
import {Project} from "@/action/projects";
import {Topic} from "@/action/topic";
import {updateTask} from "@/action/task";

type EditProps = {
    name: string | undefined,
    description: string | null,
    team: CompletedTeam | null,
    project: CompletedProject | null,
    topic: Topic | null,
    state: State | null,
    priority: Priority | null,
    deadline: Date | null,
    duration: number | null
}

export const EditTaskDialog = forwardRef<DialogRef, { task: ComplexTask, onClose?: () => void }>(({ task, onClose }, ref) => {
    const dialogRef = mutateRef(ref);
    const [values, setValues] = useState<EditProps>({
        name: task.task?.name,
        description: task.task?.description ?? null,
        team: task.team ?? null,
        project: task.project ?? null,
        topic: task.task.topic ?? null,
        state: task.task?.state ?? null,
        priority: task.task?.priority ?? null,
        deadline: task.task?.deadline ?? null,
        duration: task.task?.duration ?? null,
    });
    const [projects, setProjects] = useState<CompletedProject[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [dialogKey, setDialogKey] = useState(Date.now());
    const { user, loading, error, actionConsumer } = useUser();
    const { addToast } = useToast();
    
    const initialValues = values;
    const statuses = useMemo(() => ["PENDING", "PLANING", "STARTED", "TESTED", "FINISHED"], []);
    const priorities = useMemo(() => ["LOW", "MEDIUM", "HIGH"], []);

    const fields = {
        title: {
            initialValue: '',
            validate: (value: string) => ({
                isValid: value.trim() !== '',
                message: "Title can't be empty"
            })
        },
        team: {
            initialValue: null,
            validate: (value: CompletedTeam | null) => ({
                isValid: value !== null,
                message: 'Team is required'
            })
        },
        project: {
            initialValue: null,
            validate: (value: CompletedProject | null) => ({
                isValid: value !== null,
                message: 'Team is required'
            })
        }
    }

    useEffect(() => {
        if (values.team && user) {
            setProjects(getProjectsFromTeamId(user, values.team.id));
            setTopics(getTopicsFromTeamId(user, values.team.id));
        }
    }, [user, values.team]);
    
    const handleCloseClick = useCallback(() => {
        setDialogKey(Date.now());
        setValues(initialValues);
        setValues((prevValues) => ({...prevValues, team: task.team ?? null}));
        onClose?.();
    }, [initialValues, onClose, task.team]);

    const handleEditClick = useCallback(async () => {
        if (!user || !task?.task) return;

        actionConsumer({
            consumer: async () => {
                return await updateTask(task.task.id, {
                    ...task,
                    name: values.name,
                    description: values.description,
                    topic: values.topic?.id ?? null,
                    state: values.state ?? null,
                    priority: values.priority ?? null,
                    deadline: values.deadline ?? null,
                    duration: Number(values.duration) ?? null,
                    updatedBy: user.id,
                    updatedAt: new Date(),
                });
            },
            handler: (currentUser: CompletedUser) => {
                return updateTaskInCompletedUser(currentUser, task.task.id);
            },
            onSuccess: () => {
                addToast({
                    title: "Task saved",
                    secondTitle: "You successfully saved your task changes.",
                    icon: <Save/>
                });
            },
            onError: (error: string) => {
                addToast({
                    title: "Task not saved",
                    secondTitle: error,
                    icon: <CircleAlert/>
                });
            }
        });
        
        handleCloseClick();
    }, [user, task, actionConsumer, handleCloseClick, values, addToast]);

    const teamCombobox = useMemo(() => {
        const teams = user?.teamMemberships.map((team) => team.team) ?? [];
        return (
            <Combobox
                id={"team"}
                buttonTitle={"Team"}
                label={"Team"}
                size={"medium"}
                searchField={true}
                icon={<Users size={16} className={"mr-2"}/>}
                preSelectedValue={values.team}
                getItemTitle={(item) => (item as Team).name}
                onValueChange={(value) => {
                    setValues((prevValues) => ({
                        ...prevValues,
                        team: value as CompletedTeam,
                        project: null,
                        topic: null
                    }));
                }}
            >
                {teams.map((team) => (
                    <ComboboxItem key={team.name} title={team.name} value={team}/>
                ))}
            </Combobox>
        );
    }, [user?.teamMemberships, values.team]);

    const projectCombobox = useMemo(() => values.team && (
        <Combobox
            id={"project"}
            buttonTitle={"Project"}
            label={"Project"}
            size={"medium"}
            searchField={true}
            icon={<BookCopy size={16} className={"mr-2"} />}
            preSelectedValue={values.project}
            getItemTitle={(item) => (item as Project).name}
            onValueChange={(value) => setValues((prevValues) => ({...prevValues, project: value as CompletedProject || null }))}
        >
            {projects.map((project) => (
                <ComboboxItem key={project.name} title={project.name} value={project}/>
            ))}
        </Combobox>
    ), [values.team, values.project, projects]);

    const topicCombobox = useMemo(() => values.team && (
        <Combobox
            buttonTitle={"Topic"}
            label={"Topic"}
            size={"medium"}
            searchField={true}
            icon={<Tag size={16} className={"mr-2"} />}
            preSelectedValue={values.topic}
            getItemTitle={(item) => (item as Topic).name}
            onValueChange={(value) => setValues((prevValues) => ({...prevValues, topicItem: value as Topic || null }))}
        >
            {topics.map((topic) => (
                <ComboboxItem key={topic.name} title={topic.name} value={topic}/>
            ))}
        </Combobox>
    ), [values.team, values.topic, topics]);

    const statusCombobox = useMemo(() => (
        <Combobox
            buttonTitle={"Status"}
            label={"Status"}
            size={"medium"}
            icon={<CircleAlert size={16} className={"mr-2"} />}
            preSelectedValue={values.state}
            getItemTitle={(item) => item as string}
            onValueChange={(value) => setValues((prevValues) => ({...prevValues, status: value as State || null }))}

        >
            {statuses.map((status) => (
                <ComboboxItem key={status} title={status} value={status}/>
            ))}
        </Combobox>
    ), [values.state, statuses]);

    const priorityCombobox = useMemo(() => (
        <Combobox
            buttonTitle={"Priority"}
            label={"Priority"}
            size={"medium"}
            icon={<LineChart size={16} className={"mr-2"} />}
            preSelectedValue={values.priority}
            getItemTitle={(item) => item as string}
            onValueChange={(value) => setValues((prevValues) => ({...prevValues, priority: value as Priority || null }))}
        >
            {priorities.map((priority) => (
                <ComboboxItem key={priority} title={priority} value={priority}/>
            ))}
        </Combobox>
    ), [values.priority, priorities]);

    if (!dialogRef || user === undefined) return null;

    return (
        <Dialog width={1000}
                onClose={handleCloseClick}
                onSubmit={handleEditClick}
                fields={fields}
                ref={dialogRef}
                key={dialogKey}
        >
            <DialogHeader title={"Edit Task"}/>
            <DialogContent>
                <div className={"flex flex-col space-y-4 pb-2"}>
                    <Input
                        id={"title"}
                        placeholder={"Task Title"}
                        label={"Title"}
                        value={values.name}
                        onChange={(e) => setValues((prevValues) => ({...prevValues, name: e.target.value}))}
                        className={"w-full"}
                        validationRules={[fields.title.validate]}
                    />
                    <Textarea placeholder={"Add Description..."}
                              label={"Description"}
                              onChange={(e) => setValues((prevValues) => ({...prevValues, description: e.target.value}))}
                              spellCheck={false}
                              value={values.description ?? ""}
                              className={"h-20 py-2 text-sm bg-zinc-200 dark:bg-dark placeholder-zinc-400 dark:placeholder-marcador " +
                                  "border-1 border-zinc-300 dark:border-edge text-zinc-500 dark:text-gray focus:text-zinc-500 dark:focus:text-gray"}
                    />
                </div>
                <div className={"flex flex-row space-x-2 pt-2 z-50"}>
                    {teamCombobox}
                    {values.team && (
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
                                onValueChange={(value) => setValues((prevValues) => ({...prevValues, deadline: value}))}
                                closeButton={true}
                                dayFormat={"short"}
                    />
                    {statusCombobox}
                    {priorityCombobox}
                    <Input placeholder={"Duration in hours"}
                           type={"number"}
                           label={"Duration"}
                           value={values.duration?.toString()}
                           elementSize={"medium"}
                           icon={<Hourglass size={16}/>}
                           onChange={(e) => setValues((prevValues) => ({...prevValues, duration: Number(e.target.value)}))}
                    />
                </div>
            </DialogContent>
            <DialogFooter saveButtonTitle={"Save changes"}/>
        </Dialog>
    );
});
EditTaskDialog.displayName = "EditTaskDialog";


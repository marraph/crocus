"use client";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import React, {forwardRef, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    BookCopy,
    CheckCheck,
    CircleAlert,
    CircleX,
    Hourglass,
    LineChart,
    SquareCheckBig,
    Tag,
    Users
} from "lucide-react";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";
import {DatePicker} from "@marraph/daisy/components/datepicker/DatePicker";
import {useUser} from "@/context/UserContext";
import {Input} from "@marraph/daisy/components/input/Input";
import {Switch, SwitchRef} from "@marraph/daisy/components/switch/Switch";
import {mutateRef} from "@/utils/mutateRef";
import {useToast} from "griller/src/component/toaster";
import {Team} from "@/action/team";
import {ActionConsumerType, CompletedProject, CompletedTeam, CompletedUser, Priority, State} from "@/types/types";
import {Project} from "@/action/projects";
import {Topic} from "@/action/topic";
import {
    createTaskInCompletedUser,
    getProjectsFromTeamId,
    getTopicsFromTeamId,
    updateTaskInCompletedUser
} from "@/utils/object-helpers";
import {ValidationRule} from "@marraph/daisy/hooks/useInputValidation";
import {createTask, Task, updateTask} from "@/action/task";

type CreateProps = {
    name: string,
    description: string | null,
    team: Team | null,
    project: Project | null,
    topic: Topic | null,
    state: State | null,
    priority: Priority | null,
    deadline: Date | null,
    duration: number | null
}

export const CreateTaskDialog = forwardRef<DialogRef>(({}, ref) => {
    const dialogRef = mutateRef(ref);
    const switchRef = useRef<SwitchRef>(null);
    const [values, setValues] = useState<CreateProps>({
        name: "",
        description: null,
        team: null,
        project: null,
        topic: null,
        state: null,
        priority: null,
        deadline: null,
        duration: null
    });
    const [projects, setProjects] = useState<CompletedProject[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [dialogKey, setDialogKey] = useState(Date.now());
    const { user, loading, error, actionConsumer } = useUser();
    const { addToast } = useToast();

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
        setValues({ name: "", description: null, team: null, project: null, topic: null, state: null, priority: null, deadline: null, duration: null });
        setDialogKey(Date.now());
    }, []);

    const handleCreateClick = useCallback(async () => {
        if (!user) return null;

        actionConsumer({
            consumer: async () => {
                return await createTask({
                    name: values.name,
                    description: values.description,
                    topic: values.topic?.id ?? null,
                    state: values.state ?? null,
                    priority: values.priority ?? null,
                    deadline: values.deadline ?? null,
                    isArchived: false,
                    duration: Number(values.duration) ?? null,
                    bookedDuration: 0,
                    createdBy: user.id,
                    createdAt: new Date(),
                    updatedBy: user.id,
                    updatedAt: new Date(),
                    projectId: values.project?.id ?? null
                });
            },
            handler: (currentUser: CompletedUser, input: ActionConsumerType) => {
                return createTaskInCompletedUser(currentUser, input as Task);
            },
            onSuccess: () => {
                addToast({
                    title: "Task created successfully!",
                    secondTitle: "You can now work with the task in your task-overview.",
                    icon: <SquareCheckBig/>
                });
            },
            onError: (error: string) => {
                addToast({
                    title: "An error occurred!",
                    secondTitle: "The task could not be created. Please try again later.",
                    icon: <CircleAlert/>
                });
            }
        });

        handleCloseClick();
    }, [user, actionConsumer, handleCloseClick, values, addToast]);


    const teamCombobox = useMemo(() => {
        const teams = user?.teamMemberships.map((team) => team.team) ?? [];
        return (
            <Combobox
                id={"team"}
                buttonTitle={"Team"}
                size={"small"}
                searchField={true}
                icon={<Users size={12} className={"mr-1"} />}
                getItemTitle={(item) => (item as Team).name}
                onValueChange={(value) => {
                    setValues((prevValues) => ({
                        ...prevValues,
                        team: value as Team,
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
        }, [user?.teamMemberships]);

    const projectCombobox = useMemo(() => (
        <Combobox
            id={"project"}
            buttonTitle={"Project"}
            size={"small"}
            searchField={true}
            icon={<BookCopy size={12} className={"mr-1"} />}
            getItemTitle={(item) => (item as Project).name}
            onValueChange={(value) => setValues((prevValues) => ({ ...prevValues, project: value as Project || null}))}
        >
            {projects.map((project) => (
                <ComboboxItem key={project.name} title={project.name} value={project}/>
            ))}
        </Combobox>
    ), [projects]);

    const topicCombobox = useMemo(() => (
        <Combobox
            buttonTitle={"Topic"}
            size={"small"}
            searchField={true}
            icon={<Tag size={12} className={"mr-1"} />}
            getItemTitle={(item) => (item as Topic).name}
            onValueChange={(value) => setValues((prevValues) => ({ ...prevValues, topic: value as Topic || null }))}
        >
            {topics.map((topic) => (
                <ComboboxItem key={topic.name} title={topic.name} value={topic}/>
            ))}
        </Combobox>
    ), [topics]);

    const statusCombobox = useMemo(() => (
        <Combobox
            buttonTitle={"Status"}
            size={"small"}
            icon={<CircleAlert size={12} className={"mr-1"} />}
            getItemTitle={(item) => item as string}
            onValueChange={(value) => setValues((prevValues) => ({ ...prevValues, status: value as State || null }))}
        >
            {statuses.map((status) => (
                <ComboboxItem key={status} title={status} value={status}/>
            ))}
        </Combobox>
    ), [statuses]);

    const priorityCombobox = useMemo(() => (
        <Combobox
            buttonTitle={"Priority"}
            size={"small"}
            icon={<LineChart size={12} className={"mr-1"} />}
            getItemTitle={(item) => item as string}
            onValueChange={(value) => setValues((prevValues) => ({ ...prevValues, priority: value as Priority || null }))}
        >
            {priorities.map((priority) => (
                <ComboboxItem key={priority} title={priority} value={priority}/>
            ))}
        </Combobox>
    ), [priorities]);

    if (!user || !dialogRef) return null;

    return (
        <Dialog width={800}
                onClose={handleCloseClick}
                onSubmit={handleCreateClick}
                fields={fields}
                ref={dialogRef}
                key={dialogKey}
        >
            <DialogHeader title={"New Task"}/>
            <DialogContent>
                <div className={"flex flex-col flex-grow space-y-1"}>
                    <Input id={"title"}
                           placeholder={"Task Title"}
                           validationRules={[fields.title.validate]}
                           className={"rounded-lg bg-zinc-100 dark:bg-black py-2 text-zinc-800 dark:text-white placeholder-zinc-400 dark:placeholder-marcador " +
                               "focus-visible:ring-0 border-0 focus-visible:outline-none"}
                           value={values.name}
                           onChange={(e) => setValues((prevValues) => ({ ...prevValues, name: e.target.value }))}
                    />
                    <Textarea placeholder={"Add Description..."}
                              className={"h-20 bg-zinc-100 dark:bg-black focus:text-zinc-500 dark:focus:text-gray px-0"}
                              value={values.description ?? ""}
                              onChange={(e) => setValues((prevValues) => ({ ...prevValues, description: e.target.value }))}
                    />
                    <div className={"flex flex-row space-x-2 z-50"}>
                        {teamCombobox}
                        {values.team && (
                            <>
                                {projectCombobox}
                                {topicCombobox}
                            </>
                        )}
                    </div>
                    <div className={"flex flex-row space-x-2"}>
                        <DatePicker text={"Deadline"}
                                    size={"small"}
                                    closeButton={true}
                                    dayFormat={"short"}
                                    onValueChange={(value) =>
                                        setValues((prevValues) => ({ ...prevValues, deadline: value }))}
                        />
                        {statusCombobox}
                        {priorityCombobox}
                        <Input placeholder={"Duration in Hours"}
                               type={"number"}
                               elementSize={"small"}
                               className={"w-28 placeholder-gray"}
                               icon={<Hourglass size={12}/>}
                               onChange={(e) => setValues((prevValues) => ({ ...prevValues, duration: Number(e.target.value) }))}
                        />
                    </div>
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
});
CreateTaskDialog.displayName = "CreateTaskDialog";

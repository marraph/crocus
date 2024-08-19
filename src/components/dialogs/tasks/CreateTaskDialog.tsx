"use client";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import React, {ChangeEvent, forwardRef, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {BookCopy, CircleAlert, Hourglass, LineChart, SquareCheckBig, Tag, Users} from "lucide-react";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";
import {DatePicker} from "@marraph/daisy/components/datepicker/DatePicker";
import {createTask} from "@/service/hooks/taskHook";
import {Priority, Project, State, TaskCreation, Topic, User} from "@/types/types";
import {useUser} from "@/context/UserContext";
import {Input} from "@marraph/daisy/components/input/Input";
import {Switch, SwitchRef} from "@marraph/daisy/components/switch/Switch";
import {getProject, getProjectItemsFromTeam, getTeamItems, getTopicItem, getTopicItemsFromTeam} from "@/utils/getTypes";
import {mutateRef} from "@/utils/mutateRef";
import {useToast} from "griller/src/component/toaster";

type CreateProps = Pick<TaskCreation, 'name' | 'description' | 'project' | 'topic' | 'status' | 'priority' | 'deadline' | 'duration'>;

export const CreateTaskDialog = forwardRef<DialogRef>(({}, ref) => {
    const dialogRef = mutateRef(ref);
    const switchRef = useRef<SwitchRef>(null);

    const [values, setValues] = useState<CreateProps>(
        { name: "", description: null, project: null, topic: null, status: null, priority: null, deadline: null, duration: null });

    const [team, setTeam] = useState<string | null>(null);
    const [valid, setValid] = useState(false);
    const [dialogKey, setDialogKey] = useState(Date.now());
    const {data:user, isLoading:userLoading, error:userError} = useUser();
    const {addToast} = useToast();

    const statuses = useMemo(() => ["PENDING", "PLANING", "STARTED", "TESTED", "FINISHED"], []);
    const priorities = useMemo(() => ["LOW", "MEDIUM", "HIGH"], []);
    const teams = useMemo(() => user ? getTeamItems(user) : [], [user]);
    const projects = useMemo(() => (user && team) ? getProjectItemsFromTeam(user, team) : [], [user, team]);
    const topics = useMemo(() => (user && team) ? getTopicItemsFromTeam(user, team) : [], [user, team]);

    const validateInput = useCallback(() => {
        setValid(values.name.trim() !== "");
    }, [values.name]);

    useEffect(() => {
        validateInput();
    }, [validateInput, values.name]);

    const handleCloseClick = useCallback(() => {
        setValues({ name: "", description: null, project: null, topic: null, status: null, priority: null, deadline: null, duration: null });
        setValid(false);
        setTeam(null);
        setDialogKey(Date.now());
    }, []);

    const handleCreateClick = useCallback((user: User) => {
        const newTask: TaskCreation = {
            id: 0,
            name: values.name,
            description: values.description,
            topic: getTopicItem(user, values.topic?.title as string) ?? null,
            status: values.status as State ?? null,
            priority: values.priority as Priority ?? null,
            deadline: values.deadline ?? null,
            isArchived: false,
            duration: Number(values.duration) ?? null,
            bookedDuration: 0,
            createdBy: {id: user.id, name: user.name, email: user.email},
            createdDate: new Date(),
            lastModifiedBy: {id: user.id, name: user.name, email: user.email},
            lastModifiedDate: new Date(),
            project: getProject(user, values.project?.name) ?? null
        }
        const {data:task, isLoading:taskLoading, error:taskError} = createTask(newTask);

        handleCloseClick();
        addToast({
            title: "Task created successfully!",
            secondTitle: "You can now work with the task in your task-overview.",
            icon: <SquareCheckBig/>
        });
    }, [addToast, handleCloseClick, values.deadline, values.description, values.duration, values.priority, values.project, values.status, values.name, values.topic]);

    const handleInputChange = useCallback((field: keyof CreateProps, setValues: React.Dispatch<React.SetStateAction<CreateProps>>) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setValues((prevValues) => ({
            ...prevValues,
            [field]: e.target.value
        }));
    }, []);

    const handleValueChange = useCallback(
        (field: keyof CreateProps, value: string | null) => {
            let updatedValue: Project | Topic | string | null = value;

            if (field === 'project') {
                const project = projects.find(p => p.name === value);
                updatedValue = project ?? null;
            } else if (field === 'topic') {
                const topic = topics.find(t => t.title === value);
                updatedValue = topic ?? null;
            } else if (field === 'status') {
                const status = statuses.find(s => s === value);
                updatedValue = status ?? null;
            } else if (field === 'priority') {
                const priority = priorities.find(p => p === value);
                updatedValue = priority ?? null;
            }

            setValues((prevValues) => ({
                ...prevValues,
                [field]: updatedValue,
            }));
        },
        [projects, topics, statuses, priorities]
    );

    const handleNumberInput = useCallback((e: React.KeyboardEvent) => {
        if (!/\d/.test(e.key) && e.key !== 'Backspace') {
            e.preventDefault();
        }
    }, []);


    const teamCombobox = useMemo(() => (
        <Combobox buttonTitle={"Team"}
                  size={"small"}
                  icon={<Users size={12} className={"mr-1"} />}
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
                <ComboboxItem title={team.name} key={team.name}/>
            ))}
        </Combobox>
    ), [teams]);

    const projectCombobox = useMemo(() => (
        <Combobox buttonTitle={"Project"}
                  size={"small"}
                  key={`project-${team}`}
                  icon={<BookCopy size={12} className={"mr-1"} />}
                  onValueChange={(value) => handleValueChange('project', value)}
        >
            {projects.map((project) => (
                <ComboboxItem title={project.name} key={project.name}/>
            ))}
        </Combobox>
    ), [handleValueChange, projects, team]);

    const topicCombobox = useMemo(() => (
        <Combobox buttonTitle={"Topic"}
                  key={`topic-${team}`}
                  size={"small"}
                  icon={<Tag size={12} className={"mr-1"} />}
                  onValueChange={(value) => handleValueChange('topic', value)}
        >
            {topics.map((topic) => (
                <ComboboxItem title={topic.title} key={topic.title}/>
            ))}
        </Combobox>
    ), [team, topics, handleValueChange]);

    const statusCombobox = useMemo(() => (
        <Combobox buttonTitle={"Status"}
                  size={"small"}
                  icon={<CircleAlert size={12} className={"mr-1"} />}
                  onValueChange={(value) => handleValueChange('status', value)}
        >
            {statuses.map((status) => (
                <ComboboxItem title={status} key={status}/>
            ))}
        </Combobox>
    ), [handleValueChange, statuses]);

    const priorityCombobox = useMemo(() => (
        <Combobox buttonTitle={"Priority"}
                  size={"small"}
                  icon={<LineChart size={12} className={"mr-1"} />}
                  onValueChange={(value) => handleValueChange('priority', value)}
        >
            {priorities.map((priority) => (
                <ComboboxItem title={priority} key={priority}/>
            ))}
        </Combobox>
    ), [handleValueChange, priorities]);

    if (!dialogRef || user === undefined) return null;

    return (
        <Dialog width={800}
                onClose={handleCloseClick}
                ref={dialogRef}
                key={dialogKey}
        >
            <DialogHeader title={"New Task"}/>
            <DialogContent>
                <div className={"flex flex-col flex-grow space-y-1"}>
                    <input placeholder={"Task Title"}
                           onChange={handleInputChange("name", setValues)}
                           className={"rounded-lg bg-black py-2 text-white placeholder-marcador focus-visible:ring-0 border-0 focus-visible:outline-none"}
                    />
                    <Textarea placeholder={"Add Description..."}
                              onChange={handleInputChange("description", setValues)}
                              className={"h-20 dark:bg-black focus:text-gray px-0"}
                              value={values.description ?? ""}
                    />
                    <div className={"flex flex-row space-x-2 z-50"}>
                        {teamCombobox}
                        {team && (
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
                               elementSize={"small"}
                               className={"w-28 placeholder-gray"}
                               icon={<Hourglass size={12}/>}
                               onChange={handleInputChange("duration", setValues)}
                               onKeyDown={(e) => handleNumberInput(e)}
                        />
                    </div>
                </div>
            </DialogContent>
            <DialogFooter saveButtonTitle={"Create"}
                          onClick={() => handleCreateClick(user)}
                          disabledButton={!valid}
            >
                <div className={"flex flex-row items-center space-x-2 text-zinc-700 dark:text-gray text-xs mr-16"}>
                    <span>{"Create more"}</span>
                    <Switch ref={switchRef}/>
                </div>
            </DialogFooter>
        </Dialog>
    )
})
CreateTaskDialog.displayName = "CreateTaskDialog";

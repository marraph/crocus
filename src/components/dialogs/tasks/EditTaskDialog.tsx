"use client";

import React, {ChangeEvent, forwardRef, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {BookCopy, CircleAlert, Hourglass, LineChart, Save, Tag, Users} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";
import {DatePicker} from "@marraph/daisy/components/datepicker/DatePicker";
import {Priority, Project, State, Task, TaskCreation, TaskElement, Team, Topic} from "@/types/types";
import {useUser} from "@/context/UserContext";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import {Input} from "@marraph/daisy/components/input/Input";
import {mutateRef} from "@/utils/mutateRef";
import {
    getAllTeams,
    getProjectItemsFromTeam,
    getProjects,
    getTeamItems,
    getTopicItem, getTopicItemsFromTeam,
    getTopicsFromTeam
} from "@/utils/getTypes";
import {updateTask} from "@/service/hooks/taskHook";
import {useToast} from "griller/src/component/toaster";


type EditProps = Pick<TaskElement, 'name' | 'description' | 'team' | 'project' | 'topic' | 'status' | 'priority' | 'deadline' | 'duration'>;

export const EditTaskDialog = forwardRef<DialogRef, { taskElement: TaskElement, onClose?: () => void }>
    (({ taskElement, onClose }, ref) => {
        
    const dialogRef = mutateRef(ref);

    const [values, setValues] = useState<EditProps>({
        name: taskElement.name,
        description: taskElement.description ?? null,
        team: taskElement.team ?? null,
        project: taskElement.project ?? null,
        topic: taskElement.topic ?? null,
        status: taskElement.status ?? null,
        priority: taskElement.priority ?? null,
        deadline: taskElement.deadline ?? null,
        duration: taskElement.duration ?? null,
    });
    const [team, setTeam] = useState<string | null>(taskElement.team?.name ?? null);
    const [valid, setValid] = useState(true);
    const [dialogKey, setDialogKey] = useState(Date.now());
    const { data:user, isLoading:userLoading, error:userError } = useUser();
    const { addToast } = useToast();
    
    const initialValues = values;
    const statuses = useMemo(() => ["PENDING", "PLANING", "STARTED", "TESTED", "FINISHED"], []);
    const priorities = useMemo(() => ["LOW", "MEDIUM", "HIGH"], []);
    const teams = useMemo(() => user ? getTeamItems(user) : [], [user]);
    const projects = useMemo(() => (user && team) ? getProjectItemsFromTeam(user, team) : [], [user, team]);
    const topics = useMemo(() => (user && team) ? getTopicItemsFromTeam(user, team) : [], [user, team]);

    const validateInput = useCallback(() => {
        if (values === initialValues) {
            setValid(false);
            return;
        }
        
        setValid(values.name.trim() !== "");
    }, [initialValues, values]);
    
    useEffect(() => {
        validateInput();
    }, [validateInput, values]);

    const handleCloseClick = useCallback(() => {
        setDialogKey(Date.now());
        setValid(true);
        setValues(initialValues);
        setTeam(taskElement.team?.name ?? null);
        onClose && onClose();
    }, [initialValues, onClose, taskElement.team?.name]);

    const handleEditClick = useCallback(() => {
        if (!user || !taskElement) return
        const task: Omit<Task, 'id' | 'isArchived' | 'bookedDuration' | 'createdBy' | 'createdDate'> = {
            name: values.name,
            description: values.description,
            topic: getTopicItem(user, values.topic?.title as string) ?? null,
            status: values.status as State ?? null,
            priority: values.priority as Priority ?? null,
            deadline: values.deadline ?? null,
            duration: Number(values.duration) ?? null,
            lastModifiedBy: { id: user.id, name: user.name, email: user.email },
            lastModifiedDate: new Date(),
        };
        const { data, isLoading, error } = updateTask(taskElement.id, {...taskElement, ...task});
        handleCloseClick();
        addToast({
            title: "Task saved",
            secondTitle: "You successfully saved your task changes.",
            icon: <Save/>
        });
    }, [user, taskElement, values.name, values.description, values.topic, values.status, values.priority, values.deadline, values.duration, handleCloseClick, addToast]);

    const handleInputChange = useCallback((field: keyof EditProps, setValues: React.Dispatch<React.SetStateAction<EditProps>>) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

        const handleValueChange = useCallback(
            (field: keyof EditProps, value: string | null) => {
                let updatedValue: Team | Project | Topic | string | null = value;

                if (field === 'team') {
                    const team = teams.find(t => t.name === value);
                    updatedValue = team ?? null;
                }else if (field === 'project') {
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
            [teams, projects, topics, statuses, priorities]
        );

    const teamCombobox = useMemo(() => (
        <Combobox
            buttonTitle={"Team"}
            label={"Team"}
            size={"medium"}
            icon={<Users size={16} className={"mr-2"}/>}
            preSelectedValue={values.team?.name}
            onValueChange={(value) => {
                handleValueChange('team', value);
                setValues((prevValues) => ({
                    ...prevValues,
                    project: null,
                    topic: null
                }));
                setTeam(value);
            }}
        >
            {teams.map((team) => (
                <ComboboxItem key={team.name} title={team.name}/>
            ))}
        </Combobox>
    ), [values.team?.name, teams, handleValueChange]);

    const projectCombobox = useMemo(() => team && (
        <Combobox
            buttonTitle={"Project"}
            label={"Project"}
            size={"medium"}
            key={`project-${team}`}
            icon={<BookCopy size={16} className={"mr-2"} />}
            preSelectedValue={values.project?.name}
            onValueChange={(value) => handleValueChange('project', value)}
        >
            {projects.map((project) => (
                <ComboboxItem key={project.name} title={project.name} />
            ))}
        </Combobox>
    ), [team, values.project?.name, projects, handleValueChange]);

    const topicCombobox = useMemo(() => team && (
        <Combobox
            buttonTitle={"Topic"}
            label={"Topic"}
            size={"medium"}
            key={`topic-${team}`}
            icon={<Tag size={16} className={"mr-2"} />}
            preSelectedValue={values.topic?.title}
            onValueChange={(value) => handleValueChange('topic', value)}
        >
            {topics.map((topic) => (
                <ComboboxItem key={topic.title} title={topic.title} />
            ))}
        </Combobox>
    ), [team, values.topic?.title, topics, handleValueChange]);

    const statusCombobox = useMemo(() => (
        <Combobox
            buttonTitle={"Status"}
            label={"Status"}
            size={"medium"}
            icon={<CircleAlert size={16} className={"mr-2"} />}
            preSelectedValue={values.status}
            onValueChange={(value) => handleValueChange('status', value)}

        >
            {statuses.map((status) => (
                <ComboboxItem key={status} title={status} />
            ))}
        </Combobox>
    ), [values.status, statuses, handleValueChange]);

    const priorityCombobox = useMemo(() => (
        <Combobox
            buttonTitle={"Priority"}
            label={"Priority"}
            size={"medium"}
            icon={<LineChart size={16} className={"mr-2"} />}
            preSelectedValue={values.priority}
            onValueChange={(value) => handleValueChange('priority', value)}
        >
            {priorities.map((priority) => (
                <ComboboxItem key={priority} title={priority} />
            ))}
        </Combobox>
    ), [values.priority, priorities, handleValueChange]);

    if (!dialogRef || user === undefined) return null;

    return (
        <Dialog width={1000}
                onClose={handleCloseClick}
                ref={dialogRef}
                key={dialogKey}
        >
            <DialogHeader title={"Edit Task"}/>
            <DialogContent>
                <div className={"flex flex-col space-y-4 pb-2"}>
                    <Input placeholder={"Task Title"}
                           label={"Title"}
                           value={values.name}
                           onChange={handleInputChange("name", setValues)}
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
                          onClick={handleEditClick}
                          disabledButton={!valid}
            />
        </Dialog>
    );
});
EditTaskDialog.displayName = "EditTaskDialog";


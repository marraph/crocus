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

export const EditTaskDialog = forwardRef<DialogRef, { taskElement: TaskElement, onClose?: () => void }>(({ taskElement, onClose }, ref) => {
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
    const [team, setTeam] = useState<Team | null>(taskElement.team ?? null);
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
        setTeam(taskElement.team ?? null);
        onClose && onClose();
    }, [initialValues, onClose, taskElement.team]);

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
        
        addToast({
            title: "Task saved",
            secondTitle: "You successfully saved your task changes.",
            icon: <Save/>
        });

        handleCloseClick();
    }, [user, taskElement, values.name, values.description, values.topic, values.status, values.priority, values.deadline, values.duration, handleCloseClick, addToast]);

    const teamCombobox = useMemo(() => (
        <Combobox
            buttonTitle={"Team"}
            label={"Team"}
            size={"medium"}
            icon={<Users size={16} className={"mr-2"}/>}
            preSelectedValue={values.team}
            getItemTitle={(item) => (item as Team).name}
            onValueChange={(value) => {
                setValues((prevValues) => ({
                    ...prevValues,
                    project: null,
                    topic: null
                }));
                setTeam(value as Team || null);
            }}
        >
            {teams.map((team) => (
                <ComboboxItem key={team.name} title={team.name} value={team}/>
            ))}
        </Combobox>
    ), [values.team, teams]);

    const projectCombobox = useMemo(() => team && (
        <Combobox
            buttonTitle={"Project"}
            label={"Project"}
            size={"medium"}
            icon={<BookCopy size={16} className={"mr-2"} />}
            preSelectedValue={values.project}
            getItemTitle={(item) => (item as Project).name}
            onValueChange={(value) => setValues((prevValues) => ({...prevValues, project: value as Project || null }))}
        >
            {projects.map((project) => (
                <ComboboxItem key={project.name} title={project.name} value={project}/>
            ))}
        </Combobox>
    ), [team, values.project, projects]);

    const topicCombobox = useMemo(() => team && (
        <Combobox
            buttonTitle={"Topic"}
            label={"Topic"}
            size={"medium"}
            icon={<Tag size={16} className={"mr-2"} />}
            preSelectedValue={values.topic}
            getItemTitle={(item) => (item as Topic).title}
            onValueChange={(value) => setValues((prevValues) => ({...prevValues, topic: value as Topic || null }))}
        >
            {topics.map((topic) => (
                <ComboboxItem key={topic.title} title={topic.title} value={topic}/>
            ))}
        </Combobox>
    ), [team, values.topic, topics]);

    const statusCombobox = useMemo(() => (
        <Combobox
            buttonTitle={"Status"}
            label={"Status"}
            size={"medium"}
            icon={<CircleAlert size={16} className={"mr-2"} />}
            preSelectedValue={values.status}
            getItemTitle={(item) => item as string}
            onValueChange={(value) => setValues((prevValues) => ({...prevValues, status: value as State || null }))}

        >
            {statuses.map((status) => (
                <ComboboxItem key={status} title={status} value={status}/>
            ))}
        </Combobox>
    ), [values.status, statuses]);

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
                ref={dialogRef}
                key={dialogKey}
        >
            <DialogHeader title={"Edit Task"}/>
            <DialogContent>
                <div className={"flex flex-col space-y-4 pb-2"}>
                    <Input placeholder={"Task Title"}
                           label={"Title"}
                           value={values.name}
                           onChange={(e) => setValues((prevValues) => ({...prevValues, name: e.target.value}))}
                           className={"w-full"}
                    />
                    <Textarea placeholder={"Add Description..."}
                              label={"Description"}
                              onChange={(e) => setValues((prevValues) => ({...prevValues, description: e.target.value}))}
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
                           onChange={(e) => setValues((prevValues) => ({...prevValues, duration: Number(e.target.value)}))}
                           onKeyDown={(e) => { if (!/\d/.test(e.key) && e.key !== 'Backspace') e.preventDefault(); }}
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


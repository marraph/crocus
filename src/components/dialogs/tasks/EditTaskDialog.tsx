"use client";

import React, {forwardRef, useCallback, useEffect, useMemo, useState} from "react";
import {BookCopy, CircleAlert, Hourglass, LineChart, Save, Tag, Users} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";
import {DatePicker} from "@marraph/daisy/components/datepicker/DatePicker";
import {useUser} from "@/context/UserContext";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import {Input} from "@marraph/daisy/components/input/Input";
import {mutateRef} from "@/utils/mutateRef";
import {useToast} from "griller/src/component/toaster";
import {getProjectsFromTeam, Project} from "@/action/projects";
import {TaskElement, useTasks} from "@/context/TaskContext";
import {Team} from "@/action/team";
import {getTopicsFromTeam, Topic} from "@/action/topic";
import {Task, updateTask} from "@/action/task";


type EditProps = Pick<TaskElement, 'name' | 'description' | 'team' | 'project' | 'topicItem' | 'state' | 'priority' | 'deadline' | 'duration'>;

export const EditTaskDialog = forwardRef<DialogRef, { taskElement: TaskElement, onClose?: () => void }>(({ taskElement, onClose }, ref) => {
    const dialogRef = mutateRef(ref);
    const [values, setValues] = useState<EditProps>({
        name: taskElement.name,
        description: taskElement.description ?? null,
        team: taskElement.team ?? null,
        project: taskElement.project ?? null,
        topicItem: taskElement.topicItem ?? null,
        state: taskElement.state ?? null,
        priority: taskElement.priority ?? null,
        deadline: taskElement.deadline ?? null,
        duration: taskElement.duration ?? null,
    });
    const [projects, setProjects] = useState<Project[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [valid, setValid] = useState(true);
    const [dialogKey, setDialogKey] = useState(Date.now());
    const { user, teams } = useUser();
    const { actions } = useTasks();
    const { addToast } = useToast();
    
    const initialValues = values;
    const statuses = useMemo(() => ["PENDING", "PLANING", "STARTED", "TESTED", "FINISHED"], []);
    const priorities = useMemo(() => ["LOW", "MEDIUM", "HIGH"], []);

    useEffect(() => {
        if (values.team) {
            getProjectsFromTeam(values.team.id).then(result => {
                if (result.success) setProjects(result.data);
            });
            getTopicsFromTeam(values.team.id).then(result => {
                if (result.success) setTopics(result.data);
            });
        }
    }, [values.team]);

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
        setValues((prevValues) => ({...prevValues, team: taskElement.team ?? null}));
        onClose && onClose();
    }, [initialValues, onClose, taskElement.team]);

    const handleEditClick = useCallback(async () => {
        if (!user || !taskElement) return;
        
        const result = await actions.updateTask(taskElement.id, {
            ...taskElement,
            name: values.name,
            description: values.description,
            topic: values.topicItem?.id ?? null,
            state: values.state as State ?? null,
            priority: values.priority as Priority ?? null,
            deadline: values.deadline ?? null,
            duration: Number(values.duration) ?? null,
            lastModifiedBy: {id: user.id, name: user.name, email: user.email},
            lastModifiedDate: new Date(),
        });

        if (result.success) {
            addToast({
                title: "Task saved",
                secondTitle: "You successfully saved your task changes.",
                icon: <Save/>
            });
        } else {
            addToast({
                title: "Task not saved",
                secondTitle: "An error occurred while saving your task changes.",
                icon: <CircleAlert/>
            });
        }

        handleCloseClick();
    }, [user, taskElement, values, actions, handleCloseClick, addToast]);

    const teamCombobox = useMemo(() => (
        <Combobox
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
    ), [values.team, teams]);

    const projectCombobox = useMemo(() => values.team && (
        <Combobox
            buttonTitle={"Project"}
            label={"Project"}
            size={"medium"}
            searchField={true}
            icon={<BookCopy size={16} className={"mr-2"} />}
            preSelectedValue={values.project}
            getItemTitle={(item) => (item as Project).name}
            onValueChange={(value) => setValues((prevValues) => ({...prevValues, project: value as Project || null }))}
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
            preSelectedValue={values.topicItem}
            getItemTitle={(item) => (item as Topic).name}
            onValueChange={(value) => setValues((prevValues) => ({...prevValues, topicItem: value as Topic || null }))}
        >
            {topics.map((topic) => (
                <ComboboxItem key={topic.name} title={topic.name} value={topic}/>
            ))}
        </Combobox>
    ), [values.team, values.topicItem, topics]);

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


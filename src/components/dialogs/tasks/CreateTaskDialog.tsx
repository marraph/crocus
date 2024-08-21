"use client";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import React, {
    ChangeEvent,
    Dispatch,
    forwardRef,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import {BookCopy, CircleAlert, Hourglass, LineChart, SquareCheckBig, Tag, Users} from "lucide-react";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";
import {DatePicker} from "@marraph/daisy/components/datepicker/DatePicker";
import {createTask} from "@/service/hooks/taskHook";
import {Priority, Project, State, TaskCreation, Team, Topic, User} from "@/types/types";
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
    const [values, setValues] = useState<CreateProps>({
        name: "",
        description: null,
        project: null,
        topic: null,
        status: null,
        priority: null,
        deadline: null,
        duration: null
    });
    const [team, setTeam] = useState<Team | null>(null);
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

        addToast({
            title: "Task created successfully!",
            secondTitle: "You can now work with the task in your task-overview.",
            icon: <SquareCheckBig/>
        });

        handleCloseClick();
    }, [addToast, handleCloseClick, values.deadline, values.description, values.duration, values.priority, values.project, values.status, values.name, values.topic]);
    
    const teamCombobox = useMemo(() => (
        <Combobox 
            buttonTitle={"Team"}
            size={"small"}
            searchField={true}
            icon={<Users size={12} className={"mr-1"} />}
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
    ), [teams]);

    const projectCombobox = useMemo(() => (
        <Combobox
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
            getItemTitle={(item) => (item as Topic).title}
            onValueChange={(value) => setValues((prevValues) => ({ ...prevValues, topic: value as Topic || null }))}
        >
            {topics.map((topic) => (
                <ComboboxItem key={topic.title} title={topic.title} value={topic}/>
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
                           className={"rounded-lg bg-zinc-100 dark:bg-black py-2 text-zinc-800 dark:text-white placeholder-zinc-400 dark:placeholder-marcador " +
                               "focus-visible:ring-0 border-0 focus-visible:outline-none"}
                           onChange={(e) => setValues((prevValues) => ({ ...prevValues, name: e.target.value }))}
                    />
                    <Textarea placeholder={"Add Description..."}
                              className={"h-20 bg-zinc-100 dark:bg-black focus:text-zinc-500 dark:focus:text-gray px-0"}
                              value={values.description ?? ""}
                              onChange={(e) => setValues((prevValues) => ({ ...prevValues, description: e.target.value }))}
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
                               onChange={(e) => setValues((prevValues) => ({ ...prevValues, duration: Number(e.target.value) }))}
                               onKeyDown={(e) => { if (!/\d/.test(e.key) && e.key !== 'Backspace') e.preventDefault(); }}
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
    );
});
CreateTaskDialog.displayName = "CreateTaskDialog";

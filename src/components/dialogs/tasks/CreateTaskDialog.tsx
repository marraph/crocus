"use client";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import React, {
    ChangeEvent,
    forwardRef,
    MutableRefObject,
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
import {Priority, Status, TaskCreation, User} from "@/types/types";
import {useUser} from "@/context/UserContext";
import {Input} from "@marraph/daisy/components/input/Input";
import {SwitchRef} from "@marraph/daisy/components/switch/Switch";
import {getAllTeams, getProject, getProjects, getTopicItem, getTopicsFromTeam} from "@/utils/getTypes";
import {mutateRef} from "@/utils/mutateRef";
import {useToast} from "griller/src/component/toaster";


type InitialValues = {
    title: string;
    description: string | null;
    project: string | null;
    topic: string | null;
    status: string | null;
    priority: string | null;
    deadline: Date | null;
    duration: string | null;
}

export const CreateTaskDialog = forwardRef<DialogRef>(({}, ref) => {
    const dialogRef = mutateRef(ref);
    const switchRef = useRef<SwitchRef>(null);

    const initialValues: InitialValues = useMemo(() => ({
        title: "",
        description: null,
        project: null,
        topic: null,
        status: null,
        priority: null,
        deadline: null,
        duration: null
    }), []);

    const [values, setValues] = useState(initialValues);
    const [team, setTeam] = useState<string | null>(null);
    const [valid, setValid] = useState(false);
    const [dialogKey, setDialogKey] = useState(Date.now());
    const {data:user, isLoading:userLoading, error:userError} = useUser();
    const {addToast} = useToast();

    const statuses = useMemo(() => ["PENDING", "PLANING", "STARTED", "TESTED", "FINISHED"], []);
    const priorities = useMemo(() => ["LOW", "MEDIUM", "HIGH"], []);
    const teams = useMemo(() => user ? getAllTeams(user) : [], [user]);
    const projects = useMemo(() => (user && team) ? getProjects(user, team) : [], [user, team]);
    const topics = useMemo(() => (user && team) ? getTopicsFromTeam(user, team) : [], [user, team]);

    const validateInput = useCallback(() => {
        setValid(values.title.trim() !== "");
    }, [values.title]);

    useEffect(() => {
        validateInput();
    }, [validateInput, values.title]);

    const handleCloseClick = useCallback(() => {
        setValues(initialValues);
        setValid(false);
        setTeam(null);
        setDialogKey(Date.now());
    }, [initialValues]);

    const handleCreateClick = useCallback((user: User) => {
        const newTask: TaskCreation = {
            id: 0,
            name: values.title,
            description: values.description,
            topic: getTopicItem(user, values.topic as string) ?? null,
            status: values.status as Status ?? null,
            priority: values.priority as Priority ?? null,
            deadline: values.deadline ?? null,
            isArchived: false,
            duration: Number(values.duration) ?? null,
            bookedDuration: 0,
            createdBy: {id: user.id, name: user.name, email: user.email},
            createdDate: new Date(),
            lastModifiedBy: {id: user.id, name: user.name, email: user.email},
            lastModifiedDate: new Date(),
            project: getProject(user, values.project) ?? null
        }
        const {data:task, isLoading:taskLoading, error:taskError} = createTask(newTask);

        handleCloseClick();
        addToast({
            title: "Task created successfully!",
            secondTitle: "You can now work with the task in your task-overview.",
            icon: <SquareCheckBig/>
        });
    }, [addToast, handleCloseClick, values.deadline, values.description, values.duration, values.priority, values.project, values.status, values.title, values.topic]);

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
                <ComboboxItem title={team} key={team}/>
            ))}
        </Combobox>
    ), [teams]);

    const projectCombobox = useMemo(() => (
        <Combobox buttonTitle={"Project"}
                  size={"small"}
                  key={`project-${team}`}
                  icon={<BookCopy size={12} className={"mr-1"} />}
                  onValueChange={(value) => setValues((prevValues) => ({ ...prevValues, project: value }))}
        >
            {projects.map((project) => (
                <ComboboxItem title={project} key={project}/>
            ))}
        </Combobox>
    ), [projects, team]);

    const topicCombobox = useMemo(() => (
        <Combobox buttonTitle={"Topic"}
                  key={`topic-${team}`}
                  size={"small"}
                  icon={<Tag size={12} className={"mr-1"} />}
                  onValueChange={(value) => setValues((prevValues) => ({ ...prevValues, topic: value }))}
        >
            {topics.map((topic) => (
                <ComboboxItem title={topic} key={topic}/>
            ))}
        </Combobox>
    ), [topics, team]);

    const statusCombobox = useMemo(() => (
        <Combobox buttonTitle={"Status"}
                  size={"small"}
                  icon={<CircleAlert size={12} className={"mr-1"} />}
                  onValueChange={(value) => setValues((prevValues) => ({ ...prevValues, status: value }))}
        >
            {statuses.map((status) => (
                <ComboboxItem title={status} key={status}/>
            ))}
        </Combobox>
    ), [statuses]);

    const priorityCombobox = useMemo(() => (
        <Combobox buttonTitle={"Priority"}
                  size={"small"}
                  icon={<LineChart size={12} className={"mr-1"} />}
                  onValueChange={(value) => setValues((prevValues) => ({ ...prevValues, priority: value }))}
        >
            {priorities.map((priority) => (
                <ComboboxItem title={priority} key={priority}/>
            ))}
        </Combobox>
    ), [priorities]);

    if (!dialogRef || user === undefined) return null;

    return (
        <Dialog width={600}
                onClose={handleCloseClick}
                ref={dialogRef}
                key={dialogKey}
        >
            <DialogHeader title={"New Task"}/>
            <DialogContent>
                <div className={"flex flex-col flex-grow space-y-1"}>
                    <input placeholder={"Task Title"}
                           onChange={handleInputChange("title", setValues)}
                           className={"rounded-lg bg-black py-2 text-white placeholder-marcador focus-visible:ring-0 border-0 focus-visible:outline-none"}
                    />
                    <Textarea placeholder={"Add Description..."}
                              onChange={handleInputChange("description", setValues)}
                              className={"h-20 dark:bg-black focus:text-gray px-0"}
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
                          switchButton={true}
                          switchRef={switchRef as MutableRefObject<SwitchRef>}
                          onClick={() => handleCreateClick(user)}
                          disabledButton={!valid}
            />
        </Dialog>
    )
})
CreateTaskDialog.displayName = "CreateTaskDialog";

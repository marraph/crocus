"use client";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import React, {
    ChangeEvent,
    forwardRef,
    HTMLAttributes,
    MutableRefObject,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import {BookCopy, CircleAlert, Hourglass, LineChart, SquareCheckBig, Tag, Users} from "lucide-react";
import {cn} from "@/utils/cn";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";
import {DatePicker} from "@marraph/daisy/components/datepicker/DatePicker";
import {Alert, AlertRef} from "@marraph/daisy/components/alert/Alert";
import {createTask} from "@/service/hooks/taskHook";
import {Priority, Status, TaskCreation, User} from "@/types/types";
import {useUser} from "@/context/UserContext";
import {Input} from "@marraph/daisy/components/input/Input";
import {SwitchRef} from "@marraph/daisy/components/switch/Switch";
import {getAllTeams, getProject, getProjects, getTopicItem, getTopicsFromTeam} from "@/utils/getTypes";
import {mutateRef} from "@/utils/mutateRef";


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

export const CreateTaskDialog = forwardRef<DialogRef, HTMLAttributes<DialogRef>>(({className}, ref) => {
    const dialogRef = mutateRef(ref);
    const alertRef = useRef<AlertRef>(null);
    const switchRef = useRef<SwitchRef>(null);

    const status = useMemo(() => ["PENDING", "PLANING", "STARTED", "TESTED", "FINISHED"], []);
    const priorities = useMemo(() => ["LOW", "MEDIUM", "HIGH"], []);
    const initialValues: InitialValues = {
        title: "",
        description: null,
        project: null,
        topic: null,
        status: null,
        priority: null,
        deadline: null,
        duration: null
    }
    const [values, setValues] = useState(initialValues);
    const [team, setTeam] = useState<string | null>(null);
    const [valid, setValid] = useState(false);
    const [dialogKey, setDialogKey] = useState(Date.now());
    const {data:user, isLoading:userLoading, error:userError} = useUser();

    useEffect(() => {
        validateInput();
    }, [values.title]);

    if (!dialogRef || user === undefined) return null;

    function handleCreateClick(user: User) {
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
            bookedDuration: values.duration ? 0 : null,
            createdBy: {id: user.id, name: user.name, email: user.email},
            createdDate: new Date(),
            lastModifiedBy: {id: user.id, name: user.name, email: user.email},
            lastModifiedDate: new Date(),
            project: getProject(user, values.project) ?? null
        }
        const {data:task, isLoading:taskLoading, error:taskError} = createTask(newTask);

        handleCloseClick();
        alertRef.current?.show();
    }

    const handleCloseClick = () => {
        setValues(initialValues);
        setValid(false);
        setTeam(null);
        setDialogKey(Date.now());
    }

    const validateInput = () => {
        setValid(values.title.trim() !== "");
    }

    const handleInputChange = (field: keyof InitialValues, setValues: React.Dispatch<React.SetStateAction<InitialValues>>) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setValues((prevValues) => ({
            ...prevValues,
            [field]: e.target.value
        }));
    };

    const handleNumberInput = (e: React.KeyboardEvent) => {
        if (!/\d/.test(e.key) && e.key !== 'Backspace') {
            e.preventDefault();
        }
    };

    return (
        <>
            <Dialog width={600} ref={dialogRef} key={dialogKey}>
                <DialogHeader title={"New Task"}
                              dialogRef={dialogRef}
                              onClose={handleCloseClick}
                />
                <DialogContent>
                    <div className={cn("flex flex-col flex-grow space-y-2", className)}>
                        <input placeholder={"Task Title"}
                               onChange={handleInputChange("title", setValues)}
                               className={cn("rounded-lg bg-black py-2 text-white placeholder-marcador focus-visible:ring-0 border-0 focus-visible:outline-none", className)}
                        />
                        <Textarea placeholder={"Add Description..."}
                                  onChange={handleInputChange("description", setValues)}
                                  className={cn("h-20 bg-black placeholder-marcador focus:text-gray", className)}
                        />
                        <div className={cn("flex flex-row space-x-2 z-50", className)}>
                            <Combobox buttonTitle={"Team"}
                                      size={"small"}
                                      icon={<Users size={12} className={"mr-1"}/>}
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
                                {getAllTeams(user).map((team) => (
                                    <ComboboxItem title={team}
                                                  key={team}
                                                  size={"small"}
                                    />
                                ))}
                            </Combobox>
                            {team &&
                                <>
                                    <Combobox buttonTitle={"Project"}
                                              size={"small"}
                                              key={`project-${team}`}
                                              icon={<BookCopy size={12} className={"mr-1"}/>}
                                              onValueChange={(value) => {
                                                  setValues((prevValues) => ({ ...prevValues, project: value }))}}
                                    >
                                        {getProjects(user, team).map((project) => (
                                            <ComboboxItem title={project}
                                                          key={project}
                                                          size={"small"}
                                            />
                                        ))}
                                    </Combobox>
                                    <Combobox buttonTitle={"Topic"}
                                              key={`topic-${team}`}
                                              size={"small"}
                                              icon={<Tag size={12} className={"mr-1"}/>}
                                              onValueChange={(value) =>
                                                    setValues((prevValues) => ({ ...prevValues, topic: value }))}
                                    >
                                        {getTopicsFromTeam(user, team).map((topic) => (
                                            <ComboboxItem title={topic}
                                                          key={topic}
                                                          size={"small"}
                                            />
                                        ))}
                                    </Combobox>
                                </>
                            }
                        </div>
                        <div className={cn("flex flex-row space-x-2", className)}>
                            <DatePicker text={"Deadline"}
                                        size={"small"}
                                        closeButton={true}
                                        dayFormat={"short"}
                                        onValueChange={(value) =>
                                            setValues((prevValues) => ({ ...prevValues, deadline: value }))}
                            />
                            <Combobox buttonTitle={"Status"}
                                      size={"small"}
                                      icon={<CircleAlert size={12} className={"mr-1"}/>}
                                      onValueChange={(value) =>
                                          setValues((prevValues) => ({ ...prevValues, status: value }))}
                            >
                                {status.map((status) => (
                                    <ComboboxItem title={status}
                                                  key={status}
                                                  size={"small"}
                                    />
                                ))}
                            </Combobox>
                            <Combobox buttonTitle={"Priority"}
                                      size={"small"}
                                      icon={<LineChart size={12} className={"mr-1"}/>}
                                      onValueChange={(value) =>
                                          setValues((prevValues) => ({ ...prevValues, priority: value }))}
                            >
                                {priorities.map((priority) => (
                                    <ComboboxItem title={priority}
                                                  key={priority}
                                                  size={"small"}
                                    />
                                ))}
                            </Combobox>
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
                              cancelButton={true}
                              switchButton={true}
                              dialogRef={dialogRef}
                              switchRef={switchRef as MutableRefObject<SwitchRef>}
                              onClick={() => handleCreateClick(user)}
                              onClose={handleCloseClick}
                              disabledButton={!valid}
                />
            </Dialog>

            <Alert title={"Task created successfully!"}
                   description={"You can now work with the task in your task-overview."}
                   icon={<SquareCheckBig/>}
                   duration={3000}
                   ref={alertRef}
                   closeButton={false}
            />
        </>
    )
})
CreateTaskDialog.displayName = "CreateTaskDialog";

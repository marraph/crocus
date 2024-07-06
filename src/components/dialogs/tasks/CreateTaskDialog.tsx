"use client";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Textarea} from "@marraph/daisy/components/textarea/Textarea";
import React, {
    forwardRef,
    HTMLAttributes,
    MutableRefObject,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from "react";
import {Button} from "@marraph/daisy/components/button/Button";
import {BookCopy, CircleAlert, Hourglass, LineChart, SquareCheckBig, SquarePen, Tag, Users} from "lucide-react";
import {cn} from "@/utils/cn";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {Combobox, ComboboxItem, ComboboxRef} from "@marraph/daisy/components/combobox/Combobox";
import {DatePicker, DatepickerRef} from "@marraph/daisy/components/datepicker/DatePicker";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {
    Alert,
    AlertContent,
    AlertDescription,
    AlertIcon,
    AlertRef,
    AlertTitle
} from "@marraph/daisy/components/alert/Alert";
import {createTask} from "@/service/hooks/taskHook";
import {PreviewUser, Priority, Project, Status, Task, TaskCreation, Team, User} from "@/types/types";
import {useUser} from "@/context/UserContext";
import {Input, InputRef} from "@marraph/daisy/components/input/Input";
import {Switch, SwitchRef} from "@marraph/daisy/components/switch/Switch";
import {getProject, getProjects, getTeams, getTopicItem, getTopics} from "@/utils/getTypes";
import {mutateRef} from "@/utils/mutateRef";


type InitialValues = {
    title: string;
    description: string;
    team: string | null;
    project: string | null;
    topic: string | null;
    status: string | null;
    priority: string | null;
    deadline: Date | null;
    duration: string;
}

export const CreateTaskDialog = forwardRef<DialogRef, HTMLAttributes<DialogRef>>(({className}, ref) => {
    const dialogRef = mutateRef(ref);
    const alertRef = useRef<AlertRef>(null);
    const switchRef = useRef<SwitchRef>(null);
    const teamRef = useRef<ComboboxRef>(null);
    const projectRef = useRef<ComboboxRef>(null);
    const topicRef = useRef<ComboboxRef>(null);
    const statusRef = useRef<ComboboxRef>(null);
    const priorityRef = useRef<ComboboxRef>(null);
    const datePickerRef = useRef<DatepickerRef>(null);
    const durationRef = useRef<InputRef>(null);

    const status = ["PENDING", "PLANING", "STARTED", "TESTED", "FINISHED"];
    const priorities = ["LOW", "MEDIUM", "HIGH"];
    const initialValues: InitialValues = {
        title: "",
        description: "",
        team: null,
        project: null,
        topic: null,
        status: null,
        priority: null,
        deadline: null,
        duration: ""
    }
    const [values, setValues] = useState(initialValues);
    const [teamSelected, setTeamSelected] = useState({isSelected: false, team: ""});
    const [valid, setValid] = useState(false);
    const {data:user, isLoading:userLoading, error:userError} = useUser();

    useEffect(() => {
        validateInput();
    }, [values]);

    if (!dialogRef) return null;
    if (user === undefined) return null;

    function handleCreateClick(user: User) {
        const newTask: TaskCreation = {
            id: 0,
            name: values.title,
            description: values.description,
            topic: getTopicItem(user, topicRef.current?.getValue() as string) ?? null,
            status: statusRef.current?.getValue() as Status ?? null,
            priority: priorityRef.current?.getValue() as Priority ?? null,
            deadline: datePickerRef.current?.getSelectedValue() ?? null,
            isArchived: false,
            duration: Number(durationRef.current?.getValue()) ?? null,
            bookedDuration: durationRef.current?.getValue() ? 0 : null,
            createdBy: {id: user.id, name: user.name, email: user.email},
            createdDate: new Date(),
            lastModifiedBy: {id: user.id, name: user.name, email: user.email},
            lastModifiedDate: new Date(),
            project: getProject(user, projectRef.current?.getValue()) ?? null
        }
        const {data:task, isLoading:taskLoading, error:taskError} = createTask(newTask);

        teamRef.current?.reset();
        projectRef.current?.reset();
        topicRef.current?.reset();
        statusRef.current?.reset();
        priorityRef.current?.reset();
        datePickerRef.current?.reset();
        durationRef.current?.reset();
        switchRef.current?.setValue(false);
        setValues(initialValues);
        setValid(false);
        setTeamSelected({isSelected: false, team: ""})
        alertRef.current?.show();
    }

    const handleCloseClick = () => {
        teamRef.current?.reset();
        projectRef.current?.reset();
        topicRef.current?.reset();
        statusRef.current?.reset();
        priorityRef.current?.reset();
        datePickerRef.current?.reset();
        durationRef.current?.reset();
        switchRef.current?.setValue(false);
        setValues(initialValues);
        setValid(false);
        setTeamSelected({isSelected: false, team: ""})
    }

    const validateInput = () => {
        if (!values.duration) return;

        if (values.duration.trim() !== "" && isNaN(parseFloat(values.duration))) {
            setValid(false);
            return;
        }

        if (values.title.trim() === "") {
            setValid(false);
            return;
        }

        setValid(true);
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (
            (e.key >= '0' && e.key <= '9') ||
            e.key === '.' ||
            e.key === 'Backspace' ||
            e.key === 'Delete' ||
            e.key === 'Tab' ||
            e.key === 'Escape' ||
            e.key === 'Enter' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight' ||
            e.key === 'Home' ||
            e.key === 'End'
        ) {
            return;
        } else {
            e.preventDefault();
        }
    };

    return (
        <>
            <Dialog width={600} ref={dialogRef}>
                <DialogHeader title={"New Task"}
                              dialogRef={dialogRef}
                              switchRef={switchRef as MutableRefObject<SwitchRef>}
                              onClose={handleCloseClick}
                />
                <DialogContent>
                    <div className={cn("flex flex-col flex-grow space-y-2", className)}>
                        <input placeholder={"Task Title"}
                               value={values.title}
                               onChange={(e) => values.title == e.target.value}
                               className={cn("rounded-lg bg-black py-2 text-white placeholder-placeholder focus-visible:ring-0 border-0 focus-visible:outline-none", className)}
                        />
                        <Textarea placeholder={"Add Description..."}
                                  onChange={(e) => values.description == e.target.value}
                                  className={cn("h-20 bg-black placeholder-placeholder focus:text-gray", className)}
                                  value={values.description}
                        />
                        <div className={cn("flex flex-row space-x-2 z-50", className)}>
                            <Combobox buttonTitle={"Team"}
                                      size={"small"}
                                      icon={<Users size={12} className={"mr-1"}/>}
                                      ref={teamRef}
                            >
                                {getTeams(user).map((team) => (
                                    <ComboboxItem title={team}
                                                  key={team}
                                                  size={"small"}
                                                  onClick={() => setTeamSelected({isSelected: true, team: team})}
                                    />
                                ))}
                            </Combobox>
                            {teamSelected.isSelected &&
                                <Combobox buttonTitle={"Project"}
                                          size={"small"}
                                          icon={<BookCopy size={12} className={"mr-1"}/>}
                                          ref={projectRef}
                                >
                                    {getProjects(user, teamSelected.team).map((project) => (
                                        <ComboboxItem title={project}
                                                      key={project}
                                                      size={"small"}
                                        />
                                    ))}
                                </Combobox>
                            }
                            <DatePicker text={"Deadline"}
                                        iconSize={12}
                                        size={"small"}
                                        ref={datePickerRef}
                                        closeButton={true}
                                        dayFormat={"short"}
                            />
                        </div>
                        <div className={cn("flex flex-row space-x-2", className)}>
                            <Combobox buttonTitle={"Topic"}
                                      size={"small"}
                                      icon={<Tag size={12} className={"mr-1"}/>}
                                      ref={topicRef}
                            >
                                {getTopics(user).map((topic) => (
                                    <ComboboxItem title={topic}
                                                  key={topic}
                                                  size={"small"}
                                    />
                                ))}
                            </Combobox>
                            <Combobox buttonTitle={"Status"}
                                      size={"small"}
                                      icon={<CircleAlert size={12} className={"mr-1"}/>}
                                      ref={statusRef}
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
                                      ref={priorityRef}
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
                                   ref={durationRef}
                                   value={values.duration}
                                   icon={<Hourglass size={12}/>}
                                   onChange={(e) => values.duration == e.target.value}
                                   onKeyDown={handleKeyDown}
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
                />
            </Dialog>

            <Alert duration={3000} ref={alertRef} closeButton={false}>
                <AlertIcon icon={<SquareCheckBig/>}/>
                <AlertContent>
                    <AlertTitle title={"Task created successfully!"}></AlertTitle>
                    <AlertDescription
                        description={"You can now work with the task in your task-overview."}></AlertDescription>
                </AlertContent>
            </Alert>
        </>
    )
})
CreateTaskDialog.displayName = "CreateTaskDialog";

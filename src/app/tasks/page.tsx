"use client";

import React, {useEffect, useMemo, useRef, useState} from "react";
import {TaskTable} from "@/components/views/TaskTable";
import {CreateTaskDialog} from "@/components/dialogs/tasks/CreateTaskDialog";
import {CircleAlert, LineChart, LoaderCircle, SquarePen, Tag} from "lucide-react";
import {useUser} from "@/context/UserContext";
import {Button} from "@marraph/daisy/components/button/Button";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Filter, FilterRef, SelectedFilter} from "@/components/Filter";
import {getAllTopics} from "@/utils/getTypes";
import {TaskPlaceholder} from "@/components/placeholder/TaskPlaceholder";
import {Headbar} from "@/components/Headbar";
import {useTooltip} from "@marraph/daisy/components/tooltip/TooltipProvider";
import {useHotkeys} from "react-hotkeys-hook";
import {Task} from "@/action/task";
import {TaskElement, useTasks} from "@/context/TaskContext";


export default function Tasks() {
    const dialogRef = useRef<DialogRef>(null);
    const filterRef = useRef<FilterRef>(null);
    const [taskElements, setTaskElements] = useState<Task[]>([]);
    const [filters, setFilters] = useState<SelectedFilter[]>([]);
    const [update, setUpdate] = useState(0);

    const { user, organisations, teams } = useUser();
    const { tasks } = useTasks();

    const { addTooltip, removeTooltip } = useTooltip();

    useHotkeys('t', () => dialogRef.current?.show());

    const filterItems = useMemo(() => [
        { name: "Topic", values:  user && getAllTopics(user).map(topic => topic.title) || [], icon: <Tag size={16}/> },
        { name: "Status", values: ["PENDING", "PLANING", "STARTED", "TESTED", "FINISHED"] || [], icon: <CircleAlert size={16}/> },
        { name: "Priority", values: ["LOW", "MEDIUM", "HIGH"]  || [], icon: <LineChart size={16}/> },
    ], [user]);

    useEffect(() => {
        setFilters(filterRef.current?.getFilters() || []);
    }, [update]);

    useEffect(() => {
        let elements = tasks;
        if (filters.length > 0) {
            elements = tasks.filter(task => {
                return filters.every(filter => {
                    switch (filter.name) {
                        case 'Team' as keyof TaskElement:
                            return task.team?.name === filter.value;
                        case 'Project' as keyof TaskElement:
                            return task.project?.name === filter.value;
                        case 'Topic' as keyof TaskElement:
                            return task.topic?.title === filter.value;
                        case 'Status' as keyof TaskElement:
                            return task.state === filter.value;
                        case 'Priority' as keyof TaskElement:
                            return task.priority === filter.value;
                        default:
                            return false;
                    }
                });
            });
        }

        setTaskElements(elements);
    }, [filters, tasks]);

    if (!user) return null;

    return (
        <div className={"h-screen w-screen flex flex-col"}>
            <Headbar title={"Tasks"}/>

            <div className={"flex flex-col space-y-4 p-4 overflow-hidden"}>
                <div className={"flex flex-row items-center justify-between"}>
                    <div className={"flex flex-row items-center space-x-2"}>
                        <Button text={""}
                                theme={"primary"}
                                onClick={() => dialogRef.current?.show()}
                                icon={<SquarePen size={20}/>}
                                className={"px-2"}
                                onMouseEnter={(e) => {
                                    addTooltip({
                                        message: "Create a new task",
                                        shortcut: "T",
                                        anchor: "tl",
                                        trigger: e.currentTarget.getBoundingClientRect()
                                    });
                                }}
                                onMouseLeave={() => removeTooltip()}
                        />
                        <CreateTaskDialog ref={dialogRef}/>
                        <Filter title={"Filter"}
                                items={filterItems}
                                ref={filterRef}
                                onChange={() => setUpdate(update + 1)}
                        />
                        <div className={"flex flex-row space-x-1 text-zinc-400 dark:text-marcador"}>
                            <LoaderCircle size={14}/>
                            <span className={"text-xs"}>{taskElements.length + " OPEN"}</span>
                        </div>
                    </div>
                </div>

                <div className={"h-screen rounded-lg bg-zinc-100 dark:bg-black-light overflow-auto no-scrollbar border border-zinc-300 dark:border-edge"}>
                    {taskElements.length > 0 ?
                        <TaskTable taskElements={taskElements}/>
                        :
                        <div className={"h-full flex flex-row items-center justify-center"}>
                            <TaskPlaceholder dialogRef={dialogRef}/>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

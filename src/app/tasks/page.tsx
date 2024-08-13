"use client";

import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {TaskTable} from "@/components/views/TaskTable";
import {CreateTaskDialog} from "@/components/dialogs/tasks/CreateTaskDialog";
import {Box, CircleAlert, LineChart, LoaderCircle, SquarePen, Tag, Users} from "lucide-react";
import {useUser} from "@/context/UserContext";
import {Project, Task, TaskElement, Team} from "@/types/types";
import {Button} from "@marraph/daisy/components/button/Button";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Filter, FilterRef, SelectedFilter} from "@/components/Filter";
import {getAllProjects, getAllTopics} from "@/utils/getTypes";
import {TaskPlaceholder} from "@/components/placeholder/TaskPlaceholder";
import {Headbar} from "@/components/Headbar";
import {useToast} from "griller/src/component/toaster";
import {useTooltip} from "@marraph/daisy/components/tooltip/TooltipProvider";
import {TooltipAnchor} from "@marraph/daisy/components/tooltip/Tooltip";


export default function Tasks() {
    const dialogRef = useRef<DialogRef>(null);
    const filterRef = useRef<FilterRef>(null);
    const [taskElements, setTaskElements] = useState<TaskElement[]>([]);
    const [filters, setFilters] = useState<SelectedFilter[]>([]);
    const [update, setUpdate] = useState(0);
    const { data:user, isLoading:userLoading, error:userError } = useUser();
    const { addTooltip, removeTooltip } = useTooltip();
    const {addToast} = useToast();

    const filterItems = useMemo(() => [
        { name: "Team", values: user?.teams?.map(team => team.name) || [], icon: <Users size={16}/> },
        { name: "Project", values: user && getAllProjects(user).map(project => project.name) || [], icon: <Box size={16}/> },
        { name: "Topic", values:  user && getAllTopics(user).map(topic => topic.title) || [], icon: <Tag size={16}/> },
        { name: "Status", values: ["PENDING", "PLANING", "STARTED", "TESTED", "FINISHED"] || [], icon: <CircleAlert size={16}/> },
        { name: "Priority", values: ["LOW", "MEDIUM", "HIGH"]  || [], icon: <LineChart size={16}/> },
    ], [user]);

    const getTaskElements = useCallback((): TaskElement[] => {
        let taskElements: TaskElement[] = [];
        user?.teams?.forEach((team: Team) => {
            team.projects?.forEach((project: Project) => {
                project.tasks?.forEach((task: Task) => {
                    if (task.isArchived) return;
                    taskElements.push({
                        id: task.id,
                        name: task.name,
                        description: task.description,
                        topic: task.topic,
                        isArchived: task.isArchived,
                        duration: task.duration,
                        bookedDuration: task.bookedDuration,
                        deadline: task.deadline,
                        status: task.status,
                        priority: task.priority,
                        createdBy: task.createdBy,
                        createdDate: task.createdDate,
                        lastModifiedBy: task.lastModifiedBy,
                        lastModifiedDate: task.lastModifiedDate,
                        team: team,
                        project: project
                    });
                });
            });
        });
        return taskElements;
    }, [user]);

    useEffect(() => {
        setFilters(filterRef.current?.getFilters() || []);
    }, [update]);

    useEffect(() => {
        let elements = getTaskElements();
        if (filters.length > 0) {
            elements = elements.filter(element => {
                return filters.every(filter => {
                    switch (filter.name) {
                        case 'Team' as keyof TaskElement:
                            return element.team?.name === filter.value;
                        case 'Project' as keyof TaskElement:
                            return element.project?.name === filter.value;
                        case 'Topic' as keyof TaskElement:
                            return element.topic?.title === filter.value;
                        case 'Status' as keyof TaskElement:
                            return element.status === filter.value;
                        case 'Priority' as keyof TaskElement:
                            return element.priority === filter.value;
                        default:
                            return false;
                    }
                });
            });
        }

        setTaskElements(elements);
    }, [filters, getTaskElements]);

    if (!user) return null;

    return (
        <div className={"h-screen w-screen flex flex-col"}>
            <Headbar title={"Tasks"}/>

            <div className={"flex-grow flex flex-col space-y-4 p-4 overflow-hidden"}>
                <div className={"w-full flex flex-row items-center justify-between"}>
                    <div className={"flex flex-row items-center space-x-2"}>
                        <Button text={""}
                                theme={"primary"}
                                onClick={() => dialogRef.current?.show()}
                                icon={<SquarePen size={20}/>}
                                className={"px-2"}
                                onMouseEnter={(e) => {
                                    addTooltip({
                                        message: "Create a new task",
                                        trigger: { current: e.currentTarget }
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
                        <div className={"flex flex-row space-x-1"}>
                            <LoaderCircle size={14} className={"text-marcador"}/>
                            <span className={"text-xs text-marcador"}>{taskElements.length + " OPEN"}</span>
                        </div>
                    </div>
                </div>

                <div className={"flex-grow rounded-lg bg-black-light overflow-auto no-scrollbar border border-edge"}>
                    {taskElements.length > 0 ?
                        <TaskTable taskElements={taskElements}/>
                        :
                        <div className={"max-h-full flex flex-row items-center justify-center"}>
                            <TaskPlaceholder dialogRef={dialogRef}/>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

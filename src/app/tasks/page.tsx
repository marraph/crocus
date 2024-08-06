"use client";

import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {TaskTable} from "@/components/views/TaskTable";
import {CreateTaskDialog} from "@/components/dialogs/tasks/CreateTaskDialog";
import {LoaderCircle, SquarePen} from "lucide-react";
import {useUser} from "@/context/UserContext";
import {Project, Task, TaskElement, Team} from "@/types/types";
import {Button} from "@marraph/daisy/components/button/Button";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {CustomScroll} from "react-custom-scroll";
import {Filter, FilterRef, SelectedFilter} from "@/components/Filter";
import {getAllProjects, getAllTopics} from "@/utils/getTypes";


export default function Tasks() {
    const dialogRef = useRef<DialogRef>(null);
    const filterRef = useRef<FilterRef>(null);
    const [taskElements, setTaskElements] = useState<TaskElement[]>([]);
    const [filters, setFilters] = useState<SelectedFilter[]>([]);
    const [update, setUpdate] = useState(0);
    const { data:user, isLoading:userLoading, error:userError } = useUser();

    const filterItems = useMemo(() => [
        { name: "Team", values: user?.teams?.map(team => team.name) || [] },
        { name: "Project", values: user && getAllProjects(user).map(project => project.name) || [] },
        { name: "Topic", values:  user && getAllTopics(user).map(topic => topic.title) || [] },
        { name: "Status", values: ["PENDING", "PLANING", "STARTED", "TESTED", "FINISHED"] || [] },
        { name: "Priority", values: ["LOW", "MEDIUM", "HIGH"]  || [] }
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
        console.log(filters)
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
        <div className={"h-screen flex flex-col space-y-4 p-8"}>
            <div className={"w-full flex flex-row items-center text-nowrap justify-between"}>
                <div className={"flex flex-row items-center space-x-2 z-10"}>
                    <Button text={"Create Task"}
                            theme={"white"}
                            onClick={() => dialogRef.current?.show()}
                            icon={<SquarePen size={20} className={"mr-2"}/>}
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
            <div className={"overflow-hidden rounded-lg border border-edge"}>
                <CustomScroll>
                    <div className={"rounded-lg bg-black h-screen"}>
                        <TaskTable taskElements={taskElements}/>
                    </div>
                </CustomScroll>
            </div>
        </div>
    );
}

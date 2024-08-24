"use client";

import React, {useEffect, useMemo, useRef, useState} from "react";
import {TaskTable} from "@/components/views/TaskTable";
import {CreateTaskDialog} from "@/components/dialogs/tasks/CreateTaskDialog";
import {CircleAlert, LineChart, LoaderCircle, SquarePen, Tag} from "lucide-react";
import {useUser} from "@/context/UserContext";
import {Button} from "@marraph/daisy/components/button/Button";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {Filter, FilterRef, SelectedFilter} from "@/components/Filter";
import {TaskPlaceholder} from "@/components/placeholder/TaskPlaceholder";
import {Headbar} from "@/components/Headbar";
import {useTooltip} from "@marraph/daisy/components/tooltip/TooltipProvider";
import {useHotkeys} from "react-hotkeys-hook";
import {ComplexTask, useTasks} from "@/context/TaskContext";
import {getTopicsFromUser, Topic} from "@/action/topic";
import {getProjectsFromUser, Project} from "@/action/projects";

export default function Tasks() {
    const dialogRef = useRef<DialogRef>(null);
    const filterRef = useRef<FilterRef>(null);
    const [taskElements, setTaskElements] = useState<ComplexTask[]>([]);
    const [filters, setFilters] = useState<SelectedFilter[]>([]);
    const [update, setUpdate] = useState(0);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);

    const { user, organisations, teams } = useUser();
    const { tasks, loading, error, actions } = useTasks();

    const { addTooltip, removeTooltip } = useTooltip();

    useHotkeys('t', () => dialogRef.current?.show());

    const filterItems = useMemo(() => [
        { name: "Team", values: teams.map(team => team.name) || [], icon: <Tag size={16}/> },
        { name: "Project", values: projects.map(project => project.name) || [], icon: <Tag size={16}/> },
        { name: "Topic", values:  topics.map(topic => topic.name) || [], icon: <Tag size={16}/> },
        { name: "Status", values: ["PENDING", "PLANING", "STARTED", "TESTED", "FINISHED"] || [], icon: <CircleAlert size={16}/> },
        { name: "Priority", values: ["LOW", "MEDIUM", "HIGH"]  || [], icon: <LineChart size={16}/> },
    ], [projects, teams, topics]);

    useEffect(() => {
        if (user) {
            getTopicsFromUser(user.id).then(result => {
                if (result.success) setTopics(result.data);
            });
            getProjectsFromUser(user.id).then(result => {
                if (result.success) setProjects(result.data);
            })
        }
    }, [user]);

    useEffect(() => {
        setFilters(filterRef.current?.getFilters() || []);
    }, [update]);

    useEffect(() => {
        let elements = tasks;
        if (filters.length > 0) {
            elements = tasks.filter(task => {
                return filters.every(filter => {
                    switch (filter.name) {
                        case 'Team' as keyof ComplexTask:
                            return task.team?.name === filter.value;
                        case 'Project' as keyof ComplexTask:
                            return task.project?.name === filter.value;
                        case 'Topic' as keyof ComplexTask:
                            return task.topic?.name === filter.value;
                        case 'Status' as keyof ComplexTask:
                            return task.task?.state === filter.value;
                        case 'Priority' as keyof ComplexTask:
                            return task.task?.priority === filter.value;
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
                    {loading &&
                        <div></div>
                    }
                    {error &&
                        <div></div>
                    }

                    {!error && !loading && taskElements.length > 0 ?
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

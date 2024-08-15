import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    Table,
    TableAction,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@marraph/daisy/components/table/Table";
import {useRouter} from "next/navigation";
import {TaskContextMenu} from "@/components/contextmenus/TaskContextMenu";
import {TopicBadge} from "@/components/badges/TopicBadge";
import {StatusBadge} from "@/components/badges/StatusBadge";
import {PriorityBadge} from "@/components/badges/PriorityBadge";
import {Caret} from "@/components/badges/Caret";
import {CloseTaskDialog} from "@/components/dialogs/tasks/CloseTaskDialog";
import {DeleteTaskDialog} from "@/components/dialogs/tasks/DeleteTaskDialog";
import {EditTaskDialog} from "@/components/dialogs/tasks/EditTaskDialog";
import {Absence, Task, TaskElement} from "@/types/types";
import {cn} from "@/utils/cn";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {ProjectBadge} from "@/components/badges/ProjectBadge";
import {getSortedTaskTable, SortState} from "@/utils/sort";
import moment from "moment";
import {useTooltip} from "@marraph/daisy/components/tooltip/TooltipProvider";
import {useContextMenu} from "@/hooks/useContextMenu";

interface TaskProps {
    taskElements: TaskElement[];
}

export const TaskTable: React.FC<TaskProps> = ({ taskElements }) => {
    const router = useRouter();
    const deleteRef = useRef<DialogRef>(null);
    const editRef = useRef<DialogRef>(null);
    const closeRef = useRef<DialogRef>(null);
    const [focusTaskElement, setFocusTaskElement] = useState<TaskElement | null>(null);
    const [sort, setSort] = useState<SortState>({ key: "id", order: "asc" });
    const { addTooltip, removeTooltip } = useTooltip();
    const {contextMenu, handleContextMenu, closeContextMenu} = useContextMenu<TaskElement>();

    const header = useMemo(() => [
        { key: 'project', label: 'Project' },
        { key: 'name', label: 'Title' },
        { key: 'status', label: 'Status' },
        { key: 'deadline', label: 'Deadline' }
    ], []);

    const handleHeaderClick = useCallback((headerKey: string) => {
        setSort({
            key: headerKey,
            order: sort.key === headerKey ? (sort.order === "asc" ? "desc" : "asc") : "desc"
        })
    }, [sort.key, sort.order]);

    return (
        <>
            {focusTaskElement &&
                <>
                    <DeleteTaskDialog ref={deleteRef} taskElement={focusTaskElement}/>
                    <CloseTaskDialog ref={closeRef} taskElement={focusTaskElement}/>
                    <EditTaskDialog ref={editRef} taskElement={focusTaskElement}/>
                </>
            }

            {contextMenu.visible && contextMenu.item &&
                <TaskContextMenu
                    taskId={contextMenu.item.id}
                    x={contextMenu.x}
                    y={contextMenu.y}
                    deleteRef={deleteRef}
                    closeRef={closeRef}
                    editRef={editRef}
                />
            }

            <Table className={"w-full text-xs border-0"}>
                <TableHeader>
                    <TableRow className={cn("", taskElements.length === 0 ? "border-x-0 border-t-0 border-1 border-b border-b-edge" : "border-none")}>
                        {header.map((header) => (
                            <TableHead className={"min-w-28 max-w-32 overflow-hidden"}
                                       key={header.key}
                                       onClick={() => handleHeaderClick(header.key)}>
                                <span className={"flex flex-row items-center"}>
                                    {header.label}
                                    {header.key === sort.key &&
                                        <Caret direction={sort.key === header.key ? sort.order : "asc"}/>
                                    }
                                </span>
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody className={"text-sm"}>
                    {getSortedTaskTable(taskElements, sort).map((taskElement, index) => (
                        <TableRow key={taskElement.id}
                                  className={cn({"border-b border-b-edge": index === getSortedTaskTable(taskElements, sort).length - 1})}
                                  onClick={() => router.push(`/tasks/${taskElement.id}`)}
                                  onContextMenu={(e) => {
                                      handleContextMenu(e, taskElement);
                                      setFocusTaskElement(taskElement);
                                  }}
                        >
                            <TableCell>
                                <div className={"flex flex-row items-center space-x-2"}>
                                    {taskElement.project &&
                                        <ProjectBadge
                                            title={taskElement.project.name}
                                            onMouseEnter={(e) => {
                                                addTooltip({
                                                    message: "Project: " + taskElement.project?.name,
                                                    anchor: "tl",
                                                    trigger: e.currentTarget.getBoundingClientRect()
                                                });
                                            }}
                                            onMouseLeave={() => removeTooltip()}
                                        />

                                    }
                                    {taskElement.topic &&
                                        <TopicBadge
                                            title={taskElement.topic.title}
                                            color={"error"}
                                            onMouseEnter={(e) => {
                                                addTooltip({
                                                    message: "Topic: " + taskElement.topic?.title,
                                                    anchor: "tl",
                                                    trigger: e.currentTarget.getBoundingClientRect()
                                                });
                                            }}
                                            onMouseLeave={() => removeTooltip()}
                                        />
                                    }
                                    {taskElement.priority &&
                                        <PriorityBadge
                                            priority={taskElement.priority}
                                            onMouseEnter={(e) => {
                                                addTooltip({
                                                    message: "Priority: " + taskElement.priority,
                                                    anchor: "tl",
                                                    trigger: e.currentTarget.getBoundingClientRect()
                                                });
                                            }}
                                            onMouseLeave={() => removeTooltip()}
                                        />
                                    }
                                </div>
                            </TableCell>
                            <TableCell className={"text-white truncate"}>
                                {taskElement.name}
                            </TableCell>
                            <TableCell>
                                <StatusBadge title={taskElement.status?.toString()} color={"warning"}/>
                            </TableCell>
                            <TableCell className={"text-xs"}>
                                {moment(taskElement.deadline?.toString()).format('MMM D YYYY')}
                            </TableCell>
                            <TableAction onClick={(e) => {
                                handleContextMenu(e, taskElement);
                                setFocusTaskElement(taskElement);
                            }}
                            />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}
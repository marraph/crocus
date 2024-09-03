import React, {useCallback, useMemo, useRef, useState} from "react";
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
import {cn} from "@/utils/cn";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {ProjectBadge} from "@/components/badges/ProjectBadge";
import {getSortedTaskTable, SortState} from "@/utils/sort";
import moment from "moment";
import {useTooltip} from "@marraph/daisy/components/tooltip/TooltipProvider";
import {ComplexTask} from "@/utils/object-helpers";
import {useContextMenu} from "@marraph/daisy/hooks/useContextMenu";
import {useOutsideClick} from "@marraph/daisy/hooks/useOutsideClick";

interface TaskProps {
    tasks: ComplexTask[];
}

export const TaskTable: React.FC<TaskProps> = ({ tasks }) => {
    const router = useRouter();
    const deleteRef = useRef<DialogRef>(null);
    const editRef = useRef<DialogRef>(null);
    const closeRef = useRef<DialogRef>(null);

    const [focusTaskElement, setFocusTaskElement] = useState<ComplexTask | null>(null);
    const [sort, setSort] = useState<SortState>({ key: "id", order: "asc" });
    const {addTooltip, removeTooltip} = useTooltip();
    const {contextMenu, handleContextMenu, closeContextMenu } = useContextMenu();
    const contextRef = useOutsideClick(() => closeContextMenu());

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
                    <DeleteTaskDialog ref={deleteRef} task={focusTaskElement.task}/>
                    <CloseTaskDialog ref={closeRef} task={focusTaskElement.task}/>
                    <EditTaskDialog ref={editRef} task={focusTaskElement}/>
                </>
            }

            {contextMenu.visible && focusTaskElement?.task.id &&
                <TaskContextMenu
                    taskId={focusTaskElement.task.id}
                    x={contextMenu.x}
                    y={contextMenu.y}
                    contextRef={contextRef}
                    deleteRef={deleteRef}
                    closeRef={closeRef}
                    editRef={editRef}
                />
            }

            <Table className={"w-full text-xs border-0 rounded-b-none"}>
                <TableHeader>
                    <TableRow className={cn("", tasks.length === 0 ? "border-x-0 border-t-0 border-1 border-b border-b-zinc-300 dark:border-b-edge" : "border-none")}>
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
                    {getSortedTaskTable(tasks, sort).map((task) => (
                        <TableRow key={task.id}
                                  className={cn("last:border-b last:border-b-zinc-300 dark:last:border-b-edge")}
                                  onClick={() => router.push(`/tasks/${task.id}`)}
                                  onContextMenu={(e) => {
                                      handleContextMenu(e);
                                      setFocusTaskElement(task);
                                  }}
                        >
                            <TableCell>
                                <div className={"flex flex-row items-center space-x-2"}>
                                    {task.project &&
                                        <ProjectBadge
                                            title={task.project.name}
                                            onMouseEnter={(e) => {
                                                addTooltip({
                                                    message: "Project: " + task.project?.name,
                                                    anchor: "tl",
                                                    trigger: e.currentTarget.getBoundingClientRect()
                                                });
                                            }}
                                            onMouseLeave={() => removeTooltip()}
                                        />

                                    }
                                    {task.topicItem &&
                                        <TopicBadge
                                            title={task.topicItem.name}
                                            color={"error"}
                                            onMouseEnter={(e) => {
                                                addTooltip({
                                                    message: "Topic: " + task.topicItem?.name,
                                                    anchor: "tl",
                                                    trigger: e.currentTarget.getBoundingClientRect()
                                                });
                                            }}
                                            onMouseLeave={() => removeTooltip()}
                                        />
                                    }
                                    {task.priority &&
                                        <PriorityBadge
                                            priority={task.priority}
                                            onMouseEnter={(e) => {
                                                addTooltip({
                                                    message: "Priority: " + task.priority,
                                                    anchor: "tl",
                                                    trigger: e.currentTarget.getBoundingClientRect()
                                                });
                                            }}
                                            onMouseLeave={() => removeTooltip()}
                                        />
                                    }
                                </div>
                            </TableCell>
                            <TableCell className={"text-zinc-800 dark:text-white truncate"}>
                                {task.name}
                            </TableCell>
                            <TableCell>
                                <StatusBadge title={task.state?.toString()}/>
                            </TableCell>
                            <TableCell className={"text-xs"}>
                                {moment(task.deadline?.toString()).format('MMM D YYYY')}
                            </TableCell>
                            <TableAction
                                 actionMenu={
                                    <TaskContextMenu
                                        taskId={task.task.id}
                                        x={contextMenu.x}
                                        y={contextMenu.y}
                                        contextRef={contextRef}
                                        deleteRef={deleteRef}
                                        closeRef={closeRef}
                                        editRef={editRef}
                                    />
                                }
                                 onClose={() => setFocusTaskElement(null)}
                            />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}
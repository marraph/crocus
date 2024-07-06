import React, {useEffect, useRef, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@marraph/daisy/components/table/Table";
import {useRouter} from "next/navigation";
import {TaskContextMenu} from "@/components/contextmenus/TaskContextMenu";
import {TopicBadge} from "@/components/badges/TopicBadge";
import {StatusBadge} from "@/components/badges/StatusBadge";
import {PriorityBadge} from "@/components/badges/PriorityBadge";
import {Caret} from "@/components/badges/Caret";
import {CloseTaskDialog} from "@/components/dialogs/tasks/CloseTaskDialog";
import {DeleteTaskDialog} from "@/components/dialogs/tasks/DeleteTaskDialog";
import {EditTaskDialog} from "@/components/dialogs/tasks/EditTaskDialog";
import {TaskElement} from "@/types/types";
import {formatDate} from "@/utils/format";
import {cn} from "@/utils/cn";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {ProjectBadge} from "@/components/badges/ProjectBadge";
import {Button} from "@marraph/daisy/components/button/Button";
import {EllipsisVertical} from "lucide-react";
import {getSortedTaskTable, SortState} from "@/utils/sort";

interface TaskProps {
    taskElements: TaskElement[];
}

export const TaskTable: React.FC<TaskProps> = ({ taskElements }) => {
    const router = useRouter();
    const deleteRef = useRef<DialogRef>(null);
    const editRef = useRef<DialogRef>(null);
    const closeRef = useRef<DialogRef>(null);
    const [contextMenu, setContextMenu] = useState({ id: -1 , x: 0, y: 0, visible: false });
    const [focusTaskElement, setFocusTaskElement] = useState<TaskElement | null>(null);
    const [sort, setSort] = useState<SortState>({ key: "id", order: "asc" });

    const header = [
        { key: "project", label: "Project" },
        { key: "name", label: "Title" },
        { key: "status", label: "Status" },
        { key: "deadline", label: "Deadline" },
    ];

    useEffect(() => {
        const handleClick = () => setContextMenu({ ...contextMenu, visible: false});
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [contextMenu]);

    const handleContextMenu = (e: React.MouseEvent<HTMLElement>, taskElement: TaskElement) => {
        e.preventDefault();
        e.stopPropagation();

        setFocusTaskElement(taskElement);
        console.log(e.target)

        if (e.target instanceof HTMLButtonElement || e.target instanceof SVGElement) {
            const buttonElement = e.currentTarget;
            const rect = buttonElement.getBoundingClientRect();

            const coordinates = {
                x: rect.left - 52,
                y: rect.top + 34
            };
            setContextMenu({ id: taskElement.id, x: coordinates.x, y: coordinates.y, visible: true });
        } else {
            setContextMenu({id: taskElement.id, x: e.clientX, y: e.clientY, visible: true});
        }
    };

    const handleHeaderClick = (headerKey: string) => {
        setSort({
            key: headerKey,
            order: sort.key === headerKey ? (sort.order === "asc" ? "desc" : "asc") : "desc"
        })
    }

    return (
        <>
            {focusTaskElement &&
                <>
                    <DeleteTaskDialog ref={deleteRef} taskElement={focusTaskElement}/>
                    <CloseTaskDialog ref={closeRef} taskElement={focusTaskElement}/>
                    <EditTaskDialog ref={editRef} taskElement={focusTaskElement}/>
                </>
            }

            {contextMenu.visible &&
                <TaskContextMenu taskId={contextMenu.id} x={contextMenu.x} y={contextMenu.y} deleteRef={deleteRef} closeRef={closeRef} editRef={editRef}/>
            }

            <Table className={"bg-black w-full text-xs border-0 no-scrollbar"}>
                <TableHeader>
                    <TableRow className={cn("hover:bg-black", taskElements.length === 0 ? "border-x-0 border-t-0 border-1 border-b border-b-white" : "border-none")}>
                        {header.map((header) => (
                            <TableHead className={"text-placeholder text-sm min-w-28 max-w-32 overflow-hidden"}
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
                                  onClick={() => router.push(`/tasks/${taskElement.id}`)}
                                  onContextMenu={(event) => handleContextMenu(event, taskElement)}
                                  className={index === getSortedTaskTable(taskElements, sort).length - 1 ? " border-b border-b-white" : ""}>
                            <TableCell>
                                <div className={"flex flex-row items-center space-x-2"}>
                                    <PriorityBadge priority={taskElement.priority}/>
                                    {taskElement.project &&
                                        <ProjectBadge title={taskElement.project?.name}/>
                                    }
                                    <TopicBadge title={taskElement.topic?.title} color={"error"}/>
                                </div>
                            </TableCell>
                            <TableCell className={"text-white truncate"}>
                                {taskElement.name}
                            </TableCell>
                            <TableCell>
                                <StatusBadge title={taskElement.status?.toString()} color={"warning"}/>
                            </TableCell>
                            <TableCell className={"flex flex-row space-x-4 items-center justify-between text-xs"}>
                                {formatDate(taskElement.deadline?.toString())}
                                <Button text={""}
                                        className={"p-1.5 ml-4"}
                                        onClick={(e) => {e.stopPropagation(); handleContextMenu(e, taskElement);}}>
                                    <EllipsisVertical size={16}/>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}
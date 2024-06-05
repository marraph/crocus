import React, {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@marraph/daisy/components/table/Table";
import {Avatar} from "@marraph/daisy/components/avatar/Avatar";
import {useRouter} from "next/navigation";
import {TaskContextMenu} from "@/components/contextmenus/TaskContextMenu";
import {TopicBadge} from "@/components/badges/TopicBadge";
import {StatusBadge} from "@/components/badges/StatusBadge";
import {PriorityBadge} from "@/components/badges/PriorityBadge";
import {Caret} from "@/components/badges/Caret";
import {CloseTaskDialog} from "@/components/dialogs/CloseTaskDialog";
import {DeleteTaskDialog} from "@/components/dialogs/DeleteTaskDialog";
import {EditTaskDialog} from "@/components/dialogs/EditTaskDialog";
import {Project, Team} from "@/types/types";
import {TaskElement} from "@/app/tasks/page";
import {formatDate} from "@/utils/format";

const path = "/image.png";

const header = [
    { key: "id", label: "Id" },
    { key: "team", label: "Team" },
    { key: "project", label: "Project" },
    { key: "priority", label: "Priority" },
    { key: "topic", label: "Topic" },
    { key: "title", label: "Title" },
    { key: "status", label: "Status" },
    { key: "dueDate", label: "DueDate" },
    { key: "createdAt", label: "CreatedAt" },
    { key: "creator", label: "Creator" },
];

interface TaskProps {
    taskElements: TaskElement[];
}

export const TaskTable: React.FC<TaskProps> = ({ taskElements }) => {
    type SortOrder = "asc" | "desc";
    type SortState = { key: string; order: SortOrder; };

    const router = useRouter();
    const [contextMenu, setContextMenu] = useState({ id: -1 , x: 0, y: 0, visible: false });
    const [sort, setSort] = useState<SortState>({ key: "id", order: "asc" });

    const deleteRef = React.useRef<HTMLDialogElement>(null);
    const editRef = React.useRef<HTMLDialogElement>(null);
    const closeRef = React.useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const handleClick = () => setContextMenu({ ...contextMenu, visible: false});
        document.addEventListener('click', handleClick);
            return () => document.removeEventListener('click', handleClick);
    }, [contextMenu]);

    const handleContextMenu = (e: React.MouseEvent<HTMLTableRowElement>, id: number) => {
        e.preventDefault();
        setContextMenu({ id, x: e.clientX, y: e.clientY, visible: true });
    };

    function handleHeaderClick(headerKey: string) {
        setSort({
            key: headerKey,
            order: sort.key === headerKey ? (sort.order === "asc" ? "desc" : "asc") : "desc"
        })
    }

    function getSortedArray(array: TaskElement[]) {
        return array.sort((a: TaskElement, b: TaskElement) => {
            const aValue = a[sort.key as keyof TaskElement];
            const bValue = b[sort.key as keyof TaskElement];

            if (aValue < bValue) return sort.order === "asc" ? -1 : 1;
            if (aValue > bValue) return sort.order === "asc" ? 1 : -1;
            return 0;
        });
    }

    return (
        <>
            <DeleteTaskDialog ref={deleteRef} buttonTrigger={false}/>
            <CloseTaskDialog ref={closeRef} buttonTrigger={false}/>
            <EditTaskDialog ref={editRef} buttonTrigger={false}/>

            {contextMenu.visible &&
                <TaskContextMenu taskId={contextMenu.id} x={contextMenu.x} y={contextMenu.y} deleteRef={deleteRef} closeRef={closeRef} editRef={editRef}/>
            }

            <div className={"w-full h-full text-xs flex items-stretch pt-4"}>
                <Table className={"bg-black w-full"}>
                    <TableHeader>
                        <TableRow className={"border-none hover:bg-black"}>
                            {header.map((header) => (
                                <TableHead className={"text-placeholder text-sm w-max min-w-28"} key={header.key}
                                           onClick={() => handleHeaderClick(header.key)}>
                                    <span className={"flex flex-row items-center"}>
                                        {header.label}
                                        {header.key === sort.key && (
                                            <Caret direction={sort.key === header.key ? sort.order : "asc"}/>
                                        )}
                                    </span>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody className={"text-sm"}>
                        {getSortedArray(taskElements).map((taskElement) => (
                            <TableRow key={taskElement.task.id} onClick={() => router.push(`/tasks/${taskElement.task.id}`)}
                                      onContextMenu={(event) => handleContextMenu(event, taskElement.task.id)}>
                                <TableCell>{taskElement.task.id}</TableCell>
                                <TableCell>{taskElement.team.name}</TableCell>
                                <TableCell>{taskElement.project.name}</TableCell>
                                <TableCell>
                                    <PriorityBadge priority={taskElement.task.priority}/>
                                </TableCell>
                                <TableCell>
                                    <TopicBadge title={taskElement.task.topic.title} color={"error"}/>
                                </TableCell>
                                <TableCell className={"text-white"}>{taskElement.task.name}</TableCell>
                                <TableCell>
                                    <StatusBadge title={taskElement.task.status} color={"warning"}/>
                                </TableCell>
                                <TableCell>{formatDate(taskElement.task.deadline.toString())}</TableCell>
                                <TableCell>{formatDate(taskElement.task.createdDate.toString())}</TableCell>
                                <TableCell className={"flex flex-row space-x-2 items-center"}>
                                    <span>{taskElement.task.createdBy.name}</span>
                                    <Avatar img_url={path} size={20} className={"p-0"}/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}
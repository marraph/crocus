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
import {Status, TaskElement} from "@/types/types";
import {formatDate} from "@/utils/format";
import {ProfileBadge} from "@/components/badges/ProfileBadge";

const path = "/image.png";

const header = [
    { key: "id", label: "Id" },
    { key: "team", label: "Team" },
    { key: "project", label: "Project" },
    { key: "priority", label: "Priority" },
    { key: "topic", label: "Topic" },
    { key: "name", label: "Title" },
    { key: "status", label: "Status" },
    { key: "deadline", label: "Deadline" },
    { key: "createdBy", label: "Creator" },
];

type SortOrder = "asc" | "desc";
type SortState = { key: string; order: SortOrder; };


interface TaskProps {
    taskElements: TaskElement[];
}

export const TaskTable: React.FC<TaskProps> = ({ taskElements }) => {
    const deleteRef = React.useRef<HTMLDialogElement>(null);
    const editRef = React.useRef<HTMLDialogElement>(null);
    const closeRef = React.useRef<HTMLDialogElement>(null);
    const [contextMenu, setContextMenu] = useState({ id: -1 , x: 0, y: 0, visible: false });
    const [focusTaskElement, setFocusTaskElement] = useState<TaskElement | null>(null);
    const [sort, setSort] = useState<SortState>({ key: "id", order: "asc" });
    const router = useRouter();

    useEffect(() => {
        const handleClick = () => setContextMenu({ ...contextMenu, visible: false});
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [contextMenu]);

    const handleContextMenu = (e: React.MouseEvent<HTMLTableRowElement>, taskElement: TaskElement) => {
        e.preventDefault();
        setFocusTaskElement(taskElement);
        setContextMenu({ id: taskElement.id, x: e.clientX, y: e.clientY, visible: true });
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

            let aComparable = aValue;
            let bComparable = bValue;

            if (sort.key === 'team' || sort.key === 'project' || sort.key === 'createdBy') {
                aComparable = aValue ? (aValue as any).name : '';
                bComparable = bValue ? (bValue as any).name : '';
            }

            if (sort.key === 'createdDate' || sort.key === 'deadline') {
                aComparable = aValue ? new Date(aValue as Date).getDate() : 0;
                bComparable = bValue ? new Date(bValue as Date).getDate() : 0;
            }

            if (sort.key === 'topic') {
                aComparable = aValue ? (aValue as any).title : '';
                bComparable = bValue ? (bValue as any).title : '';
            }

            if (sort.key === 'priority') {
                const priorityOrder = {LOW: 1, MEDIUM: 2, HIGH: 3};
                const aPriority = aComparable ? priorityOrder[aComparable as keyof typeof priorityOrder] : 0;
                const bPriority = bComparable ? priorityOrder[bComparable as keyof typeof priorityOrder] : 0;

                if (aPriority && bPriority) {
                    if (aPriority < bPriority) return sort.order === "asc" ? -1 : 1;
                    if (aPriority > bPriority) return sort.order === "asc" ? 1 : -1;
                }
            }
            if (sort.key === 'status') {
                const statusOrder = {PENDING: 1, PLANING: 2, STARTED: 3, TESTED: 4, FINISHED: 5, ARCHIVED: 6};
                const aStatus = aComparable ? statusOrder[aComparable as keyof typeof statusOrder] : 0;
                const bStatus = bComparable ? statusOrder[bComparable as keyof typeof statusOrder] : 0;

                if (aStatus && bStatus) {
                    if (aStatus < bStatus) return sort.order === "asc" ? -1 : 1;
                    if (aStatus > bStatus) return sort.order === "asc" ? 1 : -1;
                }
            }
            else {
                if (aComparable && bComparable) {
                    if (aComparable < bComparable) return sort.order === "asc" ? -1 : 1;
                    if (aComparable > bComparable) return sort.order === "asc" ? 1 : -1;
                }

            }
            return 0;
        });
    }

    return (
        <>
            {focusTaskElement &&
                <>
                    <DeleteTaskDialog ref={deleteRef} taskElement={focusTaskElement} buttonTrigger={false}/>
                    <CloseTaskDialog ref={closeRef} taskElement={focusTaskElement} buttonTrigger={false}/>
                    <EditTaskDialog ref={editRef} taskElement={focusTaskElement} buttonTrigger={false}/>
                </>
            }

            {contextMenu.visible &&
                <TaskContextMenu taskId={contextMenu.id} x={contextMenu.x} y={contextMenu.y} deleteRef={deleteRef} closeRef={closeRef} editRef={editRef}/>
            }

            <div className={"w-full h-[852px] text-xs flex items-stretch pt-4"}>
                <Table className={"bg-black w-full no-scrollbar"}>
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
                            <TableRow key={taskElement.id} onClick={() => router.push(`/tasks/${taskElement.id}`)}
                                      onContextMenu={(event) => handleContextMenu(event, taskElement)}>
                                <TableCell>{taskElement.id}</TableCell>
                                <TableCell>{taskElement.team?.name}</TableCell>
                                <TableCell>{taskElement.project?.name}</TableCell>
                                <TableCell>
                                    <PriorityBadge priority={taskElement.priority?.toString()}/>
                                </TableCell>
                                <TableCell>
                                    <TopicBadge title={taskElement.topic?.title} color={"error"}/>
                                </TableCell>
                                <TableCell className={"text-white"}>{taskElement.name}</TableCell>
                                <TableCell>
                                    <StatusBadge title={taskElement.status?.toString()} color={"warning"}/>
                                </TableCell>
                                <TableCell>{formatDate(taskElement.deadline?.toString())}</TableCell>
                                <TableCell>
                                    <ProfileBadge name={taskElement.createdBy.name}/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}
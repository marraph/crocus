import React, {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@marraph/daisy/components/table/Table";
import {Avatar} from "@marraph/daisy/components/avatar/Avatar";
import {useRouter} from "next/navigation";
import {TaskContext} from "@/components/contextmenus/TaskContext";
import {TopicBadge} from "@/components/badges/TopicBadge";
import {StatusBadge} from "@/components/badges/StatusBadge";
import {PriorityBadge} from "@/components/badges/PriorityBadge";
import {Caret} from "@/components/badges/Caret";

const path = "/image.png";

const tasks = [
    {
        id: 12,
        team: "Frontend",
        project: "ServerAPI",
        topic: "bug",
        title: "Response doesnt work",
        priority: "high",
        status: "todo",
        createdAt: "April 18",
        creator: "mvriu5",
        dueDate: "May 15"
    },
    {
        id: 13,
        team: "Frontend",
        project: "ServerAPI",
        topic: "bug",
        title: "Response doesnt work v2",
        priority: "medium",
        status: "todo",
        createdAt: "April 19",
        creator: "mvriu5",
        dueDate: "May 15"
    },
    {
        id: 2,
        team: "Frontend",
        project: "ServerAPI",
        topic: "bug",
        title: "Response doesnt work v3",
        priority: "low",
        status: "todo",
        createdAt: "April 19",
        creator: "mvriu5",
        dueDate: "May 15"
    },
]

type Task = {
    id: number;
    team: string;
    project: string;
    priority: string;
    topic: string;
    title: string;
    status: string;
    dueDate: string;
    createdAt: string;
    creator: string;
};

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

export function TaskTable() {
    type SortOrder = "asc" | "desc";
    type SortState = { key: string; order: SortOrder; };

    const router = useRouter();
    const [contextMenu, setContextMenu] = useState({ id: -1 , x: 0, y: 0, visible: false });
    const [sort, setSort] = useState<SortState>({ key: "id", order: "asc" });

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

    function getSortedArray(array: Task[]) {
        return array.sort((a: Task, b: Task) => {
            const aValue = a[sort.key as keyof Task];
            const bValue = b[sort.key as keyof Task];

            if (aValue < bValue) return sort.order === "asc" ? -1 : 1;
            if (aValue > bValue) return sort.order === "asc" ? 1 : -1;
            return 0;
        });
    }

    return (
        <>
            {contextMenu.visible &&
                <TaskContext taskId={contextMenu.id} x={contextMenu.x} y={contextMenu.y}/>
            }
            <div className={"w-full h-full text-xs flex items-stretch pt-4"}>
                <Table className={"bg-black w-full"}>
                    <TableHeader>
                        <TableRow className={"border-none hover:bg-black"}>
                            {header.map((header) => (
                                <TableHead className={"text-placeholder text-sm w-max min-w-28"} key={header.key} onClick={() => handleHeaderClick(header.key)}>
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
                        {getSortedArray(tasks).map((task) => (
                            <TableRow key={task.id} onClick={() => router.push(`/tasks/${task.id}`)} onContextMenu={(event) => handleContextMenu(event, task.id)}>
                                <TableCell>{task.id}</TableCell>
                                <TableCell>{task.team}</TableCell>
                                <TableCell>{task.project}</TableCell>
                                <TableCell>
                                    <PriorityBadge priority={task.priority}/>
                                </TableCell>
                                <TableCell>
                                    <TopicBadge title={task.topic} color={""}/>
                                </TableCell>
                                <TableCell className={"text-white"}>{task.title}</TableCell>
                                <TableCell>
                                    <StatusBadge title={task.status} color={""}/>
                                </TableCell>
                                <TableCell>{task.dueDate}</TableCell>
                                <TableCell>{task.createdAt}</TableCell>
                                <TableCell className={"flex flex-row space-x-2 items-center"}>
                                    <span>{task.creator}</span>
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
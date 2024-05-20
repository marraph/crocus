import React, {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@marraph/daisy/components/table/Table";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {Avatar} from "@marraph/daisy/components/avatar/Avatar";
import {useRouter} from "next/navigation";
import {TaskContext} from "@/components/contextmenus/TaskContext";
import {SignalHigh, SignalLow, SignalMedium} from "lucide-react";
import {event} from "next/dist/build/output/log";
import {TopicBadge} from "@/components/badges/TopicBadge";
import {StatusBadge} from "@/components/badges/StatusBadge";
import {PriorityBadge} from "@/components/badges/PriorityBadge";

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

export function TaskTable() {
    const router = useRouter();
    const [contextMenu, setContextMenu] = useState({ id: -1 , x: 0, y: 0, visible: false });

    useEffect(() => {
        const handleClick = () => setContextMenu({ ...contextMenu, visible: false});
        document.addEventListener('click', handleClick);
            return () => document.removeEventListener('click', handleClick);
    }, [contextMenu]);

    const handleContextMenu = (e: React.MouseEvent<HTMLTableRowElement>, id: number) => {
        e.preventDefault();
        setContextMenu({ id, x: e.clientX, y: e.clientY, visible: true });
    };

    return (
        <>
            {contextMenu.visible &&
                <TaskContext taskId={contextMenu.id} x={contextMenu.x} y={contextMenu.y}/>
            }
            <div className={"w-full h-full text-xs flex items-stretch pt-4 pb-8 px-8"}>
                <Table className={"bg-black w-full"}>
                    <TableHeader>
                        <TableRow className={"border-none hover:bg-black"}>
                            <TableHead className={"text-placeholder"}>ID</TableHead>
                            <TableHead className={"text-placeholder"}>Team</TableHead>
                            <TableHead className={"text-placeholder"}>Project</TableHead>
                            <TableHead className={"text-placeholder"}>Priority</TableHead>
                            <TableHead className={"text-placeholder"}>Topic</TableHead>
                            <TableHead className={"text-placeholder"}>Title</TableHead>
                            <TableHead className={"text-placeholder"}>Status</TableHead>
                            <TableHead className={"text-placeholder"}>DueDate</TableHead>
                            <TableHead className={"text-placeholder"}>CreatedAt</TableHead>
                            <TableHead className={"text-placeholder"}>Creator</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className={"text-sm"}>
                        {tasks.map((task) => (
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
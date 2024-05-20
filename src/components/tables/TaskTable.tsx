import React, {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@marraph/daisy/components/table/Table";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {Avatar} from "@marraph/daisy/components/avatar/Avatar";
import {useRouter} from "next/navigation";
import {TaskContext} from "@/components/contextmenus/TaskContext";
import {SignalHigh, SignalLow, SignalMedium} from "lucide-react";
import {event} from "next/dist/build/output/log";

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
                            <TableHead>ID</TableHead>
                            <TableHead>Team</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Topic</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>DueDate</TableHead>
                            <TableHead>CreatedAt</TableHead>
                            <TableHead>Creator</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className={"text-sm"}>
                        {tasks.map((task) => (
                            <TableRow key={task.id} onClick={() => router.push(`/tasks/${task.id}`)} onContextMenu={(event) => handleContextMenu(event, task.id)}>
                                <TableCell>{task.id}</TableCell>
                                <TableCell>{task.team}</TableCell>
                                <TableCell>{task.project}</TableCell>
                                <TableCell>
                                    {task.priority === 'low' && <SignalLow strokeWidth={3} />}
                                    {task.priority === 'medium' && <SignalMedium strokeWidth={3} />}
                                    {task.priority === 'high' && <SignalHigh strokeWidth={3} />}
                                </TableCell>
                                <TableCell>
                                    <Badge text={task.topic} className={"w-max bg-error text-error font-normal  px-2 py-0.5 bg-opacity-20 rounded-lg"}></Badge>
                                </TableCell>
                                <TableCell className={"text-white"}>{task.title}</TableCell>
                                <TableCell>
                                    <Badge text={task.status} className={"w-max bg-warning font-normal text-warning px-2 py-0.5 bg-opacity-20 rounded-md"}></Badge>
                                </TableCell>
                                <TableCell>{task.dueDate}</TableCell>
                                <TableCell>{task.createdAt}</TableCell>
                                <TableCell className={"flex flex-row space-x-2 items-center"}>
                                    <span>{task.creator}</span>
                                    <Avatar img_url={path} height={20} width={20} className={"p-0"}/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}
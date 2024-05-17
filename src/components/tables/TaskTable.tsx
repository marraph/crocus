import React from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@marraph/daisy/components/table/Table";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {Avatar} from "@marraph/daisy/components/avatar/Avatar";
import {useRouter} from "next/navigation";

const path = "/image.png";

export function TaskTable() {
    const tasks = [
        {
            id: "12",
            team: "Frontend",
            project: "ServerAPI",
            topic: "bug",
            title: "Response doesnt work",
            priority: "High",
            status: "todo",
            changedAt: "April 20, 2024",
            createdAt: "April 18, 2024",
            creator: "mvriu5",
        },
        {
            id: "13",
            team: "Frontend",
            project: "ServerAPI",
            topic: "bug",
            title: "Response doesnt work v2",
            priority: "High",
            status: "todo",
            changedAt: "April 21, 2024",
            createdAt: "April 19, 2024",
            creator: "mvriu5",
        },
    ]

    const router = useRouter();

    return (
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
                        <TableHead>ChangedAt</TableHead>
                        <TableHead>CreatedAt</TableHead>
                        <TableHead>Creator</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className={"text-sm"}>
                    {tasks.map((task) => (
                        <TableRow key={task.id} onClick={() => router.push(`/tasks/${task.id}`)}>
                            <TableCell>{task.id}</TableCell>
                            <TableCell>{task.team}</TableCell>
                            <TableCell>{task.project}</TableCell>
                            <TableCell>{task.priority}</TableCell>
                            <TableCell>
                                <Badge text={task.topic} className={"w-max bg-error text-error px-2 py-0.5"}></Badge>
                            </TableCell>
                            <TableCell className={"text-white"}>{task.title}</TableCell>
                            <TableCell>{task.status}</TableCell>
                            <TableCell>{task.changedAt}</TableCell>
                            <TableCell>{task.createdAt}</TableCell>
                            <TableCell className={"flex flex-row space-x-2 items-center"}>
                                <span>{task.creator}</span>
                                <Avatar img_url={path} height={25} width={25} className={"p-0"}/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
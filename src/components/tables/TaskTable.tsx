import React from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@marraph/daisy/components/table/Table";

export function TaskTable() {
    const tasks = [
        {
            id: "12",
            team: "Frontend",
            project: "ServerAPI",
            topic: "bug",
            title: "Response doesnt work",
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
            status: "todo",
            changedAt: "April 21, 2024",
            createdAt: "April 19, 2024",
            creator: "mvriu5",
        },
    ]

    return (
        <div className={"w-full h-full flex items-stretch pt-2 pb-8 px-8"}>
            <Table className={"bg-black w-full"}>
                <TableHeader>
                    <TableRow className={"border-none hover:bg-black"}>
                        <TableHead>ID</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Topic</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>ChangedAt</TableHead>
                        <TableHead>CreatedAt</TableHead>
                        <TableHead>Creator</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell>{task.id}</TableCell>
                            <TableCell>{task.team}</TableCell>
                            <TableCell>{task.project}</TableCell>
                            <TableCell>{task.topic}</TableCell>
                            <TableCell>{task.title}</TableCell>
                            <TableCell>{task.status}</TableCell>
                            <TableCell>{task.changedAt}</TableCell>
                            <TableCell>{task.createdAt}</TableCell>
                            <TableCell>{task.creator}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
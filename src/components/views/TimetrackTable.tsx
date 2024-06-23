import React, {useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@marraph/daisy/components/table/Table";
import {Caret} from "@/components/badges/Caret";
import {EntryProjectBadge} from "@/components/badges/entry-project-badge";
import {EntryTitleBadge} from "@/components/badges/entry-task-badge";

const header = [
    { key: "entry", label: "Entry" },
    { key: "time", label: "Time" },
    { key: "duration", label: "Duration" },
];

type SortOrder = "asc" | "desc";
type SortState = { key: string; order: SortOrder; };

interface TimetrackProps {
    data: { project: string | null, task: string | null, comment: string | null, time: string, duration: string }[];
}

export const TimetrackTable: React.FC<TimetrackProps> = ({ data }) => {
    const [sort, setSort] = useState<SortState>({ key: "id", order: "asc" });

    function handleHeaderClick(headerKey: string) {
        setSort({
            key: headerKey,
            order: sort.key === headerKey ? (sort.order === "asc" ? "desc" : "asc") : "desc"
        })
    }

    return (
        <div className={"w-full h-[780px] text-xs flex items-stretch pt-4"}>
            <Table className={"bg-black w-full no-scrollbar rounded-b-none"}>
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
                    {data.map((entry, index) => (
                        <TableRow key={index} className={index === data.length - 1 ? " border-b border-b-white" : ""}>
                            <TableCell>
                                <div className={"flex flex-row items-center space-x-2"}>
                                    {entry.project && <EntryProjectBadge title={entry.project}/>}
                                    {entry.task && <EntryTitleBadge title={entry.task}/>}
                                    <span>{entry.comment}</span>
                                </div>
                            </TableCell>
                            <TableCell>{entry.time}</TableCell>
                            <TableCell>{entry.duration}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
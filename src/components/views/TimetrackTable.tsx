import React, {useState} from "react";
import {Table, TableBody, TableHead, TableHeader, TableRow} from "@marraph/daisy/components/table/Table";
import {Caret} from "@/components/badges/Caret";
import {TaskElement} from "@/types/types";

const header = [
    { key: "entry", label: "Entry" },
    { key: "comment", label: "Comment" },
    { key: "start", label: "Start" },
    { key: "end", label: "End" },
];

type SortOrder = "asc" | "desc";
type SortState = { key: string; order: SortOrder; };

interface TimetrackProps {
}

export const TimetrackTable: React.FC<TimetrackProps> = ({ }) => {
    const [sort, setSort] = useState<SortState>({ key: "id", order: "asc" });

    function handleHeaderClick(headerKey: string) {
        setSort({
            key: headerKey,
            order: sort.key === headerKey ? (sort.order === "asc" ? "desc" : "asc") : "desc"
        })
    }

    return (
        <Table className={"bg-black w-full no-scrollbar"}>
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

            </TableBody>
        </Table>
    );
}
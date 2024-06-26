import {TimeEntry} from "@/types/types";
import React, {useEffect, useState} from "react";
import {DeleteTimeEntryDialog} from "@/components/dialogs/timetracking/DeleteTimeEntryDialog";
import {EditTimeEntryDialog} from "@/components/dialogs/timetracking/EditTimeEntryDialog";
import {TimeEntryContextMenu} from "@/components/contextmenus/TimeEntryContextMenu";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@marraph/daisy/components/table/Table";
import {Caret} from "@/components/badges/Caret";
import {cn} from "@/utils/cn";

const header = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday"},
    { key: "friday", label: "Friday"},
];

type SortOrder = "asc" | "desc";
type SortState = { key: string; order: SortOrder; };

interface TimetrackProps {
    entries: TimeEntry[];
}

export const TimetrackWeekTable: React.FC<TimetrackProps> = ({ entries }) => {
    const deleteRef = React.useRef<HTMLDialogElement>(null);
    const editRef = React.useRef<HTMLDialogElement>(null);
    const [sort, setSort] = useState<SortState>({ key: "id", order: "asc" });
    const [contextMenu, setContextMenu] = useState({ id: -1 , x: 0, y: 0, visible: false });
    const [focusTimeEntry, setFocusTimeEntry] = useState<TimeEntry | null>(null);

    useEffect(() => {
        const handleClick = () => setContextMenu({ ...contextMenu, visible: false});
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [contextMenu]);

    const handleContextMenu = (e: React.MouseEvent<HTMLTableRowElement>, timeEntry: TimeEntry) => {
        e.preventDefault();
        setFocusTimeEntry(timeEntry);
        setContextMenu({ id: timeEntry.id, x: e.clientX, y: e.clientY, visible: true });
    };

    function handleHeaderClick(headerKey: string) {
        setSort({
            key: headerKey,
            order: sort.key === headerKey ? (sort.order === "asc" ? "desc" : "asc") : "desc"
        })
    }

    console.log(entries.length)

    return (
        <>
            {focusTimeEntry &&
                <>
                    <DeleteTimeEntryDialog ref={deleteRef} timeEntry={focusTimeEntry}/>
                    <EditTimeEntryDialog ref={editRef} timeEntry={focusTimeEntry}/>
                </>
            }

            {contextMenu.visible &&
                <TimeEntryContextMenu x={contextMenu.x} y={contextMenu.y} deleteRef={deleteRef} editRef={editRef}/>
            }

            <div className={"w-full h-[780px] text-xs flex items-stretch pt-4"}>
                <Table className={"bg-black w-full no-scrollbar rounded-b-none"}>
                    <TableHeader>
                        <TableRow className={cn("hover:bg-black", entries.length === 0 ? "border-x-0 border-t-0 border-1 border-b border-b-white" : "border-none")}>
                            {header.map((header) => (
                                <TableHead
                                    className={"text-placeholder text-sm w-max min-w-28"}
                                    key={header.key}
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
                        {entries.map((entry, index) => (
                            <TableRow key={index}
                                      className={index === entries.length - 1 ? " border-b border-b-white" : ""}
                                      onContextMenu={(event) => handleContextMenu(event, entry)}
                            >
                                <TableCell>

                                </TableCell>
                                <TableCell>{entry.startDate + " - " + entry.endDate}</TableCell>
                                <TableCell>{"differenz"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
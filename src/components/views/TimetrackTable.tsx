import React, {useEffect, useRef, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@marraph/daisy/components/table/Table";
import {Caret} from "@/components/badges/Caret";
import {ProjectBadge} from "@/components/badges/ProjectBadge";
import {EntryTitleBadge} from "@/components/badges/EntryTaskBadge";
import {TimeEntry} from "@/types/types";
import {TimeEntryContextMenu} from "@/components/contextmenus/TimeEntryContextMenu";
import {DeleteTimeEntryDialog} from "@/components/dialogs/timetracking/DeleteTimeEntryDialog";
import {EditTimeEntryDialog} from "@/components/dialogs/timetracking/EditTimeEntryDialog";
import {cn} from "@/utils/cn";
import {formatTime} from "@/utils/format";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {EllipsisVertical} from "lucide-react";
import {Button} from "@marraph/daisy/components/button/Button";

const header = [
    { key: "entry", label: "Entry" },
    { key: "time", label: "Time" },
    { key: "duration", label: "Duration" },
];

type SortOrder = "asc" | "desc";
type SortState = { key: string; order: SortOrder; };

interface TimetrackProps {
    entries: TimeEntry[];
}

export const TimetrackTable: React.FC<TimetrackProps> = ({ entries }) => {
    const deleteRef = useRef<DialogRef>(null);
    const editRef = useRef<DialogRef>(null);
    const [sort, setSort] = useState<SortState>({ key: "id", order: "asc" });
    const [contextMenu, setContextMenu] = useState({ id: -1 , x: 0, y: 0, visible: false });
    const [focusTimeEntry, setFocusTimeEntry] = useState<TimeEntry | null>(null);

    useEffect(() => {
        const handleClick = () => setContextMenu({ ...contextMenu, visible: false});
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [contextMenu]);

    const handleContextMenu = (e: React.MouseEvent<HTMLElement>, timeEntry: TimeEntry) => {
        e.preventDefault();
        e.stopPropagation();

        setFocusTimeEntry(timeEntry);
        console.log(e.target)

        if (e.target instanceof HTMLButtonElement || e.target instanceof SVGElement) {
            const buttonElement = e.currentTarget;
            const rect = buttonElement.getBoundingClientRect();

            const coordinates = {
                x: rect.left - 52,
                y: rect.top + 34
            };
            setContextMenu({ id: timeEntry.id, x: coordinates.x, y: coordinates.y, visible: true });
        } else {
            setContextMenu({id: timeEntry.id, x: e.clientX, y: e.clientY, visible: true});
        }
    };

    const handleOnClick = (timeEntry: TimeEntry) => {
        setFocusTimeEntry(timeEntry);
        editRef.current?.show();
    }

    function handleHeaderClick(headerKey: string) {
        setSort({
            key: headerKey,
            order: sort.key === headerKey ? (sort.order === "asc" ? "desc" : "asc") : "desc"
        })
    }

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

            <div className={"w-full h-[796px] text-xs flex pt-4"}>
                <Table className={"bg-black w-full no-scrollbar rounded-b-none"}>
                    <TableHeader>
                        <TableRow className={cn("hover:bg-black", entries.length === 0 ? "border-x-0 border-t-0 border-1 border-b border-b-white" : "border-none")}>
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
                        {entries.map((entry, index) => (
                            <TableRow key={index}
                                      className={index === entries.length - 1 ? " border-b border-b-white" : ""}
                                      onContextMenu={(event) => handleContextMenu(event, entry)}
                                      onClick={() => handleOnClick(entry)}
                            >
                                <TableCell>
                                    <div className={"flex flex-row items-center space-x-2"}>
                                        {entry.project && <ProjectBadge title={entry.project.name}/>}
                                        {entry.task && <EntryTitleBadge title={entry.task.name}/>}
                                        <span>{entry.comment}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{formatTime(entry.startDate) + " - " + formatTime(entry.endDate)}</TableCell>
                                <TableCell className={ "flex flex-row space-x-4 items-center justify-between"}>
                                    {"differenz"}
                                    <Button text={""} className={"p-1.5 mx-2"} onClick={(e) => {e.stopPropagation(); handleContextMenu(e, entry);}}>
                                        <EllipsisVertical size={16}/>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
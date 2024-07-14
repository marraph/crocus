import React, {useEffect, useRef, useState} from "react";
import {
    Table,
    TableAction,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@marraph/daisy/components/table/Table";
import {ProjectBadge} from "@/components/badges/ProjectBadge";
import {EntryTitleBadge} from "@/components/badges/EntryTaskBadge";
import {Absence, TimeEntry} from "@/types/types";
import {TimeEntryContextMenu} from "@/components/contextmenus/TimeEntryContextMenu";
import {DeleteTimeEntryDialog} from "@/components/dialogs/timetracking/DeleteTimeEntryDialog";
import {EditTimeEntryDialog} from "@/components/dialogs/timetracking/EditTimeEntryDialog";
import {cn} from "@/utils/cn";
import {formatTime} from "@/utils/format";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {EllipsisVertical} from "lucide-react";
import {Button} from "@marraph/daisy/components/button/Button";
import {AbsenceBadge} from "@/components/badges/AbsenceBadge";
import {EditAbsenceDialog} from "@/components/dialogs/timetracking/EditAbsenceDialog";

const header = [
    { key: "entry", label: "Entry" },
    { key: "time", label: "Time" },
    { key: "duration", label: "Duration" },
];

interface TimetrackProps {
    entries: TimeEntry[] | undefined;
    absences: Absence[] | undefined;
}

export const TimetrackTable: React.FC<TimetrackProps> = ({ entries, absences }) => {
    const deleteRef = useRef<DialogRef>(null);
    const editRef = useRef<DialogRef>(null);
    const [entryContextMenu, setEntryContextMenu] = useState({ id: -1 , x: 0, y: 0, visible: false });
    const [absenceContextMenu, setAbsenceContextMenu] = useState({ id: -1 , x: 0, y: 0, visible: false });
    const [focusTimeEntry, setFocusTimeEntry] = useState<TimeEntry | null>(null);
    const [focusAbsence, setFocusAbsence] = useState<Absence | null>(null);

    useEffect(() => {
        const handleClick = () => {
            setEntryContextMenu({ ...entryContextMenu, visible: false});
            setAbsenceContextMenu({ ...absenceContextMenu, visible: false});
        }
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [entryContextMenu, absenceContextMenu]);

    const getElementLength = () => {
        if (!entries && absences) return absences?.length;
        if (!absences && entries) return entries?.length;
        if (entries && absences) return entries?.length + absences?.length;
        return 0;
    }

    const handleEntryContextMenu = (e: React.MouseEvent<HTMLElement>, timeEntry: TimeEntry) => {
        e.preventDefault();
        e.stopPropagation();

        setFocusAbsence(null);
        setAbsenceContextMenu({ ...absenceContextMenu, visible: false});

        setFocusTimeEntry(timeEntry);

        if (e.target instanceof HTMLButtonElement || e.target instanceof SVGElement) {
            const buttonElement = e.currentTarget;
            const rect = buttonElement.getBoundingClientRect();

            const coordinates = {
                x: rect.left - 52,
                y: rect.top + 34
            };
            setEntryContextMenu({ id: timeEntry.id, x: coordinates.x, y: coordinates.y, visible: true });
        } else {
            setEntryContextMenu({id: timeEntry.id, x: e.clientX, y: e.clientY, visible: true});
        }
    };

    const handleAbsenceContextMenu = (e: React.MouseEvent<HTMLElement>, absence: Absence) => {
        e.preventDefault();
        e.stopPropagation();
        setFocusTimeEntry(null);
        setEntryContextMenu({ ...entryContextMenu, visible: false});

        setFocusAbsence(absence);

        if (e.target instanceof HTMLButtonElement || e.target instanceof SVGElement) {
            const buttonElement = e.currentTarget;
            const rect = buttonElement.getBoundingClientRect();

            const coordinates = {
                x: rect.left - 52,
                y: rect.top + 34
            };
            setAbsenceContextMenu({ id: absence.id, x: coordinates.x, y: coordinates.y, visible: true });
        } else {
            setAbsenceContextMenu({id: absence.id, x: e.clientX, y: e.clientY, visible: true});
        }
    };

    const handleTimeEntryOnClick = (timeEntry: TimeEntry) => {
        setFocusTimeEntry(timeEntry);
        editRef.current?.show();
    }

    const handleAbsenceOnClick = (absence: Absence) => {
        setFocusAbsence(absence);
        editRef.current?.show();
    }

    const calculateDifference = (entry: TimeEntry) => {
        const endDate = new Date(entry.endDate);
        const startDate = new Date(entry.startDate);

        return endDate.getHours() - startDate.getHours();
    }

    return (
        <>
            {focusTimeEntry &&
                <>
                    <DeleteTimeEntryDialog ref={deleteRef} timeEntry={focusTimeEntry}/>
                    <EditTimeEntryDialog ref={editRef} timeEntry={focusTimeEntry}/>
                </>
            }

            {focusAbsence &&
                <>
                    <DeleteTimeEntryDialog ref={deleteRef} absence={focusAbsence}/>
                    <EditAbsenceDialog ref={editRef} absence={focusAbsence}/>
                </>
            }

            {entryContextMenu.visible &&
                <TimeEntryContextMenu x={entryContextMenu.x} y={entryContextMenu.y} deleteRef={deleteRef} editRef={editRef}/>
            }
            {absenceContextMenu.visible &&
                <TimeEntryContextMenu x={absenceContextMenu.x} y={absenceContextMenu.y} deleteRef={deleteRef} editRef={editRef}/>
            }

            <Table className={"bg-black w-full no-scrollbar rounded-b-none text-xs border-b-0"}>
                <TableHeader>
                    <TableRow className={cn("hover:bg-black", entries?.length === 0 ? "border-x-0 border-t-0 border-1 border-b border-b-white" : "border-none")}>
                    {header.map((header) => (
                            <TableHead className={"text-marcador text-sm w-max min-w-28"} key={header.key}>
                                <span className={"flex flex-row items-center"}>
                                    {header.label}
                                </span>
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody className={"text-sm"}>
                    {absences?.map((absence, index) => (
                        <TableRow key={index}
                                  className={cn("h-min", index === getElementLength() - 1 ? " border-b border-b-white" : "")}
                                  onContextMenu={(event) => handleAbsenceContextMenu(event, absence)}
                                  onClick={() => handleAbsenceOnClick(absence)}
                        >
                            <TableCell>
                                <div className={"flex flex-row items-center space-x-2"}>
                                    <AbsenceBadge title={"Absence: " + absence.absenceType.toString()}/>
                                    <span>{absence.comment}</span>
                                </div>
                            </TableCell>
                            <TableCell>{}</TableCell>
                            <TableCell className={ "flex flex-row space-x-4 items-center justify-end"}>
                                <Button text={""} className={"p-1.5 mx-2"} onClick={(e) => {e.stopPropagation(); handleAbsenceContextMenu(e, absence);}}>
                                    <EllipsisVertical size={16}/>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {entries?.map((entry, index) => (
                        <TableRow key={index}
                                  className={index === entries?.length - 1 ? " border-b border-b-white" : ""}
                                  onContextMenu={(event) => handleEntryContextMenu(event, entry)}
                                  onClick={() => handleTimeEntryOnClick(entry)}
                        >
                            <TableCell>
                                <div className={"flex flex-row items-center space-x-2"}>
                                    {entry.project && <ProjectBadge title={entry.project.name}/>}
                                    {entry.task && <EntryTitleBadge title={entry.task.name}/>}
                                    <span>{entry.comment}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                {formatTime(entry.startDate) + " - " + formatTime(entry.endDate)}
                            </TableCell>
                            <TableCell className={ "flex flex-row space-x-4 items-center justify-between"}>
                                {calculateDifference(entry) + "h"}
                            </TableCell>
                            <TableAction onClick={(e) => handleEntryContextMenu(e, entry)}/>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
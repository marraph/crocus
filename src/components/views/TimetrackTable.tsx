import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
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
import {EntryTaskBadge} from "@/components/badges/EntryTaskBadge";
import {Absence, TimeEntry} from "@/types/types";
import {TimeEntryContextMenu} from "@/components/contextmenus/TimeEntryContextMenu";
import {DeleteTimeEntryDialog} from "@/components/dialogs/timetracking/DeleteTimeEntryDialog";
import {EditTimeEntryDialog} from "@/components/dialogs/timetracking/EditTimeEntryDialog";
import {cn} from "@/utils/cn";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {AbsenceBadge} from "@/components/badges/AbsenceBadge";
import {EditAbsenceDialog} from "@/components/dialogs/timetracking/EditAbsenceDialog";
import moment from "moment";
import {TimeEntryDaySummary} from "@/components/cards/TimeEntryDaySummary";
import { useTooltip } from "@marraph/daisy/components/tooltip/TooltipProvider";


interface TimetrackProps {
    entries: TimeEntry[] | undefined;
    absences: Absence[] | undefined;
}

export const TimetrackTable: React.FC<TimetrackProps> = ({ entries, absences }) => {
    const deleteRef = useRef<DialogRef>(null);
    const editEntryRef = useRef<DialogRef>(null);
    const editAbsenceRef = useRef<DialogRef>(null);
    const [entryContextMenu, setEntryContextMenu] = useState({ id: -1 , x: 0, y: 0, visible: false });
    const [absenceContextMenu, setAbsenceContextMenu] = useState({ id: -1 , x: 0, y: 0, visible: false });
    const [focusTimeEntry, setFocusTimeEntry] = useState<TimeEntry | null>(null);
    const [focusAbsence, setFocusAbsence] = useState<Absence | null>(null);
    const { addTooltip, removeTooltip } = useTooltip();

    const header = useMemo(() => [
        { key: "entry", label: "Entry" },
        { key: "time", label: "Time" },
        { key: "duration", label: "Duration" },
    ], []);

    useEffect(() => {
        const handleClick = () => {
            setEntryContextMenu({ ...entryContextMenu, visible: false});
            setAbsenceContextMenu({ ...absenceContextMenu, visible: false});
        }
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [entryContextMenu, absenceContextMenu]);

    const getElementLength = useCallback(() => {
        if (!entries && absences) return absences?.length;
        if (!absences && entries) return entries?.length;
        if (entries && absences) return entries?.length + absences?.length;
        return 0;
    }, [absences, entries]);

    const handleEntryContextMenu = useCallback((e: React.MouseEvent<HTMLElement>, timeEntry: TimeEntry) => {
        e.preventDefault();
        e.stopPropagation();
        setFocusAbsence(null);
        setAbsenceContextMenu({ ...absenceContextMenu, visible: false});

        setFocusTimeEntry(timeEntry);

        if (!entryContextMenu.visible) {
            if (e.target instanceof HTMLButtonElement) {
                const buttonElement = e.currentTarget;
                const rect = buttonElement.getBoundingClientRect();

                const coordinates = {
                    x: rect.left - 66,
                    y: rect.top + 34
                };
                setEntryContextMenu({id: timeEntry.id, x: coordinates.x, y: coordinates.y, visible: true});
            } else {
                setEntryContextMenu({id: timeEntry.id, x: e.clientX, y: e.clientY, visible: true});
            }
        } else {
            setEntryContextMenu({ ...entryContextMenu, visible: false });
        }
    }, [absenceContextMenu, entryContextMenu]);

    const handleAbsenceContextMenu = useCallback((e: React.MouseEvent<HTMLElement>, absence: Absence) => {
        e.preventDefault();
        e.stopPropagation();
        setFocusTimeEntry(null);
        setEntryContextMenu({ ...entryContextMenu, visible: false});

        setFocusAbsence(absence);

        if (!absenceContextMenu.visible) {
            if (e.target instanceof HTMLButtonElement) {
                const buttonElement = e.currentTarget;
                const rect = buttonElement.getBoundingClientRect();

                const coordinates = {
                    x: rect.left - 66,
                    y: rect.top + 34
                };
                setAbsenceContextMenu({ id: absence.id, x: coordinates.x, y: coordinates.y, visible: true });
            } else {
                setAbsenceContextMenu({id: absence.id, x: e.clientX, y: e.clientY, visible: true});
            }
        } else {
            setAbsenceContextMenu({ ...absenceContextMenu, visible: false });
        }
    }, [absenceContextMenu, entryContextMenu]);

    const handleTimeEntryOnClick = useCallback((timeEntry: TimeEntry) => {
        setFocusTimeEntry(timeEntry);
        editEntryRef.current?.show();
    }, []);

    const handleAbsenceOnClick = useCallback((absence: Absence) => {
        setFocusAbsence(absence);
        editAbsenceRef.current?.show();
    }, []);

    const calculateDifference = useCallback((entry: TimeEntry) => {
        const startDate = moment(entry.startDate);
        const endDate = moment(entry.endDate);

        return moment.duration(endDate.diff(startDate)).asHours();
    }, []);

    return (
        <>
            {focusTimeEntry &&
                <>
                    <DeleteTimeEntryDialog ref={deleteRef} timeEntry={focusTimeEntry}/>
                    <EditTimeEntryDialog ref={editEntryRef} timeEntry={focusTimeEntry}/>
                </>
            }

            {focusAbsence &&
                <>
                    <DeleteTimeEntryDialog ref={deleteRef} absence={focusAbsence}/>
                    <EditAbsenceDialog ref={editAbsenceRef} absence={focusAbsence}/>
                </>
            }

            {entryContextMenu.visible &&
                <TimeEntryContextMenu x={entryContextMenu.x} y={entryContextMenu.y} deleteRef={deleteRef}
                                      editRef={editEntryRef}/>
            }
            {absenceContextMenu.visible &&
                <TimeEntryContextMenu x={absenceContextMenu.x} y={absenceContextMenu.y} deleteRef={deleteRef}
                                      editRef={editAbsenceRef}/>
            }

            <div className={"h-full flex flex-col"}>
                <Table className={"bg-dark w-full no-scrollbar rounded-b-none text-xs border-b-0"}>
                    <TableHeader>
                        <TableRow
                            className={cn("hover:bg-black", entries?.length === 0 ? "border-x-0 border-t-0 border-1 border-b border-b-edge" : "border-none")}>
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
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableAction onClick={(e) => handleAbsenceContextMenu(e, absence)}/>
                            </TableRow>
                        ))}
                        {entries?.map((entry, index) => (
                            <TableRow key={index}
                                      className={index === entries?.length - 1 ? " border-b border-b-edge" : ""}
                                      onContextMenu={(event) => handleEntryContextMenu(event, entry)}
                                      onClick={() => handleTimeEntryOnClick(entry)}
                            >
                                <TableCell>
                                    <div className={"flex flex-row items-center space-x-2"}>
                                        {entry.project &&
                                            <ProjectBadge
                                                title={entry.project.name}
                                                onMouseEnter={(e) => {
                                                    addTooltip({
                                                        message: "Project: " + entry.project?.name,
                                                        anchor: "tl",
                                                        trigger: e.currentTarget.getBoundingClientRect()
                                                    });
                                                }}
                                                onMouseLeave={() => removeTooltip()}
                                            />
                                        }
                                        {entry.task &&
                                            <EntryTaskBadge
                                                title={entry.task.name}
                                                onMouseEnter={(e) => {
                                                    addTooltip({
                                                        message: "Task: " + entry.task?.name,
                                                        anchor: "tl",
                                                        trigger: e.currentTarget.getBoundingClientRect()
                                                    });
                                                }}
                                                onMouseLeave={() => removeTooltip()}
                                            />
                                        }
                                        <span>{entry.comment}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {moment(entry.startDate).format('HH:mm') + " - " + moment(entry.endDate).format('HH:mm')}
                                </TableCell>
                                <TableCell className={"flex flex-row space-x-4 items-center justify-between"}>
                                    {calculateDifference(entry) + "h"}
                                </TableCell>
                                <TableAction onClick={(e) => handleEntryContextMenu(e, entry)}/>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className={"flex-grow bg-black-light border border-y-0 border-edge"}></div>
                <TimeEntryDaySummary entries={entries}/>
            </div>
        </>
    );
}
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
import {useContextMenu} from "@/hooks/useContextMenu";
import {useOutsideClick} from "@marraph/daisy/hooks/useOutsideClick";


interface TimetrackProps {
    entries: TimeEntry[] | null;
    absences: Absence[] | null;
}

type FocusItem = { type: 'timeEntry', item: TimeEntry } | { type: 'absence', item: Absence } | null;

export const TimetrackTable: React.FC<TimetrackProps> = ({ entries, absences }) => {
    const deleteRef = useRef<DialogRef>(null);
    const editEntryRef = useRef<DialogRef>(null);
    const editAbsenceRef = useRef<DialogRef>(null);

    const [focusItem, setFocusItem] = useState<FocusItem>(null);
    const {addTooltip, removeTooltip} = useTooltip();
    const {contextMenu: entryContextMenu, handleContextMenu: handleEntryContextMenu, closeContextMenu: closeEntryContextMenu} = useContextMenu<TimeEntry>();
    const {contextMenu: absenceContextMenu, handleContextMenu: handleAbsenceContextMenu, closeContextMenu: closeAbsenceContextMenu} = useContextMenu<Absence>();

    const contextRef = useOutsideClick((e) => {
        if (e.target instanceof HTMLButtonElement || e.target instanceof SVGElement) {
            return;
        }
        closeEntryContextMenu();
        closeAbsenceContextMenu();
        setFocusItem(null);
    });

    const header = useMemo(() => [
        { key: "entry", label: "Entry" },
        { key: "time", label: "Time" },
        { key: "duration", label: "Duration" },
    ], []);

    useEffect(() => {
        if (entryContextMenu.visible) {
            closeAbsenceContextMenu();
            setFocusItem(entryContextMenu.item ? { type: 'timeEntry', item: entryContextMenu.item } : null);
        }
        if (absenceContextMenu.visible) {
            closeEntryContextMenu();
            setFocusItem(absenceContextMenu.item ? { type: 'absence', item: absenceContextMenu.item } : null);
        }
    }, [entryContextMenu.visible, closeAbsenceContextMenu, entryContextMenu.item, absenceContextMenu.visible, absenceContextMenu.item, closeEntryContextMenu]);

    const handleTimeEntryOnClick = useCallback((timeEntry: TimeEntry) => {
        setFocusItem({ type: 'timeEntry', item: timeEntry });
        editEntryRef.current?.show();
    }, []);

    const handleAbsenceOnClick = useCallback((absence: Absence) => {
        setFocusItem({ type: 'absence', item: absence });
        editAbsenceRef.current?.show();
    }, []);

    const calculateDifference = useCallback((entry: TimeEntry) => {
        const startDate = moment(entry.startDate);
        const endDate = moment(entry.endDate);

        return moment.duration(endDate.diff(startDate)).asHours();
    }, []);

    return (
        <>
            {focusItem && (
                <>
                    <DeleteTimeEntryDialog
                        ref={deleteRef}
                        timeEntry={focusItem.type === 'timeEntry' && focusItem.item ? focusItem.item : undefined}
                        absence={focusItem.type === 'absence' && focusItem.item ? focusItem.item : undefined}
                    />
                    {focusItem.type === 'timeEntry' ? (
                        <EditTimeEntryDialog ref={editEntryRef} timeEntry={focusItem.item} />
                    ) : (
                        <EditAbsenceDialog ref={editAbsenceRef} absence={focusItem.item} />
                    )}
                </>
            )}

            {(absenceContextMenu.visible || entryContextMenu.visible) && (
                <TimeEntryContextMenu
                    contextRef={contextRef}
                    editRef={entryContextMenu.visible ? editEntryRef : editAbsenceRef}
                    deleteRef={deleteRef}
                    x={entryContextMenu.visible ? entryContextMenu.x : absenceContextMenu.x}
                    y={entryContextMenu.visible ? entryContextMenu.y : absenceContextMenu.y}
                />
            )}

            <div className={"h-full flex flex-col"}>
                <Table className={"w-full no-scrollbar border-none rounded-b-none text-xs border-b-0"}>
                    <TableHeader>
                        <TableRow
                            className={cn("hover:bg-zinc-200 dark:hover:bg-black",
                                entries?.length === 0 ? "border-x-0 border-t-0 border-1 border-b border-b-zinc-300 dark:border-b-edge" : "border-none")}>
                            {header.map((header) => (
                                <TableHead className={"w-max min-w-28"} key={header.key}>
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
                                      className={"h-min last:border-b last:border-b-zinc-300 dark:last:border-b-edge"}
                                      onContextMenu={(e) => handleAbsenceContextMenu(e, absence)}
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
                                <TableAction onClick={(e) => {
                                    if (!absenceContextMenu.visible) {
                                        setFocusItem({type: "absence", item:absence});
                                        handleAbsenceContextMenu(e, absence);
                                    } else {
                                        closeAbsenceContextMenu();
                                        setFocusItem(null);
                                    }
                                }}
                                />
                            </TableRow>
                        ))}
                        {entries?.map((entry, index) => (
                            <TableRow key={index}
                                      className={index === entries?.length - 1 ? " border-b border-b-zinc-300 dark:border-b-edge" : ""}
                                      onContextMenu={(e) => handleEntryContextMenu(e, entry)}
                                      onClick={() => handleTimeEntryOnClick(entry)}
                            >
                                <TableCell>
                                    <div className={"flex flex-row items-center space-x-2"}>
                                        {entry.project &&
                                            <ProjectBadge
                                                title={entry.project.name}
                                                textClassName={"truncate"}
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
                                                textClassName={"truncate"}
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
                                        <span className={"text-nowrap"}>{entry.comment}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className={"text-nowrap"}>
                                        {moment(entry.startDate).format('HH:mm') + " - " + moment(entry.endDate).format('HH:mm')}
                                    </span>
                                </TableCell>
                                <TableCell className={"flex flex-row space-x-4 items-center justify-between"}>
                                    <span>{calculateDifference(entry) + "h"}</span>
                                </TableCell>
                                <TableAction onClick={(e) => {
                                    if (!entryContextMenu.visible) {
                                        setFocusItem({type: "timeEntry", item:entry});
                                        handleEntryContextMenu(e, entry);
                                    } else {
                                        closeEntryContextMenu();
                                        setFocusItem(null);
                                    }
                                }}
                                />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className={"flex-grow bg-zinc-100 dark:bg-black-light"}></div>
                <TimeEntryDaySummary entries={entries}/>
            </div>
        </>
    );
}
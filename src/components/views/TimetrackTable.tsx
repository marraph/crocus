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
import {useOutsideClick} from "@marraph/daisy/hooks/useOutsideClick";
import {TimeEntry} from "@/action/timeEntry";
import {Absence} from "@/action/absence";
import {useContextMenu} from "@marraph/daisy/hooks/useContextMenu";
import {getProjectFromId, getTaskFromId} from "@/utils/object-helpers";
import {useUser} from "@/context/UserContext";


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
    const {contextMenu: entryContextMenu, handleContextMenu: handleEntryContextMenu, closeContextMenu: closeEntryContextMenu} = useContextMenu();
    const {contextMenu: absenceContextMenu, handleContextMenu: handleAbsenceContextMenu, closeContextMenu: closeAbsenceContextMenu} = useContextMenu();

    const { user, loading, error } = useUser();

    const contextRef = useOutsideClick((e) => {
        closeEntryContextMenu();
        closeAbsenceContextMenu();
        setFocusItem(null);
    });

    const header = useMemo(() => [
        { key: "entry", label: "Entry" },
        { key: "time", label: "Time" },
        { key: "duration", label: "Duration" },
    ], []);

    const handleTimeEntryOnClick = useCallback((timeEntry: TimeEntry) => {
        setFocusItem({ type: 'timeEntry', item: timeEntry });
        editEntryRef.current?.show();
    }, []);

    const handleAbsenceOnClick = useCallback((absence: Absence) => {
        setFocusItem({ type: 'absence', item: absence });
        editAbsenceRef.current?.show();
    }, []);

    const calculateDifference = useCallback((entry: TimeEntry) => {
        const startDate = moment(entry.start);
        const endDate = moment(entry.end);

        return moment.duration(endDate.diff(startDate)).asHours();
    }, []);

    if (!user) return;

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
                                      onContextMenu={(e) => handleAbsenceContextMenu(e)}
                                      onClick={() => handleAbsenceOnClick(absence)}
                            >
                                <TableCell>
                                    <div className={"flex flex-row items-center space-x-2"}>
                                        <AbsenceBadge title={"Absence: " + absence.reason.toString()}/>
                                        <span>{absence.comment}</span>
                                    </div>
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableAction
                                    actionMenu={
                                        <TimeEntryContextMenu
                                            contextRef={contextRef}
                                            editRef={editAbsenceRef}
                                            deleteRef={deleteRef}
                                            x={absenceContextMenu.x}
                                            y={absenceContextMenu.y}
                                        />
                                    }
                                    onClose={() => {
                                        closeAbsenceContextMenu();
                                        setFocusItem(null);
                                    }}
                                />
                            </TableRow>
                        ))}
                        {entries?.map((entry, index) => (
                            <TableRow key={index}
                                      className={index === entries?.length - 1 ? " border-b border-b-zinc-300 dark:border-b-edge" : ""}
                                      onContextMenu={(e) => handleEntryContextMenu(e)}
                                      onClick={() => handleTimeEntryOnClick(entry)}
                            >
                                <TableCell>
                                    <div className={"flex flex-row items-center space-x-2"}>
                                        {entry.projectId && (() => {
                                            const projectName = getProjectFromId(user, entry.projectId).name;
                                            return (
                                                <ProjectBadge
                                                    title={projectName}
                                                    textClassName={"truncate"}
                                                    onMouseEnter={(e) => {
                                                        addTooltip({
                                                            message: "Project: " + projectName,
                                                            anchor: "tl",
                                                            trigger: e.currentTarget.getBoundingClientRect()
                                                        });
                                                    }}
                                                    onMouseLeave={() => removeTooltip()}
                                                />
                                            );
                                        })()}
                                        {entry.taskId && (() => {
                                            const taskName = getTaskFromId(user, entry.taskId).task.name;
                                            return (
                                                <EntryTaskBadge
                                                    title={taskName}
                                                    textClassName={"truncate"}
                                                    onMouseEnter={(e) => {
                                                        addTooltip({
                                                            message: "Task: " + taskName,
                                                            anchor: "tl",
                                                            trigger: e.currentTarget.getBoundingClientRect()
                                                        });
                                                    }}
                                                    onMouseLeave={() => removeTooltip()}
                                                />
                                            );
                                        })()}
                                        <span className={"text-nowrap"}>{entry.comment}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className={"text-nowrap"}>
                                        {moment(entry.start).format('HH:mm') + " - " + moment(entry.end).format('HH:mm')}
                                    </span>
                                </TableCell>
                                <TableCell className={"flex flex-row space-x-4 items-center justify-between"}>
                                    <span>{calculateDifference(entry) + "h"}</span>
                                </TableCell>
                                <TableAction 
                                    actionMenu={
                                        <TimeEntryContextMenu
                                            contextRef={contextRef}
                                            editRef={editEntryRef}
                                            deleteRef={deleteRef}
                                            x={entryContextMenu.x}
                                            y={entryContextMenu.y}
                                        />
                                    }
                                    onClose={() => {
                                        closeEntryContextMenu();
                                        setFocusItem(null);
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
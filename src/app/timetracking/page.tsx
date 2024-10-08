"use client";

import React, {useCallback, useMemo, useRef, useState} from "react";
import {Button} from "@marraph/daisy/components/button/Button";
import {AlarmClockPlus, ChevronLeft, ChevronRight} from "lucide-react";
import {DatePicker} from "@marraph/daisy/components/datepicker/DatePicker";
import {CreateTimeEntryDialog} from "@/components/dialogs/timetracking/CreateTimeEntryDialog";
import {TimetrackTable} from "@/components/views/TimetrackTable";
import {useUser} from "@/context/UserContext";
import {CreateAbsenceDialog} from "@/components/dialogs/timetracking/CreateAbsenceDialog";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import moment from "moment";
import {Headbar} from "@/components/Headbar";
import {useTooltip} from "@marraph/daisy/components/tooltip/TooltipProvider";
import {useHotkeys} from "react-hotkeys-hook";
import {EntryPlaceholder} from "@/components/placeholder/EntryPlaceholder";
import {useTime} from "@/context/TimeContext";

export default function Timetracking() {
    const entryDialogRef = useRef<DialogRef>(null);
    const absenceDialogRef = useRef<DialogRef>(null);
    const [enabled, setEnabled] = useState(true);
    const [day, setDay] = useState<Date>(new Date());
    const { user } = useUser();
    const { entries, absences, loading, error } = useTime();
    const {addTooltip, removeTooltip} = useTooltip();


    useHotkeys('t', () => {
        entryDialogRef.current?.show();
        setEnabled(false);
    }, { enabled });
    useHotkeys('a', () => {
        absenceDialogRef.current?.show();
        setEnabled(false);
    }, { enabled });

    const { todayEntries, todayAbsences } = useMemo(() => ({
        todayEntries: entries?.filter(entry => moment(entry.start).isSame(day, 'day')),
        todayAbsences: absences?.filter(absence => moment(absence.start).isSame(day, 'day')),
    }), [entries, absences, day]);

    const handleDayBefore = useCallback(() => {
        setDay(moment(day).subtract(1, 'days').toDate());
    }, [day]);

    const handleDayAfter = useCallback(() => {
        setDay(moment(day).add(1, 'days').toDate());
    }, [day]);

    if (!user) return null;

    return (
        <>
            <CreateAbsenceDialog ref={absenceDialogRef} onClose={() => setEnabled(true)}/>
            <CreateTimeEntryDialog ref={entryDialogRef} onClose={() => setEnabled(true)}/>

            <div className={"h-screen w-screen flex flex-col overflow-hidden"}>
                <Headbar title={"Timetracking"}/>

                <div className={"h-full flex flex-col p-4 space-y-4"}>
                    <div className={"text-nowrap flex flex-row items-center"}>
                        <div className={"flex flex-row space-x-2"}>
                            <Button text={""}
                                    theme={"primary"}
                                    onClick={() => entryDialogRef.current?.show()}
                                    icon={<AlarmClockPlus size={20}/>}
                                    className={"px-2"}
                                    onMouseEnter={(e) => {
                                        addTooltip({
                                            message: "Create a new entry",
                                            shortcut: "T",
                                            anchor: "tl",
                                            trigger: e.currentTarget.getBoundingClientRect()
                                        });
                                    }}
                                    onMouseLeave={() => removeTooltip()}
                            />
                            <Button text={"Add Absence"}
                                    onClick={() => absenceDialogRef.current?.show()}
                                    onMouseEnter={(e) => {
                                        addTooltip({
                                            message: "Create a new absence",
                                            shortcut: "A",
                                            anchor: "tl",
                                            trigger: e.currentTarget.getBoundingClientRect()
                                        });
                                    }}
                                    onMouseLeave={() => removeTooltip()}
                            />
                        </div>
                        <div className={"w-full flex flex-row items-center justify-end space-x-2"}>
                            <Button text={""}
                                    onClick={handleDayBefore}
                                    icon={<ChevronLeft size={20}/>}
                                    onMouseEnter={(e) => {
                                        addTooltip({
                                            message: "Go back",
                                            anchor: "tr",
                                            trigger: e.currentTarget.getBoundingClientRect()
                                        });
                                    }}
                                    onMouseLeave={() => removeTooltip()}
                            />
                            <Button text={""}
                                    onClick={handleDayAfter}
                                    icon={<ChevronRight size={20}/>}
                                    onMouseEnter={(e) => {
                                        addTooltip({
                                            message: "Go forward",
                                            anchor: "tr",
                                            trigger: e.currentTarget.getBoundingClientRect()
                                        });
                                    }}
                                    onMouseLeave={() => removeTooltip()}
                            />
                            <DatePicker text={"Select a Date"}
                                        size={"medium"}
                                        className={"min-w-56"}
                                        preSelectedValue={day}
                                        closeButton={false}
                                        onValueChange={(day) => day ? setDay(day) : setDay(new Date())}
                                        dayFormat={"long"}
                                        onMouseEnter={(e) => {
                                            addTooltip({
                                                message: "Change Date",
                                                anchor: "tr",
                                                trigger: e.currentTarget.getBoundingClientRect()
                                            });
                                        }}
                                        onMouseLeave={() => removeTooltip()}
                            />
                        </div>
                    </div>
                    <div className={"w-full h-full flex flex-col items-stretch bg-zinc-100 dark:bg-black-light border border-zinc-300 dark:border-edge rounded-lg"}>
                        {loading &&
                            <div></div>
                        }
                        {error &&
                            <div></div>
                        }

                        {!loading && !error && (todayEntries && todayEntries.length > 0) || (todayAbsences && todayAbsences.length > 0) ?
                            <TimetrackTable entries={todayEntries} absences={todayAbsences}/>
                        :
                            <div className={"h-full flex flex-row items-center justify-center"}>
                                <EntryPlaceholder dialogRef={entryDialogRef}/>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}
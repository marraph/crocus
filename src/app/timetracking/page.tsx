"use client";

import React, {useCallback, useMemo, useRef, useState} from "react";
import {Button} from "@marraph/daisy/components/button/Button";
import {AlarmClockPlus, ChevronLeft, ChevronRight, TreePalm} from "lucide-react";
import {DatePicker, DatepickerRef} from "@marraph/daisy/components/datepicker/DatePicker";
import {CreateTimeEntryDialog} from "@/components/dialogs/timetracking/CreateTimeEntryDialog";
import {TimetrackTable} from "@/components/views/TimetrackTable";
import {useUser} from "@/context/UserContext";
import {CreateAbsenceDialog} from "@/components/dialogs/timetracking/CreateAbsenceDialog";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import moment from "moment";
import {Headbar} from "@/components/Headbar";
import {useTooltip} from "@marraph/daisy/components/tooltip/TooltipProvider";
import {useHotkeys} from "react-hotkeys-hook";

export default function Timetracking() {
    const datepickerRef = useRef<DatepickerRef>(null);
    const entryDialogRef = useRef<DialogRef>(null);
    const absenceDialogRef = useRef<DialogRef>(null);
    
    const [day, setDay] = useState<Date>(new Date());
    const {addTooltip, removeTooltip} = useTooltip();
    const {data:user, isLoading:userLoading, error:userError} = useUser();

    const [enabled, setEnabled] = useState(true);

    useHotkeys('t', () => {
        entryDialogRef.current?.show();
        setEnabled(false);
    }, { enabled: enabled });
    useHotkeys('a', () => {
        absenceDialogRef.current?.show();
        setEnabled(false);
    }, { enabled: enabled });

    const { entries, absences } = useMemo(() => ({
        entries: user?.timeEntries?.filter(entry => moment(entry.startDate).isSame(day, 'day')),
        absences: user?.absences?.filter(absence => moment(absence.startDate).isSame(day, 'day')),
    }), [user, day]);

    const handleDayBefore = useCallback(() => {
        setDay(moment(day).subtract(1, 'days').toDate());
        datepickerRef.current?.setValue(moment(day).subtract(1, 'days').toDate());
    }, [day]);

    const handleDayAfter = useCallback(() => {
        setDay(moment(day).add(1, 'days').toDate());
        datepickerRef.current?.setValue(moment(day).add(1, 'days').toDate());
    }, [day]);

    if (!user) return null;

    return (
        <>
            <CreateAbsenceDialog ref={absenceDialogRef} onClose={() => setEnabled(true)}/>
            <CreateTimeEntryDialog ref={entryDialogRef} onClose={() => setEnabled(true)}/>

            <div className={"h-screen w-screen flex flex-col overflow-hidden"}>
                <Headbar title={"Timetracking"}/>

                <div className={"h-full flex flex-col p-4"}>
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
                            <Button text={"New Absence"}
                                    onClick={() => absenceDialogRef.current?.show()}
                                    icon={<TreePalm size={20} className={"mr-2"}/>}
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
                                        ref={datepickerRef}
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
                    <div className={"w-full h-full flex flex-col items-stretch pt-4"}>
                        <TimetrackTable entries={entries} absences={absences}/>
                    </div>
                </div>
            </div>
        </>
    );
}
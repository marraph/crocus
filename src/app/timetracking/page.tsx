"use client";

import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Button} from "@marraph/daisy/components/button/Button";
import {AlarmClockPlus, CalendarDays, ChevronLeft, ChevronRight, TreePalm} from "lucide-react";
import {DatePicker, DatepickerRef} from "@marraph/daisy/components/datepicker/DatePicker";
import {CreateTimeEntryDialog} from "@/components/dialogs/timetracking/CreateTimeEntryDialog";
import {TimetrackTable} from "@/components/views/TimetrackTable";
import {useUser} from "@/context/UserContext";
import {CreateAbsenceDialog} from "@/components/dialogs/timetracking/CreateAbsenceDialog";
import {Absence, TimeEntry} from "@/types/types";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {WeekView} from "@/components/views/WeekView";
import {SwitchButton} from "@marraph/daisy/components/switchbutton/SwitchButton";
import {Combobox, ComboboxItem, ComboboxRef} from "@marraph/daisy/components/combobox/Combobox";
import moment from "moment";
import {Headbar} from "@/components/Headbar";
import {useTooltip} from "@marraph/daisy/components/tooltip/TooltipProvider";

export interface Week {
    monday: Date;
    tuesday: Date;
    wednesday: Date;
    thursday: Date;
    friday: Date;
    saturday: Date;
    sunday: Date;
}

export default function Timetracking() {
    const datepickerRef = useRef<DatepickerRef>(null);
    const comboboxRef = useRef<ComboboxRef>(null);
    const entryDialogRef = useRef<DialogRef>(null);
    const absenceDialogRef = useRef<DialogRef>(null);
    
    const createWeek = useCallback((weekStart: moment.Moment): Week => {
        return {
            monday: weekStart.toDate(),
            tuesday: weekStart.clone().add(1, 'days').toDate(),
            wednesday: weekStart.clone().add(2, 'days').toDate(),
            thursday: weekStart.clone().add(3, 'days').toDate(),
            friday: weekStart.clone().add(4, 'days').toDate(),
            saturday: weekStart.clone().add(5, 'days').toDate(),
            sunday: weekStart.clone().add(6, 'days').toDate()
        };
    }, []);

    const findCurrentWeek = useCallback((weeksArray: Week[]): Week => {
        const today = moment().startOf('day');
        return weeksArray.find(week => {
            const monday = moment(week.monday);
            const sunday = moment(week.sunday);
            return today.isBetween(monday, sunday, null, '[]');
        }) as Week;
    }, []);

    const weeks = useMemo(() => {
        let weeksArray: Week[] = [];
        let currentWeek = moment().startOf('week').add(1, 'days');

        for (let i = 20; i > 0; i--) {
            let weekStart = currentWeek.clone().subtract(i, 'weeks');
            weeksArray.push(createWeek(weekStart));
        }

        weeksArray.push(createWeek(currentWeek));

        for (let i = 1; i <= 20; i++) {
            let weekStart = currentWeek.clone().add(i, 'weeks');
            weeksArray.push(createWeek(weekStart));
        }

        return weeksArray;
    }, [createWeek]);
    const [day, setDay] = useState<Date>(new Date());
    const [week, setWeek] = useState<Week>(findCurrentWeek(weeks));
    const [view, setView] = useState<boolean>(false);
    const {addTooltip, removeTooltip} = useTooltip();
    const {data:user, isLoading:userLoading, error:userError} = useUser();

    const { dailyEntries, weekEntries, dailyAbsences, weekAbsences } = useMemo(() => ({
        dailyEntries: user?.timeEntries?.filter(entry => moment(entry.startDate).isSame(day, 'day')),
        weekEntries: user?.timeEntries?.filter(entry => moment(entry.startDate).isBetween(week.monday, week.sunday, null, '[]')),
        dailyAbsences: user?.absences?.filter(absence => moment(absence.startDate).isSame(day, 'day')),
        weekAbsences: user?.absences?.filter(absence => moment(absence.startDate).isBetween(week.monday, week.sunday, null, '[]'))
    }), [user, day, week]);

    const handleDayBefore = useCallback(() => {
        setDay(moment(day).subtract(1, 'days').toDate());
        datepickerRef.current?.setValue(moment(day).subtract(1, 'days').toDate());
    }, [day]);

    const handleDayAfter = useCallback(() => {
        setDay(moment(day).add(1, 'days').toDate());
        datepickerRef.current?.setValue(moment(day).add(1, 'days').toDate());
    }, [day]);

    const handleWeekBefore = useCallback(() => {
        setWeek(weeks[weeks.indexOf(week) - 1]);
        comboboxRef.current?.setValue(
            moment(weeks[weeks.indexOf(week) - 1].monday).format("Do MMMM YYYY") + "  -  " +
            moment(weeks[weeks.indexOf(week) - 1].sunday).format("Do MMMM YYYY")
        );
    }, [week, weeks]);

    const handleWeekAfter = useCallback(() => {
        setWeek(weeks[weeks.indexOf(week) + 1]);
        comboboxRef.current?.setValue(
            moment(weeks[weeks.indexOf(week) + 1].monday).format("Do MMMM YYYY") + "  -  " +
            moment(weeks[weeks.indexOf(week) + 1].sunday).format("Do MMMM YYYY")
        );
    }, [week, weeks]);

    if (!user) return null;

    return (
        <>
            <CreateAbsenceDialog ref={absenceDialogRef}/>
            <CreateTimeEntryDialog ref={entryDialogRef}/>

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
                                            anchor: "tl",
                                            trigger: e.currentTarget.getBoundingClientRect()
                                        });
                                    }}
                                    onMouseLeave={() => removeTooltip()}
                            />
                            <SwitchButton firstTitle={"Day"}
                                          secondTitle={"Week"}
                                          onClick={() => setView(!view)}
                                          onMouseEnter={(e) => {
                                              addTooltip({
                                                  message: "Change View",
                                                  anchor: "tl",
                                                  trigger: e.currentTarget.getBoundingClientRect()
                                              });
                                          }}
                                          onMouseLeave={() => removeTooltip()}
                            />
                        </div>
                        <div className={"w-full flex flex-row items-center justify-end space-x-2"}>
                            <Button text={""}
                                    onClick={view ? handleDayBefore : handleWeekBefore}
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
                                    onClick={view ? handleDayAfter : handleWeekAfter}
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
                            {view ?
                                <DatePicker text={"Select a Date"}
                                            size={"medium"}
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
                                :
                                <Combobox buttonTitle={"Week"}
                                          icon={<CalendarDays size={16} className={"mr-2"}/>}
                                          ref={comboboxRef}
                                          preSelectedValue={moment(week.monday).format("Do MMMM YYYY") + "  -  " + moment(week.sunday).format("Do MMMM YYYY")}
                                          onValueChange={(week) => setWeek(weeks.find((w) =>
                                              moment(w.monday).format("Do MMMM YYYY") + "  -  " + moment(w.sunday).format("Do MMMM YYYY") === week) as Week)}
                                          onMouseEnter={(e) => {
                                              addTooltip({
                                                  message: "Change week",
                                                  anchor: "tr",
                                                  trigger: e.currentTarget.getBoundingClientRect()
                                              });
                                          }}
                                          onMouseLeave={() => removeTooltip()}
                                >
                                    {weeks.map((week, index) => (
                                        <ComboboxItem key={index}
                                                      title={moment(week.monday).format("Do MMMM YYYY") + "  -  " + moment(week.sunday).format("Do MMMM YYYY")}
                                        />
                                    ))}
                                </Combobox>
                            }
                        </div>
                    </div>

                    <div className={"w-full h-full flex flex-col items-stretch pt-4"}>
                        {view ?
                            <TimetrackTable entries={dailyEntries} absences={dailyAbsences}/>
                            :
                            <WeekView timeEntries={weekEntries} absences={weekAbsences} week={week}/>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}
"use client";

import React, {useEffect, useMemo, useRef, useState} from "react";
import {Button} from "@marraph/daisy/components/button/Button";
import {AlarmClockPlus, CalendarDays, ChevronLeft, ChevronRight, TreePalm} from "lucide-react";
import {DatePicker, DatepickerRef} from "@marraph/daisy/components/datepicker/DatePicker";
import {CreateTimeEntryDialog} from "@/components/dialogs/timetracking/CreateTimeEntryDialog";
import {TimetrackTable} from "@/components/views/TimetrackTable";
import {useUser} from "@/context/UserContext";
import {CreateAbsenceDialog} from "@/components/dialogs/timetracking/CreateAbsenceDialog";
import {Absence, TimeEntry, User} from "@/types/types";
import {TimeEntryDaySummary} from "@/components/cards/TimeEntryDaySummary";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";
import {WeekView} from "@/components/views/WeekView";
import {SwitchButton} from "@marraph/daisy/components/switchbutton/SwitchButton";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";

interface Week {
    start: Date;
    end: Date;
}

function getStartAndEndOfWeek(date: Date): Week {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);

    start.setDate(diff);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
}

function getNextAndPreviousFiftyWeeks(): Week[] {
    const weeks: Week[] = [];
    let currentDate = new Date();

    // Get the previous 50 weeks
    for (let i = 0; i < 50; i++) {
        currentDate.setDate(currentDate.getDate() - 7);
        const week = getStartAndEndOfWeek(currentDate);
        weeks.push(week);
    }

    // Reset the date to current date
    currentDate = new Date();

    // Get the next 50 weeks
    for (let i = 0; i < 50; i++) {
        const week = getStartAndEndOfWeek(currentDate);
        weeks.push(week);
        currentDate.setDate(currentDate.getDate() + 7);
    }

    return weeks;
}

function compareDays(date1: Date, date2: Date) {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}

function findCurrentWeek(weeks: Week[]): Week | undefined {
    const currentDate = new Date();
    return weeks.find((week) => currentDate >= week.start && currentDate <= week.end);
}

function getFilterDayEntries(user: User | undefined, day: Date): TimeEntry[] | undefined {
    if (user === undefined) return undefined;
    return user.timeEntries.filter((entry) =>
        compareDays(new Date(entry.startDate), day) &&
        compareDays(new Date(entry.endDate), day))
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
}

function getFilterDayAbsences(user: User | undefined, day: Date) {
    if (user === undefined) return undefined;
    const comparisonDay = new Date(day).setHours(0, 0, 0, 0);

    return user.absences.filter((absence) => {
        const startDate = new Date(absence.startDate).setHours(0, 0, 0, 0);
        const endDate = new Date(absence.endDate).setHours(0, 0, 0, 0);

        return startDate <= comparisonDay && endDate >= comparisonDay;
    }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

function getFilterWeekEntries(user: User | undefined, weekDates: Date[]): TimeEntry[] | undefined {
    return user?.timeEntries.filter((entry) => {
        const startDate = new Date(entry.startDate);
        const endDate = new Date(entry.endDate);

        return weekDates.some((date) => startDate <= date && endDate >= date);
    }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

function getFilterWeekAbsences(user: User | undefined, weekDates: Date[]) {
    return user?.absences.filter((absence) => {
        const startDate = new Date(absence.startDate);
        const endDate = new Date(absence.endDate);

        return weekDates.some((date) => startDate <= date && endDate >= date);
    }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

function getCurrentWeekDates(): Date[] {
    const currentDate = new Date();
    const day = currentDate.getDay();
    const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(currentDate.setDate(diff));
    return Array.from({length: 5}, (_, i) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        return date;
    });
}

export default function Timetracking() {
    const datepickerRef = useRef<DatepickerRef>(null);
    const entryDialogRef = useRef<DialogRef>(null);
    const absenceDialogRef = useRef<DialogRef>(null);

    const [day, setDay] = useState<Date>(new Date());
    const [week, setWeek] = useState<Date[]>(getCurrentWeekDates());
    const [view, setView] = useState<boolean>(true);
    const weeks = useMemo(() => getNextAndPreviousFiftyWeeks(), []);
    const {data:user, isLoading:userLoading, error:userError} = useUser();

    const [dailyEntries, setDailyEntries] = useState<TimeEntry[] | undefined>(getFilterDayEntries(user, day));
    const [weekEntries, setWeekEntries] = useState<TimeEntry[] | undefined>(getFilterWeekEntries(user, week));
    const [dailyAbsences, setDailyAbsences] = useState<Absence[] | undefined>(getFilterDayAbsences(user, day));
    const [weekAbsences, setWeekAbsences] = useState<Absence[] | undefined>(getFilterWeekAbsences(user, week));

    useEffect(() => {
        if (user?.timeEntries) setDailyEntries(getFilterDayEntries(user, day));
        if (user?.timeEntries) setWeekEntries(getFilterWeekEntries(user, week));
        if (user?.absences) setDailyAbsences(getFilterDayAbsences(user, day));
        if (user?.absences) setWeekAbsences(getFilterWeekAbsences(user, week));

    }, [user, day, week, user?.timeEntries, user?.absences]);

    if (!user) return null;

    const handleDayBefore = () => {
        let newDate = new Date(day.setDate(day.getDate() - 1));
        setDay(newDate);
        datepickerRef.current?.setValue(newDate);
    }

    const handleDayAfter = () => {
        let newDate = new Date(day.setDate(day.getDate() + 1));
        setDay(newDate);
        datepickerRef.current?.setValue(newDate);
    }

    const handleWeekBefore = () => {

    }

    const handleWeekAfter = () => {

    }

    return (
        <>
            <div className={"h-screen flex flex-col p-8"}>
                <div className={"text-nowrap flex flex-row items-center justify-between"}>
                    <div className={"w-full flex flex-row items-center space-x-2"}>
                        {view ?
                            <>
                                <Button text={""}
                                        className={"h-8 w-10 p-0 pl-1.5"}
                                        onClick={() => handleDayBefore()}
                                >
                                    <ChevronLeft/>
                                </Button>
                                <Button text={""}
                                        className={"h-8 w-10 p-0 pl-2"}
                                        onClick={() => handleDayAfter()}
                                >
                                    <ChevronRight/>
                                </Button>
                                <DatePicker text={"Select a Date"}
                                            iconSize={16}
                                            size={"medium"}
                                            preSelectedValue={day}
                                            ref={datepickerRef}
                                            closeButton={false}
                                            onValueChange={(day) => day ? setDay(day) : setDay(new Date())}
                                            dayFormat={"long"}
                                />
                            </>
                            :
                            <>
                                <Button text={""}
                                        className={"h-8 w-10 p-0 pl-1.5"}
                                        onClick={() => handleWeekBefore()}
                                >
                                    <ChevronLeft/>
                                </Button>
                                <Button text={""}
                                        className={"h-8 w-10 p-0 pl-2"}
                                        onClick={() => handleWeekAfter()}
                                >
                                    <ChevronRight/>
                                </Button>
                                <Combobox buttonTitle={"Week"}
                                          icon={<CalendarDays size={16} className={"mr-2"}/>}
                                          preSelectedValue={findCurrentWeek(weeks)?.start.toLocaleDateString() + " - " + findCurrentWeek(weeks)?.end.toLocaleDateString()}
                                >
                                    {weeks.map((week, index) => (
                                        <ComboboxItem key={index} title={week.start.toLocaleDateString() + " - " + week.end.toLocaleDateString()}/>
                                    ))}
                                </Combobox>
                            </>
                        }

                    </div>
                    <div className={"flex flex-row justify-end space-x-2"}>
                        <SwitchButton firstTitle={"Day"} secondTitle={"Week"} onClick={() => setView(!view)}/>
                        <Button text={"New Absence"}
                                theme={"dark"}
                                className={"w-min h-8"}
                                onClick={() => absenceDialogRef.current?.show()}
                        >
                            <TreePalm size={20} className={"mr-2"}/>
                        </Button>
                        <Button text={"New Entry"}
                                theme={"white"}
                                className={"w-min h-8"}
                                onClick={() => entryDialogRef.current?.show()}
                        >
                            <AlarmClockPlus size={20} className={"mr-2"}/>
                        </Button>
                    </div>
                </div>

                {view ?
                    <div className={"w-full h-screen rounded-lg flex flex-col items-stretch pt-4"}>
                        <TimetrackTable entries={dailyEntries} absences={dailyAbsences}/>
                        <div className={"flex-grow bg-black border border-y-0 border-white border-opacity-20"}></div>
                        <TimeEntryDaySummary entries={dailyEntries}/>
                    </div>
                    :
                    <div className={"w-full h-screen rounded-lg flex flex-col items-stretch pt-4"}>
                        <WeekView timeEntries={weekEntries} absences={weekAbsences} weekDates={getCurrentWeekDates()}/>
                        <TimeEntryDaySummary entries={weekEntries}/>
                    </div>
                }
            </div>

            <CreateAbsenceDialog ref={absenceDialogRef}/>
            <CreateTimeEntryDialog ref={entryDialogRef}/>
        </>
    );
}
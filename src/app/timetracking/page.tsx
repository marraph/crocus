"use client";

import React, {useEffect, useRef, useState} from "react";
import {Button} from "@marraph/daisy/components/button/Button";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {DatePicker, DatepickerRef} from "@marraph/daisy/components/datepicker/DatePicker";
import {CreateTimeEntryDialog} from "@/components/dialogs/timetracking/CreateTimeEntryDialog";
import {TimetrackTable} from "@/components/views/TimetrackTable";
import {useUser} from "@/context/UserContext";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {CreateAbsenceDialog} from "@/components/dialogs/timetracking/CreateAbsenceDialog";
import {Absence, TimeEntry, User} from "@/types/types";
import {abs} from "stylis";
import {TimeEntryDaySummary} from "@/components/cards/TimeEntryDaySummary";

function compareDays(date1: Date, date2: Date) {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}

function getFilterEntries(user: User | undefined, day: Date): TimeEntry[] | undefined {
    if (user === undefined) return undefined;
    return user.timeEntries.filter((entry) =>
        compareDays(new Date(entry.startDate), day) &&
        compareDays(new Date(entry.endDate), day))
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
}

function getFilterAbsences(user: User | undefined, day: Date) {
    if (user === undefined) return undefined;
    const comparisonDay = new Date(day).setHours(0, 0, 0, 0);

    return user.absences.filter((absence) => {
        const startDate = new Date(absence.startDate).setHours(0, 0, 0, 0);
        const endDate = new Date(absence.endDate).setHours(0, 0, 0, 0);

        return startDate <= comparisonDay && endDate >= comparisonDay;
    }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

export default function Timetracking() {
    const datepickerRef = useRef<DatepickerRef>(null);
    const [day, setDay] = useState<Date>(new Date());
    const {data:user, isLoading:userLoading, error:userError} = useUser();

    const [dailyEntries, setDailyEntries] = useState<TimeEntry[] | undefined>(getFilterEntries(user, day));
    const [dailyAbsences, setDailyAbsences] = useState<Absence[] | undefined>(getFilterAbsences(user, day));

    useEffect(() => {
        if (user?.timeEntries) setDailyEntries(getFilterEntries(user, day));
        if (user?.absences) setDailyAbsences(getFilterAbsences(user, day));
    }, [day, user?.timeEntries, user?.absences]);

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

    const handleDayChange = (day: Date) => {
        // setDay(day);
    }

    return (
        <div className={"h-screen flex flex-col p-8"}>
            <div className={"text-nowrap flex flex-row items-center justify-between"}>
                <div className={"w-full flex flex-row items-center space-x-2"}>
                    <Button text={""} className={"h-8 w-10 p-0 pl-1.5"} onClick={() => handleDayBefore()}>
                        <ChevronLeft/>
                    </Button>
                    <Button text={""} className={"h-8 w-10 p-0 pl-2"} onClick={() => handleDayAfter()}>
                        <ChevronRight/>
                    </Button>
                    <DatePicker text={"Select a Date"} iconSize={16} size={"medium"} preSelectedValue={day}
                                ref={datepickerRef} closeButton={false} onClick={() => handleDayChange} dayFormat={"long"}/>
                </div>
                <div className={"flex flex-row justify-end"}>
                    <div className={"mr-2"}>
                        <CreateAbsenceDialog/>
                    </div>
                    <CreateTimeEntryDialog/>
                </div>
            </div>

            <div className={"w-full h-screen rounded-lg flex flex-col items-stretch pt-4"}>
                <TimetrackTable entries={dailyEntries} absences={dailyAbsences}/>
                <div className={"flex-grow bg-black border border-y-0 border-white border-opacity-20"}></div>
                <TimeEntryDaySummary entries={dailyEntries}/>
            </div>
        </div>
    );
}
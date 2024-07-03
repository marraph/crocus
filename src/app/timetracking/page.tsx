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
    return user.absences.filter((absence) =>
        new Date(absence.startDate) <= day ||
        new Date(absence.endDate) >= day)
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
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
    }, [day, user?.timeEntries]);

    if (!user) return null;

    const sumDuration = () => {
        if (dailyEntries === undefined) return 0;
        let totalDuration = 0.0;

        for (const entry of dailyEntries) {
            const endDate = new Date(entry.endDate);
            const startDate = new Date(entry.startDate);

            const duration = endDate.getHours() - startDate.getHours();
            const hours = parseFloat(duration.toString());
            totalDuration += hours;
        }
        return totalDuration;
    }

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

    return (
        <div className={"h-full flex flex-col"}>
            <div className={"text-nowrap flex flex-row items-center justify-between"}>
                <div className={"w-full flex flex-row items-center space-x-2"}>
                    <Button text={""} className={"h-8 w-10 p-0 pl-1.5"} onClick={() => handleDayBefore()}>
                        <ChevronLeft/>
                    </Button>
                    <Button text={""} className={"h-8 w-10 p-0 pl-2"} onClick={() => handleDayAfter()}>
                        <ChevronRight/>
                    </Button>
                    <DatePicker text={"Select a Date"} iconSize={16} size={"medium"} preSelectedValue={day} ref={datepickerRef} closeButton={false}/>
                </div>
                <div className={"flex flex-row justify-end"}>
                    <div className={"mr-2"}>
                        <CreateAbsenceDialog/>
                    </div>
                    <CreateTimeEntryDialog/>
                </div>
            </div>

            <div className={"w-full h-full rounded-lg flex flex-col items-stretch"}>
                <>
                    <TimetrackTable entries={dailyEntries} absences={dailyAbsences}/>
                    <div className={"bg-badgegray border border-white border-opacity-20 rounded-b-lg px-4 flex flex-row justify-between items-center"}>
                        <Badge text={dailyEntries?.length.toString() + (dailyEntries?.length === 1 ? " ENTRY" : " ENTRIES")}
                               size={"small"}
                               className={"rounded-md bg-selectwhite text-dark my-3"}>
                        </Badge>
                        <div className={"flex flex-row items-center space-x-2"}>
                            <span className={"text-sm text-gray"}>{"Total Duration:"}</span>
                            <span className={"text-base text-white"}>{sumDuration() + "h"}</span>
                        </div>
                    </div>
                </>
            </div>

        </div>
    );
}
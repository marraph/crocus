"use client";

import React, {useRef, useState} from "react";
import {Button} from "@marraph/daisy/components/button/Button";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {DatePicker, DatepickerRef} from "@marraph/daisy/components/datepicker/DatePicker";
import {CreateTimeEntryDialog} from "@/components/dialogs/CreateTimeEntryDialog";
import {TimetrackTable} from "@/components/views/TimetrackTable";
import {useUser} from "@/context/UserContext";


export default function Timetracking() {
    const datepickerRef = useRef<DatepickerRef>(null);
    const [day, setDay] = useState<Date>(new Date());
    const {data:user, isLoading:userLoading, error:userError} = useUser();
    const entries = [] as any;

    const sumDuration = () => {
        let totalDuration = 0.0;

        for (const entry of entries) {
            const hours = parseFloat(entry.duration.replace('h', ''));
            totalDuration += hours;
        }
        return totalDuration;
    }

    const handleDayBefore = () => {
        setDay(new Date(day.setDate(day.getDate() - 1)));
        datepickerRef.current?.setValue(day);
    }

    const handleDayAfter = () => {
        setDay(new Date(day.setDate(day.getDate() + 1)));
        datepickerRef.current?.setValue(day);
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
                    <DatePicker text={"Select a Date"} iconSize={16} size={"medium"} preSelectedValue={day} ref={datepickerRef}/>
                </div>
                <CreateTimeEntryDialog className={"justify-end"}/>
            </div>

            <div className={"w-full h-full rounded-lg flex flex-col items-stretch mt-4"}>
                <TimetrackTable entries={entries}/>
                <div className={"bg-badgegray border border-white border-opacity-20 rounded-b-lg p-4 flex flex-row justify-between items-center"}>
                    <div className={"flex flex-row items-center space-x-2"}>
                        <span className={"text-sm text-gray"}>{"Total Entries:"}</span>
                        <span className={"text-base text-white"}>{entries.length}</span>
                    </div>
                    <div className={"flex flex-row items-center space-x-2"}>
                        <span className={"text-sm text-gray"}>{"Total Duration:"}</span>
                        <span className={"text-base text-white"}>{sumDuration() + "h"}</span>
                    </div>
                </div>
            </div>

        </div>
    );
}
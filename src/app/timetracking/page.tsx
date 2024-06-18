"use client";

import React, {useRef, useState} from "react";
import {Button} from "@marraph/daisy/components/button/Button";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {DatePicker, DatepickerRef} from "@marraph/daisy/components/datepicker/DatePicker";
import {CreateTimeEntryDialog} from "@/components/dialogs/CreateTimeEntryDialog";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@marraph/daisy/components/table/Table";
import {Caret} from "@/components/badges/Caret";
import {PriorityBadge} from "@/components/badges/PriorityBadge";
import {TopicBadge} from "@/components/badges/TopicBadge";
import {StatusBadge} from "@/components/badges/StatusBadge";
import {formatDate} from "@/utils/format";
import {ProfileBadge} from "@/components/badges/ProfileBadge";
import {TimetrackTable} from "@/components/views/TimetrackTable";

export default function Timetracking() {
    const datepickerRef = useRef<DatepickerRef>(null);
    const [day, setDay] = useState<Date>(new Date());

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

            <div className={"w-full h-[838px] rounded-lg flex items-stretch mt-4"}>
                <TimetrackTable/>
            </div>

        </div>
    );
}
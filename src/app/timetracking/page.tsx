"use client";

import React, {useRef, useState} from "react";
import {Button} from "@marraph/daisy/components/button/Button";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {DatePicker, DatepickerRef} from "@marraph/daisy/components/datepicker/DatePicker";
import {CreateTimeEntryDialog} from "@/components/dialogs/CreateTimeEntryDialog";

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
                    <Button text={""} className={"h-8"} onClick={() => handleDayBefore()}>
                        <ChevronLeft/>
                    </Button>
                    <Button text={""} className={"h-8"} onClick={() => handleDayAfter()}>
                        <ChevronRight/>
                    </Button>
                    <DatePicker text={"Select a Date"} iconSize={16} size={"small"} preSelectedValue={day} ref={datepickerRef}/>
                </div>
                <CreateTimeEntryDialog className={"justify-end"}/>
            </div>

            <div className={"w-full h-[838px] bg-black rounded-lg border border-white border-opacity-20 flex items-stretch mt-4"}>

            </div>

        </div>
    );
}
"use client";

import React, {useRef, useState} from "react";
import {Button} from "@marraph/daisy/components/button/Button";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {DatePicker, DatepickerRef} from "@marraph/daisy/components/datepicker/DatePicker";
import {CreateTimeEntryDialog} from "@/components/dialogs/timetracking/CreateTimeEntryDialog";
import {TimetrackTable} from "@/components/views/TimetrackTable";
import {useUser} from "@/context/UserContext";
import {TimeEntry} from "@/types/types";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {CreateAbsenceDialog} from "@/components/dialogs/timetracking/CreateAbsenceDialog";

const timeEntry: TimeEntry = {
    id: 1,
    task: {
        id: 1,
        name: "Implement new feature",
        description: "Develop and implement the new feature for the application",
        topic: {
            id: 1,
            title: "Development",
            hexCode: "#FF5733",
            createdBy: {
                id: 1,
                name: "Jane Doe",
                email: "jane.doe@example.com"
            },
            createdDate: new Date('2024-01-01T10:00:00Z'),
            lastModifiedBy: {
                id: 1,
                name: "Jane Doe",
                email: "jane.doe@example.com"
            },
            lastModifiedDate: new Date('2024-01-02T10:00:00Z')
        },
        isArchived: false,
        duration: null,
        deadline: new Date('2024-07-01T10:00:00Z'),
        status: "STARTED",
        priority: "HIGH",
        createdBy: {
            id: 1,
            name: "Jane Doe",
            email: "jane.doe@example.com"
        },
        createdDate: new Date('2024-01-01T10:00:00Z'),
        lastModifiedBy: {
            id: 1,
            name: "Jane Doe",
            email: "jane.doe@example.com"
        },
        lastModifiedDate: new Date('2024-01-02T10:00:00Z')
    },
    project: {
        id: 1,
        name: "Project Alpha",
        description: "A project to develop the new feature",
        priority: "HIGH",
        isArchived: false,
        tasks: [],
        createdBy: {
            id: 1,
            name: "Jane Doe",
            email: "jane.doe@example.com"
        },
        createdDate: new Date('2024-01-01T10:00:00Z'),
        lastModifiedBy: {
            id: 1,
            name: "Jane Doe",
            email: "jane.doe@example.com"
        },
        lastModifiedDate: new Date('2024-01-02T10:00:00Z')
    },
    comment: "Worked on initial setup and database integration.",
    startDate: new Date('2024-06-01T08:00:00Z'),
    endDate: new Date('2024-06-01T12:00:00Z'),
    dailyEntry: {
        id: 1,
        startDate: new Date('2024-06-01T08:00:00Z'),
        endDate: new Date('2024-06-01T17:00:00Z'),
        createdBy: {
            id: 1,
            name: "Jane Doe",
            email: "jane.doe@example.com"
        },
        createdDate: new Date('2024-01-01T10:00:00Z'),
        lastModifiedBy: {
            id: 1,
            name: "Jane Doe",
            email: "jane.doe@example.com"
        },
        lastModifiedDate: new Date('2024-01-02T10:00:00Z')
    },
    createdBy: {
        id: 1,
        name: "Jane Doe",
        email: "jane.doe@example.com"
    },
    createdDate: new Date('2024-01-01T10:00:00Z'),
    lastModifiedBy: {
        id: 1,
        name: "Jane Doe",
        email: "jane.doe@example.com"
    },
    lastModifiedDate: new Date('2024-01-02T10:00:00Z')
}

export default function Timetracking() {
    const datepickerRef = useRef<DatepickerRef>(null);
    const [day, setDay] = useState<Date>(new Date());
    const {data:user, isLoading:userLoading, error:userError} = useUser();
    const entries: TimeEntry[] = [timeEntry];

    const sumDuration = () => {
        let totalDuration = 0.0;

        for (const entry of entries) {
            const duration = entry.endDate.getHours() - entry.startDate.getHours();
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
                    <TimetrackTable entries={entries}/>
                    <div className={"bg-badgegray border border-white border-opacity-20 rounded-b-lg px-4 flex flex-row justify-between items-center"}>
                        <Badge text={entries.length.toString() + (entries.length === 1 ? " ENTRY" : " ENTRIES")}
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
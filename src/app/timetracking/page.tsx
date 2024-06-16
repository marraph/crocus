"use client";

import React from "react";
import {Button} from "@marraph/daisy/components/button/Button";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {DatePicker} from "@marraph/daisy/components/datepicker/DatePicker";
import {CreateTimeEntryDialog} from "@/components/dialogs/CreateTimeEntryDialog";

export default function Timetracking() {
    return (
        <div className={"h-full flex flex-col"}>

            <div>heatmap</div>

            <div className={"flex flex-row items-center justify-between"}>
                <div className={"flex flex-row items-center space-x-2"}>
                    <Button text={""}>
                        <ChevronLeft/>
                    </Button>
                    <Button text={""}>
                        <ChevronRight/>
                    </Button>
                    <DatePicker text={"Select a Date"} iconSize={16}/>
                </div>
                <CreateTimeEntryDialog className={"justify-end"}/>
            </div>


        </div>
    );
}
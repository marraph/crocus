"use client";

import {useParams, useRouter} from "next/navigation";
import {Headbar} from "@/components/Headbar";
import {OrganisationUserCard} from "@/components/cards/OrganisationUserCard";
import {OrganisationTeamCard} from "@/components/cards/OrganisationTeamCard";
import {Button} from "@marraph/daisy/components/button/Button";
import {Settings, CalendarSearch} from "lucide-react";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {Breadcrumb} from "@marraph/daisy/components/breadcrumb/Breadcrumb";
import React from "react";
import {RegionChart} from "@marraph/daisy/components/regionchart/RegionChart";
import {Combobox, ComboboxItem} from "@marraph/daisy/components/combobox/Combobox";

export default function Page() {
    const router = useRouter();
    const id = Number(useParams().id);

    const data = [
        { day: 5, tasks: 100 },
        { day: 10, tasks: 70 },
        { day: 15, tasks: 120 },
        { day: 20, tasks: 150 },
        { day: 25, tasks: 45 },
        { day: 30, tasks: 80 },
    ]

    return (
        <div className={"h-screen w-screen flex flex-col overflow-hidden"}>
            <Headbar>
                <Breadcrumb pastText={"Dashboard"}
                            nowText={"My Organisation"}
                            onClick={() => router.push("/dashboard/")}
                />
            </Headbar>

            <div className={"flex flex-row items-center space-x-8 p-4 pb-8 justify-between"}>
                <span className={"text-lg"}>Acme Inc.</span>
                <Button text={"Settings"}
                        theme={"primary"}
                        icon={<Settings size={20} className={"mr-2"}/>}
                />
            </div>

            <div className={"flex-grow h-80 flex flex-col rounded-lg border border-edge mx-4 mb-4"}>
                <div className={"flex flex-row items-center justify-between p-4 bg-dark rounded-lg"}>
                    <span>Task's completed</span>
                    <Combobox buttonTitle={"Select a range"} icon={<CalendarSearch size={16} className={"mr-2"}/>}>
                        <ComboboxItem title={"Last 7 Days"}/>
                        <ComboboxItem title={"Last 30 Days"}/>
                        <ComboboxItem title={"Last 365 Days"}/>
                    </Combobox>
                </div>
                <Seperator/>
                <div className={"h-full w-full p-4"}>
                    <RegionChart data={data} xAxis_dataKey={"day"} yAxis_dataKey={"tasks"} gradient={true}/>
                </div>
            </div>

            <Seperator/>

            <div className={"flex flex-row space-x-8 p-4"}>
                <OrganisationUserCard/>
                <OrganisationTeamCard/>
            </div>

        </div>
    );
}
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
import {TasksGraphCard} from "@/components/cards/TasksGraphCard";

export default function Page() {
    const router = useRouter();
    const id = Number(useParams().id);

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

            <TasksGraphCard/>

            <Seperator/>

            <div className={"flex flex-row space-x-8 p-4"}>
                <OrganisationUserCard/>
                <OrganisationTeamCard/>
            </div>

        </div>
    );
}
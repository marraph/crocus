"use client";

import {useParams, useRouter} from "next/navigation";
import {Headbar} from "@/components/Headbar";
import {OrganisationTeamTable} from "@/components/views/OrganisationTeamTable";
import {Button} from "@marraph/daisy/components/button/Button";
import {Settings} from "lucide-react";
import {Breadcrumb} from "@marraph/daisy/components/breadcrumb/Breadcrumb";
import React from "react";
import {TasksGraphCard} from "@/components/cards/TasksGraphCard";
import {Tab, TabHeader} from "@marraph/daisy/components/tab/Tab";

export default function Page() {
    const router = useRouter();
    const id = Number(useParams().id);

    return (
        <div className={"h-screen w-screen flex flex-col pb-4"}>
            <Headbar>
                <Breadcrumb pastText={"Dashboard"}
                            nowText={"My Organisation"}
                            onClick={() => router.push("/dashboard/")}
                />
            </Headbar>

            <div className={"h-full flex flex-col p-4"}>
                <div className={"flex flex-row items-center space-x-8 justify-between"}>
                    <span className={"text-xl font-medium"}>Acme Inc.</span>
                    <Button text={"Settings"}
                            theme={"primary"}
                            icon={<Settings size={20} className={"mr-2"}/>}
                    />
                </div>

                <TabHeader titles={["Teams", "Members", "Timetracking"]}>
                    <Tab className={"h-full"}>
                        <div className={" h-full rounded-lg bg-zinc-100 dark:bg-black-light overflow-auto no-scrollbar border border-zinc-300 dark:border-edge my-4"}>
                            <OrganisationTeamTable/>
                        </div>
                    </Tab>
                    <Tab>
                        <div className={"py-4"}>
                        </div>
                    </Tab>
                    <Tab>
                        <div className={"py-4"}>
                            <TasksGraphCard/>
                        </div>
                    </Tab>
                </TabHeader>
            </div>

        </div>
    );
}
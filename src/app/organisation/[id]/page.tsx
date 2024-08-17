"use client";

import {useParams, useRouter} from "next/navigation";
import {Headbar} from "@/components/Headbar";
import {OrganisationUserCard} from "@/components/cards/OrganisationUserCard";
import {OrganisationTeamCard} from "@/components/cards/OrganisationTeamCard";
import {Button} from "@marraph/daisy/components/button/Button";
import {Settings} from "lucide-react";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";
import {Breadcrumb} from "@marraph/daisy/components/breadcrumb/Breadcrumb";
import React from "react";

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

            <div className={"flex flex-row items-center space-x-8 p-4 justify-between"}>
                <div className={"flex flex-row items-center space-x-4"}>
                    <span>Acme Inc.</span>
                    <span>Created on</span>
                </div>
                <Button text={"Settings"}
                        theme={"primary"}
                        icon={<Settings size={20} className={"mr-2"}/>}
                />
            </div>

            <div className={"flex-grow h-80 rounded-lg bg-dark border border-edge mx-4 mb-4"}>

            </div>

            <Seperator/>

            <div className={"flex flex-row space-x-8 p-4"}>
                <OrganisationUserCard/>
                <OrganisationTeamCard/>
            </div>

        </div>
    );
}
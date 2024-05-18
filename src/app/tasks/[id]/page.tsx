import {Breadcrump} from "@marraph/daisy/components/breadcrump/Breadcrump";
import {Seperator} from "@marraph/daisy/components/seperator/Seperator";

const task = {
    title: "Title",
    description: "wigbw iwi iwbig iw i niwnoq nlsndkln dsnksg sd.",
    team: "Team",
    project: "Project",
    priority: "Priority",
    topic: "Topic",
    status: "Status",
    change: "Change",
    changedAt: "ChangedAt",
    changedFrom: "ChangedFrom",
    createdAt: "CreatedAt",
    creator: "Creator",
}

export default function TaskIdPage() {
    return (
        <div className={"h-full flex flex-col items-stretch space-y-4 px-8 pb-8"}>
            <Breadcrump pastText={"Tasks"} nowText={"Api not working"}/>
            <div className={"flex flex-row grow border border-white border-opacity-20 bg-black rounded-lg"}>
                <div className={"w-full "}>

                </div>

                <div className={"w-max justify-end bg-dark rounded-lg h-min flex flex-col grow text-sm"}>
                    <div className={"flex flex-row space-x-4 px-4 pt-4 pb-2"}>
                        <span className={"text-gray"}>Title</span>
                        <span>{task.title}</span>
                    </div>
                    <Seperator className={"w-full py-4"}/>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <span className={"text-gray"}>Desc.</span>
                        <span>{task.description}</span>
                    </div>
                    <Seperator className={"w-full"}/>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <span className={"text-gray"}>Team</span>
                        <span>{task.team}</span>
                    </div>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <span className={"text-gray"}>Project</span>
                        <span>{task.project}</span>
                    </div>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <span className={"text-gray"}>Priority</span>
                        <span>{task.priority}</span>
                    </div>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <span className={"text-gray"}>Topic</span>
                        <span>{task.topic}</span>
                    </div>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <span className={"text-gray"}>Status</span>
                        <span>{task.status}</span>
                    </div>
                    <Seperator className={"w-full py-4"}/>
                    <span className={"text-xs text-placeholder px-4 py-2"}>LAST CHANGE</span>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <span className={"text-gray"}>Change</span>
                        <span>{task.change}</span>
                    </div>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <span className={"text-gray"}>ChangedAt</span>
                        <span>{task.changedAt}</span>
                    </div>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <span className={"text-gray"}>ChangedFrom</span>
                        <span>{task.changedFrom}</span>
                    </div>
                    <Seperator className={"w-full py-4"}/>
                    <span className={"text-xs text-placeholder px-4 py-2"}>CREATION</span>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <span className={"text-gray"}>CreatedAt</span>
                        <span>{task.createdAt}</span>
                    </div>
                    <div className={"flex flex-row space-x-4 px-4 py-2"}>
                        <span className={"text-gray"}>Creator</span>
                        <span>{task.creator}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
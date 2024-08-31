import React, {useCallback, useMemo, useState} from "react";
import {Box, EllipsisVertical, Plus, Search, Users} from "lucide-react";
import {
    Table,
    TableAction,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@marraph/daisy/components/table/Table";
import {cn} from "@/utils/cn";
import {Caret} from "@/components/badges/Caret";
import {getSortedTaskTable, SortState} from "@/utils/sort";
import {ProjectBadge} from "@/components/badges/ProjectBadge";
import {TopicBadge} from "@/components/badges/TopicBadge";
import {PriorityBadge} from "@/components/badges/PriorityBadge";
import {StatusBadge} from "@/components/badges/StatusBadge";
import moment from "moment/moment";
import {MembersBadge} from "@/components/badges/MembersBadge";

const teamCount = 5;

const teams = [
    {
        name: "Team 1",
        members: 5,
        projects: 9
    },
    {
        name: "Team 2",
        members: 3,
        projects: 4
    },
    {
        name: "Team 3",
        members: 7,
        projects: 12
    },
    {
        name: "Team 4",
        members: 2,
        projects: 3
    },
    {
        name: "Team 5",
        members: 4,
        projects: 7
    }
];


export const OrganisationTeamTable: React.FC<{}> = () => {
    const header = useMemo(() => [
        { key: 'name', label: 'Name' },
        { key: 'projects', label: 'Projects' },
        { key: 'members', label: 'Members' }
    ], []);

    return (
        <Table className={"w-full text-xs border-0 rounded-b-none"}>
            <TableHeader>
                <TableRow className={cn("", teams.length === 0 ? "border-x-0 border-t-0 border-1 border-b border-b-zinc-300 dark:border-b-edge" : "border-none")}>
                    {header.map((header) => (
                        <TableHead
                            className={"min-w-28 max-w-32 overflow-hidden"}
                            key={header.key}
                        >
                            <span className={"flex flex-row items-center"}>
                                {header.label}
                            </span>
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody className={"text-sm"}>
                {teams.map((team, index) => (
                    <TableRow key={index}
                              className={cn("last:border-b last:border-b-zinc-300 dark:last:border-b-edge")}
                    >
                        <TableCell>
                            {team.name}
                        </TableCell>

                        <TableCell>
                            <ProjectBadge title={team.projects.toString() + " Projects"}/>
                        </TableCell>

                        <TableCell>
                            <MembersBadge title={team.members.toString() + " Members"}/>
                        </TableCell>

                        <TableAction
                            actionMenu={<></>}
                        />
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
"use client";

import React from "react";
import {Badge} from "@marraph/daisy/components/badge/Badge";
import {cn} from "@/utils/cn";
import { Status } from "@/types/types";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    color: string;
}

export const StatusBadge: React.FC<Props> = ({ title, className, ...props }) => {
    if (!title) return null;

    const additionalClasses = cn({
        'bg-topicblue text-topicblue': title === "PENDING",
        'bg-topicred text-topicred': title === "PLANING",
        'bg-topicgreen text-topicgreen': title === "STARTED",
        'bg-topicyellow text-topicyellow': title === "TESTED",
        'bg-topicpurple text-topicpurple': title === "FINISHED",

    });

    return (
        <Badge
            text={title}
            className={cn(`bg-opacity-20  font-mono font-normal rounded-md w-max px-2 py-0.5`, additionalClasses, className)}

            {...props}
        />
    );
}
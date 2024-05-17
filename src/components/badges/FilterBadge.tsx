import React from "react";
import {CloseButton} from "@marraph/daisy/components/closebutton/CloseButton";
import {cn} from "@/utils/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
}

const FilterBadge = React.forwardRef<HTMLDivElement, BadgeProps>(({ title, className, ...props }, ref) => (
    <div className={"flex flex-row items-center bg-black border border-white border-opacity-20 rounded-lg text-gray space-x-2 p-1 pl-3 h-8"} ref={ref} {...props}>
        {props.children}
        <span className={"text-sm text-placeholder"}>{title}</span>
        <CloseButton className={cn("h-min w-min", className)} text={""} />
    </div>
));
FilterBadge.displayName = "FilterBadge";

export { FilterBadge };

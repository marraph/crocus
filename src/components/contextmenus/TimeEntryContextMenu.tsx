import React, {forwardRef} from "react";
import {useRouter} from "next/navigation";
import {ContextMenu, ContextMenuItem} from "@marraph/daisy/components/contextmenu/ContextMenu";
import {Pencil, Trash2} from "lucide-react";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";

interface TimeEntryContextProps extends React.HTMLAttributes<HTMLDivElement> {
    x: number;
    y: number;
    deleteRef: React.RefObject<DialogRef>;
    editRef: React.RefObject<DialogRef>;
}

export const TimeEntryContextMenu = forwardRef<HTMLDivElement, TimeEntryContextProps>(({ deleteRef, editRef, x, y, className, ...props }, ref) => {
    const router = useRouter();

    return (
        <ContextMenu className={"absolute z-50 text-xs w-max py-1 shadow-2xl"} style={{top: y, left: x}} {...props} ref={ref}>
            <ContextMenuItem title={"Edit"}
                             className={"mt-1"}
                             onClick={() => editRef.current?.show()}
                             icon={<Pencil size={16}/>}
            />
            <ContextMenuItem title={"Delete"}
                             onClick={() => deleteRef.current?.show()}
                             className={"text-lightred hover:text-lightred hover:bg-lightred hover:bg-opacity-10"}
                             icon={<Trash2 size={16}/>}
            />
        </ContextMenu>
    );
});
TimeEntryContextMenu.displayName = "TimeEntryContextMenu";
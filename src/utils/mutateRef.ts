import {ForwardedRef, MutableRefObject} from "react";
import {DialogRef} from "@marraph/daisy/components/dialog/Dialog";

export function mutateRef (ref: ForwardedRef<DialogRef>): MutableRefObject<DialogRef> | void {
    if (ref && typeof ref === 'object') {
        return ref as MutableRefObject<DialogRef>;
    }
}
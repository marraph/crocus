import {Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle} from "@marraph/daisy/components/alert/Alert";
import {MessageSquarePlus} from "lucide-react";

export function AddedTaskMessageAlert() {
    return (
        <Alert className={"fixed bottom-4 right-4 z-50 border border-white border-opacity-20 bg-dark"}>
            <AlertIcon icon={<MessageSquarePlus />}/>
            <AlertContent>
                <AlertTitle title={"Added Message"}></AlertTitle>
                <AlertDescription description={"You successfully added your message to the auditlog."}></AlertDescription>
            </AlertContent>
        </Alert>
    )
}
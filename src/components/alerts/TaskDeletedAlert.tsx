import {Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle} from "@marraph/daisy/components/alert/Alert";
import {Trash2} from "lucide-react";

export function TaskDeletedAlert() {
    return (
        <Alert className={"fixed bottom-4 right-4 z-50 border border-white border-opacity-20 bg-dark"}>
            <AlertIcon icon={<Trash2 color="#c51919" />}/>
            <AlertContent>
                <AlertTitle title={"Task deleted successfully!"}></AlertTitle>
                <AlertDescription description={"You can no longer interact with this task."}></AlertDescription>
            </AlertContent>
        </Alert>
    )
}
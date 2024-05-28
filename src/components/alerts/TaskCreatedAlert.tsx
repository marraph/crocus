import {Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle} from "@marraph/daisy/components/alert/Alert";
import {SquareCheckBig} from "lucide-react";

export function TaskCreatedAlert() {
    return (
        <Alert className={"fixed bottom-4 right-4 z-50 border border-white border-opacity-20 bg-dark"}>
            <AlertIcon icon={<SquareCheckBig />}/>
            <AlertContent>
                <AlertTitle title={"Task created successfully!"}></AlertTitle>
                <AlertDescription description={"You can now work with the task in your task-overview."}></AlertDescription>
            </AlertContent>
        </Alert>
    )
 }
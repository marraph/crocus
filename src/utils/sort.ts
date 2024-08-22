import {TaskElement} from "@/context/TaskContext";

export type SortOrder = "asc" | "desc";
export type SortState = { key: string; order: SortOrder; };

export function getSortedTaskTable(array: TaskElement[], sort: SortState) {
    return array.sort((a: TaskElement, b: TaskElement) => {
        const aValue = a[sort.key as keyof TaskElement];
        const bValue = b[sort.key as keyof TaskElement];

        let aComparable = aValue;
        let bComparable = bValue;

        if (sort.key === 'project' || sort.key === 'createdBy') {
            aComparable = aValue ? (aValue as any).name : '';
            bComparable = bValue ? (bValue as any).name : '';
        }

        if (sort.key === 'createdDate' || sort.key === 'deadline') {
            aComparable = aValue ? new Date(aValue as Date).getDate() : 0;
            bComparable = bValue ? new Date(bValue as Date).getDate() : 0;
        }

        if (sort.key === 'topic') {
            aComparable = aValue ? (aValue as any).title : '';
            bComparable = bValue ? (bValue as any).title : '';
        }

        if (sort.key === 'priority') {
            const priorityOrder = {LOW: 1, MEDIUM: 2, HIGH: 3};
            const aPriority = aComparable ? priorityOrder[aComparable as keyof typeof priorityOrder] : 0;
            const bPriority = bComparable ? priorityOrder[bComparable as keyof typeof priorityOrder] : 0;

            if (aPriority && bPriority) {
                if (aPriority < bPriority) return sort.order === "asc" ? -1 : 1;
                if (aPriority > bPriority) return sort.order === "asc" ? 1 : -1;
            }
        }
        if (sort.key === 'status') {
            const statusOrder = {PENDING: 1, PLANING: 2, STARTED: 3, TESTED: 4, FINISHED: 5, ARCHIVED: 6};
            const aStatus = aComparable ? statusOrder[aComparable as keyof typeof statusOrder] : 0;
            const bStatus = bComparable ? statusOrder[bComparable as keyof typeof statusOrder] : 0;

            if (aStatus && bStatus) {
                if (aStatus < bStatus) return sort.order === "asc" ? -1 : 1;
                if (aStatus > bStatus) return sort.order === "asc" ? 1 : -1;
            }
        }
        else {
            if (aComparable && bComparable) {
                if (aComparable < bComparable) return sort.order === "asc" ? -1 : 1;
                if (aComparable > bComparable) return sort.order === "asc" ? 1 : -1;
            }

        }
        return 0;
    });
}
import {User, TaskElement} from "@/types/types";

interface PropsContextType {
    taskElement: TaskElement;
}


export const findTaskProps = (user: User | undefined, taskId: number): PropsContextType => {
    if (!user) throw new Error('Cant find task props');

    for (const team of user.teams) {
        for (const project of team.projects) {
            const task = project.tasks.find(t => t.id === taskId);
            if (task) {
                return { taskElement:
                    {
                        id: task.id,
                        name: task.name,
                        description: task.description,
                        topic: task.topic,
                        isArchived: task.isArchived,
                        duration: task.duration,
                        bookedDuration: task.bookedDuration,
                        deadline: task.deadline,
                        status: task.status,
                        priority: task.priority,
                        createdBy: task.createdBy,
                        createdDate: task.createdDate,
                        lastModifiedBy: task.lastModifiedBy,
                        lastModifiedDate: task.lastModifiedDate,
                        team: team,
                        project: project
                    }
                };
            }
        }
    }
    return { taskElement: {} as TaskElement};
}
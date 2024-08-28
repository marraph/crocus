import {DBQueryConfig} from "drizzle-orm/relations";
import {eq} from "drizzle-orm";
import {users} from "@/schema";

export const userConfig = (id: number): DBQueryConfig => ({
    where: eq(users.id, id),
    with: {
        absence: true,
        entry: true,
        organisationMemberships: {
            with: {
                organisation: {
                    with: {
                        createdBy: true,
                        updatedBy: true
                    }
                }
            }
        },
        teamMemberships: {
            with: {
                team: {
                    with: {
                        topic: true,
                        createdBy: true,
                        updatedBy: true,
                        project: {
                            with: {
                                createdBy: true,
                                updatedBy: true,
                                task: {
                                    with: {
                                        topic: true,
                                        createdBy: true,
                                        updatedBy: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
})

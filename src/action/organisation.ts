import {eq, InferInsertModel, InferSelectModel} from "drizzle-orm";
import {organisation} from "@/schema";
import {db} from "@/database/drizzle";

export type Organisation = InferSelectModel<typeof organisation>
export type NewOrganisation = InferInsertModel<typeof organisation>
export type UpdateOrganisation = Partial<NewOrganisation>

export const createOrganisation = async (newOrganisation: NewOrganisation): Promise<Organisation> => {
    const [createdOrganisation] = await db
        .insert(organisation)
        .values(newOrganisation)
        .returning();

    return createdOrganisation
}

export const updateOrganisation = async (id: number, updateOrganisation: UpdateOrganisation): Promise<Organisation> => {
    const [updatedOrganisation] = await db
        .update(organisation)
        .set(updateOrganisation)
        .where(eq(organisation.id, id))
        .returning()

    return updatedOrganisation
}

export const deleteOrganisation = async (id: number) => {
    await db.delete(organisation).where(eq(organisation.id, id))
}

export const getOrganisation = async (organisationId: number): Promise<Organisation> => {
    const [foundOrganisation] = await db
        .select()
        .from(organisation)
        .where(eq(organisation.id, organisationId))

    return foundOrganisation
}
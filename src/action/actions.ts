import {eq, InferInsertModel, InferSelectModel} from "drizzle-orm";
import {PgColumn, PgTable} from "drizzle-orm/pg-core";
import {db} from "@/database/drizzle";

type Entity<Table extends PgTable> = InferSelectModel<Table>
type NewEntity<Table extends PgTable> = InferInsertModel<Table>
type UpdateEntity<Table extends PgTable> = Partial<NewEntity<Table>>

type ActionResult<T> =
    | { success: true; data: T }
    | { success: false; error: string }

const createEntry = async <Table extends PgTable>(
    table: Table,
    model: NewEntity<Table>
): Promise<ActionResult<Entity<Table>>> => {
    try {
        const [createdEntity] = await db
            .insert(table)
            .values(model)
            .returning() as Entity<Table>[]

        if (!createdEntity) {
            return {success: false, error: 'Failed to create entity'}
        }

        return {success: true, data: createdEntity}
    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

const updateEntry = async <Table extends PgTable>(
    table: Table,
    model: UpdateEntity<Table>,
    entityId: number,
    idField: PgColumn
): Promise<ActionResult<Entity<Table>>> => {
    try {
        const [createdEntity] = await db
            .update(table)
            .set(model)
            .where(eq(idField, entityId))
            .returning() as Entity<Table>[]

        if (!createdEntity) {
            return {success: false, error: "Failed to update entity"}
        }

        return {success: true, data: createdEntity}
    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

const deleteEntity = async <Table extends PgTable>(
    table: Table,
    id: number,
    idField: PgColumn
) => {
    await db.delete(table).where(eq(idField, id))
}

const getEntity = async <Table extends PgTable>(
    table: Table,
    id: number,
    idField: PgColumn
): Promise<ActionResult<Entity<Table>>> => {
    try {
        const [queryEntity] = await db
            .select()
            .from(table)
            .where(eq(idField, id))
            .limit(1)

        if (!queryEntity) {
            return {success: false, error: "Failed to get entity"}
        }

        return {success: true, data: queryEntity}
    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

const getEntities = async <Table extends PgTable>(
    table: Table,
    limit: number = 100
): Promise<ActionResult<Entity<Table>[]>> => {
    try {
        const entities = await db.select().from(table).limit(limit);

        if (!entities) {
            return {success: false, error: "Failed to get all entities"}
        }

        if (entities.length == 0) {
            return {success: false, error: "Found no entities"}
        }

        return {success: true, data: entities}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

const queryEntity = async <Table extends PgTable>(
    table: Table,
    field: number | string,
    fieldType: PgColumn,
    limit: number = 100
): Promise<ActionResult<Entity<Table>[]>> => {

    try {
        const entities = await db
            .select()
            .from(table)
            .where(eq(fieldType, field))
            .limit(limit);

        if (!entities) {
            return {success: false, error: "Failed to get all entities"}
        }

        if (entities.length == 0) {
            return {success: false, error: "Found no entities"}
        }

        return {success: true, data: entities}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
}

export {
    createEntry,
    updateEntry,
    deleteEntity,
    getEntity,
    getEntities,
    queryEntity
}

export type {
    Entity,
    NewEntity,
    UpdateEntity,
    ActionResult
}
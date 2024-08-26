import {eq, InferInsertModel, InferSelectModel} from "drizzle-orm";
import {PgColumn, PgTable} from "drizzle-orm/pg-core";
import {db} from "@/database/drizzle";
import {DBQueryConfig} from "drizzle-orm/relations";
import {RelationalQueryBuilder} from "drizzle-orm/pg-core/query-builders/query";

type Entity<Table extends PgTable> = InferSelectModel<Table>
type NewEntity<Table extends PgTable> = InferInsertModel<Table>
type UpdateEntity<Table extends PgTable> = Partial<NewEntity<Table>>

type ActionResult<T> =
    | { success: true; data: T }
    | { success: false; error: string }

const createEntity = async <Table extends PgTable>(
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

const updateEntity = async <Table extends PgTable>(
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
): Promise<ActionResult<boolean>> => {
    try {

        const [deletedId] = await db
            .delete(table)
            .where(eq(idField, id))
            .returning({id: idField})

        if (!deletedId) {
            return {success: false, error: 'Didnt found any entry to delete'}
        }

        return {success: true, data: true}

    } catch (err) {
        const error = err as Error
        return {success: false, error: error.message}
    }
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


export {
    createEntity,
    updateEntity,
    deleteEntity,
    getEntity,
}

export type {
    Entity,
    NewEntity,
    UpdateEntity,
    ActionResult
}
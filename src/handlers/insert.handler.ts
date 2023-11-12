import { ChangeStreamInsertDocument, Collection } from "mongodb";


export function InsertChangeHandlerFactory(extractId: Function, historyCollection: Collection) {

    return async function InsertChangeHandler(next: ChangeStreamInsertDocument) {
        const data = next.fullDocument;
        console.log(extractId.toString());
        const dataId: any = extractId(data);
        const parent = null;
        const created_at = new Date();

        console.log({
            data,
            dataId,
            parent,
            created_at
        })

        await historyCollection.insertOne({
            data,
            dataId,
            parent,
            created_at
        })
    }
}
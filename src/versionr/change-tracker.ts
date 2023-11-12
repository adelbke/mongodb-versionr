import { Observable, Subject, map } from "rxjs";
import { TrackingConfig } from "../interfaces/config.interface";
import { ChangeStream, ChangeStreamDocument, Collection } from "mongodb";

export type ProcessedChangeEvent = {
    operationType: string
    changeDoc: ChangeStreamDocument
    historyOutput: any
    timestamp: Date
}


export class ChangeTracker {

    private events$: Observable<ChangeStreamDocument>;
    private extractId: (data: any) => any;
    private dataCollection: Collection;
    private historyCollection: Collection;
    private changeStream: ChangeStream<Document, ChangeStreamDocument<Document>>;

    // public processedEvents$: Observable<ProcessedChangeEvent>;

    constructor(config: TrackingConfig) {

        this.extractId = config.extractId;
        this.dataCollection = config.dataCollection;
        this.historyCollection = config.historyCollection;
        this.changeStream = this.dataCollection.watch();
        this.events$ = this.createChangeStreamObservable();
    }

    public async close(): Promise<void> {
        return await this.changeStream.close();
    }


    private createChangeStreamObservable(): Observable<ChangeStreamDocument> {

        const subject = new Subject<ChangeStreamDocument>();
        this.changeStream.on('change', (changeStreamDoc: ChangeStreamDocument) => {
            subject.next(changeStreamDoc);
        })

        this.changeStream.on('close', () => {
            subject.complete();
        })

        this.changeStream.on('error', (error) => {
            subject.error(error);
        })



        return subject.asObservable();
    }


    public trackEvents(): Observable<ProcessedChangeEvent> {

        // track changes

        return this.events$.pipe(
            map((next: ChangeStreamDocument) => {
                return {
                    operationType: 'insert',
                    changeDoc: next,
                    historyOutput: {
                        data: 'hi'
                    },
                    timestamp: new Date()
                }
            })
        );
    }

}
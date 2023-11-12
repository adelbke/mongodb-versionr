// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"

import {
  //   ChangeStreamDeleteDocument,
  ChangeStreamDocument,
  //   ChangeStreamInsertDocument,
  //   ChangeStreamReplaceDocument,
  //   ChangeStreamUpdateDocument,
  //   Collection,
  //   Document,
} from 'mongodb';
import {
  CollectionConfig,
  MongoDBVersionrConfig,
  TrackingConfig,
} from '../interfaces/config.interface';
// import { InsertChangeHandlerFactory } from './handlers/insert.handler';
import { Observable, combineLatest, tap } from 'rxjs';
import { ChangeTracker } from './change-tracker';

// ...
export default class MongoDBVersionr {
  private config: MongoDBVersionrConfig;

  public trackingConfig: TrackingConfig[];

  private trackers: ChangeTracker[] | null = null;

  constructor(config: MongoDBVersionrConfig) {
    this.config = config;
    const { collections, mongoDBClient } = config;

    // retrieve collections Instances and making tracking configurations
    this.trackingConfig = collections.map((coll: CollectionConfig) => {
      const [db, collName] = coll.dataCollection;
      const [histDB, histCollName] = coll.historyCollection;
      const dataCollection = mongoDBClient.db(db).collection(collName);
      const historyCollection = mongoDBClient
        .db(histDB)
        .collection(histCollName);
      return {
        extractId: coll.extractId,
        dataCollection,
        historyCollection,
      };
    });
  }

  private setupHandlers(
    events$: Observable<ChangeStreamDocument>
  ): Observable<any> {
    return events$.pipe(
      tap(() => {
        console.log('event received');
      })
    );
  }

  public async listen(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.trackers = this.trackingConfig.map((config: TrackingConfig) => {
        return new ChangeTracker(config);
      }) as ChangeTracker[];

      const processedChangeObservables = this.trackers.map(
        (tracker: ChangeTracker) => {
          return tracker.trackEvents();
        }
      );

      console.log('Listening to changes! ');
      combineLatest(processedChangeObservables).subscribe({
        error(err) {
          reject(err);
        },
        complete() {
          resolve();
        },
        next(value) {},
      });
    });
  }

  public async close() {
    if (this.trackers != null) {
      const closePromises = this.trackers.map(tracker => tracker.close());
      await Promise.all(closePromises);
    } else {
      throw new Error('No Change Tracker is running !');
    }
  }
}

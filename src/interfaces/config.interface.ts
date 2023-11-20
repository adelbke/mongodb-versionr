import { Collection, MongoClient } from 'mongodb';

export interface CollectionConfig {
  dataCollection: [string, string];
  extractId(data: any): any;
  historyCollection: [string, string];
}

export interface MongoDBVersionrConfig {
  collections: CollectionConfig[];
  mongoDBClient: MongoClient;
}

export interface TrackingConfig {
  dataCollection: Collection;
  historyCollection: Collection;
  extractId(data: any): any;
}

import { ChangeStream, ChangeStreamDocument, MongoClient } from 'mongodb';
import MongoDBVersionr from '../versionr/versionr';
import { InsertChangeHandlerFactory } from '../handlers/insert.handler';

async function bootstrap() {
  const client = new MongoClient(
    'mongodb://localhost:27017/?readPreference=primary&directConnection=true&ssl=false',
    {
      replicaSet: 'rs0',
    }
  );

  const versionr = new MongoDBVersionr({
    mongoDBClient: client,
    collections: [
      {
        historyCollection: ['test_db', 'hist_coll'],
        dataCollection: ['test_db', 'data_coll'],
        extractId(data) {
          return data['idField'];
        },
      },
    ],
  });

  await versionr.listen();

  // const changeStream = versionr.trackingConfig[0].dataCollection.watch();

  // console.log('before listening to streams');

  // const eventWaiter = new Promise((resolve, reject) => {
  //     changeStream.on('change',(next: ChangeStreamDocument) => {
  //         console.log('received an event !! Operation type: ' + next.operationType)
  //         if(next.operationType == 'insert'){
  //             console.log('insert type !')
  //             const handler = InsertChangeHandlerFactory(versionr.trackingConfig[0].extractId, versionr.trackingConfig[0].historyCollection)
  //             handler(next)
  //         }

  //         resolve(next);
  //     })

  // });

  // console.log('inserting document')

  // // await client.db('test_db').collection('data_coll').insertOne({
  // //     tnaket: 'test'
  // // })

  // await versionr.trackingConfig[0].dataCollection.insertOne({
  //     idField: 'test id',
  //     dataField: 'hello',
  //     dataNumber: 17,
  //     datacomplex: [
  //         'banana', 'apple'
  //     ]
  // })

  // console.log('Finished inserting');

  // console.log('waiting write event')

  // await eventWaiter;

  // console.log()

  // const closePromise = new Promise((resolve,reject) => {
  //     process.on('SIGINT', function() {
  //         console.log("Caught interrupt signal");

  //         resolve(null);
  //     });
  // })

  // await Promise.all([closePromise, client.close(), changeStream.close()])
}

if (require.main === module) {
  bootstrap();
}

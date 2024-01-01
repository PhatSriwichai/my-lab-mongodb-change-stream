# MyLab Mongodb ChangeStream

## Document
- [changeStreams](https://www.mongodb.com/docs/v6.0/changeStreams/)

## Run
```
docker compose build app
docker compose up -d
```

## Step
1. connect Mongodb with MongodbClient For example: Robo3T, MongoDB Compass
2. insert document in dbName="test_db" and collectionName="todo"
3. watch log is 
```json
Change detected: 
{
    "_id": {
        "_data": "826592F01C000000012B022C0100296E5A1004E689078448064B578BE39A229AAEC58146645F696400646592F01C1CAE7021AA8C8CD10004"
    },
    "operationType": "insert",
    "clusterTime": {
        "$timestamp": "7319176347480227841"
    },
    "wallTime": "2024-01-01T17:02:20.270Z",
    "fullDocument": {
        "_id": "6592f01c1cae7021aa8c8cd1",
        "name": "000"
    },
    "ns": {
        "db": "test_db",
        "coll": "todo"
    },
    "documentKey": {
        "_id": "6592f01c1cae7021aa8c8cd1"
    }
}
```
4. stop app
```
docker compose stop app
```
5. watch log in app
```
docker compose log app
```
- copy value lastResumeToken from log
```json
{
    "_data":"826592F01C000000012B022C0100296E5A1004E689078448064B578BE39A229AAEC58146645F696400646592F01C1CAE7021AA8C8CD10004"
}
```
- uncomment and set _data from lastResumeToken log
```js
// let lastResumeToken;
let lastResumeToken = {
    _data: "826592F01C000000012B022C0100296E5A1004E689078448064B578BE39A229AAEC58146645F696400646592F01C1CAE7021AA8C8CD10004"
};

```
6. insert new document in dbName="test_db" and collectionName="todo"
7. build new app and start app
```
docker compose build app
```
```
docker compose up app
```
8. seen missing stream
```json
 Change detected: {
    "_id": {
        "_data": "826592F20E000000012B022C0100296E5A1004E689078448064B578BE39A229AAEC58146645F696400646592F20E1CAE7021AA8C8CD20004"
    },
    "operationType": "insert",
    "clusterTime": {
        "$timestamp": "7319178486373941249"
    },
    "wallTime": "2024-01-01T17:10:38.482Z",
    "fullDocument": {
        "_id": "6592f20e1cae7021aa8c8cd2",
        "name": "missing"
    },
    "ns": {
        "db": "test_db",
        "coll": "todo"
    },
    "documentKey": {
        "_id": "6592f20e1cae7021aa8c8cd2"
    }
}
```

## Cleanup
```
docker compose down
```
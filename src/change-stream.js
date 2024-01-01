const MongoClient = require('mongodb').MongoClient;

let lastResumeToken;
// let lastResumeToken = {
//     _data: "826592F01C000000012B022C0100296E5A1004E689078448064B578BE39A229AAEC58146645F696400646592F01C1CAE7021AA8C8CD10004"
// };

async function watchChanges(dbName, collectionName) {
    try {
        const uri = `mongodb://mongo1:27017,mongo2:27017,mongo3:27017/${dbName}?replicaSet=rs0`;
        const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await client.connect();
        
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const options = lastResumeToken ? { resumeAfter: lastResumeToken } : undefined;
        const changeStream = collection.watch([], options);
        console.log(`Watching changes on ${collectionName} collection...`);

        changeStream.on("change", (change) => {
            console.log("Change detected:", JSON.stringify(change));
            lastResumeToken = change._id; // update resume token
        });
        changeStream.on("error", (error) => {
            console.error("Error in watchChanges:", error);
        });

    } catch (error) {
        console.error("Error in watchChanges:", error);
    }
};

watchChanges("test_db", "todo");

process.on("SIGTERM", () => {
    console.log(`signal SIGTERM received: closing HTTP server`);
    console.log("===> lastResumeToken", JSON.stringify(lastResumeToken));
});




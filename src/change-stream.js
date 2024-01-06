const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const Prometheus = require('prom-client');
const { latencyHistogram } = require("./metrics/latency");
const { PubSub } = require('@google-cloud/pubsub');

let lastResumeToken;
// let lastResumeToken = {
//     _data: "826592F01C000000012B022C0100296E5A1004E689078448064B578BE39A229AAEC58146645F696400646592F01C1CAE7021AA8C8CD10004"
// };

const topicName = 'test-mongo-change';
const pubSubClient = new PubSub();
const topicObj = pubSubClient.topic(topicName, {
    batching: {
        maxMessages: 10,
        maxMilliseconds: 1000,
    },
});

// const topicObj = pubSubClient.topic(topicName);

async function publishMessage(message) {
    

    // ID ของ project และ topic
    
    const dataBuffer = Buffer.from(message);
    try {
        const messageId = await topicObj
            .publishMessage({
                data: dataBuffer
            });
        // console.log(`Message ${messageId} published.`);
    } catch (error) {
        console.error(`Received error while publishing: ${error.message}`);
        process.exitCode = 1;
    }
}


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
        // console.log(`Watching changes on ${collectionName} collection...`);

        changeStream.on("change", async (change) => {
            const wallTime = new Date(change.wallTime).getTime();
            const receivedTime = Date.now();
            const latency = receivedTime - wallTime;
            latencyHistogram.observe(latency / 1000);
            // console.log(`Change detected: ${change.operationType} - Latency: ${latency} ms`);

            // console.log("Change detected:", JSON.stringify(change));
            await publishMessage(JSON.stringify(change));
            lastResumeToken = change._id;
        });
        changeStream.on("error", (error) => {
            console.error("Error in watchChanges:", error);
        });

    } catch (error) {
        console.error("Error in watchChanges:", error);
    }
};

const app = express();
const port = process.env.APP_PORT ? parseInt(process.env.APP_PORT): 8080;

const collectDefaultMetrics = Prometheus.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

app.get('/metrics', (req, res) => {
    res.set('Content-Type', Prometheus.register.contentType);
    Prometheus.register.metrics().then(data => res.send(data));
});

app.listen(port, () => console.log(`Express server running on port ${port}`));

watchChanges("test_db", "todo");

process.on("SIGTERM", () => {
    console.log(`signal SIGTERM received: closing HTTP server`);
    console.log("===> lastResumeToken", JSON.stringify(lastResumeToken));
});




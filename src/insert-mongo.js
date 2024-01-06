const { MongoClient } = require('mongodb');
const async = require('async');

const uri = `mongodb://mongo1:27017,mongo2:27017,mongo3:27017/test_db?replicaSet=rs0`;
const dbName = 'test_db';
const collectionName = 'todo';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function insertDocument(db, collection, document) {
    return collection.insertOne(document);
}

async function main() {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // สร้าง array ของ tasks
        const tasks = [];
        for (let i = 0; i < 500; i++) {
            tasks.push((callback) => {
                insertDocument(db, collection, {
                    "timestamp": new Date(),
                    "guid": "45ef09e4-b99e-4713-8149-8dc745436323",
                    "isActive": false,
                    "balance": "$3,068.03",
                    "picture": "http://placehold.it/32x32",
                    "age": 37,
                    "eyeColor": "brown",
                    "name": "Lessie Perry",
                    "gender": "female",
                    "company": "ZIORE",
                    "email": "lessieperry@ziore.com",
                    "phone": "+1 (879) 589-2080",
                    "address": "329 Hanover Place, Stewartville, Puerto Rico, 6025",
                    "about": "Pariatur ex anim consectetur voluptate velit non minim eu officia. Velit et aute minim sunt excepteur esse est. Velit dolore tempor enim mollit eiusmod labore aliquip id adipisicing. Incididunt aute sint elit mollit dolore proident aute nulla ad labore. Aliqua nostrud eu do mollit pariatur sit pariatur elit minim enim occaecat.\r\n",
                    "registered": "2019-10-05T04:55:12 -07:00",
                    "latitude": 38.225896,
                    "longitude": 179.171599,
                    "tags": [
                        "cillum",
                        "commodo",
                        "deserunt",
                        "labore",
                        "aliqua",
                        "consequat",
                        "velit"
                    ],
                    "friends": [
                        {
                            "id": 0,
                            "name": "Angie Guthrie"
                        },
                        {
                            "id": 1,
                            "name": "Neal Whitley"
                        },
                        {
                            "id": 2,
                            "name": "Sears Owen"
                        }
                    ],
                    "greeting": "Hello, Lessie Perry! You have 8 unread messages.",
                    "favoriteFruit": "strawberry"
                })
                    .then(result => callback(null, result))
                    .catch(err => callback(err));
            });
        }

        // รัน tasks พร้อมเพรียง
        async.parallel(tasks, (err, results) => {
            if (err) {
                throw err;
            }
            console.log('All documents have been inserted');
        });

    } finally {
        // client.close();
    }
}
setInterval(async () => {
    await main();
}, 100);


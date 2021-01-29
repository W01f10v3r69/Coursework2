const express = require('express');
const app = express();

const MongoClient = require('mongodb').MongoClient;

let db;
MongoClient.connect('mongodb+srv://wolflover:wolflover@nether.rl4hb.mongodb.net/cwdb?retryWrites=true&w=majority',
(err, client) => {
    db = client.db('cwdb')
});

app.use(express.json());

app.param('collectionName', (req, res, next, collectionName) =>{
    req.collection = db.collection(collectionName)
    return next()
});

app.get('/', (req, res) =>{
    res.send ('Select a collection, e.g., /collection/collectionName')
});

app.get('/collection/:collectionName', (req, res) => {
    req.collection.find({}).toArray ((e, results) => {
        if (e) return next(e)
        res.send(results)
    });
});

app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
        if (e) return next (e)
        res.send(results.ops)
    })
})

app.listen(3000);
console.log ('server running on port 3000');

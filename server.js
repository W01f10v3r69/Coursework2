const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const http = require("http");
const fs = require("fs");
const path = require("path");
const bodyParser  = require('body-parser');
const publicPath = path.resolve(__dirname, "cw");


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(publicPath));


let con =
MongoClient.connect('mongodb+srv://wolflover:wolflover@nether.rl4hb.mongodb.net/cwdb?retryWrites=true&w=majority',
{useUnifiedTopology: true}
// (err, client) => {
//     db = client.db('cwdb')}
  );

// app.param('collectionName', (req, res, next, collectionName) =>{
//     req.collection = db.collection(collectionName)
//     return next()
// });
//
// app.get('/', (req, res) =>{
//     res.send ('Select a collection, e.g., /collection/collectionName')
// });

//Middleware logger
app.use((req, res, next) => {
    console.log("Here comes a " + req.method + " to " + req.url);
    console.log("Request:" + req);
    console.log("Request date: " + new Date());
    next();
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});


//Static Middleware
app.use((req, res, next) => {
    let filePath = path.join(__dirname, "cw", req.url);
    fs.stat(filePath, (err, fileInfo) => {
    if (err) {
        console.log(err);
        next();
        return;
    }
    if (fileInfo.isFile()){
        res.sendFile(filePath);
    }else{
        console.log(err);
        next();
    }});
});

//Lessons GET
app.get('/lessons', (req, res) => {
    con.then(client => client.db('cwdb').collection('lessons').find({}).toArray((err, result) => {
        if(err) console.log(err);
        res.send(JSON.stringify(result));
    }));
});

//Orders POST
app.post('/orders', (req, res) => {
    con.then(client => client.db('cwdb').collection('orders').insertOne(req.body, (err, result) => {
        if(err) throw (err);
        res.send(result.ops)
    }));
});
// app.post('/collection/:collectionName', (req, res, next) => {
//     req.collection.insert(req.body, (e, results) => {
//         if (e) return next (e)
//         res.send(results.ops)
//     })
// })

//Spaces Update PUT
app.put('/updateSpaces', (req, res) => {
    let data = req.body;
    for(let i = 0, l = data.length; i < l; i++) {
        let lessonID =  data[i].lesson_id;
        let updatedSpaces = { $set: {spaces: data[i].spaces - 1} };
        con.then(client =>  client.db('cwdb').collection('lessons').updateMany({
            lesson_id: id
        }, updatedSpaces, {
            safe: true,
            multi: true
        }, (err) => {
            if (err) throw err;
        }));
    }
});


const port = process.env.PORT || 3000;
http.createServer(app).listen(port);
// app.listen(3000);
// console.log ('server running on port 3000');

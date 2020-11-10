require('dotenv').config();
let express = require('express');
let mongodb = require('mongodb');
let sanitizeHTML = require('sanitize-html');
let app = express();
let db;
let port = process.env.PORT || 2820

let connectionString = process.env.MONGO;

mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    db = client.db();
    app.listen(port);
});

app.use(express.static('public'));  
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// app security FN
const passwordProtected = (req, res, next) => {
  res.set('WWW-Authenticate', 'Basic realm="Simple Todo App"');
  if(req.headers.authorization === process.env.LOGIN){
    next();
  }else {
    res.status(401).send("Authentication required");
  }
}
app.use(passwordProtected);

app.get('/',(req,res) => {
    // requesting data from mongoDB
    db.collection('items').find().toArray((err, items) => {
      res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Simple To-Do App</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
      </head>
      <body>
        <div class="container">
          <h1 class="display-4 text-center py-1">To-Do App</h1>
          
          <div class="jumbotron p-3 shadow-sm">
            <form action="/create-item" method="POST" id="create-form">
              <div class="d-flex align-items-center">
                <input name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;" id="create-field">
                <button class="btn btn-primary">Add New Item</button>
              </div>
            </form>
          </div>
          <ul class="list-group pb-5" id="item-list"></ul>
        </div>
      <script>
        let items = ${JSON.stringify(items)};
      </script>
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
      <script src="/browser.js"></script>
      </body>
      </html>
      `);
    });
});

// creating item
app.post('/create-item', (req,res) => {
  // sanitize the entered text
  let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}});
  db.collection('items').insertOne({text: safeText}, (err, info) => {
    res.json(info.ops[0]);

    // display error if exist
    if(err){
      alert(err);
    }
  });
});

// updating item
app.post('/update-item', (req,res) => {
  let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}});
  db.collection('items').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)}, {$set: {text: safeText}}, () => {
    res.send("Success");
  });
});

// deleting item
app.post('/delete-item', (req,res) => {
  db.collection('items').deleteOne({_id: new mongodb.ObjectId(req.body.id)}, () => {
    res.send("Success");
  });
})
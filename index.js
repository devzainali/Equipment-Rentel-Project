const express = require("express");
let app = express();

const port = 3000;

const path = require('path');

const bodyParser = require('body-parser');

app.set("view engine", "pug");
app.set("views", path.resolve('.src/views'));


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended : true }));

// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: true }));


app.use(bodyParser.json({ limit: '100mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))
app.use(express.static('uploads'));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', "X-Requested-With, content-type, x-auth-token");
    next();
})
//Serves all the request which includes /images in the url from Images folder
app.use('owner', express.static(__dirname + 'owner'));


const router = express.Router();

app.use(router);


const rootPath = path.resolve('./dist');
app.use(express.static(rootPath));


//DB connection
require('./src/database/connection');
//Cron job
require('./routes/Modules/user/cronJob/cronJob');
//all routes defined in this file
require('./startup/routes')(app);

require('./startup/config')();

console.log(process.env.NODE_ENV);

router.use((err, req, res, next) => {
    if (err) {
        return res.send(err.message);
    }
});

app.listen(port, err => {
    if (err) {
        return console.log(`Cannot listen on port:${port}`);
    }
    console.log(`Server is  listen on port:${port}`);
});

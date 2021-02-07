import express from 'express';
import bodyParser from 'body-parser';
import Pool from './db.js';
import userrouter from "./routes/user.js";
const app = express(); // initialize the express server
// create a test route
Pool.connect(function (err, client, done) {
    if (err)
        console.log(err);
    console.log('Connected');
});
app.get('/', (req, res, next) => {
    res.send('Hello world');
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/user', userrouter);
// Define the port to run the server. this could either be defined 
app.listen(process.env.PORT || 4000, () => {
    console.log("server started on port", process.env.PORT || 4000);
});
//# sourceMappingURL=app.js.map
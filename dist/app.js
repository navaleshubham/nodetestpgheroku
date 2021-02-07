//library
import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
//class and functions
import Pool from './db.js';
import userrouter from "./routes/user.js";
// initialize the express server
const app = express();
// database conection test
Pool.connect(function (err, client, done) {
    if (err)
        console.log(err);
    console.log('Connected');
});
//configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
//routes
app.use('/user', userrouter);
//demo route
// app.get('/', (req, res, next) => {
//     res.send('Hello world')
// })
// Define the port to run the server. this could either be defined 
app.listen(process.env.PORT || 4000, () => {
    console.log("server started on port", process.env.PORT || 4000);
});
//# sourceMappingURL=app.js.map
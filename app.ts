//library
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken'
//class and functions
import Pool from './db';
import userrouter from './routes/user';
import * as cookie from 'cookie-parser'
// initialize the express server
const app = express();

// database conection test
Pool.connect(function (err: any, _client: any, _done: any) {
    if (err) console.log(err);
    console.log('Connected');
});

//auth check middleware
function authentication(req: express.Request, res: express.Response, next) {
    const cookie = req.cookies
    const rresult = jwt.verify(cookie.auth_token, process.env.JWT_SECRET);
    console.log(`${req.method} ${req.path}`);
    next();
}

//configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(cookie())
app.use(authentication)


//routes
app.use('/user', userrouter);

//demo route
// app.get('/', (req, res, next) => {
//     res.send('Hello world')
// })

// Define the port to run the server. this could either be defined
app.listen(process.env.PORT || 4000, () => {
    console.log('server started on port', process.env.PORT || 4000);
});

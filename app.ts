//library
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
//class and functions
import Pool from './db';
import userrouter from './routes/user';
// initialize the express server
const app = express();

// database conection test
Pool.connect(function (err: any, _client: any, _done: any) {
    if (err) console.log(err);
    creteorchecktable()
    console.log('Connected all okay');
});

async function creteorchecktable() {
    try {
        const client = await Pool.connect()
        const sql = `CREATE TABLE employee
                   (first_name CHAR(20) NOT NULL, 
                   last_name CHAR(20) NOT NULL,
                   title CHAR(20) NOT NULL,
                   email CHAR(50) NOT NULL,
                   password CHAR(50) NOT NULL,
                   PRIMARY KEY(email))`
        const result = await client.query(sql)
        console.log(result);

    } catch (error) {
        console.log('table already exists')
    }

}
//auth check middleware
async function authentication(req: express.Request, res: express.Response, next) {
    const cookie = req.cookies;
    const result = await jwt.verify(cookie.auth_token, process.env.JWT_SECRET);
    const user = await checkuser(result)
    if (user) {
        next();
    }
    else {
        res.send(user)
    }
}

async function checkuser(data) {
    try {
        const client = await Pool.connect();
        const sql = `SELECT * FROM employee WHERE email=${data.email}`;
        const { rows } = await client.query(sql);
        const users = rows;
        client.release();
        if (users.length == 1) {
            return true
        }
        else {
            return false
        }
    } catch (error) {
        return error
    }
}
//configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(authentication);

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
